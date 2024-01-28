const Ccommunity = require('../controllers/Ccommunity');
const router = require('express').Router();
const { S3Client } = require('@aws-sdk/client-s3');
// aws-s3관련 (이미지)
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid4');

require('dotenv').config();

router.get('/', Ccommunity.community);

// 이미지 저장 관련
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRECTACCESSKEY,
    },
});

// multer 설정
const storage = multerS3({
    s3: s3,
    acl: 'public-read-write',
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        const filename = `${uuid()}-${file.originalname}`;
        cb(null, filename);
    },
    // limits: { fileSize: 5 * 1024 * 1024 },
});

// multer설정을 라우터로 빼기
const upload = multer({ storage: storage });

// 글 추가
router.post('/write', upload.single('file'), Ccommunity.communityWrite);

// 글 읽기
router.get('/read', Ccommunity.communityRead);

// 댓글 데이터 추가
router.post('/commentWrite', Ccommunity.communityCommentWrite);

// 글 삭제
// router.post('/like', Ccommunity.communityLike);

module.exports = router;
