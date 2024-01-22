const NewsSchema = require('../models/NewsSchema');
const getCoinNewsList = require('../utils/coinCrawling');
const { getNaverNewsList, getMainNewsList } = require('../utils/naverCrawling');

exports.getNewsList = async (req, res) => {
    try {
        const existingNews = await NewsSchema.find()
            .sort({ date: -1 })
            .limit(20);
        if (existingNews) {
            res.send(existingNews);
        } else {
            console.log('News DB is empty');
        }
    } catch (error) {
        console.error('Error in database operation:', error);
    }
};

exports.resetNewsList = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        var newsDatas = await getMainNewsList(
            'https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=101'
        );
        // 날짜 최신순 정렬
        // 날짜를 Date 객체로 변환하는 함수
        function parseDate(dateString) {
            const [datePart, amPm, timePart] = dateString.split(' '); // 날짜와 시간을 분리
            const [year, month, day] = datePart.split('.').map(Number); // 년, 월, 일 추출
            let [hour, minute] = timePart.split(':').map(Number); // 시간과 분 추출

            // 오후인 경우, 시간을 12시간 추가
            if (amPm.includes('오후') && hour !== 12) {
                hour += 12;
            }
            return new Date(year, month - 1, day, hour, minute);
        }

        newsDatas = newsDatas.sort(function (a, b) {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);

            return dateB - dateA;
        });
        console.log(newsDatas);
        // 클라이언트로 데이터 전송
        res.send(newsDatas);
        console.log('데이터 보내기 성공');
    } catch (error) {
        console.error('Error in main function:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getStockNews = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDatas = await getNaverNewsList(
            'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=101&sid2=258'
        );

        // 클라이언트로 데이터 전송
        res.send(newsDatas);
        console.log('데이터 보내기 성공');

        // 데이터베이스 작업을 비동기적으로 실행
        await Promise.all(
            newsDatas.map(async (newsdata) => {
                try {
                    // 중복된 데이터가 없을 때에만 데이터 생성
                    await NewsSchema.updateOne(
                        { title: newsdata.title, content: newsdata.content },
                        { $setOnInsert: { ...newsdata, group: 1 } },
                        // updateOne 메서드의 옵션으로 upsert: true를 설정
                        // 주어진 조건에 맞는 데이터가 없을 때에는 새로운 데이터를 생성
                        { upsert: true }
                    );
                } catch (error) {
                    console.error('Error in database operation: 데이터 중복');
                    return;
                }
            })
        );
    } catch (error) {
        console.error('Error in main function:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.getCoinNews = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDatas = await getCoinNewsList(
            'https://www.digitaltoday.co.kr/news/articleList.html?page=1&total=12260&sc_section_code=S1N9&sc_sub_section_code=&sc_serial_code=&sc_second_serial_code=&sc_area=&sc_level=&sc_article_type=&sc_view_level=&sc_sdate=&sc_edate=&sc_serial_number=&sc_word=&box_idxno=&sc_multi_code=&sc_is_image=&sc_is_movie=&sc_user_name=&sc_order_by=E&view_type=sm'
        );

        // 클라이언트로 데이터 전송
        res.send(newsDatas);
        console.log('데이터 보내기 성공');
        // 데이터베이스 작업을 비동기적으로 실행
        await Promise.all(
            newsDatas.map(async (newsdata) => {
                try {
                    // 중복된 데이터가 없을 때에만 데이터 생성
                    await NewsSchema.updateOne(
                        { title: newsdata.title, content: newsdata.content },
                        { $setOnInsert: { ...newsdata, group: 2 } },
                        // updateOne 메서드의 옵션으로 upsert: true를 설정
                        // 주어진 조건에 맞는 데이터가 없을 때에는 새로운 데이터를 생성
                        { upsert: true }
                    );
                } catch (error) {
                    console.error('Error in database operation: 데이터 중복');
                    return;
                }
            })
        );
    } catch (error) {
        console.error('Error in main function:', error);
        res.status(500).send('Internal Server Error');
    }
    console.log('데이터 넣기 성공');
};
//   } catch (error) {
//     console.error(error);
//   };
// };

// 경제 뉴스 가져오기
exports.getEconomyNews = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDatas = await getNaverNewsList(
            'https://news.naver.com/main/list.naver?mode=LS2D&mid=shm&sid1=101&sid2=263'
        );

        // 클라이언트로 데이터 전송
        res.send(newsDatas);
        console.log('데이터 보내기 성공');

        // 데이터베이스 작업을 비동기적으로 실행
        await Promise.all(
            newsDatas.map(async (newsdata) => {
                try {
                    // 중복된 데이터가 없을 때에만 데이터 생성
                    await NewsSchema.updateOne(
                        { title: newsdata.title, content: newsdata.content },
                        { $setOnInsert: { ...newsdata, group: 3 } },
                        // updateOne 메서드의 옵션으로 upsert: true를 설정
                        // 주어진 조건에 맞는 데이터가 없을 때에는 새로운 데이터를 생성
                        { upsert: true }
                    );
                } catch (error) {
                    console.error('Error in database operation: 데이터 중복');
                    return;
                }
            })
        );
    } catch (error) {
        console.error('Error in main function:', error);
        res.status(500).send('Internal Server Error');
    }
};

// const stockNews = await NewsSchema.find({ group: 1 });   주식
// const coinNews = await NewsSchema.find({ group: 2 });    암호화폐
// const economyNews = await NewsSchema.find({ group: 3 }); 경제
``;
