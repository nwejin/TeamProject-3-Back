const NewsSchema = require("../models/NewsSchema");

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
