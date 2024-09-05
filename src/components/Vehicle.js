import React, { useState, useEffect, useCallback } from 'react';
import { useBox } from '@react-three/cannon';
import { Box, Sphere, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Vehicle({ onCollision }) {
  const [ref, api] = useBox(() => ({
    mass: 5,
    position: [0, 0.5, 0],
    type: 'Kinematic', // This keeps the vehicle from falling due to gravity
    name: 'vehicle',
    onCollide: (e) => {
      if (e.body?.name === 'fallingShape') {
        onCollision(); // Call onCollision callback when shape hits the vehicle
      }
    },
  }));

  const [movingForward, setMovingForward] = useState(false);
  const [movingBackward, setMovingBackward] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Track cursor position
  const handleMouseMove = useCallback((event) => {
    setCursorPos({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'w') setMovingForward(true);
      if (event.key === 's') setMovingBackward(true);
    };

    const handleKeyUp = (event) => {
      if (event.key === 'w') setMovingForward(false);
      if (event.key === 's') setMovingBackward(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Update position based on movement and cursor position
  useFrame(() => {
    const speed = 0.1;
    const direction = new THREE.Vector3(cursorPos.x, 0, cursorPos.y).normalize();

    if (movingForward) {
      api.position.set(
        ref.current.position.x + direction.x * speed,
        ref.current.position.y,
        ref.current.position.z + direction.z * speed
      );
    }

    if (movingBackward) {
      api.position.set(
        ref.current.position.x - direction.x * speed,
        ref.current.position.y,
        ref.current.position.z - direction.z * speed
      );
    }

    // Rotate the vehicle to face the direction of movement
    const angle = Math.atan2(direction.z, direction.x);
    api.rotation.set(0, -angle, 0);
  });

  return (
    <group>
      {/* Vehicle body */}
      <Box args={[2, 0.5, 1]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#00f" />
      </Box>

      {/* Front wheel */}
      <Sphere args={[0.5, 32, 32]} position={[0, -0.5, 1]}>
        <meshStandardMaterial color="#444" />
      </Sphere>

      {/* Back wheels */}
      <Cylinder args={[0.3, 0.3, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[-1.5, -0.5, -0.9]}>
        <meshStandardMaterial color="#444" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[1.5, -0.5, -0.9]}>
        <meshStandardMaterial color="#444" />
      </Cylinder>
    </group>
  );
}

export default Vehicle;
