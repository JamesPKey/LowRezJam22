class InputControls {
    public W: Phaser.Input.Keyboard.Key
    public A: Phaser.Input.Keyboard.Key
    public S: Phaser.Input.Keyboard.Key
    public D: Phaser.Input.Keyboard.Key
    public E: Phaser.Input.Keyboard.Key
    public T: Phaser.Input.Keyboard.Key
    public Shift: Phaser.Input.Keyboard.Key
    
    constructor(scene: Phaser.Scene) {
      this.W = scene.input.keyboard.addKey('W')
      this.A = scene.input.keyboard.addKey('A')
      this.S = scene.input.keyboard.addKey('S')
      this.D = scene.input.keyboard.addKey('D')
      this.E = scene.input.keyboard.addKey('E')
      this.T = scene.input.keyboard.addKey('T')
      this.Shift = scene.input.keyboard.addKey('Shift')
    }
  }

const gameFont = {
    fontFamily: 'BMmini',
    fontSize: '0.8em',
}

const blackColour = 0x000000
const textboxColour = 0x808080
const whiteColour = 0xffffff

export {InputControls, gameFont, blackColour, textboxColour, whiteColour};