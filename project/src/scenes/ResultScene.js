export default class ResultScene extends Phaser.Scene {
    constructor() {
        super("ResultScene"); // このSceneの識別名（GameSceneから遷移してくる先）
    }

    create() {
        // リザルト画面のメッセージ表示
        this.add.text(240, 250, "皆さん、おはようございます。", {
            fontSize: "32px",
            fill: "#ffffff"
        });

        // タイトルへ戻るための操作説明
        this.add.text(180, 320, "Press ENTER to Title", {
            fontSize: "20px",
            fill: "#aaaaaa"
        });

        // ENTERキーが押されたときの処理を登録
        this.input.keyboard.on("keydown-ENTER", () => {
            // TitleSceneへ戻る
            this.scene.start("TitleScene");
        });
    }
}