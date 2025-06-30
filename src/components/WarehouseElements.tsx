import React from 'react';
import { Box, Cylinder, Plane } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { zoneColors, TILE_SIZE, RACK_HEIGHT, SHELF_HEIGHT } from '../data/warehouseData';

interface RackProps {
  position: [number, number, number];
  zone: 'A' | 'B' | 'C' | 'D';
}

export const Rack: React.FC<RackProps> = ({ position, zone }) => {
  const color = zoneColors[zone];
  const shelfCount = Math.floor(RACK_HEIGHT / SHELF_HEIGHT);
  
  return (
    <group position={position}>
      {/* Main rack structure */}
      <Box
        args={[TILE_SIZE * 0.8, RACK_HEIGHT, TILE_SIZE * 0.8]}
        position={[0, RACK_HEIGHT / 2, 0]}
      >
        <meshStandardMaterial color="#666666" />
      </Box>
      
      {/* Individual shelves */}
      {Array.from({ length: shelfCount }, (_, i) => (
        <Box
          key={i}
          args={[TILE_SIZE * 0.9, 0.2, TILE_SIZE * 0.9]}
          position={[0, i * SHELF_HEIGHT + 0.5, 0]}
        >
          <meshStandardMaterial color={color} />
        </Box>
      ))}
      
      {/* Storage boxes on shelves */}
      {Array.from({ length: shelfCount }, (_, shelfIndex) =>
        Array.from({ length: 3 }, (_, boxIndex) => (
          <Box
            key={`${shelfIndex}-${boxIndex}`}
            args={[0.8, 0.6, 0.8]}
            position={[
              (boxIndex - 1) * 1.2,
              shelfIndex * SHELF_HEIGHT + 0.9,
              0
            ]}
          >
            <meshStandardMaterial color={color} opacity={0.8} />
          </Box>
        ))
      )}
    </group>
  );
};

interface DockProps {
  position: [number, number, number];
}

export const Dock: React.FC<DockProps> = ({ position }) => {
  return (
    <group position={position}>
      {/* Dock platform */}
      <Box
        args={[TILE_SIZE, 0.5, TILE_SIZE]}
        position={[0, 0.25, 0]}
      >
        <meshStandardMaterial color="#444444" />
      </Box>
      
      {/* Truck representation */}
      <group position={[0, 1.5, TILE_SIZE * 0.4]}>
        {/* Truck body */}
        <Box args={[2.5, 2, 6]}>
          <meshStandardMaterial color="#ff6600" />
        </Box>
        
        {/* Truck cab */}
        <Box args={[2.5, 1.5, 2]} position={[0, 0.25, -4]}>
          <meshStandardMaterial color="#cc4400" />
        </Box>
        
        {/* Wheels */}
        {[-1.5, 1.5].map((x, i) =>
          [-2, 2].map((z, j) => (
            <Cylinder
              key={`${i}-${j}`}
              args={[0.4, 0.4, 0.3]}
              position={[x, -1, z]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <meshStandardMaterial color="#222222" />
            </Cylinder>
          ))
        )}
      </group>
    </group>
  );
};

interface FloorTileProps {
  position: [number, number, number];
  type: 'aisle' | 'dock';
}

export const FloorTile: React.FC<FloorTileProps> = ({ position, type }) => {
  const color = type === 'aisle' ? '#cccccc' : '#999999';
  
  return (
    <Box
      args={[TILE_SIZE, 0.1, TILE_SIZE]}
      position={[position[0], position[1] - 0.05, position[2]]}
    >
      <meshStandardMaterial color={color} />
    </Box>
  );
};

interface WallLogoProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export const WallLogo: React.FC<WallLogoProps> = ({ position, rotation = [0, 0, 0] }) => {
  const texture = useLoader(TextureLoader, '/src/assets/deliveroo-dark-bg-1.png');
  
  return (
    <Plane
      args={[6, 4]}
      position={position}
      rotation={rotation}
    >
      <meshStandardMaterial map={texture} transparent />
    </Plane>
  );
};