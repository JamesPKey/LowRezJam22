import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  private keyE: any;

  constructor() {
    super('HelpScene');
  }

  preload() {}

  create() {
    this.keyE = this.input.keyboard.addKey('E')

    
    const helpText = this.add.text(32, 8, "Help")
    helpText.setColor("#fff")
    helpText.setOrigin(0.5, 0.5)

    const moveText = this.add.text(32, 24, "WASD:")
    moveText.setColor("#fff")
    moveText.setOrigin(0.5, 0.5)
    const moveValueText = this.add.text(32, 36, "Move")
    moveValueText.setColor("#fff")
    moveValueText.setOrigin(0.5, 0.5)

    const interactText = this.add.text(32, 48, "E:")
    interactText.setColor("#fff")
    interactText.setOrigin(0.5, 0.5)
    const interactValueText = this.add.text(32, 58, "Use")
    interactValueText.setColor("#fff")
    interactValueText.setOrigin(0.5, 0.5)
  }

  update() {
    if(this.keyE?.isDown) {
        // Todo: Go back
    }
  }
  

}
