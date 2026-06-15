import Phaser from "phaser";
import System from "./systems/System.js";

import TitleScene from "./scenes/TitleScene/TitleScene.js";
import GameScene from "./scenes/GameScene/GameScene.js";
import ResultScene from "./scenes/ResultScene/ResultScene.js";
import StageClearTransitionScene from "./scenes/EndingScene/StageClearTransitionScene.js";
import OfficeScene from "./scenes/EndingScene/OfficeScene.js";
import EndingScene from "./scenes/EndingScene/EndingScene.js";
import PreloadScene from "./scenes/EndingScene/PreloadScene.js";
import VideoScene from "./scenes/EndingScene/VideoScene.js";

const config = {
  type: System.CONFIG.TYPE,

  width: System.CONFIG.WIDTH,
  height: System.CONFIG.HEIGHT,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  scene: [
    PreloadScene,
    TitleScene,
    GameScene,
    ResultScene,
    StageClearTransitionScene,
    OfficeScene,
    EndingScene,
    VideoScene
    ],

  physics: {
    default: System.CONFIG.PHYSICS.DEFAULT,
    arcade: System.CONFIG.PHYSICS.ARCADE,
  },
};

export default config;