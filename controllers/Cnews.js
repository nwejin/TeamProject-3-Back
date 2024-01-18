const NewsSchema = require("../models/NewsSchema");
const newsCrawling = require("../utils/newsCrawling");

exports.getNewsList = async (req, res) => {};
exports.saveNewsData = async (req, res) => {
    const newsDataObject = await newsCrawling(
        "https://kr.investing.com/news/economy"
    );
    const newsDatas = Object.values(newsDataObject);
    try {
        // newsDatas.forEach(newsdata => {
        //     await NewsSchema.create(newsdata);
        // });

        for (const newsdata of newsDatas) {
            await NewsSchema.create(newsdata);
        }
        console.log("데이터 넣기 성공");
        res.send("데이터 넣기 성공");
    } catch (error) {
        console.error(error);
    }
};
