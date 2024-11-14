import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './pages/CreateAccountPage'; 
import LoginPage from './pages/LogInPage'; 
import ResetPassword from './pages/ResetPassword'; 
import ProfilePage from './pages/ProfilePage'; 
import EditProfile from './pages/EditProfile'; // Import the EditProfile page
import BottomBar from './BottomBar'; 
import PostCreationPage from './pages/PostCreationPage';
import MessagePage from './pages/MessagePage';
import HomeFeed from './pages/HomeFeed';
import FeedSearch from './pages/FeedSearch';
import Activity from './pages/Activity'; 
import FeedColumn from './pages/FeedColumn';
import UsersFollowers from './pages/UsersFollowers';
import UsersFollowing from './pages/UsersFollowing';

function App() {
  return (
    <BrowserRouter>
      <AppContent /> {/* Separate content with hooks into a different function */}
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation(); // Hook to get the current location

  // Define the pages where the BottomBar should not appear
  const hideBottomBarOnPages = ['/', '/CreateAccountPage', '/ResetPassword'];//', /LogInPage'

  return (
    <div>
      <main>
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="CreateAccountPage" element={<CreateAccountPage />} />
          <Route path="LogInPage" element={<LoginPage />} />
          <Route path="ResetPassword" element={<ResetPassword />} />
          <Route path="ProfilePage/:userId" element={<ProfilePage />} />
          <Route path="EditProfile" element={<EditProfile />} /> {/* New route for EditProfile */}
          <Route path="PostCreation" element={<PostCreationPage />} />
          <Route path="Messages" element={<MessagePage />} />
          <Route path="HomeFeed" element={<HomeFeed />} />
          <Route path="FeedSearch" element={<FeedSearch />} />  
          <Route path="Activity" element={<Activity />} />    
          <Route path="FeedColumn" element={<FeedColumn />} />  

          <Route path="usersFollowers/:userId" element={<UsersFollowers />} />
          <Route path="usersFollowing/:userId" element={<UsersFollowing />} />
        </Routes>
      </main>
      
      {/* Conditionally render BottomBar based on the current path */}
      {!hideBottomBarOnPages.includes(location.pathname) && <BottomBar />}
    </div>
  );
}

export default App;
