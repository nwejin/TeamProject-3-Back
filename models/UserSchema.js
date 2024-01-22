const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
    user_id: {
        require: true,
        unique: true,
        type: String,
    },
    user_password: {
        require: true,
        type: String,
    },
    user_nickname: {
        require: true,
        type: String,
    },
    user_email: {
        require: true,
        type: String,
    },
    word_bookmark: {
        ref: 'WordSchema',
        type: [String],
    },
    news_bookmark: {
        ref: 'NewsSchema',
        type: [String],
    },
});

// 기본적으로 첫번째인자 + s(소문자)로 생성된다. -> 세번째 인자로 설정한 값이 DB 컬렉션 아래에 스키마명으로 들어가게 된다.
module.exports = mongoose.model('User', UserSchema);
