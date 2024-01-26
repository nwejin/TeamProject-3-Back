const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoConnect = require('./models/Mindex');
const axios = require('axios');
const qs = require('querystring');
require('dotenv').config;

mongoConnect();
const PORT = process.env.PORT || 8000;
app.use(
    cors({
        origin: 'http://localhost:3000', // 클라이언트의 도메인
        credentials: true,
    })
);
const bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const indexRouter = require('./routes/RUser');
app.use('/', indexRouter);

const newsRouter = require('./routes/Rnews');
app.use('/news', newsRouter);

const communityRouter = require('./routes/Rcommunity');
app.use('/community', communityRouter);

const virtualRouter = require('./routes/Rvirtual');
app.use('/virtual', virtualRouter);

const mypageRouter = require('./routes/Rmypage');
app.use('/mypage', mypageRouter);

// 카카오 로그인
// 나중에 정리할게요 >..<
async function call(method, uri, param, header) {
    try {
        rtn = await axios({
            method: method,
            url: uri,
            headers: header,
            data: param,
        });
    } catch (err) {
        rtn = err.response;
    }
    return rtn.data;
}

let kakaoToken = '';
app.get('/kakao/login', async function (req, res) {
    try {
        console.log(req.query);
        const param = qs.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            client_secret: process.env.CLIENT_SECRET,
            code: req.query.code,
        });
        const header = { 'content-type': 'application/x-www-form-urlencoded' };
        console.log(process.env.TOKEN_URI);
        var rtn = await call('POST', process.env.TOKEN_URI, param, header);
        console.log(rtn.access_token);
        kakaoToken = rtn.access_token;

        try {
            console.log('/profile 시작');
            console.log(kakaoToken);
            const uri = process.env.API_HOST + '/v2/user/me';
            const param = {};
            const header = {
                'content-type':
                    'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${kakaoToken}`,
            };
            const rtn = await call('POST', uri, param, header);
            console.log(rtn);
            res.send(rtn);
        } catch (error) {
            // Handle error
            console.error(error);
            res.send('profile 가져오기 오류');
        }
    } catch (error) {
        console.log(error);
        res.send('login 오류');
    }
    // res.status(302).redirect(`http://localhost:3000`);
});

// app.get('/profile', async function (req, res) {
//     console.log('/profile 시작');
//     console.log(kakaoToken);
//     const uri = process.env.API_HOST + '/v2/user/me';
//     const param = {};
//     const header = {
//         'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
//         Authorization: `Bearer ${kakaoToken}`,
//     };
//     try {
//         const rtn = await call('POST', uri, param, header);
//         console.log(rtn);
//         res.send(rtn);
//     } catch (error) {
//         // Handle error
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

app.get('/kakao/logout', async function (req, res) {
    const uri = process.env.API_HOST + '/v1/user/logout';
    const param = null;
    const header = {
        Authorization: 'Bearer ' + kakaoToken,
    };
    try {
        var rtn = await call('POST', uri, param, header);
        kakaoToken = '';
        res.send(rtn);
    } catch (error) {
        console.log(error);
        res.send('로그아웃 실패');
    }
});
app.get('/kakao/exit', async function (req, res) {
    const uri = process.env.API_HOST + '/v1/user/unlink';
    const param = null;
    const header = {
        Authorization: 'Bearer ' + kakaoToken,
    };
    try {
        var rtn = await call('POST', uri, param, header);
        kakaoToken = '';
        res.send(rtn);
    } catch (error) {
        console.log(error);
        res.send('로그아웃 실패');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
