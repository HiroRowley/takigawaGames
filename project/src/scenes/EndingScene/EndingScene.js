import Phaser from "phaser";

export default class EndingScene extends Phaser.Scene {

    constructor() {
        super("EndingScene"); // ←ここに入れる
    }

    create() {
        this.cameras.main.setBackgroundColor("#000");

        const text = this.add.text(400, 600,
`エンドロール

A：○○
B：○○
C：○○`, {
            fontSize: "32px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: -200,
            duration: 8000
        });
    }
}