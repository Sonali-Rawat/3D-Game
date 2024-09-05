import { useEffect} from 'react';
import { useThree } from '@react-three/fiber';

const useControls = (vehicleRef) => {
  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (vehicleRef.current) {
        switch (event.key) {
          case 'w':
            vehicleRef.current.position.z -= 0.1;
            break;
          case 's':
            vehicleRef.current.position.z += 0.1;
            break;
          default:
            // Optional: handle other keys or ignore
            break;
        }
      }
    };

    const handleMouseMove = (event) => {
      if (vehicleRef.current) {
        const { clientX, clientY } = event;
        const mouseX = (clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(clientY / window.innerHeight) * 2 + 1;
        camera.position.x += mouseX * 0.1;
        camera.position.y += mouseY * 0.1;
        camera.lookAt(vehicleRef.current.position);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [vehicleRef, camera]);
};

export default useControls;
