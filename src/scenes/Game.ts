import Phaser from 'phaser';
import { InputControls, textboxColour } from '../Common';

const DEBUG_MODE = true // Disabled this before publish

export default class Game extends Phaser.Scene {
  private keys?: InputControls;

  private playerX: any;
  private playerY: any;

  private player: any;

  private activeTextBox?: TextBox;

  constructor() {
    super('GameScene');
  }

  create() {
    this.registerInputs()

    this.playerX = 32
    this.playerY = 32
    this.player = this.add.rectangle(this.playerX, this.playerY, 2, 2, 0xffffff)
  }

  update() {
    if (this.keys?.W.isDown && this.playerY > 0) {
      this.playerY = this.playerY - 1
      this.player.setPosition(this.playerX, this.playerY)
    }
    if (this.keys?.A.isDown && this.playerX > 0) {
      this.playerX = this.playerX - 1
      this.player.setPosition(this.playerX, this.playerY)
    }
    if (this.keys?.S.isDown && this.playerY < 64) {
      this.playerY = this.playerY + 1
      this.player.setPosition(this.playerX, this.playerY)
    }
    if (this.keys?.D.isDown  && this.playerX < 64) {
      this.playerX = this.playerX + 1
      this.player.setPosition(this.playerX, this.playerY)
    }
    if (this.keys?.E.isDown) {
      //Todo: interact

      // Close any active textbox
      this.closeTextBox();
    }

    this.listenForDebugInputs()
  }

  registerInputs() {
    this.keys = new InputControls(this)
  }

  listenForDebugInputs() {
    if (DEBUG_MODE && this.keys?.T.isDown) {
      this.createTextBox('You found the \ntreasure!')
    }
  }

  createTextBox(text: string) {
      const textboxHeight = 20
      const textSize = '0.8em'

      this.activeTextBox ||= {
        container: this.add.rectangle(32, 64 - (textboxHeight / 2), 64, textboxHeight, textboxColour),
        text: this.add.text(1, 45, text, {
          fontFamily: 'BMmini',
          fontSize: textSize,
        }),
     } 
  }

  closeTextBox() {
    this.activeTextBox?.text.destroy();
    this.activeTextBox?.container.destroy();
    this.activeTextBox = undefined
  }
}

interface TextBox {
  container: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
}