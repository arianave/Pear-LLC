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

const multer = require('multer');
const path = require('path');

// Set up Multer for file storage


// Initialize the multer upload middleware
const upload = multer({ dest: './uploads' });

app.post('/api/users', async (req, res) => {
  const { firstName, lastName, email, username, password, birthDate } = req.body;

  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password,
      birthDate,
      creationDate: new Date() // Automatically set creation date
    });
    await newUser.save(); // Save to the database
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      // Check if the user exists in the database
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the provided password with the one stored in the database
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // If login is successful, send success response including user ID
      res.status(200).json({ 
        message: 'Login successful', 
        user: { 
          username: user.username,
          userId: user._id // Include the user ID in the response
        } 
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });

  app.post('/api/post', upload.single('mediaContent'), async (req, res) => {
    try {
      const { userID, textContent, postType } = req.body;
      console.log(req.file.path);
      const mediaContent = req.file ? req.file.path : null; // Handle file upload (if any)
  
      let newPost;
  
      // Handle text posts (no media)
    if (postType === 'text') {
      newPost = new Post({
        userID,
        textContent, // Save text content for text posts
        creationDate: new Date(),
      });
    } 
    // Handle picture posts
    else if (postType === 'picture') {
      if (!mediaContent) {
        return res.status(400).json({ success: false, message: 'Picture file is required' });
      }
      newPost = new Post({
        userID,
        textContent, // Save caption for picture posts
        photoContent: mediaContent, // Save media in the correct field
        creationDate: new Date(),
      });
    } 
    // Handle video posts
    else if (postType === 'video') {
      if (!mediaContent) {
        return res.status(400).json({ success: false, message: 'Video file is required' });
      }
      newPost = new Post({
        userID,
        textContent, // Save caption for video posts
        videoContent: mediaContent, // Save media in the correct field
        creationDate: new Date(),
      });
    } 
    // Handle invalid post types
    else {
      return res.status(400).json({ success: false, message: 'Invalid post type' });
    }

    // Save the new post to the database
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating post', error });
  }
});

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
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });