import React from 'react';
import Header from '../Header';

function App() {
  const username = 'Alice';

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '100px' }}>
      <Header username={username} />
    </div>
  );
}

export default App;
