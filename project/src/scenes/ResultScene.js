import Phaser from "phaser";
import DataManager from "../managers/DataManager.js";


export default class ResultScene extends Phaser.Scene {
    constructor() {
        super("ResultScene");
    }

    create() {
        // リザルト画面表示
        this.add.text(240, 250, "皆さん、おはようございます。", {
            fontSize: "32px",
            fill: "#ffffff"
        });

        // 操作説明
        this.add.text(180, 320, "Enter: Retry / Esc: Title", {
            fontSize: "20px",
            fill: "#aaaaaa"
        });

        // Enterキー：リトライ
        this.input.keyboard.on("keydown-ENTER", () => {
            this.retryGame();
        });

        // Escキー：タイトルへ戻る
        this.input.keyboard.on("keydown-ESCAPE", () => {
            this.backToTitle();
        });
    }

    // リトライ処理
        retryGame() {
        
        // 残機減少 + HP回復
        DataManager.resetPlayerData();
        
        this.scene.start(
            "GameScene",
            {
                stageNumber:
                    DataManager.getCurrentStage()
            }
        );
    }

    // タイトルへ戻る処理（責務分離）
    backToTitle() {
        this.resetResultState();   // ← 分離した処理
        this.scene.start("TitleScene");
    }

    // ResultScene側の状態リセット処理
    resetResultState() {
        // 将来的に結果データクリアなどをここに書く
        // 例: DataManager.resetPlayerData()
    }
}