export default class ResultScene extends Phaser.Scene {
    constructor() {
        super("ResultScene");
    }

    create() {
        this.add.text(240, 250, "皆さん、おはようございます。", {
            fontSize: "32px",
            fill: "#ffffff"
        });

        this.add.text(180, 320, "Press ENTER to Title", {
            fontSize: "20px",
            fill: "#aaaaaa"
        });

        this.input.keyboard.on("keydown-ENTER", () => {
            this.scene.start("TitleScene");
        });
    }
}