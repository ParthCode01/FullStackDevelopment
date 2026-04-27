import React from 'react';
import UserProfile from './UserProfile';

function Navbar({ username }) {
  return (
    <nav style={{ marginTop: '52px', padding: '12px', background: '#f4f4f4', borderRadius: '6px' }}>
      <p>Navbar area</p>
      <UserProfile username={username} />
    </nav>
  );
}

export default Navbar;
