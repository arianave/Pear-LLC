import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import global styles
import Button from './Button'; // Import the Button component

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
    <div style={containerStyle}>
      <Button />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
