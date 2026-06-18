import Phaser from "phaser";
// ※もしDataManagerを直接読み込む場合はここでインポートしてください
//import DataManager from "./DataManager";
 
export default class ResultScene extends Phaser.Scene {
    constructor() {
        super("ResultScene");
    }
 
    // 前のシーン（GameSceneなど）からデータを受け取る
    // ResultScene.js の init メソッド
    init(data) {
        this.paidHolidays = data.paidHolidays !== undefined ? data.paidHolidays : 3;
        // ミスしたステージの番号を記憶しておく（なければステージ1）
        this.retryStageNumber = data.stageNumber !== undefined ? data.stageNumber : 1;
    }
 
    // ResultScene.js の retryGame メソッド
    retryGame() {
        // ミスしたステージ番号を渡しながら、GameSceneを再開する
        this.scene.start("GameScene", { stageNumber: this.retryStageNumber });
    }
 
    create() {
        // 背景を真っ黒にする
        this.cameras.main.setBackgroundColor('#000000');
 
        // 画面の中央座標を取得（画面サイズが800x600の場合を想定）
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
 
        // キャラクターのイメージを表示して縮小する
        // ★ ここに .setScale(0.5) を追加（0.5で半分のサイズになります）
        this.add.image(centerX - 60, centerY, "player").setScale(0.2);
 
        // 「有給 〇日」のテキストを表示
        this.add.text(centerX, centerY - 16, `有給 × ${this.paidHolidays} 日`, {
            fontSize: "32px",
            fill: "#ffffff",
            fontFamily: "sans-serif"
        });
 
        // マリオのように自動遷移させる（2000ミリ秒 = 2秒後に実行）
        this.time.delayedCall(2000, () => {
            // 有給がマイナスでも容赦なく強制リトライ
            this.retryGame();
        });
    }
 
    // リトライ処理
    retryGame() {
        // 必要に応じてデータの初期化処理（HPを全回復するなど）を記述
        this.reset
        this.scene.start("GameScene");
    }
 
    // タイトルへ戻る処理（責務分離）
    backToTitle() {
        this.resetResultState();
        this.scene.start("TitleScene"); // または本当のGameOverSceneへ
    }
 
    // ResultScene側の状態リセット処理
    resetResultState() {
        // 将来的に結果データクリアなどをここに書く
    }
}

 