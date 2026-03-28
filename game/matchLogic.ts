/**
 * Detects horizontal and vertical matches of 3 or more in an 8x8 grid.
 * @param grid 2D array representing the candy types.
 * @returns Array of Coordinates {r, c} that are matched.
 */
export function detectMatches(grid: number[][]): { r: number, c: number }[] {
  const matched = new Set<string>();

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Check horizontal matches
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 2; c++) {
      const type = grid[r][c];
      if (type === -1) continue;
      
      let matchCount = 1;
      while (c + matchCount < cols && grid[r][c + matchCount] === type) {
        matchCount++;
      }

      if (matchCount >= 3) {
        for (let i = 0; i < matchCount; i++) {
          matched.add(`${r},${c + i}`);
        }
      }
    }
  }

  // Check vertical matches
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 2; r++) {
      const type = grid[r][c];
      if (type === -1) continue;

      let matchCount = 1;
      while (r + matchCount < rows && grid[r + matchCount][c] === type) {
        matchCount++;
      }

      if (matchCount >= 3) {
        for (let i = 0; i < matchCount; i++) {
          matched.add(`${r + i},${c}`);
        }
      }
    }
  }

  return Array.from(matched).map(str => {
    const [r, c] = str.split(',').map(Number);
    return { r, c };
  });
}
