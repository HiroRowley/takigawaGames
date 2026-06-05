import Phaser from "phaser";
import Stage1PreviewScene from "./scenes/Stage1PreviewScene.js";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: "#93dceb",
  scene: [Stage1PreviewScene],
});