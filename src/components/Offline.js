import React from 'react';
import PropTypes from 'prop-types';
import './Offline.css';

const Offline = ({ timestamp }) => (
  <div className="Offline">
    <h3>You are currently offline. Last updated {timestamp}</h3>
  </div>
);

Offline.propTypes = {
  timestamp: PropTypes.string.isRequired,
};

export default Offline;
