// UserSchema.js
const mongoose = require('mongoose');

// Define the UserSchema class
class UserSchema {
  constructor() {
    this.schema = new mongoose.Schema({
      userID: mongoose.Schema.Types.ObjectId,
      username: String,
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      birthDate: Date,
      creationDate: Date,
      profilePicture: String,
      profileBiography: String,
      accountPrivacy: String
    });

    this.model = mongoose.model('User', this.schema);
  }
}

module.exports = new UserSchema();
