import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  private keyW: any;
  private keyA: any;
  private keyS: any;
  private keyD: any;
  private keyE: any;

  private playerX: any;
  private playerY: any;

  private player: any;

  constructor() {
    super('GameScene');
  }

  create() {
    this.keyW = this.input.keyboard.addKey('W')
    this.keyA = this.input.keyboard.addKey('A')
    this.keyS = this.input.keyboard.addKey('S')
    this.keyD = this.input.keyboard.addKey('D')
    this.keyE = this.input.keyboard.addKey('E')

    this.playerX = 32
    this.playerY = 32
    this.player = this.add.rectangle(this.playerX, this.playerY, 2, 2, 0xffffff)

  }

  update() {
    if (this.keyW?.isDown && this.playerY > 0) {
      this.playerY = this.playerY - 1
      this.player.setPosition(this.playerX, this.playerY)
    }
    if (this.keyA?.isDown && this.playerX > 0) {
      this.playerX = this.playerX - 1
      this.player.setPosition(this.playerX, this.playerY)
    }
    if (this.keyS?.isDown && this.playerY < 64) {
      this.playerY = this.playerY + 1
      this.player.setPosition(this.playerX, this.playerY)
    }
    if (this.keyD?.isDown  && this.playerX < 64) {
      this.playerX = this.playerX + 1
      this.player.setPosition(this.playerX, this.playerY)
    }
    if(this.keyE?.isDown) {
      //Todo: interact
    }
  }
}
