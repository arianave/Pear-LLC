import React, { useState } from 'react';
import '../CSS/PostCreationPage.css';
import { getUserId } from '../userData/user';

function PostCreationPage() {
  const [postType, setPostType] = useState(''); // Manages post type (text, picture, video, thread)
  const [textContent, setTextContent] = useState(''); // Manages text post content
  const [mediaContent, setMediaContent] = useState(); // Manages media content (picture or video)
  const [caption, setCaption] = useState(''); // Manages caption for media posts
  const userID = getUserId(); // Retrieves the user's ID
  const [error, setError] = useState(''); // Handles validation errors

  // Handle post type selection (text, picture, video, thread)
  const handlePostTypeSelection = (type) => {
    setPostType(type);
  };

  // Handle text post input
  const handleTextChange = (e) => {
    setTextContent(e.target.value);
  };

  // Handle media (picture or video) input
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMediaContent(file); // Save the selected file
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
    if (postType === 'text' && textContent.trim() === '') {
      setError('Text post content is required.');
    } else if ((postType === 'picture' || postType === 'video') && (!mediaContent || caption.trim() === '')) {
      setError('Both media content and caption are required.');
    } else {
      try {
        const formData = new FormData();
        formData.append('postType', postType);

        if (postType === 'text') {
          formData.append('textContent', textContent); // Send text content for text posts
        } else {
          formData.append('mediaContent', mediaContent); // Send media content (picture or video)
          formData.append('caption', caption); // Send caption for media posts
        }

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
          setTextContent('');
          setMediaContent(null);
          setCaption('');
        } else {
          console.error('Error creating post:', result.error);
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
          placeholder="Write your text post here (max 250 characters)..."
          value={textContent}
          onChange={handleTextChange}
          maxLength={250} // Character limit for text posts
        />
      )}
      {(postType === 'picture' || postType === 'video') && (
        <>
          <input
            type="file"
            accept={postType === 'picture' ? 'image/*' : 'video/*'}
            onChange={handleMediaChange}
          />
          {/* Caption input for media posts */}
          <textarea
            placeholder="Add a caption (max 250 characters)..."
            value={caption}
            onChange={handleCaptionChange}
          />
        </>
      )}

      {error && <p className="error-message">{error}</p>}

      {/* Submit button */}
      <button className="submit-post-button" onClick={handleSubmit}>
        Post
      </button>
    </div>
  );
}

export default PostCreationPage;