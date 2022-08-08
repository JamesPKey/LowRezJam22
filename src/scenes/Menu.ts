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

    let selection = 0

    this.input.keyboard.on('keydown_w', () => {selection = selection - 1}, this);

    this.input.keyboard.on('keydown_s', () => {selection = selection + 1}, this);

    const rect = this.add.rectangle(8, 32 + (selection * 16), 2, 2, 0xffffff)

    const newText = this.add.text(32, 32, "New")
    newText.setColor("#fff")
    newText.setOrigin(0.5, 0.5)

    const helpText = this.add.text(32, 48, "Help")
    helpText.setColor("#fff")
    helpText.setOrigin(0.5, 0.5)

  }
}
