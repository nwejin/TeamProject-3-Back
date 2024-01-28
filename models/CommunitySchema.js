const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommunitySchema = new Schema(
    {
        // id 연결 (ref는 exports 이름)
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true,
        },
        userNickName: {
            type: String,
            require: true,
        },
        //  커뮤니티 데이터
        title: {
            require: true,
            type: String,
        },
        content: {
            require: true,
            type: String,
        },
        subject: {
            require: true,
            type: String,
            enum: ['free', 'economy', 'stock', 'coin'],
        },
        date: {
            type: String,
            default: Date.now,
        },
        like: {
            type: Number,
            default: 0,
        },
        image: {
            type: String,
        },
    }
    // , {
    //     timestamps: true,
    // }
);

module.exports = mongoose.model('Community', CommunitySchema);
