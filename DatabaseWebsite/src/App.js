import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage'; // Import the WelcomePage component
import CreateAccountPage from './pages/CreateAccountPage'; // Import the CreateAccountPage component
import LoginPage from './pages/LogInPage'; // Import the LoginPage component
import ResetPassword from './pages/ResetPassword'; // Import ResetPassword
import ProfilePage from './pages/ProfilePage'; //Import ProfilePage

function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          {/* Set LogInPage as the default page */}
          <Route index element={<LoginPage />} />
          <Route path="CreateAccountPage" element={<CreateAccountPage />} />
          <Route path="LogInPage" element={<LoginPage />} />
          <Route path="ResetPassword" element={<ResetPassword />} /> {/* Make sure the path matches */}
          <Route path="ProfilePage" element={<ProfilePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
