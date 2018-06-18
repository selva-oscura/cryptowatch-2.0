import React from 'react';

const Offline = ({ timestamp }) => {
  console.log('timestamp', timestamp, typeof timestamp);
  return (
    <div className="Offline">
      <h3>You are currently offline. Last updated {timestamp}</h3>
    </div>
  );
};

export default Offline;
