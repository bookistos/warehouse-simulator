import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Rack, Dock, FloorTile, WallLogo } from './WarehouseElements';
import { Minimap } from './Minimap';
import { useWarehouseControls } from '../hooks/useWarehouseControls';
import { 
  parseWarehouseMap, 
  getWorldPosition, 
  warehouseMap,
  PLAYER_HEIGHT,
  TILE_SIZE
} from '../data/warehouseData';

const CameraController: React.FC<{ onPositionChange: (pos: { x: number; z: number }, rot: number) => void }> = ({ onPositionChange }) => {
  const { camera } = useThree();
  const { position, rotation } = useWarehouseControls(camera);

  useEffect(() => {
    camera.position.set(0, PLAYER_HEIGHT, 8);
    camera.lookAt(0, PLAYER_HEIGHT, 0); // Look north initially
  }, [camera]);

  useEffect(() => {
    onPositionChange({ x: position.x, z: position.z }, rotation);
  }, [position, rotation, onPositionChange]);

  return null;
};

const WarehouseEnvironment: React.FC = () => {
  const tiles = parseWarehouseMap();
  const mapWidth = warehouseMap[0].length * TILE_SIZE;
  const mapDepth = warehouseMap.length * TILE_SIZE;
  
  return (
    <group>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.5}
      />

      {/* Generate warehouse elements */}
      {tiles.map((row, rowIndex) =>
        row.map((tile, colIndex) => {
          const worldPos = getWorldPosition(rowIndex, colIndex);
          const position: [number, number, number] = [worldPos.x, 0, worldPos.z];

          if (tile.type === 'rack' && tile.zone) {
            return (
              <Rack
                key={`${rowIndex}-${colIndex}`}
                position={position}
                zone={tile.zone}
              />
            );
          } else if (tile.type === 'dock') {
            return (
              <group key={`${rowIndex}-${colIndex}`}>
                <FloorTile position={position} type="dock" />
                <Dock position={position} />
              </group>
            );
          } else if (tile.type === 'aisle') {
            return (
              <FloorTile
                key={`${rowIndex}-${colIndex}`}
                position={position}
                type="aisle"
              />
            );
          }
          return null;
        })
      )}

      {/* Warehouse walls and structure */}
      <group>
        {/* Floor boundary */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[mapWidth + 4, 0.1, mapDepth + 4]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[mapWidth + 4, 0.2, mapDepth + 4]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        
        {/* Walls */}
        {/* North wall */}
        <mesh position={[0, 4, -mapDepth/2 - 2]} receiveShadow>
          <boxGeometry args={[mapWidth + 4, 8, 0.4]} />
          <meshStandardMaterial color="#141623" />
        </mesh>
        
        {/* South wall */}
        <mesh position={[0, 4, mapDepth/2 + 2]} receiveShadow>
          <boxGeometry args={[mapWidth + 4, 8, 0.4]} />
          <meshStandardMaterial color="#141623" />
        </mesh>
        
        {/* East wall */}
        <mesh position={[mapWidth/2 + 2, 4, 0]} receiveShadow>
          <boxGeometry args={[0.4, 8, mapDepth + 4]} />
          <meshStandardMaterial color="#141623" />
        </mesh>
        
        {/* West wall */}
        <mesh position={[-mapWidth/2 - 2, 4, 0]} receiveShadow>
          <boxGeometry args={[0.4, 8, mapDepth + 4]} />
          <meshStandardMaterial color="#141623" />
        </mesh>
      </group>

      {/* Wall logos */}
      <WallLogo 
        position={[0, 4, -mapDepth/2 - 1.8]} 
        rotation={[0, 0, 0]} 
      />
      <WallLogo 
        position={[0, 4, mapDepth/2 + 1.8]} 
        rotation={[0, Math.PI, 0]} 
      />
      <WallLogo 
        position={[mapWidth/2 + 1.8, 4, 0]} 
        rotation={[0, -Math.PI/2, 0]} 
      />
      <WallLogo 
        position={[-mapWidth/2 - 1.8, 4, 0]} 
        rotation={[0, Math.PI/2, 0]} 
      />
    </group>
  );
};

export const WarehouseScene: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 8 });
  const [playerRotation, setPlayerRotation] = useState(0);

  const handlePositionChange = (pos: { x: number; z: number }, rot: number) => {
    setPlayerPosition(pos);
    setPlayerRotation(rot);
  };

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ 
          fov: 75, 
          near: 0.1, 
          far: 1000,
          position: [0, PLAYER_HEIGHT, 8]
        }}
        shadows
      >
        <CameraController onPositionChange={handlePositionChange} />
        <WarehouseEnvironment />
        <Environment preset="warehouse" />
      </Canvas>
      
      {/* Minimap */}
      <Minimap 
        playerPosition={playerPosition}
        playerRotation={playerRotation}
      />
      
      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Warehouse Navigation</h3>
        <div className="text-sm space-y-1">
          <div>↑ Arrow: Move Forward</div>
          <div>↓ Arrow: Move Backward</div>
          <div>← Arrow: Turn Left</div>
          <div>→ Arrow: Turn Right</div>
          <div className="text-yellow-300">Shift + ↑/↓: Move Faster</div>
          <div className="text-yellow-300">Shift + ←/→: Turn Faster</div>
          <div className="text-blue-300">Cmd + ←/→: Strafe Left/Right</div>
        </div>
        <div className="mt-3 text-xs">
          <div className="text-red-400">Red Zone A</div>
          <div className="text-blue-400">Blue Zone B</div>
          <div className="text-green-400">Green Zone C</div>
          <div className="text-purple-400">Purple Zone E</div>
        </div>
      </div>
    </div>
  );
};