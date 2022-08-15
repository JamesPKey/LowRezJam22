import Phaser from 'phaser';
import { blackColour, gameFont, InputControls, textboxColour, whiteColour } from '../Common';

const DEBUG_MODE = true // Disabled this before publish
const DEBUG_GHOST_MODE = true //Disable collision

export default class Game extends Phaser.Scene {
  private keys?: InputControls;
  private eKeyDown: boolean = false
  private eKeyDownTime: number = 0

  private player!: Player;
  private drawables: Obstacle[] = []

  private dialog!: Dialog;
  private inventory!: Inventory;

  constructor() {
    super('GameScene');
  }

  create() {
    this.registerInputs()

    this.drawables.push(
      // House floor
      new Drawable(this, 32, 32, 64, 64, 0x6e470b),
      // House floor
      new Drawable(this, 52, 8, 24, 16, 0x7ec850),

      // Top Left room
      new Obstacle(this, 15, 12, 2, 24),
      new Obstacle(this, 8, 23, 16, 2),

      // Top Middle room
      new Obstacle(this, 20, 16, 10, 2),
      new Obstacle(this, 42, 16, 26, 2),
      new Obstacle(this, 40, 10, 2, 20),

      // Garden wall
      new Obstacle(this, 61, 16, 6, 2),

      // Bottom wall
      new Obstacle(this, 15, 63, 30, 2),
      new Obstacle(this, 49, 63, 30, 2),

      // Office / kitchen wall
      new Obstacle(this, 40, 38, 2, 24),
      new Obstacle(this, 40, 58, 2, 8),
      new Obstacle(this, 52, 44, 26, 2),

      // Lounge wall
      new Obstacle(this, 24, 52, 2, 20),
      new Obstacle(this, 10, 39, 2, 8),
      new Obstacle(this, 15, 26, 2, 4),
      new Obstacle(this, 15, 34, 2, 4),

      new Obstacle(this, 4, 42, 10, 2),
      new Obstacle(this, 21, 42, 8, 2),
      new Obstacle(this, 12, 35, 6, 2),

      // Sink
      new Drawable(this, 42, 18, 2, 2, 0x006994, [], () => {
        this.dialog.addMessage("Its a sink!")
        if (this.inventory.items.includes("Bottle")) {
          this.dialog.addMessage("Filled up \nBottle!")
          this.inventory.items.push("Water")
        }
      }),

      // Mirror
      new Drawable(this, 8, 23, 4, 2, 0xc0c0c0, ["Obstacle"], () => {
        this.dialog.addMessage("Its a mirror!")
      }),

      // Front door
      new Drawable(this, 32, 63, 4, 2, 0x5a3300, ["Obstacle"], () => {
        this.dialog.addMessage("Its a door!")
        if (this.inventory.items.includes("Front Key")) {
          this.dialog.addMessage(`You win! \n${Math.ceil(this.eKeyDownTime/1000)}s`)
        }
      }),

      // Back door
      new Drawable(this, 56, 16, 4, 2, 0x5a3300, ["Obstacle"], () => {
        this.dialog.addMessage("Its a door!")
      }),

      // Back hole
      new Drawable(this, 27, 16, 4, 2, 0x381100, ["Obstacle"], () => {
        this.dialog.addMessage("Its a hole!")
      }),

      //Bin
      new Drawable(this, 42, 1, 2, 2, 0x404040, ["Obstacle"], () => {
        this.dialog.addMessage("Its a bin!")
        if (!this.inventory.items.includes("Bottle")) {
          this.dialog.addMessage("Picked up \nBottle!")
          this.inventory.items.push("Bottle")
        }
      }),

      //Key
      new Drawable(this, 2, 1, 2, 2, 0x404040, ["Obstacle"], () => {
        this.dialog.addMessage("Picked up key!")
        this.inventory.items.push("Front Key")
      })
    )

    this.drawables.forEach(drawable => drawable.createDrawable())

    this.player = new Player(this, 32, 32)
    this.player.createDrawable()

    this.dialog = new Dialog(this)

    this.inventory = new Inventory()

    // Initial text
    this.dialog.addMessage("Where am I?")
    this.dialog.addMessage("Need to  \nescape!")
  }

  update(time: number) {
    if(!this.dialog.activeTextBox) {
      if (this.keys?.W.isDown && this.player.hitbox().top > 0) {
        const playerHitbox = this.player.hitbox(0, -1)
        if (DEBUG_GHOST_MODE || !this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
          this.player.setY(this.player.y - 1)
        }
      }
      if (this.keys?.A.isDown && this.player.hitbox().left > 0) {
        const playerHitbox = this.player.hitbox(-1, 0)
        if (DEBUG_GHOST_MODE || !this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
          this.player.setX(this.player.x - 1)
        }
      }
      if (this.keys?.S.isDown && this.player.hitbox().bottom < 64) {
        const playerHitbox = this.player.hitbox(0, 1)
        if (DEBUG_GHOST_MODE || !this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
          this.player.setY(this.player.y + 1)
        }
      }
      if (this.keys?.D.isDown && this.player.hitbox().right < 64) {
        const playerHitbox = this.player.hitbox(1, 0)
        if (DEBUG_GHOST_MODE || !this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
          this.player.setX(this.player.x + 1)
        }
      }
    }

    if (this.keys?.E.isDown) {
      if (!this.eKeyDown) { this.eKeyDown = true}
    } else if (this.eKeyDown) {
      this.eKeyDown = false
      this.eKeyDownTime = time
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
  public scene: Phaser.Scene
  public x: number
  public y: number
  public w: number
  public h: number
  public colour: number
  public flags: Flag[]
  public drawable?: any
  public interaction: any

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, colour: number, flags: Flag[] = [], interaction?: any) {
    this.scene = scene
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.flags = flags
    this.colour = colour
    this.interaction = interaction
  }

  createDrawable() {
    this.drawable = this.scene.add.rectangle(this.x, this.y, this.w, this.h, this.colour)
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

class Inventory {
  public items: string[] = []
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
      container: this.scene.add.rectangle(32, 64 - (textboxHeight / 2), 64, textboxHeight, textboxColour, 0x22),
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


