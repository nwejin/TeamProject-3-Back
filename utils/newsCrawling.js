const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const axios = require("axios");

// 매개변수 -> 크롤링하고자 하는 웹 페이지의 URL
const getOriginNews = async (originUrl) => {
    try {
        // Axios 사용하여 웹 페이지의 HTML을 가져옴
        const response = await axios.get(originUrl, {
            responseType: "arrayBuffer",
        });
        // response.data를 Buffer로 변환하고, toString()을 사용하여 인코딩 적용
        const newsDecoded = Buffer.from(response.data).toString("utf-8");
        // cheerio를 사용하여 HTML를 파싱
        const $ = cheerio.load(newsDecoded);
        // 원하는 정보를 추출하여 출력 또는 다른 작업 수행
        const newContentArray = $("#leftColumn > div.WYSIWYG.articlePage > p");
        var newContent = "";
        // 선택한 요소의 형제 요소들을 반복
        newContentArray.siblings("p").each(function () {
            newContent += $(this).text() + "\n";
        });
        const bigImageUrl = $("#carouselImage").attr("src");
        const newsDate = $("#leftColumn > div:nth-child(6) > span")
            .first()
            .text()
            .trim();
        var bigImageAndContent = {
            newContent,
            bigImageUrl,
            newsDate: newsDate.slice(4),
        };
        return bigImageAndContent;
    } catch (error) {
        console.error(error);
        return;
    }
};

const getNewsList = async (newsFieldUrl) => {
    try {
        // Axios 사용하여 웹 페이지의 HTML을 가져옴
        // get 함수를 사용하여 지정된 URL에서 GET 요청을 보냄
        // Axios 사용하여 웹 페이지의 HTML을 가져옴
        const response = await axios.get(newsFieldUrl, {
            responseType: "arrayBuffer",
        });
        // response.data를 Buffer로 변환하고, toString()을 사용하여 인코딩 적용
        const listDecoded = Buffer.from(response.data).toString("utf-8");

        // cheerio를 사용하여 HTML를 파싱
        const $ = cheerio.load(listDecoded);
        // 원하는 정보를 추출하여 출력 또는 다른 작업 수행

        const listArray = $(
            "#leftColumn > div.largeTitle > article:nth-child(n)"
        ).toArray();
        var listResult = [];
        for (const dataList of listArray) {
            const smallImage = $(dataList).find("a > img");
            // console.log(smallImage);
            const smallimg = smallImage.attr("data-src");
            const aFind = $(dataList).find("div.textDiv > a").first();
            const path = aFind.attr("href");
            const url = `${"https://kr.investing.com" + path}`;
            const title = aFind.text().trim();

            try {
                const bigImageAndContent = await getOriginNews(url);
                const context = bigImageAndContent.newContent;
                const bigimg = bigImageAndContent.bigImageUrl;
                const date = bigImageAndContent.newsDate;
                listResult.push({
                    url,
                    title,
                    smallimg,
                    bigimg,
                    context,
                    date,
                    group: 3,
                });
            } catch (error) {
                console.error("list1 push 에러");
                continue;
            }
        }
        // console.log("listResult", listResult);
        return listResult;
        // console.log(listResult.length);
    } catch (error) {
        console.error("뉴스 리스트 불러오기 실패", error);
    }
};

// 뉴스 분야별 분리
// 주식 1
// getNewsList("https://kr.investing.com/news/stock-market-news");

// 암호화폐 2
// getNewsList("https://kr.investing.com/news/cryptocurrency-news");

// 경제 3
// getNewsList("https://kr.investing.com/news/economy");

module.exports = getNewsList;
