import * as Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import MainMenuScene from './scenes/MainMenuScene';
import GameScene from './scenes/GameScene';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  parent: 'phaser-container',
  backgroundColor: '#2b1a30', // Deep purple
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 960,
  },
  input: {
    activePointers: 3,
  },
  render: {
    pixelArt: false,
    antialias: true
  },
  scene: [BootScene, MainMenuScene, GameScene],
};

export const initGame = (parent: string) => {
  return new Phaser.Game({ ...config, parent });
};
