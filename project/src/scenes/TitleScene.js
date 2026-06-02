export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    create() {
        this.add.text(250, 250, "滝川さんの大出勤", {
            fontSize: "32px",
            fill: "#ffffff"
        });

        this.add.text(200, 320, "Press ENTER to Start", {
            fontSize: "20px",
            fill: "#aaaaaa"
        });

        this.input.keyboard.on("keydown-ENTER", () => {
            this.scene.start("GameScene");
        });
    }
}