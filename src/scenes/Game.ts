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

  update(time: any) {
    if (time % 3 != 0) {return}
    if (this.keys?.W.isDown && this.player.hitbox().top > 0) {
      this.player.setY(this.player.y - 1)
    }
    if (this.keys?.A.isDown && this.player.hitbox().left > 0) {
      this.player.setX(this.player.x - 1)
    }
    if (this.keys?.S.isDown && this.player.hitbox().bottom < 64) {
      this.player.setY(this.player.y + 1)
    }
    if (this.keys?.D.isDown  && this.player.hitbox().right < 64) {
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

class Drawable {
  public x: number
  public y: number
  public w: number
  public h: number
  public drawable: any

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.drawable = scene.add.rectangle(this.x, this.y, this.w, this.h, whiteColour)
  }

  setX = (x: number) => {
    this.x = x
    this.drawable.setPosition(this.x, this.y)
  }

  setY = (y: number) => {
    this.y = y
    this.drawable.setPosition(this.x, this.y)
  }

  hitbox = () => ({
    top: this.y - (this.h/2),
    left: this.x - (this.w/2),
    bottom: this.y + (this.h/2),
    right: this.x + (this.w/2)
  })
}

class Player extends Drawable {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 2, 2)
  }
}