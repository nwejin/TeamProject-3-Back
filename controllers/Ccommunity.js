const CommunitySchema = require('../models/CommunitySchema');
const CommentSchema = require('../models/CommentSchema');
const ReCommentSchema = require('../models/ReCommentSchema');

exports.community = (req, res) => {};

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
