import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import CreateAccountPage from './pages/CreateAccountPage'; 
import LoginPage from './pages/LogInPage'; 
import ResetPassword from './pages/ResetPassword'; 
import ProfilePage from './pages/ProfilePage'; 
import BottomBar from './BottomBar'; 
import PostCreationPage from './pages/PostCreationPage';

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
  const hideBottomBarOnPages = ['/LogInPage', '/CreateAccountPage', '/ResetPassword'];

  return (
    <div>
      <main>
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="CreateAccountPage" element={<CreateAccountPage />} />
          <Route path="LogInPage" element={<LoginPage />} />
          <Route path="ResetPassword" element={<ResetPassword />} />
          <Route path="ProfilePage" element={<ProfilePage />} />
          <Route path="PostCreation" element={<PostCreationPage />} />
        </Routes>
      </main>
      
      {/* Conditionally render BottomBar based on the current path */}
      {!hideBottomBarOnPages.includes(location.pathname) && <BottomBar />}
    </div>
  );
}

export default App;
