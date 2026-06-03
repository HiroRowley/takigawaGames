import Phaser from "phaser";
import System from "./systems/System.js";

import TitleScene from "./scenes/TitleScene.js";
import GameScene from "./scenes/GameScene.js";
import ResultScene from "./scenes/ResultScene.js"; 

const config = {
  type: System.CONFIG.TYPE, // System.jsから定数を読み込むように修正

  width: System.CONFIG.WIDTH,
  height: System.CONFIG.HEIGHT,


  scene: [TitleScene, GameScene,ResultScene], 

  physics: {
    default: System.CONFIG.PHYSICS.DEFAULT,
    arcade: System.CONFIG.PHYSICS.ARCADE, // System.js側を修正したため、これで正しく重力が適用されます
  },

  // もし画面の自動リサイズ・中央寄せを行いたい場合は、以下のコメントアウトを解除してください
  /*
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
  */
};

export default config;