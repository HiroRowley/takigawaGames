export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene"); // このSceneの識別名（TitleSceneから遷移してくる先）
    }

    create() {
        // ゲーム画面であることを示すテキスト表示
        this.add.text(250, 250, "GAME SCENE", {
            fontSize: "32px",
            fill: "#ffffff"
        });

        // 次のSceneへ進むための操作説明
        this.add.text(180, 320, "Press SPACE to Result", {
            fontSize: "20px",
            fill: "#aaaaaa"
        });

        // SPACEキーが押されたときの処理を登録
        this.input.keyboard.on("keydown-SPACE", () => {
            // ResultSceneへ画面遷移
            this.scene.start("ResultScene");
        });
    }
}