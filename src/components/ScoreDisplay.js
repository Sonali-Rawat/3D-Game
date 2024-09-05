// src/components/ScoreDisplay.js
import React from 'react';

const ScoreDisplay = ({ score }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '20px',
      fontWeight: 'bold'
    }}>
      Score: {score}
    </div>
  );
};

export default ScoreDisplay;
