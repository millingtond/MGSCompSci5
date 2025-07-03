// src/main.ts
import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // Use WebGL if available, otherwise Canvas
  width: 800,
  height: 600,
  parent: 'game-container', // ID of the div in your index.html
  backgroundColor: '#2d2d2d',
  scene: [GameScene] // The scene to start with
};

new Phaser.Game(config);