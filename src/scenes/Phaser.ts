import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
  constructor() {
    super('PhaserScene');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
  }

  create() {
    const logo = this.add.image(32, 32, 'logo');
    logo.setScale(0.15)

    this.input.on('pointerup', (pointer: any) => {
      this.scene.start('MenuScene');
    }, this);


    this.tweens.add({
      targets: logo,
      scaleX: 0.2,
      scaleY: 0.2,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });

  }

  update(time: number, delta: number): void {
    if (time > 2000)
      this.scene.start("MenuScene")
  }
}
