import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink} from 'react-router-dom';
import './App.css';
import WelcomePage from './pages/WelcomePage'; // Import the WelcomePage component
import CreateAccountPage from './pages/CreateAccountPage';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh', // Full viewport height
  backgroundColor: '#f0f0f0', // Light background color for contrast
};

function App() {
  return (
    <BrowserRouter>
    <header>
      <nav>
        <h1>PeerToPear</h1>
        <NavLink to="/">WelcomePage</NavLink>
        <NavLink to="CreateAccountPage">Create Account</NavLink>
      </nav>
    </header>
    <main>
      <Routes>
        <Route index element={<WelcomePage/> }/>
        <Route path="CreateAccountPage" element={<CreateAccountPage/> }/>
      </Routes>
    </main>
    </BrowserRouter>
  );
}

export default App;
