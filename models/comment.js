const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  data: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  issue: { type: Schema.Types.ObjectId, ref: 'Issue' },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
