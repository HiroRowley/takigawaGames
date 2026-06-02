import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    // 前シーンからデータ受け取り（今回は未使用）
    init(data) {
        // this.stageNumber = data?.stageNumber;
        // console.log("受け取ったステージ:", this.stageNumber);
    }

    // アセット読み込み（今回は未使用）
    preload() {
        // this.load.image("player", "assets/player.png");
        // this.load.image("enemy", "assets/enemy.png");
        // this.load.image("trap", "assets/trap.png");
    }

    create() {
        // =========================
        // 仮UI（遷移確認用）
        // =========================
        this.add.text(250, 250, "GAME SCENE", {
            fontSize: "32px",
            fill: "#ffffff"
        });

        this.add.text(180, 320, "Press SPACE to Result", {
            fontSize: "20px",
            fill: "#aaaaaa"
        });

        // =========================
        // 遷移テスト（今回はこれが本体）
        // =========================
        this.input.keyboard.on("keydown-SPACE", () => {
            this.gameOver(); // ← 本来の設計ルートに合わせる
        });

        // =========================
        // 本来のゲーム設計（未使用・コメントアウト）
        // =========================

        /*
        // Stageデータ読み込み
        this.loadStageData();

        // Player / Enemy / Trap生成
        this.createPlayer();
        this.createEnemies();
        this.createTraps();

        // 衝突判定
        this.setupCollisions();

        // プレイヤー死亡監視
        this.setupPlayerDeathListener();
        */
    }

    update() {
        // =========================
        // 毎フレーム処理（未使用）
        // =========================
        /*
        this.handlePlayerInput();
        this.checkGoal();
        */
    }

    // =========================
    // ダメージ処理（未使用）
    // =========================
    handlePlayerDamage(player, damageSource) {
        /*
        const damage = damageSource.getDamage();
        player.takeDamage(damage);
        */
    }

    // =========================
    // ゲームオーバー（遷移本体）
    // =========================
    gameOver() {
        this.scene.start("ResultScene");
    }

    // =========================
    // 次ステージ（未使用）
    // =========================
    nextStage() {
        /*
        DataManager.stageNumber++;
        this.scene.restart({ stage: DataManager.stageNumber });
        */
    }
    
}