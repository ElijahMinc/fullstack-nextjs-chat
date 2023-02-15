const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    surname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    cloudinaryId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('User', UserSchema);
