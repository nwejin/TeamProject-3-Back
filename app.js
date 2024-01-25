const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoConnect = require('./models/Mindex');
const axios = require('axios');
const qs = require('querystring');
const session = require('express-session');

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
const indexRouter = require('./routes/Rindex');

app.use('/', indexRouter);
const newsRouter = require('./routes/Rnews');
app.use('/news', newsRouter);

const communityRouter = require('./routes/Rcommunity');
app.use('/community', communityRouter);

// 카카오 로그인
// 나중에 정리할게요 >..<
const client_id = 'da5d3b32f284512d0975b638e8a033ea';
const redirect_uri = 'http://localhost:3000/kakao/callback';
const token_uri = 'https://kauth.kakao.com/oauth/token';
const api_host = 'https://kapi.kakao.com';
const client_secret = 'QpoC5CVw8TIYq0cMg2Pz7H0YXxklFIKE';

app.get('/authorize', function (req, res) {
    res.status(302).redirect(
        `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&prompt=login`
    );
});

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
app.get('/redirect', async function (req, res) {
    console.log(req.query);
    const param = qs.stringify({
        grant_type: 'authorization_code',
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: client_secret,
        code: req.query.code,
    });
    const header = { 'content-type': 'application/x-www-form-urlencoded' };
    var rtn = await call('POST', token_uri, param, header);
    console.log(rtn.access_token);
    kakaoToken = rtn.access_token;
    // res.status(302).redirect(`http://localhost:3000`);
});

app.get('/profile', async function (req, res) {
    console.log('/profile 시작');
    console.log(kakaoToken);
    const uri = api_host + '/v2/user/me';
    const param = {};
    const header = {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${kakaoToken}`,
    };
    try {
        const rtn = await call('POST', uri, param, header);
        console.log(rtn);
        res.send(rtn);
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/logout', async function (req, res) {
    const uri = api_host + '/v1/user/logout';
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
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
