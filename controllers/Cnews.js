const { idText, identifierToKeywordKind } = require('typescript');
const MyHighlightSchema = require('../models/MyHighlightSchema');
const NewsSchema = require('../models/NewsSchema');
const UserSchema = require('../models/UserSchema');
const WordsSchema = require('../models/WordSchema');
const getCoinNewsList = require('../utils/coinCrawling');
const { getNaverNewsList, getMainNewsList } = require('../utils/naverCrawling');
const { tokenCheck } = require('../utils/tokenCheck');

exports.sendEconomyNews = async (req, res) => {
    try {
        const existingNews = await NewsSchema.find({ group: 3 })
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

exports.sendStockNews = async (req, res) => {
    try {
        const existingNews = await NewsSchema.find({ group: 1 })
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

exports.sendCoinNews = async (req, res) => {
    try {
        const existingNews = await NewsSchema.find({ group: 2 })
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

// ------------------------------------------------------------------

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
        // console.log(newsDatas);
        // 클라이언트로 데이터 전송
        res.send(newsDatas);
        console.log('데이터 보내기 성공');
    } catch (error) {
        console.error('Error in main function:', error);
        res.status(500).send('Internal Server Error');
    }
};

// ---------------------------------------------------------------

exports.getStockNews = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDatas = await getNaverNewsList(
            'https://news.naver.com/breakingnews/section/101/258'
        );

        // 클라이언트로 데이터 전송
        // res.send('newsDatas');
        // console.log('데이터 보내기 성공');

        //데이터베이스 작업을 비동기적으로 실행
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
        res.status(201).send('saved');
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
        // res.send(newsDatas);
        // console.log('데이터 보내기 성공');

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
        res.status(201).send('saved');
    } catch (error) {
        console.error('Error in main function:', error);
        res.status(500).send('Internal Server Error');
    }
};
//   catch (error) {
//     console.error('Error in main function:', error);
//     res.status(500).send('Internal Server Error');
//   }
//   console.log('데이터 넣기 성공');
//   res.send('데이터 넣기 성공');
// };
//   } catch (error) {
//     console.error(error);
//   };
// };

// 경제 뉴스 가져오기
exports.getEconomyNews = async (req, res) => {
    try {
        // 웹 크롤링을 비동기적으로 실행
        const newsDatas = await getNaverNewsList(
            'https://news.naver.com/breakingnews/section/101/263'
        );

        // 클라이언트로 데이터 전송
        // res.send(newsDatas);
        // console.log('데이터 보내기 성공');

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
        res.status(201).send('saved');
    } catch (error) {
        console.error('Error in main function:', error);
        res.status(500).send('Internal Server Error');
    }
};

// const stockNews = await NewsSchema.find({ group: 1 });   주식
// const coinNews = await NewsSchema.find({ group: 2 });    암호화폐
// const economyNews = await NewsSchema.find({ group: 3 }); 경제
``;

// ------------------------------------------------------------------

// 메인페이지 뉴스 2개 가져오기
exports.getMainNews = async (req, res) => {
    try {
        const news = await NewsSchema.find().limit(2);
        // console.log(news);
        if (news.length === 0) {
            res.send({ success: false, msg: '등록된 뉴스가 없습니다.' });
        } else {
            res.send({ success: true, news: news });
        }
    } catch (error) {
        console.log(error);
    }
};

// ------------------------------------------------------------------
// 마이페이지

// 유저가 좋아요한 단어 가져오기
exports.getMyWords = async (req, res) => {
    try {
        const id = await tokenCheck(req);
        // console.log(id);

        const user = await UserSchema.find({
            user_id: id,
        });
        // console.log(user);
        if (user.length === 0) {
            res.send({ success: false, msg: '좋아요한 단어가 없습니다.' });
        } else {
            res.send({ success: true, user: user });
        }
    } catch (error) {
        console.log(error);
    }
};

// 단어 좋아요 취소하기
exports.deleteMyWords = async (req, res) => {
    try {
        const id = await tokenCheck(req);
        const no = req.body.no;

        const result = await UserSchema.updateOne(
            { user_id: id },
            { $pull: { word_bookmark: { no: no } } }
        );
        console.log(result);
        if (result.modifiedCount === 1) {
            // 성공적으로 제거된 경우
            res.send({
                success: true,
                msg: '단어가 성공적으로 제거되었습니다.',
            });
        } else {
            // 해당 no를 가진 요소가 없는 경우
            res.send({
                success: false,
                msg: '해당 단어를 찾을 수가 없습니다.',
            });
        }
    } catch (error) {
        console.log(error);
    }
};

// 유저가 저장한 뉴스
exports.getMyNews = async (req, res) => {
    try {
        const user_id = await tokenCheck(req);
        console.log(user_id);

        const user = await UserSchema.findOne({ user_id }).populate(
            'news_bookmark'
        );
        // console.log(user);
        const savedNews = user.news_bookmark;
        // console.log('---------', savedNews);
        if (savedNews) {
            res.json({ success: true, news: savedNews });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
    }
};

// ------------------------------------------------------------------

// Db에서 newsDetail로 단어 전송
exports.getWordsDb = async (req, res) => {
    try {
        const words = await WordsSchema.find();
        // console.log(words);
        res.json(words);
    } catch (error) {
        console.error(error);
    }
};

// 기존에 하트 누른 단어인지 검사
exports.checkMyWord = async (req, res) => {
    try {
        const modalWord = req.query.modalWord;
        // console.log('하트체크',modalWord);
        const id = await tokenCheck(req);

        const user = await UserSchema.findOne({ user_id: id });
        if (user) {
            const saveCheck = user.word_bookmark.some(
                (word) => word._id === modalWord._id
            );
            if (saveCheck) {
                res.json({ isSavedWord: saveCheck });
            } else {
                res.json({ isSavedWord: saveCheck });
            }
        }
    } catch (error) {
        console.error(error);
    }
};

// wordModal에서 하트 누른 단어 userDb에 저장
exports.saveMyWord = async (req, res) => {
    try {
        // console.log(req.body);
        const modalWord = req.body.modalWord;
        // console.log(modalWord);
        const id = await tokenCheck(req);
        // console.log(id);
        const user = await UserSchema.findOne({ user_id: id });
        if (user) {
            const duplicateCheck = user.word_bookmark.some(
                (word) => word._id === modalWord._id
            );
            if (!duplicateCheck) {
                user.word_bookmark.push(modalWord);
                await user.save();
            } else {
                user.word_bookmark.pull(modalWord);
                await user.save();
            }
            res.status(200).json({ success: true, message: '단어 저장 성공!' });
        } else {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없음',
            });
        }
    } catch (error) {
        console.error(error);
    }
};

// news 저장 유무 확인
exports.checkMyNews = async (req, res) => {
    try {
        const savedNews = req.query.data;
        // console.log('뉴스체크',savedNews);
        const id = await tokenCheck(req);

        const user = await UserSchema.findOne({ user_id: id });
        if (user) {
            const saveCheck = user.news_bookmark.some(
                (news) => news.toString() === savedNews._id
            );
            if (saveCheck) {
                res.json({ isSavedNews: saveCheck });
            } else {
                res.json({ isSavedNews: saveCheck });
            }
        }
    } catch (error) {
        console.error(error);
    }
};

// news 저장
exports.saveMyNews = async (req, res) => {
    try {
        // console.log(req.body);
        const savedNews = req.body.data;
        const id = await tokenCheck(req);
        // console.log(id);

        const user = await UserSchema.findOne({ user_id: id });
        if (user) {
            const duplicateCheck = user.news_bookmark.some(
                (news) => news.toString() === savedNews._id
            );
            if (!duplicateCheck) {
                user.news_bookmark.push(savedNews._id);
                await user.save();
            } else {
                user.news_bookmark.pull(savedNews._id);
                await user.save();
            }
            res.status(200).json({ success: true, message: '뉴스 저장 성공!' });
        } else {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없음',
            });
        }
    } catch (error) {
        console.error(error);
    }
};

