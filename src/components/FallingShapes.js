import React, { useEffect, useState } from 'react';
import { useBox, useSphere, useCylinder } from '@react-three/cannon';
import { Box, Sphere, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Helper function to generate random colors
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Helper function to generate random shapes
const getRandomShape = () => {
  const shapes = ['box', 'sphere', 'cylinder'];
  return shapes[Math.floor(Math.random() * shapes.length)];
};

const FallingShapes = ({ onGameOver, onScoreUpdate }) => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    // Create falling shapes at intervals
    const interval = setInterval(() => {
      setShapes(prevShapes => [
        ...prevShapes,
        { key: Math.random(), position: [Math.random() * 4 - 2, 10, Math.random() * 4 - 2], type: getRandomShape(), color: getRandomColor() }
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {shapes.map((shape) => (
        <FallingShape
          key={shape.key}
          position={shape.position}
          shape={shape.type}
          color={shape.color}
          onGameOver={onGameOver}
          onScoreUpdate={onScoreUpdate}
        />
      ))}
    </>
  );
};

const FallingShape = ({ position, shape, color, onGameOver, onScoreUpdate }) => {
  // Assign physics properties based on the shape type
  let [ref, api] = [null, null];
  switch (shape) {
    case 'box':
      [ref, api] = useBox(() => ({
        mass: 1,
        position,
        args: [1, 1, 1],
        onCollide: (e) => {
          if (e.body?.name === 'vehicle') {
            onGameOver();
          }
          if (e.contact?.ni?.[1] > 0.5) {
            onScoreUpdate();
          }
        },
      }));
      break;
    case 'sphere':
      [ref, api] = useSphere(() => ({
        mass: 1,
        position,
        args: [0.5],
        onCollide: (e) => {
          if (e.body?.name === 'vehicle') {
            onGameOver();
          }
          if (e.contact?.ni?.[1] > 0.5) {
            onScoreUpdate();
          }
        },
      }));
      break;
    case 'cylinder':
      [ref, api] = useCylinder(() => ({
        mass: 1,
        position,
        args: [0.5, 0.5, 1, 16],
        onCollide: (e) => {
          if (e.body?.name === 'vehicle') {
            onGameOver();
          }
          if (e.contact?.ni?.[1] > 0.5) {
            onScoreUpdate();
          }
        },
      }));
      break;
    default:
      break;
  }

  // Auto-remove shape when it falls below a certain height
  useFrame(() => {
    if (ref && ref.current.position.y < -5) {
      api.position.set(Math.random() * 4 - 2, 10, Math.random() * 4 - 2); // Reset position
      onScoreUpdate(); // Increase score
    }
  });

  // Render the shape with random colors
  return shape === 'box' ? (
    <Box ref={ref} args={[1, 1, 1]}>
      <meshStandardMaterial color={color} />
    </Box>
  ) : shape === 'sphere' ? (
    <Sphere ref={ref} args={[0.5, 32, 32]}>
      <meshStandardMaterial color={color} />
    </Sphere>
  ) : (
    <Cylinder ref={ref} args={[0.5, 0.5, 1, 16]}>
      <meshStandardMaterial color={color} />
    </Cylinder>
  );
};

export default FallingShapes;
