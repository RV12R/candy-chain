import * as Phaser from 'phaser';
import confetti from 'canvas-confetti';

const GRID_SIZE = 8;
const CANDY_TYPES = 5;
const CELL_SIZE = 70;
const X_OFFSET = 40;
const Y_OFFSET = 180;

const XY_OFFSET = { x: 40, y: 180 };

interface LevelConfig {
    moves: number;
    targetScore: number;
    targetCandies?: { [type: number]: number };
}

const LEVELS: LevelConfig[] = [
    { moves: 15, targetScore: 1000 },
    { moves: 20, targetScore: 1500, targetCandies: { 0: 15 } }, // 15 of type 0
    { moves: 25, targetScore: 2500, targetCandies: { 1: 15, 2: 15 } }
];

export default class GameScene extends Phaser.Scene {
    private grid: (Phaser.GameObjects.Sprite | null)[][] = [];
    private selected: { r: number, c: number } | null = null;
    private score = 0;
    private moves = 0;
    private level = 1;
    private targetScore = 0;
    private targetCandies: { [type: number]: number } = {};
    private collectedCandies: { [type: number]: number } = {};
    private scoreText!: Phaser.GameObjects.Text;
    private infoText!: Phaser.GameObjects.Text;
    private isProcessing = false;

    constructor() {
        super('GameScene');
    }

