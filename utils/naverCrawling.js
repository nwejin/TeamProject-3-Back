// (네이버)
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
        const newContent = $("#dic_area").text().trim();
        const bigImageUrl = $("#img1").attr("src");
        const newsDate = $(
            "#ct > div.media_end_head.go_trans > div.media_end_head_info.nv_notrans > div.media_end_head_info_datestamp > div > span"
        ).text();
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

const getNaverNewsList = async (newsFieldUrl) => {
    try {
        // Axios 사용하여 웹 페이지의 HTML을 가져옴
        // get 함수를 사용하여 지정된 URL에서 GET 요청을 보냄
        // Axios 사용하여 웹 페이지의 HTML을 가져옴
        const response = await axios.get(newsFieldUrl, {
            responseType: "arrayBuffer",
        });
        // response.data를 Buffer로 변환하고, toString()을 사용하여 인코딩 적용
        const listDecoded = Buffer.from(response.data).toString("euc-kr");

        // cheerio를 사용하여 HTML를 파싱
        const $ = cheerio.load(listDecoded);
        // 원하는 정보를 추출하여 출력 또는 다른 작업 수행

        const listArray1 = $(
            "#main_content > div.list_body.newsflash_body > ul.type06_headline > li:nth-child(n)"
        ).toArray();
        console.log(listArray1);

        // const listArray2 = $(
        //     "#main_content > div.list_body.newsflash_body > ul.type06 > li:nth-child(n)"
        // ).toArray;

        // const AllList = [...listArray1];
        // const listResult = [];
        // for (const dataList of AllList) {
        //     const smallImage = $(dataList).find("dl > dt.photo > a > img");
        //     const smallimg = smallImage.attr("src");
        //     const titleElement = $(dataList).find("dl > dt").last();
        //     const title = $(titleElement).find("a").text();
        //     const url = $(titleElement).find("a").attr("href");

        //     try {
        //         const bigImageAndContent = await getOriginNews(url);
        //         const content = bigImageAndContent.newContent;
        //         const bigimg = bigImageAndContent.bigImageUrl;
        //         const date = bigImageAndContent.newsDate;
        //         listResult.push({
        //             url,
        //             title,
        //             smallimg,
        //             bigimg,
        //             content,
        //             date,
        //             group,
        //         });
        //     } catch (error) {
        //         console.error("list1 push 에러");
        //         continue;
        //     }
        // }
        // console.log("listResult", listResult);
        // return listResult;
        // console.log(listResult.length);
    } catch (error) {
        console.error("뉴스 리스트 불러오기 실패", error);
    }
};

// module.exports = getNaverNewsList;
getNaverNewsList(
    "https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=101"
);
