import Phaser from 'phaser';
import { gameFont, InputControls } from '../Common';

export default class MenuScene extends Phaser.Scene {
  private keys?: InputControls;
  private selection = 0
  private menuIndicator: any

  constructor() {
    super('MenuScene');
  }

  preload() {}

  create() {
    const logo = this.add.text(32, 8, "Escape", {
      fontFamily: 'BMmini',
      fontSize: '2em',
    })
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

    this.keys = new InputControls(this)

    this.menuIndicator = this.add.rectangle(12, 32 + (this.selection * 16), 2, 2, 0xffffff)

    const newText = this.add.text(32, 32, "New", gameFont)
    newText.setColor("#fff")
    newText.setOrigin(0.5, 0.5)

    const helpText = this.add.text(32, 48, "Help", gameFont)
    helpText.setColor("#fff")
    helpText.setOrigin(0.5, 0.5)
  }

  update() {
    if (this.keys?.W.isDown) {
      this.selection = 0
      this.menuIndicator.setPosition(12, 32)
    }
    if (this.keys?.S.isDown) {
      this.selection = 1
      this.menuIndicator.setPosition(12, 48)
    }
    if(this.keys?.E.isDown) {
      if (this.selection == 0) {
        this.scene.start('GameScene');
      } else {
        this.scene.start('HelpScene');
      }
  
    }
  }
  

}