    create() {
        const { width, height } = this.scale;
        
        // Base dark background
        this.add.rectangle(width/2, height/2, width, height, 0x020617);
        
        // Subtle radial glows to match Home page
        const g = this.add.graphics();
        g.fillStyle(0x4c1d95, 0.2); // Purple glow
        g.fillCircle(width, height, 400);
        g.fillStyle(0x831843, 0.2); // Pink glow
        g.fillCircle(0, 0, 300);

        // UI background for the grid
        this.add.graphics()
            .fillStyle(0x000000, 0.4)
            .fillRoundedRect(X_OFFSET - 10, Y_OFFSET - 10, (GRID_SIZE * CELL_SIZE) + 20, (GRID_SIZE * CELL_SIZE) + 20, 20)
            .lineStyle(2, 0xec4899, 0.5)
            .strokeRoundedRect(X_OFFSET - 10, Y_OFFSET - 10, (GRID_SIZE * CELL_SIZE) + 20, (GRID_SIZE * CELL_SIZE) + 20, 20);

        this.scoreText = this.add.text(this.scale.width / 2, 50, 'SCORE: 0', { 
            fontSize: '44px', 
            color: '#fff', 
            fontStyle: 'bold',
            stroke: '#ec4899',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.infoText = this.add.text(this.scale.width / 2, 110, '', { 
            fontSize: '18px', 
            color: '#94a3b8', 
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);

        this.loadLevel(this.level);
        this.createGrid();
    }

    loadLevel(levelNum: number) {
        // Fallback to simpler generated levels if we exceed predefined list
        const config = LEVELS[levelNum - 1] || { 
            moves: 30, targetScore: levelNum * 2000, 
            targetCandies: { [Phaser.Math.Between(0, 4)]: 20 + levelNum * 5 } 
        };
        
        this.moves = config.moves;
        this.targetScore = config.targetScore;
        this.targetCandies = config.targetCandies ? { ...config.targetCandies } : {};
        this.collectedCandies = {};
        for (const t in this.targetCandies) {
            this.collectedCandies[t] = 0;
        }
        this.updateInfoText();
    }

    createGrid() {
        for (let r = 0; r < GRID_SIZE; r++) {
            this.grid[r] = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                let type: number;
                // Ensure no matches on startup
                do {
                    type = Phaser.Math.Between(0, CANDY_TYPES - 1);
                } while (this.wouldMatchAtStart(r, c, type));

                this.grid[r][c] = this.spawnCandy(r, c, type);
            }
        }
    }

    wouldMatchAtStart(r: number, c: number, type: number): boolean {
        if (c >= 2 && this.grid[r][c-1]?.getData('type') === type && this.grid[r][c-2]?.getData('type') === type) return true;
        if (r >= 2 && this.grid[r-1][c]?.getData('type') === type && this.grid[r-2][c]?.getData('type') === type) return true;
        return false;
    }

    spawnCandy(r: number, c: number, type: number, isInitial = true) {
        const x = X_OFFSET + c * CELL_SIZE + CELL_SIZE / 2;
        const startY = isInitial ? (Y_OFFSET + r * CELL_SIZE + CELL_SIZE / 2) : -100;
        const targetY = Y_OFFSET + r * CELL_SIZE + CELL_SIZE / 2;
        
        const sprite = this.add.sprite(x, startY, `candy_${type}`);
        sprite.setOrigin(0.5);
        sprite.setDisplaySize(CELL_SIZE - 10, CELL_SIZE - 10);
        sprite.setInteractive({ useHandCursor: true });
        sprite.setBlendMode(Phaser.BlendModes.SCREEN); // Removes black Box background
        sprite.setData('type', type);
        sprite.setData('r', r);
        sprite.setData('c', c);
        sprite.setData('special', 'none'); // 'none', 'striped-v', 'striped-h', 'wrapped', 'color-bomb'

        sprite.on('pointerdown', () => this.selectCandy(sprite));

        return sprite;
    }

    applySpecialVisuals(sprite: Phaser.GameObjects.Sprite, special: string) {
        if (special === 'none') return;

        const g = this.add.graphics();
        g.depth = 10;
        g.setBlendMode(Phaser.BlendModes.ADD);

        if (special === 'striped-h') {
            g.lineStyle(4, 0x22d3ee, 1);
            g.strokeEllipse(0, 0, CELL_SIZE - 10, 14);
            g.fillStyle(0x22d3ee, 0.4);
            g.fillEllipse(0, 0, CELL_SIZE - 20, 6);
            this.tweens.add({ targets: g, scaleX: 1.1, scaleY: 0.9, yoyo: true, duration: 800, repeat: -1 });
        } else if (special === 'striped-v') {
            g.lineStyle(4, 0xec4899, 1);
            g.strokeEllipse(0, 0, 14, CELL_SIZE - 10);
            g.fillStyle(0xec4899, 0.4);
            g.fillEllipse(0, 0, 6, CELL_SIZE - 20);
            this.tweens.add({ targets: g, scaleX: 0.9, scaleY: 1.1, yoyo: true, duration: 800, repeat: -1 });
        } else if (special === 'wrapped') {
            g.lineStyle(4, 0xa855f7, 1);
            const size = CELL_SIZE - 15;
            g.strokeRoundedRect(-size/2, -size/2, size, size, 8);
            
            this.tweens.add({ targets: g, angle: 360, duration: 2500, repeat: -1 });
            this.tweens.add({ targets: g, scale: 1.2, yoyo: true, duration: 600, repeat: -1 });
        }

        // Lock graphics overlay strictly to sprite position & lifecycle
        const updateEvent = () => {
            if (!sprite || !sprite.active) {
                g.destroy();
                this.events.off('update', updateEvent);
                return;
            }
            g.x = sprite.x;
            g.y = sprite.y;
            g.alpha = sprite.alpha;
        };

        this.events.on('update', updateEvent);
        sprite.on('destroy', () => {
            g.destroy();
            this.events.off('update', updateEvent);
        });
    }

    selectCandy(candy: Phaser.GameObjects.Sprite) {
        if (this.isProcessing) return;

        const r = candy.getData('r');
        const c = candy.getData('c');

        if (!this.selected) {
            this.selected = { r, c };
            candy.setDisplaySize(CELL_SIZE, CELL_SIZE); // Subtle grow
            candy.setTint(0xff88ff);
        } else {
            const { r: r1, c: c1 } = this.selected;
            const candy1 = this.grid[r1][c1];
            if (candy1) {
                candy1.setDisplaySize(CELL_SIZE - 10, CELL_SIZE - 10);
                candy1.clearTint();
            }
            
            // Swap if adjacent
            if (Math.abs(r - r1) + Math.abs(c - c1) === 1) {
                this.handleSwap(r1, c1, r, c);
            }
            this.selected = null;
        }
    }

    async handleSwap(r1: number, c1: number, r2: number, c2: number) {
        this.isProcessing = true;
        
        await this.animateSwap(r1, c1, r2, c2);
        
        const candy1 = this.grid[r1][c1];
        const candy2 = this.grid[r2][c2];
        const s1 = candy1 ? candy1.getData('special') : 'none';
        const s2 = candy2 ? candy2.getData('special') : 'none';

        const isColorBombSwap = s1 === 'color-bomb' || s2 === 'color-bomb';
        const isSpecialSpecialSwap = s1 !== 'none' && s2 !== 'none';
        const isCombo = isColorBombSwap || isSpecialSpecialSwap;

        const matches = this.findMatches();
        const hasMatches = matches.horizontalMatches.length > 0 || matches.verticalMatches.length > 0;
        
        if (hasMatches || isCombo) {
            this.moves--;
            this.updateInfoText();
            if (isCombo) {
                await this.processCombo(r1, c1, r2, c2, candy1, candy2, s1, s2);
            } else {
                await this.processMatches(matches);
            }
        } else {
            // Swap back if no match
            await this.animateSwap(r1, c1, r2, c2);
            this.isProcessing = false;
        }

        if (this.moves <= 0 && !this.isProcessing) {
            this.handleGameOver();
        }
    }

    async processCombo(r1: number, c1: number, r2: number, c2: number, candy1: any, candy2: any, s1: string, s2: string) {
        const type1 = candy1.getData('type');
        const type2 = candy2.getData('type');
        const allMatched = new Set<string>();

        allMatched.add(`${r1},${c1}`);
        allMatched.add(`${r2},${c2}`);

        if (s1 === 'color-bomb' && s2 === 'color-bomb') {
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) allMatched.add(`${i},${j}`);
            }
        } else if (s1 === 'color-bomb' || s2 === 'color-bomb') {
            const targetColor = s1 === 'color-bomb' ? type2 : type1;
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    if (this.grid[i][j]?.getData('type') === targetColor) allMatched.add(`${i},${j}`);
                }
            }
        } else {
            // Special + Special (Massive Cross)
            for (let i = 0; i < GRID_SIZE; i++) {
                allMatched.add(`${r1},${i}`);
                allMatched.add(`${i},${c1}`);
                allMatched.add(`${r2},${i}`);
                allMatched.add(`${i},${c2}`);
            }
            this.createBeam(candy1.x, candy1.y, true);
            this.createBeam(candy1.x, candy1.y, false);
            this.createExplosion(candy1.x, candy1.y);
        }

        const matchArray = Array.from(allMatched).map(s => {
            const [r, c] = s.split(',').map(Number);
            return { r, c };
        });

        this.score += matchArray.length * 20;
        this.scoreText.setText('SCORE: ' + this.score);
        this.events.emit('score-updated', this.score);

        const removalTweens: Promise<void>[] = [];
        matchArray.forEach(({ r, c }) => {
            const candy = this.grid[r][c];
            if (candy) {
                const p = new Promise<void>(resolve => {
                    this.tweens.add({
                        targets: candy, alpha: 0, scale: 0.1, duration: 300,
                        onComplete: () => {
                            candy.destroy();
                            this.grid[r][c] = null;
                            resolve();
                        }
                    });
                });
                removalTweens.push(p);
            }
        });

        await Promise.all(removalTweens);
        await this.dropCandies();
        await this.refillGrid();

        const nextMatches = this.findMatches();
        const hasMatches = nextMatches.horizontalMatches.length > 0 || nextMatches.verticalMatches.length > 0;
        if (hasMatches) {
            await this.processMatches(nextMatches);
        } else {
            this.isProcessing = false;
        }
    }

    updateInfoText() {
        let objStr = `GOAL: ${this.targetScore} PTS`;
        if (Object.keys(this.targetCandies).length > 0) {
            objStr += ` + COLLECT `;
            const parts = [];
            for (const t in this.targetCandies) {
                const max = this.targetCandies[t];
                const curr = this.collectedCandies[t] || 0;
                parts.push(`${Math.min(curr, max)}/${max} (T${t})`);
            }
            objStr += parts.join(', ');
        }
        this.infoText.setText(`LEVEL ${this.level}  |  MOVES: ${this.moves}\n${objStr}`);
    }

    checkWinCondition(): boolean {
        if (this.score < this.targetScore) return false;
        
        for (const t in this.targetCandies) {
            if ((this.collectedCandies[t] || 0) < this.targetCandies[t]) return false;
        }
        return true;
    }

    handleGameOver() {
        if (this.checkWinCondition()) {
            alert("Level Complete! Great job.");
            this.level++;
            this.score = 0; // Or keep it if we want cumulative
            this.loadLevel(this.level);
            // Optionally recreate grid here, but dropping candies works too
        } else {
            alert(`Game Over! Needed ${this.targetScore} points and objectives.`);
            this.score = 0;
            this.scene.restart();
        }
    }

    animateSwap(r1: number, c1: number, r2: number, c2: number): Promise<void> {
        return new Promise(resolve => {
            const candy1 = this.grid[r1][c1]!;
            const candy2 = this.grid[r2][c2]!;

            this.grid[r1][c1] = candy2;
            this.grid[r2][c2] = candy1;

            candy1.setData('r', r2); candy1.setData('c', c2);
            candy2.setData('r', r1); candy2.setData('c', c1);

            this.tweens.add({
                targets: candy1,
                x: X_OFFSET + c2 * CELL_SIZE + CELL_SIZE / 2,
                y: Y_OFFSET + r2 * CELL_SIZE + CELL_SIZE / 2,
                duration: 300,
                ease: 'Quad.easeInOut'
            });

            this.tweens.add({
                targets: candy2,
                x: X_OFFSET + c1 * CELL_SIZE + CELL_SIZE / 2,
                y: Y_OFFSET + r1 * CELL_SIZE + CELL_SIZE / 2,
                duration: 300,
                ease: 'Quad.easeInOut',
                onComplete: () => resolve()
            });
        });
    }

    findMatches() {
        const horizontalMatches: { r: number, c: number, type: number }[][] = [];
        const verticalMatches: { r: number, c: number, type: number }[][] = [];

        // Horizontal
        for (let r = 0; r < GRID_SIZE; r++) {
            let currentMatch: { r: number, c: number, type: number }[] = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                const type = this.grid[r][c]?.getData('type');
                if (type !== undefined && (currentMatch.length === 0 || currentMatch[0].type === type)) {
                    currentMatch.push({ r, c, type });
                } else {
                    if (currentMatch.length >= 3) horizontalMatches.push([...currentMatch]);
                    currentMatch = type !== undefined ? [{ r, c, type }] : [];
                }
            }
            if (currentMatch.length >= 3) horizontalMatches.push([...currentMatch]);
        }

        // Vertical
        for (let c = 0; c < GRID_SIZE; c++) {
            let currentMatch: { r: number, c: number, type: number }[] = [];
            for (let r = 0; r < GRID_SIZE; r++) {
                const type = this.grid[r][c]?.getData('type');
                if (type !== undefined && (currentMatch.length === 0 || currentMatch[0].type === type)) {
                    currentMatch.push({ r, c, type });
                } else {
                    if (currentMatch.length >= 3) verticalMatches.push([...currentMatch]);
                    currentMatch = type !== undefined ? [{ r, c, type }] : [];
                }
            }
            if (currentMatch.length >= 3) verticalMatches.push([...currentMatch]);
        }

        return { horizontalMatches, verticalMatches };
    }

    async processMatches(matchGroups: { horizontalMatches: any[], verticalMatches: any[] }) {
        const { horizontalMatches, verticalMatches } = matchGroups;
        const allMatched = new Set<string>();
        const specialCreations: { r: number, c: number, type: number, special: string }[] = [];

        const triggerSpecial = (r: number, c: number, type: number, special: string) => {
            // Visual feedback for activation
            const x = X_OFFSET + c * CELL_SIZE + CELL_SIZE / 2;
            const y = Y_OFFSET + r * CELL_SIZE + CELL_SIZE / 2;
            
            if (special === 'striped-h') {
                this.createBeam(x, y, true);
                for (let i = 0; i < GRID_SIZE; i++) allMatched.add(`${r},${i}`);
            } else if (special === 'striped-v') {
                this.createBeam(x, y, false);
                for (let i = 0; i < GRID_SIZE; i++) allMatched.add(`${i},${c}`);
            } else if (special === 'wrapped') {
                this.createExplosion(x, y);
                for (let i = r-1; i <= r+1; i++) {
                    for (let j = c-1; j <= c+1; j++) {
                        if (i >= 0 && i < GRID_SIZE && j >= 0 && j < GRID_SIZE) allMatched.add(`${i},${j}`);
                    }
                }
            } else if (special === 'color-bomb') {
                this.createColorPulse(x, y);
                for (let i = 0; i < GRID_SIZE; i++) {
                    for (let j = 0; j < GRID_SIZE; j++) {
                        if (this.grid[i][j]?.getData('type') === type) allMatched.add(`${i},${j}`);
                    }
                }
            }
        };

        // Identify matches and handle existing special activations
        [...horizontalMatches, ...verticalMatches].forEach(match => {
            match.forEach((m: any) => {
                allMatched.add(`${m.r},${m.c}`);
                const candy = this.grid[m.r][m.c];
                if (candy && candy.getData('special') !== 'none') {
                    triggerSpecial(m.r, m.c, m.type, candy.getData('special'));
                }
            });
        });

        // Identify new special candy creations without overlapping bugs
        const specialGrid: { [key: string]: string } = {};

        // Intersection (Wrapped) takes priority!
        Array.from(allMatched).forEach(s => {
            const [r, c] = s.split(',').map(Number);
            const inH = horizontalMatches.some(m => m.some((mc: any) => mc.r === r && mc.c === c));
            const inV = verticalMatches.some(m => m.some((mc: any) => mc.r === r && mc.c === c));
            if (inH && inV) {
                specialGrid[`${r},${c}`] = 'wrapped';
            }
        });

        horizontalMatches.forEach(match => {
            const head = match[0];
            const coord = `${head.r},${head.c}`;
            if (!specialGrid[coord]) {
                if (match.length === 4) specialGrid[coord] = 'striped-h';
                else if (match.length >= 5) specialGrid[coord] = 'color-bomb';
            }
        });

        verticalMatches.forEach(match => {
            const head = match[0];
            const coord = `${head.r},${head.c}`;
            if (!specialGrid[coord]) {
                if (match.length === 4) specialGrid[coord] = 'striped-v';
                else if (match.length >= 5) specialGrid[coord] = 'color-bomb';
            }
        });

        for (const [coord, special] of Object.entries(specialGrid)) {
             const [r, c] = coord.split(',').map(Number);
             const type = this.grid[r][c] ? this.grid[r][c]!.getData('type') : 0;
             specialCreations.push({ r, c, type, special });
        }

        const matchArray = Array.from(allMatched).map(s => {
            const [r, c] = s.split(',').map(Number);
            return { r, c };
        });

        // Track items collected
        matchArray.forEach(({ r, c }) => {
            const candy = this.grid[r][c];
            if (candy) {
                const type = candy.getData('type');
                if (this.collectedCandies[type] !== undefined) {
                    this.collectedCandies[type]++;
                }
            }
        });
        this.updateInfoText();

        this.score += matchArray.length * 10;
        this.scoreText.setText('SCORE: ' + this.score);
        this.events.emit('score-updated', this.score);

        // Removal animation
        const removalTweens: Promise<void>[] = [];
        matchArray.forEach(({ r, c }) => {
            const candy = this.grid[r][c];
            if (candy) {
                const p = new Promise<void>(resolve => {
                    this.tweens.add({
                        targets: candy,
                        alpha: 0, scale: 0.1,
                        duration: 300,
                        onComplete: () => {
                            candy.destroy();
                            this.grid[r][c] = null;
                            resolve();
                        }
                    });
                });
                removalTweens.push(p);
            }
        });

        await Promise.all(removalTweens);

        // Create new special candies (if their spot is empty or was just cleared)
        specialCreations.forEach(sc => {
            const texture = sc.special === 'color-bomb' ? 'special_bomb' : `candy_${sc.type}`;
            const sprite = this.spawnCandy(sc.r, sc.c, sc.type, true);
            this.grid[sc.r][sc.c] = sprite;
            
            if (sc.special === 'color-bomb') {
                sprite.setTexture('special_bomb');
                sprite.setDisplaySize(CELL_SIZE, CELL_SIZE);
            } else {
                this.applySpecialVisuals(sprite, sc.special);
                // Optional: set a unique tint or property
                sprite.setData('special', sc.special);
            }
        });

        // Fill Gaps
        await this.dropCandies();
        await this.refillGrid();

        // Check for cascades
        const nextMatches = this.findMatches();
        if (nextMatches.horizontalMatches.length > 0 || nextMatches.verticalMatches.length > 0) {
            await this.processMatches(nextMatches);
        } else {
            this.isProcessing = false;
        }
    }

    async dropCandies(): Promise<void> {
        const dropPromises: Promise<void>[] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            let emptySpaces = 0;
            for (let r = GRID_SIZE - 1; r >= 0; r--) {
                if (this.grid[r][c] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    const candy = this.grid[r][c]!;
                    const newR = r + emptySpaces;
                    this.grid[newR][c] = candy;
                    this.grid[r][c] = null;
                    candy.setData('r', newR);
                    
                    const p = new Promise<void>(resolve => {
                        this.tweens.add({
                            targets: candy,
                            y: Y_OFFSET + newR * CELL_SIZE + CELL_SIZE / 2,
                            duration: 200 * emptySpaces,
                            ease: 'Bounce.easeOut',
                            onComplete: () => resolve()
                        });
                    });
                    dropPromises.push(p);
                }
            }
        }
        await Promise.all(dropPromises);
    }

    async refillGrid(): Promise<void> {
        const spawnPromises: Promise<void>[] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE; r++) {
                if (this.grid[r][c] === null) {
                    const type = Phaser.Math.Between(0, CANDY_TYPES - 1);
                    const sprite = this.spawnCandy(r, c, type, false);
                    this.grid[r][c] = sprite;
                    
                    const p = new Promise<void>(resolve => {
                        this.tweens.add({
                            targets: sprite,
                            y: Y_OFFSET + r * CELL_SIZE + CELL_SIZE / 2,
                            duration: 400,
                            ease: 'Bounce.easeOut',
                            onStart: () => {
                                // Start higher up to fall in
                                sprite.y = Y_OFFSET - 100 - (GRID_SIZE - r) * 50;
                            },
                            onComplete: () => resolve()
                        });
                    });
                    spawnPromises.push(p);
                }
            }
        }
        await Promise.all(spawnPromises);
    }

    createBeam(x: number, y: number, horizontal: boolean) {
        const beam = this.add.graphics();
        beam.lineStyle(10, 0x00ffff, 0.8);
        if (horizontal) {
            beam.lineBetween(X_OFFSET, y, X_OFFSET + GRID_SIZE * CELL_SIZE, y);
        } else {
            beam.lineBetween(x, Y_OFFSET, x, Y_OFFSET + GRID_SIZE * CELL_SIZE);
        }
        this.tweens.add({
            targets: beam,
            alpha: 0,
            duration: 500,
            onComplete: () => beam.destroy()
        });
    }

    createExplosion(x: number, y: number) {
        const circle = this.add.circle(x, y, CELL_SIZE * 1.5, 0xffaa00, 0.4);
        this.tweens.add({
            targets: circle,
            scale: 2,
            alpha: 0,
            duration: 600,
            onComplete: () => circle.destroy()
        });
    }

    createColorPulse(x: number, y: number) {
        confetti({
            particleCount: 100,
            spread: 120,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
            colors: ['#ffffff', '#00ffff', '#ff00ff']
        });
    }
}
