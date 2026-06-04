import Phaser from "phaser";
import Stage2PreviewScene from "./scenes/Stage2PreviewScene.js";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: "#1d1d1d",
  scene: [Stage2PreviewScene],
});