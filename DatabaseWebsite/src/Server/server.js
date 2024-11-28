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
    isPrivate: Boolean
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
  postID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Post' },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },                         
  timestamp: { type: Date, default: Date.now }
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
downvoteCount: Number,
upvotedUsers: { type: [mongoose.Schema.Types.ObjectId], default: [] },
downvotedUsers: { type: [mongoose.Schema.Types.ObjectId], default: [] }
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
sender: mongoose.Schema.Types.ObjectId,
receiver: mongoose.Schema.Types.ObjectId,
messageContent: String,
messageDate: Date
});

const Message = mongoose.model('Message', MessageSchema);

const FollowSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  requestStatus: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId }],
  following: [{ type: mongoose.Schema.Types.ObjectId }]
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
      creationDate: new Date(),
      profileBiography: '',
      isPrivate: false, 
      profilePicture: ''
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

  app.post('/api/users/:userId/profile', async (req, res) => {
    const { userId } = req.params;
    const { biography, profilePicture, isPrivate } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profileBiography: biography,
          profilePicture: profilePicture,
          isPrivate: isPrivate,
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the profile.' });
    }
  });

  app.post('/api/post', upload.single('mediaContent'), async (req, res) => {
    try {
      const { userID, textContent, postType } = req.body;
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

  app.get('/api/users/:userId', async (req, res) => {
    try {
      const userId = req.params.userId; // Extract userId from URL
      const user = await User.findById(userId); // Find user by ID
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({ success: true, user }); // Send the user object in the response
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  app.get('/api/searchUsers/:username', async (req, res) => {
    const username = req.params.username;
    
    try {
      const users = await User.find({ username: { $regex: username, $options: 'i' } }); // Case-insensitive search
      res.json({ success: true, users });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error searching users' });
    }
  });

  app.get('/api/name/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, user: { name: `${user.firstName} ${user.lastName}` } });
    } catch (error) {
      console.error('Error retrieving name:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });

  app.get('/api/username/:userId', async (req, res) => {
    const { userId } = req.params; // Extract userId from request parameters
  
    try {
      // Find the user in the database by userId
      const user = await User.findById(userId);
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Respond with the user's details (you can send only the username if needed)
      res.json({ success: true, user: { username: user.username } });
    } catch (error) {
      console.error('Error retrieving username:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  app.get('/api/comments/:postId', async (req, res) => {
    try {
      const postId = req.params.postId; // Extract postId from the URL
      const comments = await Comment.find({ postID: postId }); // Find comments by postID
  
      if (!comments || comments.length === 0) {
        return res.json({ success: false, message: 'No comments found for this post' });
      }
  
      res.json({ success: true, comments }); // Send the comments in the response
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
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

  // Add a new comment to a post
  app.post('/api/addcomments/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const { content, userId } = req.body;

      if (!content || !userId) {
        return res.status(400).json({ success: false, message: 'Content and userID are required' });
      }

      // Create a new comment
      const newComment = new Comment({
        postID: postId,
        userID: userId,
        content: content,
        timestamp: new Date(),
      });

      await newComment.save();
      res.json({ success: true, comment: newComment });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Upvote a post
  app.post('/api/posts/:postId/upvote/:userId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.params.userId;

      // Find the vote document for the post or create one if it doesn't exist
      let voteDoc = await Vote.findOne({ postID: postId });

      if (!voteDoc) {
        // If no votes exist for this post, create a new Vote document
        voteDoc = new Vote({
          postID: postId,
          upvoteCount: 1,
          downvoteCount: 0,
          upvotedUsers: [userId],
          downvotedUsers: []
        });
      } else {
        // Check if the user has already upvoted; if so, remove the upvote
        if (voteDoc.upvotedUsers.includes(userId)) {
          voteDoc.upvoteCount -= 1;
          voteDoc.upvotedUsers = voteDoc.upvotedUsers.filter(id => id.toString() !== userId);
        } else {
          // Remove any downvote if it exists, and add an upvote
          if (voteDoc.downvotedUsers.includes(userId)) {
            voteDoc.downvoteCount -= 1;
            voteDoc.downvotedUsers = voteDoc.downvotedUsers.filter(id => id.toString() !== userId);
          }
          // Add the upvote
          voteDoc.upvoteCount += 1;
          voteDoc.upvotedUsers.push(userId);
        }
      }
  
      await voteDoc.save();
      res.json({ success: true, upvoteCount: voteDoc.upvoteCount, downvoteCount: voteDoc.downvoteCount });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Downvote a post
  app.post('/api/posts/:postId/downvote/:userId', async (req, res) => {
    try {
      const postId = req.params.postId;
      const userId = req.params.userId;

      // Find the vote document for the post or create one if it doesn't exist
      let voteDoc = await Vote.findOne({ postID: postId });

      if (!voteDoc) {
        // If no votes exist for this post, create a new Vote document
        voteDoc = new Vote({
          postID: postId,
          upvoteCount: 0,
          downvoteCount: 1,
          upvotedUsers: [],
          downvotedUsers: [userId]
        });
      } else {
        // Check if the user has already downvoted; if so, remove the downvote
        if (voteDoc.downvotedUsers.includes(userId)) {
          voteDoc.downvoteCount -= 1;
          voteDoc.downvotedUsers = voteDoc.downvotedUsers.filter(id => id.toString() !== userId);
        } else {
          // Remove any upvote if it exists, and add a downvote
          if (voteDoc.upvotedUsers.includes(userId)) {
            voteDoc.upvoteCount -= 1;
            voteDoc.upvotedUsers = voteDoc.upvotedUsers.filter(id => id.toString() !== userId);
          }
          // Add the downvote
          voteDoc.downvoteCount += 1;
          voteDoc.downvotedUsers.push(userId);
        }
      }
  
      await voteDoc.save();
      res.json({ success: true, upvoteCount: voteDoc.upvoteCount, downvoteCount: voteDoc.downvoteCount });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Check if a user has already voted on a post
  app.get('/api/posts/:postId/hasVoted', async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.query.userId;

      // Find the Vote document for the given postId
      const voteRecord = await Vote.findOne({ postID: postId });

      if (!voteRecord) {
        return res.json({ success: false, message: 'Vote record not found for this post' });
      }

      let hasVoted = false;
      let voteType = null;

      // Check if userId is in the upvotedUsers or downvotedUsers array
      if (voteRecord.upvotedUsers.includes(userId)) {
        hasVoted = true;
        voteType = 'upvote';
      } else if (voteRecord.downvotedUsers.includes(userId)) {
        hasVoted = true;
        voteType = 'downvote';
      }

      // Return whether the user has voted and the type of vote
      res.json({ success: true, hasVoted, voteType });
    } catch (error) {
      console.error('Error checking if user has voted:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
});

  // Backend: Get vote count for a post
  app.get('/api/posts/:postId/voteCount', async (req, res) => {
    const { postId } = req.params;

    try {
      const vote = await Vote.findOne({ postID: postId });

      if (!vote) {
        return res.json({ success: false, message: 'Vote record not found for this post' });
      }

      res.json({ success: true, upvoteCount: vote.upvoteCount, downvoteCount: vote.downvoteCount });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // code below may need to be adjusted
  app.get('/getFollowedPosts/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const followsCollection = db.collection('follows');
        const postsCollection = db.collection('posts');

        // Step 1: Get the list of users that the current user follows, using userID instead of _id
        const followData = await followsCollection.findOne({ userID: ObjectId(userId) });

        if (!followData) {
            return res.status(404).json({ message: 'User not found or not following anyone.' });
        }

        const following = followData.following; // Array of userIDs that this user follows

        // Step 2: Get posts from the users the current user is following
        const posts = await postsCollection
            .find({ userID: { $in: following.map(id => ObjectId(id)) } }) // Find posts by followed user IDs
            .sort({ createdAt: -1 }) // Sort posts by creation date, newest first
            .toArray();

        res.json({ posts });
    } catch (error) {
        console.error('Error fetching followed posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

  app.get('/api/chats/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
      // Fetch chats where the user is either the sender or receiver
      const chats = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }]
      }).sort({ messageDate: -1 }); // Sort by most recent messages

      if (chats.length > 0) {
        res.status(200).json({
          success: true,
          chats
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'No chats found for this user'
        });
      }
    } catch (error) {
      console.error('Error retrieving chats:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving chats'
      });
    }
  });

  app.post('/api/messages', async (req, res) => {
    const { senderId, receiverId, content } = req.body;
  
    try {
      const newMessage = new Message({
        sender : senderId,
        receiver : receiverId,
        messageContent : content,
        messageDate: new Date() // Automatically set creation date
      });
      await newMessage.save(); // Save to the database
      res.status(201).json({ success: true, newMessage });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating message', error });
    }
  });


 // Fetch followers for a user with detailed debugging
app.get('/api/followers/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(`Received request for followers of user with ID: ${userId}`);

  try {
    let followData = await Follow.findOne({ userID: userId });
    
    if (!followData) {
      console.log(`No follow data found for user with ID: ${userId}. Creating new entry...`);

      // Create a new entry with the provided userId
      followData = new Follow({
        userID: userId,
        requestStatus: 'active', // Set a default status; adjust as needed
        followers: [],
        following: []
      });

      await followData.save();
      console.log(`New Follow entry created for user with ID: ${userId}`);
    }

    const followers = await User.find({ _id: { $in: followData.followers } });
    
    if (followers.length === 0) {
      console.warn(`No followers found in User collection for user with ID: ${userId}`);
      return res.status(200).json({ success: true, followers: [], message: 'No followers found.' });
    }

    console.log(`Successfully retrieved ${followers.length} followers for user ID: ${userId}`);
    res.status(200).json({ success: true, followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Fetch following for a user with detailed debugging
app.get('/api/following/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(`Received request for following users of user with ID: ${userId}`);

  try {
    const followData = await Follow.findOne({ userID: userId });

    if (!followData) {
      console.log(`No follow data found for user with ID: ${userId}`);
      return res.status(200).json({ success: false, message: 'No following found.' });
    }


    const following = await User.find({ _id: { $in: followData.following } });

    if (following.length === 0) {
      console.warn(`No following users found in User collection for user with ID: ${userId}`);
      return res.status(200).json({ success: true, following: [], message: 'No following found.' });
    }

    console.log(`Successfully retrieved ${following.length} following users for user ID: ${userId}`);
    res.status(200).json({ success: true, following });
  } catch (error) {
    console.error('Error fetching following users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to follow a user
app.post('/api/follow', async (req, res) => {
  const { userId, followUserId } = req.body;

  try {
    let followData = await Follow.findOne({ userID: userId });

    // Check if the user is already being followed
    if (followData.following.includes(followUserId)) {
      return res.status(400).json({ success: false, message: 'Already following this user' });
    }

    // Add the user to the following list
    followData.following.push(followUserId);
    await followData.save();

    res.status(200).json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ success: false, error: 'Error following user' });
  }
});

// Route to add a follower to a user's followers list
app.post('/api/addFollower', async (req, res) => {
  const { followUserId, userId } = req.body;

  try {
    // Find the Follow document for the user being followed
    const followData = await Follow.findOne({ userID: followUserId });

    if (!followData) {
      return res.status(404).json({ success: false, message: 'User to follow not found' });
    }

    // Check if the follower already exists in the followers list
    if (followData.followers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Already a follower' });
    }

    // Add the follower to the followers list
    followData.followers.push(userId);
    await followData.save();

    res.status(200).json({ success: true, message: 'Follower added successfully' });
  } catch (error) {
    console.error('Error adding follower:', error);
    res.status(500).json({ success: false, message: 'Error adding follower', error });
  }
});

// Unfollow a user
app.post('/api/unfollow', async (req, res) => {
  const { userId, unfollowUserId } = req.body;
  try {
    const followData = await Follow.findOne({ userID: userId });
    followData.following = followData.following.filter(id => id.toString() !== unfollowUserId);
    await followData.save();
    res.status(200).json({
      "success": true,
      "message": "Unfollowed successfully"
    });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error });
  }
});

// Remove a follower
app.post('/api/removeFollower', async (req, res) => {
  const { userId, removeUserId } = req.body;

  try {
    // Find the Follow document for the user
    const followData = await Follow.findOne({ userID: userId });

    if (!followData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the follower's ID from the 'followers' array
    followData.followers = followData.followers.filter(id => id.toString() !== removeUserId);

    // Save the updated Follow document
    await followData.save();

    res.status(200).json({
      "success": true,
      "message": "Follower removed successfully."
    });
  } catch (error) {
    console.error('Error removing follower:', error);
    res.status(500).json({ message: 'Error removing follower', error });
  }
});


  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });