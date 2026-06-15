import Phaser from "phaser";
 
export default class VideoScene extends Phaser.Scene {
    constructor() {
        super("VideoScene");
    }
 
    create() {
        this.cameras.main.setBackgroundColor("#000");
 
        const vw = this.cameras.main.width;
        const vh = this.cameras.main.height;
 
        // 画面中央に配置するため、座標を (vw/2, vh/2) にし、Originを中央 (0.5, 0.5) に変更します
        const video = this.add.video(vw / 2, vh / 2, "endingVideo")
            .setOrigin(0.5, 0.5);
 
        // 画面サイズと動画の元サイズの倍率をそれぞれ計算
        const scaleX = vw / video.width;
        const scaleY = vh / video.height;
 
        // ---------------------------------------------------------
        // 用途に合わせてどちらかのスケール計算を選んでください
        // ---------------------------------------------------------
 
        // 【パターンA】画面内にすべて収める（Letterbox / 余白に黒帯ができる）
        const scale = Math.min(scaleX, scaleY);
 
        // 【パターンB】画面いっぱいに広げる（Cover / はみ出た部分は見切れる）
        // const scale = Math.max(scaleX, scaleY);
 
        // ---------------------------------------------------------
        scale = scale * 3.0;
        // 計算した倍率を適用（比率を維持して拡大・縮小）
        video.setScale(scale);
 
        video.play();
 
        video.once("complete", () => {
            console.log("動画終了");
        });
    }
}