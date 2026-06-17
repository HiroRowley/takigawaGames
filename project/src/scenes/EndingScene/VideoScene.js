import Phaser from "phaser";

export default class VideoScene extends Phaser.Scene {
  constructor() {
    super("VideoScene");
  }

  preload() {
    this.load.video("endingVideo", "asset/ending.mp4");
  }

  create() {
    this.cameras.main.setBackgroundColor("#000000");

    const video = this.add
      .video(this.scale.width / 2, this.scale.height / 2, "endingVideo")
      .setOrigin(0.5);

    video.on("play", () => {
      const scale = Math.min(
        this.scale.width / video.width,
        this.scale.height / video.height
      );
      video.setScale(scale);
    });

    video.play();
    video.once("complete", () => {window.location.reload();
      
    });
  }
}
