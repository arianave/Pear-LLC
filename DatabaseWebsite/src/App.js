import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage'; // Import the WelcomePage component
import CreateAccountPage from './pages/CreateAccountPage'; // Import the CreateAccountPage component
import LoginPage from './pages/LogInPage'; // Import the LoginPage component

function App() {
  return (
    <BrowserRouter>
    <main>
      <Routes>
        <Route index element={<WelcomePage />} />
        <Route path="CreateAccountPage" element={<CreateAccountPage />} />
        <Route path="LogInPage" element={<LoginPage />} />
      </Routes>
    </main>
  </BrowserRouter>
  );
}

export default App;
