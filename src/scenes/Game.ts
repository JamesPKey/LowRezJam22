import Phaser from 'phaser';
import { blackColour, gameFont, InputControls, textboxColour, whiteColour } from '../Common';

const DEBUG_MODE = false // Disabled this before publish

export default class Game extends Phaser.Scene {
  private keys?: InputControls;
  private eKeyDown: boolean = false
  private eKeyDownTime: number = 0

  private player!: Player;
  private drawables: Obstacle[] = []

  private dialog!: Dialog;
  private inventory!: Inventory;

  private officeDoor!: Drawable;
  private missingFloorboard!: Drawable;
  private backDoor!: Drawable;
  private mirror!: Drawable;
  private gardenShroud!: Drawable;
  private secretRoomShroud!: Drawable;

  private music!: Phaser.Sound.BaseSound;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.audio("game-music", ['assets/audio/Horror.mp3']);
  }

  create() {
    this.registerInputs()

    this.music = this.sound.add("game-music", { loop: true });
    if (!this.sound.get("game-music").isPlaying) {
      this.music.play() 
    }

    this.officeDoor = new Drawable(this, 40, 52, 2, 4, 0x5a3300, ["Obstacle"], () => {
      this.dialog.addMessage("Its a door!")
      this.dialog.addMessage("The lock is \nhi-tech!")
      if (this.inventory.items.includes("ID Card")) {
        this.dialog.addMessage("Opened with \nID Card!")
        this.officeDoor.drawable?.destroy()
        this.drawables = this.drawables.filter(drawable => drawable != this.officeDoor)
      }
    })

    this.missingFloorboard = new Drawable(this, 27, 16, 4, 2, 0x381100, ["Obstacle"], () => {
      this.dialog.addMessage("Its a hole \nin the floor!")
      this.dialog.addMessage("Holey moley!")
      if (this.inventory.items.includes("Plank")) {
        this.dialog.addMessage("Covered hole \nwith plank!")
        this.missingFloorboard.drawable?.destroy()
        this.drawables = this.drawables.filter(drawable => drawable != this.missingFloorboard)
      }
    })

    this.backDoor = new Drawable(this, 56, 16, 4, 2, 0x5a3300, ["Obstacle"], () => {
      this.dialog.addMessage("Its a door!")
      this.dialog.addMessage("A-door-able!")
      if (this.inventory.items.includes("Back Key")) {
        this.dialog.addMessage("Opened with \nBack Key")
        this.backDoor.drawable?.destroy()
        this.gardenShroud.drawable?.destroy()
        this.drawables = this.drawables.filter(drawable => drawable != this.backDoor && drawable != this.gardenShroud)
      }
    })

    this.mirror = new Drawable(this, 8, 23, 4, 2, 0xc0c0c0, ["Obstacle"], () => {
      this.dialog.addMessage("Its a mirror!")
      this.dialog.addMessage("No time for \nreflection!")
      if (this.inventory.items.includes("Stone")) {
        this.dialog.addMessage("Threw Stone \nat mirror!")
        this.dialog.addMessage("Mirror shattered!")
        this.dialog.addMessage("Picked up \nmirror shard!")
        this.inventory.items.push("Mirror")
        this.mirror.drawable?.destroy()
        this.drawables = this.drawables.filter(drawable => drawable != this.mirror)
      }
    })

    this.gardenShroud = new Drawable(this, 52, 7, 24, 16, 0x000000, ["Obstacle"], () => {
    })

    this.secretRoomShroud = new Drawable(this, 7, 10, 16, 24, 0x000000, ["Obstacle"], () => {
      this.dialog.addMessage("The mirror \nbroke!")
      this.dialog.addMessage("Bad luck!")
      if (this.inventory.items.includes("Torch")) {
        this.dialog.addMessage("Shines the \ntorch!")
        this.dialog.addMessage("A hidden \nspace!")
        this.secretRoomShroud.drawable?.destroy()
        this.drawables = this.drawables.filter(drawable => drawable != this.secretRoomShroud)
      }
    })

    this.drawables.push(
      // House floor
      new Drawable(this, 32, 32, 64, 64, 0x6e470b),
      // House floor
      new Drawable(this, 52, 8, 24, 16, 0x7ec850),

      // Top Left room
      new Obstacle(this, 15, 12, 2, 24),
      new Obstacle(this, 3, 23, 6, 2),
      new Obstacle(this, 13, 23, 6, 2),

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

      // Front door
      new Drawable(this, 32, 63, 4, 2, 0x5a3300, ["Obstacle"], () => {
        this.dialog.addMessage("Its a door!")
        this.dialog.addMessage("Locked tight!")
        if (this.inventory.items.includes("Front Key")) {
          this.dialog.addMessage(`You win! \nEscaped in${Math.ceil(this.eKeyDownTime/1000)}s`)
        }
      }),

      // Bathroom

      // Sink
      new Drawable(this, 2, 25, 3, 2, 0x006994, ["Obstacle"], () => {
        this.dialog.addMessage("Its a sink!")
        this.dialog.addMessage("Not just a \nblue square!")
        if (this.inventory.items.includes("Bottle")) {
          this.dialog.addMessage("Filled up \nBottle!")
          this.inventory.items.push("Water")
        }
      }),

      this.mirror,

      new Drawable(this, 4, 39, 10, 4, 0xbbbbbb, ["Obstacle"], () => {
        this.dialog.addMessage("Its a Bath!")
        this.dialog.addMessage("Squeaky clean!")
      }),

      // Kitchen

      this.backDoor,

      new Drawable(this, 62, 20, 4, 4, 0xbbbbbb, ["Obstacle"], () => {
        this.dialog.addMessage("Its a Fridge!")
        this.dialog.addMessage("Not hungry!")
      }),

      new Drawable(this, 62, 26, 4, 4, 0x333333, ["Obstacle"], () => {
        this.dialog.addMessage("Its a Cooker!")
        if (this.inventory.items.includes("Match")) {
          this.dialog.addMessage("Cooker lit \nwith match!")
        }
        if (!this.inventory.items.includes("Back Key") && this.inventory.items.includes("Ice Block")) {
          this.dialog.addMessage("Melted \nIce Block!")
          this.dialog.addMessage("Picked up \nBack Key!")
          this.inventory.items.push("Back Key")
        }
      }),

      new Drawable(this, 62, 32, 4, 4, 0xbbbbbb, ["Obstacle"], () => {
        this.dialog.addMessage("Its a Freezer!")
        this.dialog.addMessage("Cool!")
        if (!this.inventory.items.includes("Ice Block")) {
          this.dialog.addMessage("Picked up \nIce Block!")
          this.inventory.items.push("Ice Block")
        }
      }),

      // Office

      // Office door
      this.officeDoor,

      // Desk
      new Obstacle(this, 52, 47, 12, 4, 0xbbbbbb),

      // Chair
      new Drawable(this, 52, 50, 4, 2, 0x8b0000),

      // Computer
      new Drawable(this, 52, 48, 4, 2, 0xadd8e6, ["Obstacle"], () => {
        this.dialog.addMessage("Computer \nsays no!")
      }),

      //Bin
      new Drawable(this, 59, 46, 2, 2, 0x404040, ["Obstacle"], () => {
        this.dialog.addMessage("Its a bin!")
        if (!this.inventory.items.includes("Match")) {
          this.dialog.addMessage("Picked up \nMatch!")
          this.inventory.items.push("Match")
        }
      }),

      // Cellar

      this.missingFloorboard,

      new Drawable(this, 22, 2, 4, 4, 0xdcb579, ["Obstacle"], () => {
        this.dialog.addMessage("Its a Drawer!")
        this.dialog.addMessage("Empty!")
      }),

      new Drawable(this, 27, 2, 4, 4, 0xdcb579, ["Obstacle"], () => {
        this.dialog.addMessage("Its a Drawer!")
        this.dialog.addMessage("Still empty!")
      }),

      new Drawable(this, 32, 2, 4, 4, 0xdcb579, ["Obstacle"], () => {
        this.dialog.addMessage("Its a Drawer!")
        if (!this.inventory.items.includes("Torch")) {
          this.dialog.addMessage("Handle is \nslippery!")
          if (this.inventory.items.includes("Water")){
            this.dialog.addMessage("Clean handle \nwith water!")
            this.dialog.addMessage("Picked up \nTorch!")
            this.inventory.items.push("Torch")
          }
        }
      }),

      // Lounge

      // Chair
      new Drawable(this, 2, 45, 6, 4, 0xf898c8, [], () => {
        this.dialog.addMessage("Its a chair!")
        if (!this.inventory.items.includes("ID Card")) {
          this.dialog.addMessage("Picked up \nID Card!")
          this.inventory.items.push("ID Card")
        }
      }),

      // Sofa
      new Drawable(this, 20, 50, 4, 12, 0xf898c8, [], () => {
        this.dialog.addMessage("Its a sofa!")
        this.dialog.addMessage("Get down!")
      }),

      // Rug
      new Drawable(this, 10, 54, 12, 12, 0x8b0000, [], () => {
        this.dialog.addMessage("Its a rug!")
        this.dialog.addMessage("Beautiful!")
      }),

      // Garden

      // Bin
      new Drawable(this, 42, 1, 2, 2, 0x404040, ["Obstacle"], () => {
        this.dialog.addMessage("Its a bin!")
        if (!this.inventory.items.includes("Bottle")) {
          this.dialog.addMessage("Picked up \nBottle!")
          this.inventory.items.push("Bottle")
        }
      }),

      // Shed
      new Drawable(this, 60, 1, 4, 6, 0x6e470b, ["Obstacle"], () => {
        this.dialog.addMessage("Its a Shed!")
        if (!this.inventory.items.includes("Planks")) {
          this.dialog.addMessage("The lock \nis tied!")
          if (this.inventory.items.includes("Mirror")) {
            this.dialog.addMessage("Cut the rope \nwith the mirror!")
            this.dialog.addMessage("Picked up \nPlank!")
            this.inventory.items.push("Plank")
          }
        }
      }),

      // Stone
      new Drawable(this, 42, 14, 1, 1, 0x303030, [], () => {
        this.dialog.addMessage("Its a stone!")
        if (!this.inventory.items.includes("Stone")) {
          this.dialog.addMessage("Picked up \nStone!")
          this.inventory.items.push("Stone")
        }
      }),

      this.gardenShroud,

      //Secret Room

      //Key
      new Drawable(this, 2, 1, 2, 2, 0x404040, ["Obstacle"], () => {
        if (!this.inventory.items.includes("Front Key")) {
          this.dialog.addMessage("Picked up key!")
          this.inventory.items.push("Front Key")
        }
      }),

      this.secretRoomShroud
    )

    this.drawables.forEach(drawable => drawable.createDrawable())

    this.player = new Player(this, 32, 32)
    this.player.createDrawable()

    this.dialog = new Dialog(this)

    this.inventory = new Inventory()

    if (!DEBUG_MODE) {
      // Initial text
      this.dialog.addMessage("Where am I?")
      this.dialog.addMessage("Need to\n escape!")
    }
  }

  update(time: number) {
    if(!this.dialog.activeTextBox) {
      if (this.keys?.W.isDown && this.player.hitbox().top > 0) {
        const playerHitbox = this.player.hitbox(0, -1)
        if (this.player.ghostMode || !this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
          this.player.setY(this.player.y - 1)
        }
      }
      if (this.keys?.A.isDown && this.player.hitbox().left > 0) {
        const playerHitbox = this.player.hitbox(-1, 0)
        if (this.player.ghostMode || !this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
          this.player.setX(this.player.x - 1)
        }
      }
      if (this.keys?.S.isDown && this.player.hitbox().bottom < 64) {
        const playerHitbox = this.player.hitbox(0, 1)
        if (this.player.ghostMode || !this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
          this.player.setY(this.player.y + 1)
        }
      }
      if (this.keys?.D.isDown && this.player.hitbox().right < 64) {
        const playerHitbox = this.player.hitbox(1, 0)
        if (this.player.ghostMode || !this.drawables.find(drawable => drawable.flags.includes('Obstacle') && drawable.collides(playerHitbox))) {
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
      this.dialog.addMessage('Sample \nmessage.')
    }
    this.player.ghostMode = DEBUG_MODE && (this.keys?.Shift.isDown ?? false)
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
  public ghostMode: boolean = false;

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


