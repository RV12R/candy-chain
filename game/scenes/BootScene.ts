import { Scene } from 'phaser';

export default class BootScene extends Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.setBaseURL('/assets/');
    this.load.image('candy_0', 'candy_0.png');
    this.load.image('candy_1', 'candy_1.png');
    this.load.image('candy_2', 'candy_2.png');
    this.load.image('candy_3', 'candy_3.png');
    this.load.image('candy_4', 'candy_4.png');
    this.load.image('special_bomb', 'special_bomb.png');
  }

  create() {
    this.scene.start('MainMenuScene');
  }
}
