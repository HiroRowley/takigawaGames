import Phaser from "phaser";
import System from "./systems/System.js";

import TitleScene from "./scenes/TitleScene.js";
import GameScene from "./scenes/GameScene.js";
import ResultScene from "./scenes/ResultScene.js"; 
import StageClearTransitionScene from "./scenes/EndingScene/StageClearTransitionScene.js";
import OfficeScene from "./scenes/EndingScene/OfficeScene.js";
import EndingScene from "./scenes/EndingScene/EndingScene.js";
import VideoScene from "./scenes/EndingScene/VideoScene.js";

const config = {
  type: System.CONFIG.TYPE, // System.jsから定数を読み込むように修正

  width: System.CONFIG.WIDTH,
  height: System.CONFIG.HEIGHT,
  
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },


  scene: [
    TitleScene,
    GameScene,
    ResultScene,
    StageClearTransitionScene,
    OfficeScene,
    EndingScene,
    VideoScene,
  ],

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
