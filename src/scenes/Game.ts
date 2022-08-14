import Phaser from 'phaser';
import { blackColour, gameFont, InputControls, textboxColour, whiteColour } from '../Common';

const DEBUG_MODE = true // Disabled this before publish

export default class Game extends Phaser.Scene {
  private keys?: InputControls;
  private eKeyDown: boolean = false

  private player!: Player;
  private drawables: Obstacle[] = []

  private dialog!: Dialog;

  constructor() {
    super('GameScene');
  }

  create() {
    this.registerInputs()

    this.drawables.push(
      //Floor
      new Drawable(this, 32, 32, 64, 64, 0x6e470b),
      // Top Left room
      new Obstacle(this, 8, 12, 16, 24),
      //Top Middle room
      new Obstacle(this, 20, 16, 8, 2), // Top wall left
      new Obstacle(this, 40, 16, 28, 2), // Top wall right
      new Obstacle(this, 40, 10, 2, 20), // Top wall going up
      //Sink
      new Drawable(this, 42, 18, 2, 2, 0x006994, [], () => {
        this.dialog.addMessage("Its a sink!")
      }),
      //Mirror
      new Drawable(this, 8, 23, 4, 2, 0xc0c0c0, ["Obstacle"], () => {
        this.dialog.addMessage("Its a mirror!")
      }),

      //Bottom wall
      new Obstacle(this, 15, 63, 30, 2), // Top wall left
      new Obstacle(this, 49, 63, 30, 2), // Top wall right

      //Mirror
      new Drawable(this, 32, 63, 4, 2, 0x5a3300, ["Obstacle"], () => {
        this.dialog.addMessage("Its a door!")
      }),
    )

    this.player = new Player(this, 32, 32)

    this.dialog = new Dialog(this)
  }

  update(time: number) {
    if(!this.dialog.activeTextBox) {
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
    }

    if (this.keys?.E.isDown) {
      if (!this.eKeyDown) { this.eKeyDown = true}
    } else if (this.eKeyDown) {
      this.eKeyDown = false
      if(!!this.dialog.activeTextBox) {
        // Close any active textbox
        this.dialog.nextMessage();
        return
      }

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
      this.dialog.addMessage('You found the \ntreasure!')
    }
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
  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, colour: number = blackColour) {
    super(scene, x, y, w, h, colour, ["Obstacle"])
  }
}

class Dialog {
  public messageQueue: string[] = []
  public scene: Phaser.Scene

  public activeTextBox?: TextBox

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  addMessage(text: string) {
    const textboxHeight = 20
    if (!this.messageQueue.includes(text)){
      this.messageQueue.push(text)
    }

    this.activeTextBox ||= {
      container: this.scene.add.rectangle(32, 64 - (textboxHeight / 2), 64, textboxHeight, textboxColour),
      text: this.scene.add.text(1, 45, this.messageQueue[0], gameFont),
   } 
  }

  nextMessage() {
    this.messageQueue.shift()
    if (!!this.messageQueue.length){
      this.activeTextBox?.text.setText(this.messageQueue[0])
    } else {
      this.closeTextBox()
    }
  }

  closeTextBox() {
    this.activeTextBox?.text.destroy();
    this.activeTextBox?.container.destroy();
    this.activeTextBox = undefined
  }

}


