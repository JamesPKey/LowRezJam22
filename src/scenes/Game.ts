import Phaser from 'phaser';
import { InputControls, textboxColour, whiteColour } from '../Common';

const DEBUG_MODE = true // Disabled this before publish

export default class Game extends Phaser.Scene {
  private keys?: InputControls;

  private player!: Player;

  private activeTextBox?: TextBox;

  constructor() {
    super('GameScene');
  }

  create() {
    this.registerInputs()

    this.player = new Player(this, 32, 32)
  }

  update() {
    if (this.keys?.W.isDown && this.player.y > 0) {
      this.player.setY(this.player.y - 1)
    }
    if (this.keys?.A.isDown && this.player.x > 0) {
      this.player.setX(this.player.x - 1)
    }
    if (this.keys?.S.isDown && this.player.y < 64) {
      this.player.setY(this.player.y + 1)
    }
    if (this.keys?.D.isDown  && this.player.x < 64) {
      this.player.setX(this.player.x + 1)
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

class Player {
  public x: number
  public y: number
  public drawable: any

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.x = x
    this.y = y
    this.drawable = scene.add.rectangle(this.x, this.y, 2, 2, whiteColour)
  }

  setX = (x: number) => {
    this.x = x
    this.drawable.setPosition(this.x, this.y)
  }

  setY = (y: number) => {
    this.y = y
    this.drawable.setPosition(this.x, this.y)
  }
}