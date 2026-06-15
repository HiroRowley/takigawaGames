import Phaser from "phaser";

export default class VideoScene extends Phaser.Scene {
    constructor() {
        super("VideoScene");
    }

    create() {
        // 背景を黒にする
        this.cameras.main.setBackgroundColor("#000");

        // 中央座標
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        const video = this.add.video(centerX, centerY, "endingVideo")
            .setOrigin(0.5);

        video.play();

        video.once("complete", () => {
            console.log("動画終了");
        });
    }
}