// ref, populate 테스트
// exports.myHighlight = async (req, res) => {
//     try {
//     // console.log('req.body >', req.body);
//     // const highlightTxt = req.body.selectedText;
//     const id = await tokenCheck(req);
//     // console.log(id);
//     const fromWordDb = await UserSchema.findOne({user_id: id}).populate('news_bookmark');
//     console.log('---------------------',fromWordDb.news_bookmark);
//     } catch(error) {
//         console.error(error);
//     }

// }

// 형광펜 텍스트 저장
exports.myHighlight = async (req, res) => {
    try {
        // console.log(req.body);
        const { news_id, selectedTxt } = req.body;
        // const highlightTxt = req.body.selectedTxt;
        const id = await tokenCheck(req);

        // 형광펜 저장 텍스트 데이터가 있는 유저인지 구분
        const saveUserCheck = await MyHighlightSchema.findOne({ user_id: id });

        // 형광펜 저장 텍스트 데이터 없는 유저
        if (!saveUserCheck) {
            await MyHighlightSchema.create({
                user_id: id,
                highlight: [
                    {
                        news_id: news_id,
                        word: [selectedTxt],
                    },
                ],
            });
        } else {
            // 형광펜 저장 텍스트가 있지만 어떤 뉴스에 형광펜을 했는지 구분
            const existingHighlight = saveUserCheck.highlight.find(
                (h) => h.news_id === news_id
            );

            if (existingHighlight) {
                existingHighlight.word.push(selectedTxt);
            } else {
                // 해당 news_id에 대한 하이라이트가 없는 경우 새로운 하이라이트 객체 추가
                saveUserCheck.highlight.push({
                    news_id: news_id,
                    word: [selectedTxt],
                });
            }
            await saveUserCheck.save();
        }
    } catch (error) {
        console.error(error);
    }
};

