import { Scene } from 'phaser';

export default class MainMenuScene extends Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // Background gradient or simple color is handled by game config mostly, 
    // but let's add some title text
    this.add.text(width / 2, height / 3, 'CANDY CHAIN', {
      fontSize: '56px',
      color: '#ffffff',
      fontStyle: '900',
      stroke: '#ec4899',
      strokeThickness: 8,
      shadow: { offsetX: 0, offsetY: 0, color: '#ec4899', blur: 20, stroke: true, fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 3 + 60, 'COLLECT $CRUSH REWARDS', {
      fontSize: '18px',
      color: '#22d3ee',
      fontStyle: 'bold',
      shadow: { offsetX: 0, offsetY: 0, color: '#22d3ee', blur: 10, fill: true }
    }).setOrigin(0.5);

    const playButton = this.add.container(width / 2, height / 2 + 100);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xcc00cc, 1);
    btnBg.fillRoundedRect(-150, -40, 300, 80, 40);
    btnBg.lineStyle(4, 0xffffff, 1);
    btnBg.strokeRoundedRect(-150, -40, 300, 80, 40);
    
    const btnText = this.add.text(0, 0, 'PLAY NOW', {
      fontSize: '40px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    playButton.add([btnBg, btnText]);
    playButton.setSize(300, 80);
    playButton.setInteractive({ useHandCursor: true });

    playButton.on('pointerdown', () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    });

    playButton.on('pointerover', () => {
      this.tweens.add({ targets: playButton, scale: 1.1, duration: 100 });
      btnBg.clear();
      btnBg.fillStyle(0xff33ff, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 40);
      btnBg.lineStyle(4, 0xffffff, 1);
      btnBg.strokeRoundedRect(-150, -40, 300, 80, 40);
    });

    playButton.on('pointerout', () => {
      this.tweens.add({ targets: playButton, scale: 1.0, duration: 100 });
      btnBg.clear();
      btnBg.fillStyle(0xcc00cc, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 40);
      btnBg.lineStyle(4, 0xffffff, 1);
      btnBg.strokeRoundedRect(-150, -40, 300, 80, 40);
    });
  }
}
