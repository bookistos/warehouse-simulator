import React from 'react';
import { warehouseMap, zoneColors } from '../data/warehouseData';

interface MinimapProps {
  playerPosition: { x: number; z: number };
  playerRotation: number;
}

export const Minimap: React.FC<MinimapProps> = ({ playerPosition, playerRotation }) => {
  const tileSize = 12; // Size of each tile in pixels
  const mapWidth = warehouseMap[0].length * tileSize;
  const mapHeight = warehouseMap.length * tileSize;
  
  // Convert world position to minimap coordinates
  const playerX = (playerPosition.x / 4 + warehouseMap[0].length / 2) * tileSize;
  const playerZ = (playerPosition.z / 4 + warehouseMap.length / 2) * tileSize;
  
  // Calculate rotation angle for the triangle (0 = north, clockwise)
  const rotationAngle = -playerRotation * (180 / Math.PI);

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-80 p-3 rounded-lg border border-gray-600">
      <h4 className="text-white text-sm font-bold mb-2 text-center">Warehouse Map</h4>
      <div 
        className="relative border border-gray-500"
        style={{ width: mapWidth, height: mapHeight }}
      >
        {/* Render warehouse tiles */}
        {warehouseMap.map((row, rowIndex) =>
          row.split('').map((tile, colIndex) => {
            let bgColor = '#333333'; // Default
            let borderColor = '#555555';
            
            if (tile === 'D') {
              bgColor = '#666666'; // Dock
              borderColor = '#888888';
            } else if (tile === '_') {
              bgColor = '#cccccc'; // Aisle
              borderColor = '#dddddd';
            } else if (tile === 'A') {
              bgColor = zoneColors.A;
              borderColor = '#ff6666';
            } else if (tile === 'B') {
              bgColor = zoneColors.B;
              borderColor = '#6666ff';
            } else if (tile === 'C') {
              bgColor = zoneColors.C;
              borderColor = '#66ff66';
            } else if (tile === 'E') {
              bgColor = zoneColors.E;
              borderColor = '#ff66ff';
            }
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute"
                style={{
                  left: colIndex * tileSize,
                  top: rowIndex * tileSize,
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: bgColor,
                  border: `1px solid ${borderColor}`,
                  opacity: 0.8
                }}
              />
            );
          })
        )}
        
        {/* Player triangle emoji */}
        <div
          className="absolute text-lg leading-none select-none"
          style={{
            left: playerX,
            top: playerZ,
            transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,
            transformOrigin: 'center center'
          }}
        >
          🔺
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-2 text-xs text-white space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔺</span>
          <span>You</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2" style={{ backgroundColor: '#cccccc' }}></div>
            <span>Aisle</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2" style={{ backgroundColor: '#666666' }}></div>
            <span>Dock</span>
          </div>
        </div>
      </div>
    </div>
  );
};