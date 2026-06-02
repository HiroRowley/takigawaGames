export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    create() {
        this.add.text(250, 250, "GAME SCENE", {
            fontSize: "32px",
            fill: "#ffffff"
        });

        this.add.text(180, 320, "Press SPACE to Result", {
            fontSize: "20px",
            fill: "#aaaaaa"
        });

        this.input.keyboard.on("keydown-SPACE", () => {
            this.scene.start("ResultScene");
        });

        //キー入力受付ローリー
        this.cursors = this.input.keyboard.createCursorKeys();

        //プレイヤーの生成ローリー
        this.player = new Player(this, 100, 450);
    }
    update() {
        //プレイヤーの更新ローリー
        this.player.update(this.cursors);
    }
}