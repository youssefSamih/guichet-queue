const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  logName: {
    type: String,
  },
  imgProfile: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