// 형광펜 텍스트 프론트로 전송
exports.getHighlight = async (req, res) => {
    try {
        // console.log('--------------', req.query);
        const { news_id } = req.query;
        const id = await tokenCheck(req);

        const user = await MyHighlightSchema.findOne({ user_id: id });
        // console.log('------------------', user);
        if (user) {
            // news_id가 일치하는 데이터 객체 찾기

            const findHighlight = user.highlight.find(
                (h) => h.news_id === news_id
            );
            // console.log('-------', findHighlight);
            if (findHighlight) {
                res.json({ available: true, highlight: findHighlight });
            }
            // else {
            //     res.json({ available: false });
            // }
        } else {
            res.json({ available: false });
        }
    } catch (error) {
        console.error(error);
    }
};

// 형광펜 삭제
exports.deleteHighlight = async (req, res) => {
    try {
        // console.log(req.body);
        const { news_id, highlightTxt } = req.body;
        const user_id = await tokenCheck(req);

        // const user = await MyHighlightSchema.findOne({ user_id });

        // const findNewsid = user.highlight.find((h) => h.news_id === news_id);
        // // console.log('-----!!!', findNewsid);
        // const findHighlightWord = findNewsid.word;
        // console.log('--------!', findHighlightWord);

        // MongoDB에서 해당 값을 pull하여 삭제
        const deleteTxt = await MyHighlightSchema.updateOne(
            { user_id, 'highlight.news_id': news_id },
            { $pull: { 'highlight.$.word': highlightTxt } }
        );
        if (deleteTxt.modifiedCount === 1) {
            res.json({ success: true, msg: '하이라이트 삭제 완료' });
        } else {
            res.json({
                success: false,
                msg: '해당하는 하이라이트를 찾을 수 없습니다.',
            });
        }
    } catch (error) {
        console.error(error);
    }
};
