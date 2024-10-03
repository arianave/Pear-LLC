import React, { useState } from 'react';
import './PostCreationPage.css';
import { getUserId } from '../user';

function PostCreationPage() {
  const [postType, setPostType] = useState(''); // Manages post type (text, picture, video, thread)
  const [postContent, setPostContent] = useState(''); // Manages post content
  const [caption, setCaption] = useState(''); // Manages post caption
  const userID = getUserId; //Retrieves the user's ID
  const [error, setError] = useState(''); // Handles validation errors

  // Handle post type selection (text, picture, video, thread)
  const handlePostTypeSelection = (type) => {
    setPostType(type);
  };

  // Handle post content input (for text, caption, etc.)
  const handleInputChange = (e) => {
    setPostContent(e.target.value);
  };

  // Handle caption input
  const handleCaptionChange = (e) => {
    if (e.target.value.length <= 250) {
      setCaption(e.target.value);
      setError('');
    } else {
      setError('Caption cannot exceed 250 characters.');
    }
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (caption.trim() === '' || postContent.trim() === '') {
      setError('Both post content and caption are required.');
    } else {
        try {
            const formData = new FormData();
            formData.append('postType', postType);
            formData.append('postContent', postContent); 
            formData.append('caption', caption);
            formData.append('userID', userID);

            const response = await fetch('http://98.80.48.42:3000/api/post', {
            method: 'POST',
            body: formData,
            });
        
            const result = await response.json();

            if (result.success) {
              console.log('Post created successfully:', result);
        
              // Reset form after submission
              setPostType('');
              setPostContent('');
              setCaption('');
            } else {
              console.error('Error creating post:', result.message);
            }
          } catch (error) {
            console.error('Error during post creation:', error);
          }
    }
  };

  return (
    <div className="post-creation-container">
      <h2>Create a Post</h2>

      {/* Post type selection */}
      <div className="post-type-buttons">
        <button onClick={() => handlePostTypeSelection('text')}>Text</button>
        <button onClick={() => handlePostTypeSelection('picture')}>Picture</button>
        <button onClick={() => handlePostTypeSelection('video')}>Video</button>
        <button onClick={() => handlePostTypeSelection('thread')}>Thread</button>
      </div>

      {/* Conditionally render input fields based on post type */}
      {postType === 'text' && (
        <textarea
          placeholder="Write your text post here..."
          value={postContent}
          onChange={handleInputChange}
          maxLength={250} // Character limit for text posts
        />
      )}
      {postType === 'picture' && (
        <input type="file" accept="image/*" onChange={handleInputChange} />
      )}
      {postType === 'video' && (
        <input type="file" accept="video/*" onChange={handleInputChange} />
      )}
      {postType === 'thread' && (
        <textarea
          placeholder="Enter your thread name..."
          value={postContent}
          onChange={handleInputChange}
        />
      )}

      {/* Caption input */}
      <textarea
        placeholder="Add a caption (max 250 characters)..."
        value={caption}
        onChange={handleCaptionChange}
      />
      {error && <p className="error-message">{error}</p>}

      {/* Submit button */}
      <button className="submit-post-button" onClick={handleSubmit}>
        Post
      </button>
    </div>
  );
}

export default PostCreationPage;
