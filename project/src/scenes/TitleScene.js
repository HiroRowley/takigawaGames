export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    create() {
        // タイトル表示
        this.add.text(250, 250, "滝川さんの大出勤", {
            fontSize: "32px",
            fill: "#ffffff"
        });

        this.add.text(200, 320, "Press ENTER to Start", {
            fontSize: "20px",
            fill: "#aaaaaa"
        });

        // 入力監視だけここでやる
        this.input.keyboard.on("keydown-ENTER", () => {
            this.startGame();
        });
    }

    startGame() {
        // Scene遷移だけを担当
        this.scene.start("GameScene");
    }
}