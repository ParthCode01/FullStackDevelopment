import React from 'react';

function UserProfile({ username }) {
  return (
    <div style={{ marginTop: '30px' }}>
      <strong>User Profile:</strong>
      <div>Hello, {username}!</div>
    </div>
  );
}

export default UserProfile;
