import Phaser from 'phaser';
import { blackColour, InputControls, textboxColour, whiteColour } from '../Common';

const DEBUG_MODE = true // Disabled this before publish

export default class Game extends Phaser.Scene {
  private keys?: InputControls;

  private player!: Player;
  private drawables: Obstacle[] = []

  private activeTextBox?: TextBox;

  constructor() {
    super('GameScene');
  }

  create() {
    this.registerInputs()

    this.drawables.push(
      new Obstacle(this, 8, 32, 16, 64),
      new Obstacle(this, 48, 16, 8, 8),
      new Obstacle(this, 48, 48, 12, 12),
      new Drawable(this, 60, 32, 3, 2, 0x006994, [], () => this.createTextBox('You found the \ntreasure!'))
    )

    this.player = new Player(this, 32, 32)

  }

  update(time: number) {
    if (time % 3 != 0) {return}
    if (this.keys?.W.isDown && this.player.hitbox().top > 0) {
      const playerHitbox = this.player.hitbox(0, -1)
      if (!this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
        this.player.setY(this.player.y - 1)
      }
    }
    if (this.keys?.A.isDown && this.player.hitbox().left > 0) {
      const playerHitbox = this.player.hitbox(-1, 0)
      if (!this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
        this.player.setX(this.player.x - 1)
      }
    }
    if (this.keys?.S.isDown && this.player.hitbox().bottom < 64) {
      const playerHitbox = this.player.hitbox(0, 1)
      if (!this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
        this.player.setY(this.player.y + 1)
      }
    }
    if (this.keys?.D.isDown && this.player.hitbox().right < 64) {
      const playerHitbox = this.player.hitbox(1, 0)
      if (!this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
        this.player.setX(this.player.x + 1)
      }
    }
    if (this.keys?.E.isDown) {
      // Close any active textbox
      this.closeTextBox();

      const playerHitbox = this.player.hitbox()
      const interactable = this.drawables.find(drawable => !!drawable.interaction && drawable.interactable(playerHitbox))
      interactable?.interaction()


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

type Flag = 'Obstacle'

class Drawable {
  public x: number
  public y: number
  public w: number
  public h: number
  public flags: Flag[]
  public drawable: any
  public interaction: any

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, colour: number, flags: Flag[] = [], interaction?: any) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.flags = flags
    this.drawable = scene.add.rectangle(this.x, this.y, this.w, this.h, colour)
    this.interaction = interaction
  }

  setX = (x: number) => {
    this.x = x
    this.drawable.setPosition(this.x, this.y)
  }

  setY = (y: number) => {
    this.y = y
    this.drawable.setPosition(this.x, this.y)
  }

  hitbox = (offsetX: number = 0, offsetY: number = 0) => ({
    top: (this.y + offsetY) - (this.h/2),
    left: (this.x + offsetX) - (this.w/2),
    bottom: (this.y + offsetY) + (this.h/2),
    right: (this.x + offsetX) + (this.w/2)
  })

  collides = (otherHitbox: any) => {
    const hitbox = this.hitbox()
    return hitbox.left < otherHitbox.right &&
    hitbox.right > otherHitbox.left &&
    hitbox.top < otherHitbox.bottom &&
    hitbox.bottom > otherHitbox.top
  }

  interactable = (otherHitbox: any) => {
    const aura = this.flags.includes('Obstacle') ? 1 : 0
    const hitbox = this.hitbox()
    return hitbox.left - aura < otherHitbox.right &&
    hitbox.right + aura > otherHitbox.left &&
    hitbox.top - aura < otherHitbox.bottom &&
    hitbox.bottom + aura > otherHitbox.top
  }
}

class Player extends Drawable {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 2, 2, whiteColour)
  }
}

class Obstacle extends Drawable {
  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    super(scene, x, y, w, h, blackColour, ["Obstacle"])
  }
}


