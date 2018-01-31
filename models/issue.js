const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const types = ['Pending', 'Completed'];

const IssueSchema = new Schema({
  name: { type: String, trim: true, required: true },
  status: { type: String, required: true, enum: types, default: 'Pending' },
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  files: [String],
}, { timestamps: true });

module.exports = {
  Issue: mongoose.model('Issue', IssueSchema),
  statuses: types,
};
