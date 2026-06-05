import Phaser from "phaser";
import Stage3PreviewScene from "./scenes/Stage3PreviewScene.js";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: "#637fdb",
  scene: [Stage3PreviewScene],
});