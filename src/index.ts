import Phaser from 'phaser';
import config from './config';
import PhaserScene from './scenes/Phaser';
import MenuScene from './scenes/Menu';
import GameScene from './scenes/Game';
import HelpScene from './scenes/Help';

new Phaser.Game(
  Object.assign(config, {
    scene: [
      PhaserScene,
      MenuScene,
      GameScene,
      HelpScene
    ]
  })
);
