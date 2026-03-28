import { detectMatches } from './matchLogic';

describe('Match Detection Logic', () => {
  it('should detect a horizontal match of 3', () => {
    const grid = [
      [1, 1, 1, 2, 3, 4, 5, 6],
      [2, 3, 4, 5, 6, 7, 0, 1],
    ];
    // Fill rest with -1
    while(grid.length < 8) grid.push(Array(8).fill(-1));

    const matches = detectMatches(grid);
    expect(matches).toEqual(
      expect.arrayContaining([
        { r: 0, c: 0 },
        { r: 0, c: 1 },
        { r: 0, c: 2 },
      ])
    );
    expect(matches.length).toBe(3);
  });

  it('should detect a vertical match of 4', () => {
    const grid = Array(8).fill(null).map(() => Array(8).fill(-1));
    grid[0][0] = 5;
    grid[1][0] = 5;
    grid[2][0] = 5;
    grid[3][0] = 5;

    const matches = detectMatches(grid);
    expect(matches.length).toBe(4);
  });
});
