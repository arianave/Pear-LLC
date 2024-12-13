import React, { useState } from 'react';
import '../CSS/PostCreationPage.css';
import { getUserId } from '../userData/user';
import getServerURL from './serverURL';

function PostCreationPage() {
  const [postType, setPostType] = useState(''); // Manages post type (text, picture, video, thread)
  const [textContent, setTextContent] = useState(''); // Manages text post content
  const [communityName, setCommunityName] = useState(''); // Manages community name
  const [description, setDescription] = useState(''); // Manages community description 
  const [mediaContent, setMediaContent] = useState(); // Manages media content (picture or video)
  const [caption, setCaption] = useState(''); // Manages caption for media posts
  const userID = getUserId(); // Retrieves the user's ID
  const [error, setError] = useState(''); // Handles validation errors

  // Handle post type selection (text, picture, video, thread)
  const handlePostTypeSelection = (type) => {
    if (postType === type){
      setPostType('');
    } else {
      setPostType(type);
    }
  };

  // Handle text post input
  const handleTextChange = (e) => {
    setTextContent(e.target.value);
  };

  const handleCommunityNameChange = (e) => {
    setCommunityName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
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
    console.log('Post type:', postType);
    console.log('Text content:', textContent);
    console.log('Media content:', mediaContent);
    console.log('Caption:', caption);

    if (postType === 'text' && textContent.trim() === '') {
        setError('Text post content is required.');
        return;
    } else if ((postType === 'picture' || postType === 'video') && (!mediaContent || caption.trim() === '')) {
        setError('Both media content and caption are required.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('postType', postType);
        formData.append('userID', userID);

        if (postType === 'text') {
            formData.append('textContent', textContent);
        } else if (postType === 'community'){
            formData.append('communityName', communityName);
            formData.append('description', description);
        } else {
            formData.append('mediaContent', mediaContent);
            formData.append('textContent', caption);
        }

        const response = await fetch(`${getServerURL()}/api/post`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            console.log('Post created successfully:', result);
            setPostType('');
            setTextContent('');
            setCommunityName('');
            setDescription('');
            setMediaContent(null);
            setCaption('');
            setError('');
        } else {
            console.error('Error creating post:', result.message);
            setError(result.message);
        }
    } catch (error) {
        console.error('Error during post creation:', error);
        setError('An unexpected error occurred.');
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
        <button onClick={() => handlePostTypeSelection('community')}>Community</button>
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
          <input className="input-PCP" type="file" accept={postType === 'picture' ? 'image/*' : 'video/*'} onChange={handleMediaChange} />

          {/* <input   
            type="file"
            accept={postType === 'picture' ? 'image/*' : 'video/*'}
            onChange={handleMediaChange}
          />*/}
          {/* Caption input for media posts */}
          <textarea
            placeholder="Add a caption (max 250 characters)..."
            value={caption}
            onChange={handleCaptionChange}
          />
        </>
      )}
      {postType === 'community' && (
        <>
        <input className="input-PCP" type="text" placeholder="Community Name (max 25 characters)..." value={communityName} onChange={handleCommunityNameChange} maxLength={25} />
        {/*}
          <inputPCP
            type="text"
            placeholder="Community Name (max 25 characters)..."
            value={communityName}
            onChange={handleCommunityNameChange}
            maxLength={25} // Character limit for community name
          />
          */}
          <textarea
            placeholder="Description (max 250 characters)..."
            value={description}
            onChange={handleDescriptionChange}
            maxLength={250} // Character limit for description
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