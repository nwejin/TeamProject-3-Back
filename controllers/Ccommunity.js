const CommunitySchema = require('../models/CommunitySchema');
const CommentSchema = require('../models/CommentSchema');
const ReCommentSchema = require('../models/ReCommentSchema');

exports.community = (req, res) => {};

// 1. DB 저장
exports.communityInsert = async (req, res) => {
  try {
    await CommunitySchema.create({
      title: req.body.title,
      content: req.body.content,
      subject: req.body.subject,
      file: req.body.file,
    });
  } catch (err) {
    console.log(err);
  }
};

// 2. 저장된 값 불러와서 프론트에 보내주기 (최신순으로)
