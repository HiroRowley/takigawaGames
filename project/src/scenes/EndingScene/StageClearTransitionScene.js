import Phaser from "phaser";

export default class StageClearTransitionScene extends Phaser.Scene {
  constructor() {
    super("StageClearTransitionScene");
  }

  create(data) {
    const nextScene = data?.next || "OfficeScene";
    const payload = data?.data || {};
    const { width, height } = this.scale;

    const white = this.add
      .rectangle(0, 0, width, height, 0xffffff)
      .setOrigin(0)
      .setDepth(9999)
      .setAlpha(0);

    this.tweens.add({
      targets: white,
      alpha: 1,
      duration: 2500,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.scene.stop("GameScene");
        this.scene.start(nextScene, payload);
      },
    });
  }
}
