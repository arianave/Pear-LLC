import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import global styles
import WelcomePage from './WelcomePage'; // Import the WelcomePage component

// Inline CSS to center the button container
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh', // Full viewport height
  backgroundColor: '#f0f0f0', // Light background color for contrast
};

function App() {
  return (
    <div>
      <div style={containerStyle}>
        <WelcomePage /> {/* Render the welcome page */}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
