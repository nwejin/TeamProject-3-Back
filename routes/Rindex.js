const Cuser = require('../controllers/Cuser');
const Cindex = require('../controllers/Cindex');
const router = require('express').Router();

router.get('/', () => {
  Cindex.getMain;
});
router.get('/createUser', Cuser.userInsert);

// 로그인 기능
router.post('/login', Cuser.userLogin);

// 회원가입 기능
router.post('/register', Cuser.userRegister);

// 아이디 중복체크
router.post('/idValidate', Cuser.userIdDuplicate);

// 아이디 찾기
router.post('/findId', Cuser.userFindId);

// 비밀번호 찾기
router.post('/findPw', Cuser.userFindPw);

// 비밀번호 변경하기
router.post('/changePw', Cuser.userChangePw);

module.exports = router;
