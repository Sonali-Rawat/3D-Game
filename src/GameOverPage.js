import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameOverPage() {
  const navigate = useNavigate();
  const score = window.localStorage.getItem('score');

  const handlePlayAgain = () => {
    // Redirect to the home page to restart the game
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '20%' }}>
      <h1>Game Over</h1>
      <p>Your Score: {score}</p>
      <button onClick={handlePlayAgain}>Play Again</button>
    </div>
  );
}

export default GameOverPage;
