
import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {

    constructor() {

        super("TitleScene");

    }

    create() {

        // タイトル
        this.add.text(220, 220, "滝川さんの大出勤", {
            fontSize: "48px",
            fill: "#ffffff"
        });

        // 説明
        this.add.text(240, 320, "Press ENTER to start", {
            fontSize: "24px",
            fill: "#aaaaaa"
        });

        // Enter監視
        this.input.keyboard.on("keydown-ENTER", () => {

            this.startGame();

        });
    }

    // =========================
    // ゲーム開始
    // =========================
    startGame() {

        this.scene.start("GameScene", {
            stage: 1
        });

    }
}

