import { useEffect, useRef, useState } from 'react';
import { Camera, Vector3 } from 'three';
import { 
  getTileFromPosition, 
  MOVEMENT_SPEED, 
  FAST_MOVEMENT_SPEED,
  ROTATION_SPEED, 
  PLAYER_HEIGHT 
} from '../data/warehouseData';

export const useWarehouseControls = (camera: Camera | null) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const [position, setPosition] = useState(new Vector3(0, PLAYER_HEIGHT, 8));
  const [rotation, setRotation] = useState(0); // 0 = facing north

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.code);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const updateMovement = () => {
      if (!camera) return;

      let newPosition = position.clone();
      let newRotation = rotation;

      // Handle rotation (faster with Shift)
      const isFastRotation = keysPressed.current.has('ShiftLeft') || keysPressed.current.has('ShiftRight');
      const currentRotationSpeed = isFastRotation ? ROTATION_SPEED * 2.5 : ROTATION_SPEED;

      if (keysPressed.current.has('ArrowLeft')) {
        newRotation += currentRotationSpeed;
      }
      if (keysPressed.current.has('ArrowRight')) {
        newRotation -= currentRotationSpeed;
      }

      // Determine movement speed (faster with Shift for forward/backward)
      const isFastMovement = keysPressed.current.has('ShiftLeft') || keysPressed.current.has('ShiftRight');
      const currentSpeed = isFastMovement ? FAST_MOVEMENT_SPEED : MOVEMENT_SPEED;

      // Handle movement
      const moveVector = new Vector3();
      
      // Forward/backward movement
      if (keysPressed.current.has('ArrowUp')) {
        moveVector.x = Math.sin(newRotation) * currentSpeed;
        moveVector.z = Math.cos(newRotation) * currentSpeed;
      }
      if (keysPressed.current.has('ArrowDown')) {
        moveVector.x = -Math.sin(newRotation) * currentSpeed;
        moveVector.z = -Math.cos(newRotation) * currentSpeed;
      }

      // Side movement with Command key
      const isSideMovement = keysPressed.current.has('MetaLeft') || keysPressed.current.has('MetaRight');
      if (isSideMovement) {
        if (keysPressed.current.has('ArrowLeft')) {
          // Move left (perpendicular to facing direction)
          moveVector.x = Math.cos(newRotation) * MOVEMENT_SPEED;
          moveVector.z = -Math.sin(newRotation) * MOVEMENT_SPEED;
        }
        if (keysPressed.current.has('ArrowRight')) {
          // Move right (perpendicular to facing direction)
          moveVector.x = -Math.cos(newRotation) * MOVEMENT_SPEED;
          moveVector.z = Math.sin(newRotation) * MOVEMENT_SPEED;
        }
      }

      // Check collision before moving
      const testPosition = newPosition.clone().add(moveVector);
      const tile = getTileFromPosition(testPosition.x, testPosition.z);
      
      if (tile && tile.walkable) {
        newPosition.add(moveVector);
      }

      // Update states if changed
      if (!newPosition.equals(position)) {
        setPosition(newPosition);
      }
      if (newRotation !== rotation) {
        setRotation(newRotation);
      }

      // Update camera
      camera.position.copy(newPosition);
      camera.lookAt(
        newPosition.x + Math.sin(newRotation),
        newPosition.y,
        newPosition.z + Math.cos(newRotation)
      );
    };

    const interval = setInterval(updateMovement, 16); // ~60fps
    return () => clearInterval(interval);
  }, [camera, position, rotation]);

  return { position, rotation };
};