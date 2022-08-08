import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  private keyW: any;
  private keyS: any;
  private keyE: any;
  private selection = 0
  private menuIndicator: any

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

    this.keyW = this.input.keyboard.addKey('W')
    this.keyS = this.input.keyboard.addKey('S')
    this.keyE = this.input.keyboard.addKey('E')

    this.menuIndicator = this.add.rectangle(4, 32 + (this.selection * 16), 2, 2, 0xffffff)

    const newText = this.add.text(32, 32, "New")
    newText.setColor("#fff")
    newText.setOrigin(0.5, 0.5)

    const helpText = this.add.text(32, 48, "Help")
    helpText.setColor("#fff")
    helpText.setOrigin(0.5, 0.5)
  }

  update() {
    if (this.keyW?.isDown) {
      this.selection = 0
      this.menuIndicator.setPosition(4, 32)
    }
    if (this.keyS?.isDown) {
      this.selection = 1
      this.menuIndicator.setPosition(4, 48)
    }
    if(this.keyE?.isDown) {
      if (this.selection == 0) {
        this.scene.start('GameScene');
      } else {
        this.scene.start('HelpScene');
      }
  
    }
  }
  

}
