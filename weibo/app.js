const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");
const { CLIENT_RENEG_WINDOW } = require("tls");
const weiboURL = "https://s.weibo.com";
const hotSearchURL = weiboURL + "/top/summary?cate=realtimehot";
superagent.get(hotSearchURL, (err, res) => {
  if (err) console.error(err);
  const $ = cheerio.load(res.text);
  let hotList = [];
  $("#pl_top_realtimehot table tbody tr").each(function (index) {
    if (index !== 0) {
      const $td = $(this).children().eq(1);
      const link = weiboURL + $td.find("a").attr("href");
      const text = $td.find("a").text();
      const hotValue = $td.find("span").text();
      const icon = $td.find("img").attr("src")
        ? "https:" + $td.find("img").attr("src")
        : "";
      hotList.push({
        index,
        link,
        text,
        hotValue,
        icon,
      });
    }
  });
  fs.writeFileSync(
    `${__dirname}/hotSearch.json`,
    JSON.stringify(hotList),
    "utf-8"
  );
  for(var i = 0; i < hotList.length; i++){
    console.log(String(parseInt(i)+1)+"、"+hotList[i].text + "  热度："+hotList[i].hotValue);
   
  }
  console.log(hotList);
});
