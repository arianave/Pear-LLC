const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
process.env.PORT = 3000;
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const UserSchema = new mongoose.Schema({
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

const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
    postID:mongoose.Schema.Types.ObjectId,
    userID: mongoose.Schema.Types.ObjectId,  
    textContent: String,                         
    mediaContent: String,                        
    creationDate: Date,                               
  });
  
const Post = mongoose.model('Post', PostSchema);

const CommentSchema = new mongoose.Schema({
    commentID: mongoose.Schema.Types.ObjectId,
    postID: mongoose.Schema.Types.ObjectId, 
    userID: mongoose.Schema.Types.ObjectId, 
    textContent: String,                         
    creationDate: Date,   
  });
  
const Comment = mongoose.model('Comment', CommentSchema);

const ThreadSchema = new mongoose.Schema({
  threadID: mongoose.Schema.Types.ObjectId,
  userID: mongoose.Schema.Types.ObjectId,
  threadName: String,                         
  creationDate: Date,
});

const Thread = mongoose.model('Thread', ThreadSchema);

const VoteSchema = new mongoose.Schema({
  voteID: mongoose.Schema.Types.ObjectId,
  postID: mongoose.Schema.Types.ObjectId,
  upvoteCount: Number,
  downvoteCount: Number
});

const Vote = mongoose.model('Vote', VoteSchema);

const TagSchema = new mongoose.Schema({
  tagID: mongoose.Schema.Types.ObjectId,
  postID: mongoose.Schema.Types.ObjectId,
  tagName: String
});

const Tag = mongoose.model('Tag', TagSchema);

const MessageSchema = new mongoose.Schema({
  messageID: mongoose.Schema.Types.ObjectId,
  userID: mongoose.Schema.Types.ObjectId,
  messageContent: String,
  messageDate: Date
});

const Message = mongoose.model('Message', MessageSchema);

const FollowSchema = new mongoose.Schema({
  userID: mongoose.Schema.Types.ObjectId,
  requestStatus: String
});

const Follow = mongoose.model('Follow', FollowSchema);

const JoinSchema = new mongoose.Schema({
  userID: mongoose.Schema.Types.ObjectId,
  threadID: mongoose.Schema.Types.ObjectId,
  joinStatus: Boolean,
  joinDate: Date
});

const Join = mongoose.model('Join', JoinSchema);

// API endpoint to fetch data
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/posts', async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/comments', async (req, res) => {
    try {
      const comments = await Comment.find();
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/threads', async (req, res) => {
    try {
      const threads = await Thread.find();
      res.json(threads);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/votes', async (req, res) => {
    try {
      const votes = await Vote.find();
      res.json(votes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await Tag.find();
      res.json(tags);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await Message.find();
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/follows', async (req, res) => {
    try {
      const follows = await Follow.find();
      res.json(follows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.get('/api/joins', async (req, res) => {
    try {
      const joins = await Join.find();
      res.json(joins);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
