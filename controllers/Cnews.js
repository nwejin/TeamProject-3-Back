const NewsSchema = require("../models/NewsSchema");
const newsCrawling = require("../utils/newsCrawling");

exports.getNewsList = async (req, res) => {
    // const newsDataObject = await newsCrawling(
    //     "https://kr.investing.com/news/economy"
    // );
    // const newsDatas = Object.values(newsDataObject);
    try {
        const stockNews = await NewsSchema.find({ group: 1 });
        console.log(Array.isArray(stockNews));
        // const coinNews = await NewsSchema.find({ group: 2 });
        // const economyNews = await NewsSchema.find({ group: 3 });
        // console.log(typeof stockNews);
        // console.log(stockNews);
        console.log("데이터 보내기 성공");
        res.send(stockNews);
    } catch (error) {
        console.error(error);
    }
};
exports.saveNewsData = async (req, res) => {
    const newsDataObject = await newsCrawling(
        "https://kr.investing.com/news/economy"
    );
    const newsDatas = Object.values(newsDataObject);
    try {
        for (const newsdata of newsDatas) {
            try {
                await NewsSchema.create(newsdata);
            } catch (error) {
                continue;
            }
        }
        console.log("데이터 넣기 성공");
        res.send("데이터 넣기 성공");
    } catch (error) {
        console.error(error);
    }
};
