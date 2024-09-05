import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { OrbitControls } from '@react-three/drei';
import Vehicle from './components/Vehicle';
import FallingShapes from './components/FallingShapes';
import ScoreDisplay from './components/ScoreDisplay'; // Import the ScoreDisplay component
import './App.css'; // Import your CSS
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import GameOverPage from './GameOverPage'; // Import GameOverPage component

function GameApp() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const handleGameOver = () => {
    setGameOver(true);
    window.localStorage.setItem('score', score);
    navigate('/game-over');
  };

  const handleScoreUpdate = () => {
    setScore(prevScore => prevScore + 1);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <Canvas
        style={{ height: '100%', width: '100%' }}
        camera={{ position: [0, 5, 10], fov: 75 }}
      >
        <ambientLight />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <OrbitControls />
        <Physics>
          <Vehicle onCollision={handleGameOver} /> {/* Ensure onCollision is passed */}
          <FallingShapes onGameOver={handleGameOver} onScoreUpdate={handleScoreUpdate} />
        </Physics>
      </Canvas>
      {/* Add ScoreDisplay component */}
      <ScoreDisplay score={score} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameApp />} />
        <Route path="/game-over" element={<GameOverPage />} />
      </Routes>
    </Router>
  );
}

export default App;
