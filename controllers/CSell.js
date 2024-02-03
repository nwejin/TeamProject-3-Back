const VirtualSchema = require('../models/VirtualSchema');
const StockWordSchema = require('../models/StockWordSchema');
const UserSchema = require('../models/UserSchema');
const { tokenCheck } = require('../utils/tokenCheck');

exports.post_profit = async (req, res) => {
    const { profit } = req.body;
    const { jwtCookie } = req.cookies; // 비로그인 시 savedId만 전달 -> 로그인 시 savedId + jwtCookie 전달
    const userid = await tokenCheck(req); //saveId 대신 userid로 저장
    console.log('req.body > ', profit);

    try {
        if (jwtCookie) {
            // 로그인 시
            let searchData = await VirtualSchema.findOne({ userid: userid }); // userid로 DB 검색

            if (!searchData) {
                // userid가 없으면 정보 저장
                const newData = new VirtualSchema({
                    userid: userid,
                    profit: profit,
                    win: 0,
                    loss: 0,
                });
                searchData = await newData.save();
                console.log('new data', searchData);
            } else {
                // userid가 있으면 수익 업데이트
                searchData.profit += profit;
            }

            // 수익에 따른 이긴 횟수, 진 횟수 통계
            if (profit > 0) {
                searchData.win ? (searchData.win += 1) : (searchData.win = 1);
                console.log('profit win');
            }
            if (profit < 0) {
                searchData.loss
                    ? (searchData.loss += 1)
                    : (searchData.loss = 1);
                console.log('profit loss');
            }

            // 모든 수정이 완료 후 저장 -> 병렬 저장 방지를 위해 마지막으로 save
            await searchData.save();
            res.send({ success: true });
        } else {
            // 비로그인 시
            console.log('not jwt, 비로그인임');
        }
    } catch (error) {
        console.log(error);
        res.send({ success: false });
    }
};

// 모의투자 통계
exports.post_showRecord = async (req, res) => {
    try {
        const userid = await tokenCheck(req); //여기서 아이디 검증 -> findOne에서 할 필요 x
        console.log('userid record', userid);

        const record = await VirtualSchema.findOne({ userid: userid });
        const { profit, win, loss, profitArray } = record;

        console.log('레코드 구조 분해 > ', profit, win, loss, profitArray);

        res.send({
            profit: profit,
            win: win,
            loss: loss,
            profitArray: profitArray,
        });
    } catch (error) {
        console.log('post record error > ', error);
        res.send(error);
    }
};

// P&L 출력
exports.post_ProfitAndLoss = async (req, res) => {
    try {
        const { profit } = req.body;
        const userid = await tokenCheck(req);
        if (userid) {
            const ProfitAndLoss = await VirtualSchema.findOneAndUpdate(
                { userid: userid },
                { $push: { profitArray: profit } },
                { returnDocument: 'after' }
            );
            console.log('profitAnd loss', ProfitAndLoss.profitArray); // 이 부분을 추가하여 배열을 출력
            // res.send(ProfitAndLoss.profitArray);
        }
    } catch (error) {
        console.log(error);
    }

    res.send(true);
};

//모의투자 랭킹 보기 (전체 유저의 profit순으로 정렬 (win rate도 같이 보내기))
exports.post_showRank = async (req, res) => {
    try {
        let rank = []; //rank = 모든 사용자 {id, profit, win, objectId.user_profile} 으로 구성
        const userId = await tokenCheck(req);

        const user = await UserSchema.findOne({
            user_id: userId,
        });
        if (!user) {
            return res.status(404).send('사용자 확인 불가');
        }
        const profile = user.user_profile;

        //profit, win으로 정렬 우선순위 설정
        const allRank = await VirtualSchema.find().sort({
            profit: -1,
            win: -1,
        }); //모든 사용자 기록

        allRank.map((item) => {
            const { userid, profit, win } = item;
            rank.push({ userid, profit, win, profile });
        });

        console.log('rank > ', rank);

        res.send({ rank: rank });
    } catch (err) {
        res.send(err);
    }
};

// 클릭한 용어의 설명을 출력합니다.
exports.get_vocabulary = async (req, res) => {
    try {
        const { eng_word } = req.query;
        console.log(req.query);
        const word = await StockWordSchema.findOne({
            eng_word: eng_word,
        });
        res.send({ data: word });
        // res.send('hi');
    } catch (error) {
        console.log(error);
    }
};
