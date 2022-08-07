import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {}

  create() {
    const logo = this.add.text(32, 8, "Game")
    logo.setOrigin(0.5, 0.5)

    this.tweens.add({
      targets: logo,
      scaleX: 0.2,
      scaleY: 0.2,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });

    const newText = this.add.text(32, 32, "New")
    newText.setOrigin(0.5, 0.5)

    const helpText = this.add.text(32, 48, "Help")
    helpText.setOrigin(0.5, 0.5)

  }
}
