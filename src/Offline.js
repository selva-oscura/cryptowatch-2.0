import React from 'react';
import './Offline.css';

const Offline = ({ timestamp }) => (
  <div className="Offline">
    <h3>You are currently offline. Last updated {timestamp}</h3>
  </div>
);

export default Offline;
