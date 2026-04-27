import React from 'react';
import Navbar from './Navbar';

function Header({ username }) {
  return (
    <header style={{ border: '3px solid #ccc', padding: '56px', borderRadius: '18px' }}>
      <h1>My App</h1>
      <Navbar username={username} />
    </header>
  );
}

export default Header;
