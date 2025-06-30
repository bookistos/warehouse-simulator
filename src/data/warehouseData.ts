export interface WarehouseTile {
  type: 'dock' | 'aisle' | 'rack';
  zone?: 'A' | 'B' | 'C' | 'D' | 'E';
  walkable: boolean;
}

export const warehouseMap = [
  'DDDDDDDDDDDD',
  '____________',
  'AAAA_BBBB_AA',
  'AAAA_BBBB_BB',
  '____________',
  'CCCC_EEEE_CC',
  'CCCC_EEEE_CC'
];

export const TILE_SIZE = 4;
export const RACK_HEIGHT = 6;
export const SHELF_HEIGHT = 1.2;
export const PLAYER_HEIGHT = 1.7;
export const MOVEMENT_SPEED = 0.2;
export const FAST_MOVEMENT_SPEED = 0.4;
export const ROTATION_SPEED = 0.03;

export const zoneColors = {
  A: '#ff4444', // Red
  B: '#4444ff', // Blue
  C: '#44ff44', // Green
  D: '#ffff44', // Yellow
  E: '#ff44ff'  // Magenta
};

export const parseWarehouseMap = (): WarehouseTile[][] => {
  return warehouseMap.map(row => 
    row.split('').map(char => {
      if (char === 'D') {
        return { type: 'dock', walkable: false };
      } else if (char === '_') {
        return { type: 'aisle', walkable: true };
      } else {
        return { 
          type: 'rack', 
          zone: char as 'A' | 'B' | 'C' | 'D' | 'E',
          walkable: false 
        };
      }
    })
  );
};

export const getWorldPosition = (row: number, col: number) => ({
  x: (col - warehouseMap[0].length / 2) * TILE_SIZE,
  z: (row - warehouseMap.length / 2) * TILE_SIZE
});

export const getTileFromPosition = (x: number, z: number) => {
  const col = Math.floor(x / TILE_SIZE + warehouseMap[0].length / 2);
  const row = Math.floor(z / TILE_SIZE + warehouseMap.length / 2);
  
  if (row < 0 || row >= warehouseMap.length || col < 0 || col >= warehouseMap[0].length) {
    return null;
  }
  
  const tiles = parseWarehouseMap();
  return tiles[row][col];
};