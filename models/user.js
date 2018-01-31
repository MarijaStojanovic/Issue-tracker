const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { emailRegExp } = require('../lib/misc');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegExp, 'Invalid email'],
    required: 'Please enter an email address',
  },
  password: { type: String, required: true, select: false },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
