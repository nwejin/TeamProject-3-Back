const NewsSchema = require("../models/NewsSchema");
const newsCrawling = require("../utils/newsCrawling");

exports.getNewsList = async (req, res) => {
    try {
        const existingNews = await NewsSchema.find().limit(20);
        // 중복된 데이터가 없으면 새로운 데이터를 생성
        if (existingNews) {
            res.send(existingNews);
        }
    } catch (error) {
        console.error("Error in database operation:", error);
    }
};

exports.returnNewsList = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDataObject = await newsCrawling(
            "https://kr.investing.com/news/latest-news"
        );
        const newsDatas = Object.values(newsDataObject);

        console.log("데이터 보내기 성공");

        // 클라이언트로 데이터 전송
        res.send(newsDatas);

        // 데이터베이스 작업을 비동기적으로 실행
        await Promise.all(
            newsDatas.map(async (newsdata) => {
                try {
                    // 중복 체크
                    const existingNews = await NewsSchema.findOne({
                        title: newsdata.title,
                    });

                    // 중복된 데이터가 없으면 새로운 데이터를 생성
                    if (!existingNews) {
                        await NewsSchema.create(newsdata);
                    }
                } catch (error) {
                    console.error("Error in database operation:", error);
                }
            })
        );
    } catch (error) {
        console.error("Error in main function:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.getStockNews = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDataObject = await newsCrawling(
            "https://kr.investing.com/news/stock-market-news"
        );
        const newsDatas = Object.values(newsDataObject);

        console.log("데이터 보내기 성공");

        // 클라이언트로 데이터 전송
        res.send(newsDatas);

        // 데이터베이스 작업을 비동기적으로 실행
        await Promise.all(
            newsDatas.map(async (newsdata) => {
                try {
                    // 중복 체크
                    const existingNews = await NewsSchema.findOne({
                        title: newsdata.title,
                    });

                    // 중복된 데이터가 없으면 새로운 데이터를 생성
                    if (!existingNews) {
                        await NewsSchema.create({ ...newsdata, group: 1 });
                    }
                } catch (error) {
                    console.error("Error in database operation:", error);
                }
            })
        );
    } catch (error) {
        console.error("Error in main function:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.getCoinNews = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDataObject = await newsCrawling(
            "https://kr.investing.com/news/cryptocurrency-news"
        );
        const newsDatas = Object.values(newsDataObject);

        console.log("데이터 보내기 성공");

        // 클라이언트로 데이터 전송
        res.send(newsDatas);

        // 데이터베이스 작업을 비동기적으로 실행
        await Promise.all(
            newsDatas.map(async (newsdata) => {
                try {
                    // 중복 체크
                    const existingNews = await NewsSchema.findOne({
                        title: newsdata.title,
                    });

                    // 중복된 데이터가 없으면 새로운 데이터를 생성
                    if (!existingNews) {
                        await NewsSchema.create({ ...newsdata, group: 2 });
                    }
                } catch (error) {
                    console.error("Error in database operation:", error);
                }
            })
        );
    } catch (error) {
        console.error("Error in main function:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.getEconomyNews = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDataObject = await newsCrawling(
            "https://kr.investing.com/news/economy"
        );
        const newsDatas = Object.values(newsDataObject);

        console.log("데이터 보내기 성공");

        // 클라이언트로 데이터 전송
        res.send(newsDatas);

        // 데이터베이스 작업을 비동기적으로 실행
        await Promise.all(
            newsDatas.map(async (newsdata) => {
                try {
                    // 중복 체크
                    const existingNews = await NewsSchema.findOne({
                        title: newsdata.title,
                    });

                    // 중복된 데이터가 없으면 새로운 데이터를 생성
                    if (!existingNews) {
                        await NewsSchema.create({ ...newsdata, group: 3 });
                    }
                } catch (error) {
                    console.error("Error in database operation:", error);
                }
            })
        );
    } catch (error) {
        console.error("Error in main function:", error);
        res.status(500).send("Internal Server Error");
    }
};

// 임시 함수
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

// const stockNews = await NewsSchema.find({ group: 1 });   주식
// const coinNews = await NewsSchema.find({ group: 2 });    암호화폐
// const economyNews = await NewsSchema.find({ group: 3 }); 경제
