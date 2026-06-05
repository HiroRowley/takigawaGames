import Phaser from "phaser";
import DataManager from "../managers/DataManager.js";

// ステージデータのインポート
import Stage1 from "../stages/Stage1.js";

import Player from "../objects/Player.js";
import Enemy from "../objects/enemy/EnemyBase.js";
import Trap from "../objects/traps/TrapBase.js";
import Noda from "../objects/enemy/Noda.js";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }

    // =====================================
    // init
    // =====================================
    init(data) {
        // デモ用に強制的にステージ1に固定
        this.stageNumber = 1;
    }

    // =====================================
    // preload
    // =====================================
    preload() {
        this.imageLoader();
    }

    imageLoader(){
        // 全ステージで使う画像をロード
        this.load.image("player", "asset/takigawa/player.png");
        this.load.image("noda", "asset/noda/noda.png");
        // ※ もしground画像を用意した場合は、ここでロードしてください。
        // 例: this.load.image("ground", "asset/ground.png");
    }

    // =====================================
    // create
    // =====================================
    create() {
        // オブジェクトグループを静的グループ(staticGroup)として初期化
        this.grounds = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        this.traps = this.physics.add.group(); // トラップ用のグループも一応初期化

        // 1. ステージ読込
        this.loadStageData();

        // 2. 地形生成
        this.createGround();

        // 3. 各種オブジェクト生成
        this.createPlayer();
        this.createEnemies();
        this.createGoal();

        // 4. コライダー（当たり判定）設定
        this.setupCollisions();

        // 5. プレイヤー死亡監視
        this.setupPlayerDeathListener();
    }

    // =====================================
    // ステージ読込とデータ整形
    // =====================================
    loadStageData() {
        const stages = {
            1: Stage1
        };

        this.stageData = stages[this.stageNumber];

        if (!this.stageData) {
            console.error(`ステージ ${this.stageNumber} のデータが見つかりません。`);
            return;
        }

        this.TILE = this.stageData.TILE;

        // データが存在しないプロパティは空配列 [] で初期化
        this.groundList = this.stageData.groundList || [];
        this.enemySpawnList = this.stageData.enemySpawnList || [];
        this.trapList = this.stageData.trapList || [];

        // 必須データの取得
        this.playerSpawn = this.stageData.playerSpawn;
        this.goalData = this.stageData.goalPosition || this.stageData.goal;
    }

    // =====================================
    // 座標変換ヘルパー関数
    // =====================================
    getPixelX(x) {
        return this.TILE ? (x * this.TILE + this.TILE / 2) : x;
    }

    getPixelY(y) {
        return this.TILE ? (y * this.TILE + this.TILE / 2) : y;
    }

    // =====================================
    // 地形生成（バグ修正版）
    // =====================================
    createGround() {
        this.groundList.forEach(pos => {
            const px = this.getPixelX(pos.x);
            const py = this.getPixelY(pos.y);
            
            // 画像アセットがない場合でも動くように、茶色の四角(Rectangle)を生成してグループに追加
            const ground = this.add.rectangle(px, py, this.TILE, this.TILE, 0x654321); 
            
            // 静的グループに登録して物理化する
            this.grounds.add(ground);
            
            // 物理ボディのサイズを四角に合わせる
            ground.body.setSize(this.TILE, this.TILE);
        });
    }

    // =====================================
    // Player生成
    // =====================================
    createPlayer() {
        const px = this.getPixelX(this.playerSpawn.x);
        const py = this.getPixelY(this.playerSpawn.y);

        this.player = new Player(this, px, py);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    // =====================================
    // Enemy生成
    // =====================================
    createEnemies() {
        this.enemySpawnList.forEach(pos => {
            const px = this.getPixelX(pos.x);
            const py = this.getPixelY(pos.y);

            let enemy; 
            switch (pos.type) {
                case "noda": 
                    enemy = new Noda(this, px, py);
                    break; 
                default: 
                    return; 
            }            
            this.enemies.add(enemy);
        });
    }

    // =====================================
    // ゴール生成
    // =====================================
    createGoal() {
        if (!this.goalData) return;

        const px = this.getPixelX(this.goalData.x);
        const py = this.getPixelY(this.goalData.y);

        this.goalSprite = this.physics.add.staticSprite(px, py, "goal");
    }

    // =====================================
    // Collider設定（追加・修正版）
    // =====================================
    setupCollisions() {
        // 【重要】プレイヤーと地面の衝突判定を追加（これで床に立ちます）
        this.physics.add.collider(this.player, this.grounds);

        // 敵と地面の衝突判定も追加（敵が下に落ちていかないようにする）
        this.physics.add.collider(this.enemies, this.grounds);

        // プレイヤーと敵の重なり（踏みつけ・被ダメージ）判定
        this.physics.add.overlap(
            this.player,
            this.enemies,
            (player, enemy) => {
                if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
                    this.handleEnemyStomp(enemy, player);
                } else {
                    this.handlePlayerDamage(player, enemy);
                }
            },
            null,
            this
        );

        // ダメージ判定 (Trap)
        this.physics.add.overlap(
            this.player, 
            this.traps, 
            this.handlePlayerDamage, 
            null, 
            this
        );

        // ゴール判定
        if (this.goalSprite) {
            this.physics.add.overlap(
                this.player,
                this.goalSprite,
                () => { this.nextStage(); },
                null,
                this
            );
        }
    }

    // =====================================
    // Player死亡監視
    // =====================================
    setupPlayerDeathListener() {
        this.player.on("late", () => {
            this.gameOver();
        });
    }

    // =====================================
    // 敵を踏みつけたときの処理
    // =====================================
    handleEnemyStomp(enemy, player) {
        player.setVelocityY(-300); 

        if (enemy.die) {
            enemy.die();
        } else {
            enemy.destroy(); 
        }
    }

    // =====================================
    // ダメージ処理
    // =====================================
    handlePlayerDamage(player, damageSource) {
        if (!damageSource.getDamage) return;
        const damage = damageSource.getDamage();
        player.takeDamage(damage);
    }

    // =====================================
    // ゲームオーバー
    // =====================================
    gameOver() {
        if(DataManager && DataManager.resetPlayerData) {
            DataManager.resetPlayerData();
        }
        this.scene.start("ResultScene");
    }

    // =====================================
    // 次ステージ / クリア判定
    // =====================================
    nextStage() {
        const nextStage = this.stageNumber + 1;

        if (nextStage > 3) {
            this.scene.start("ResultScene", { clear: true }); 
            return;
        }

        DataManager.setCurrentStage(nextStage);
        this.scene.start("GameScene", { stage: nextStage });
    }

    // =====================================
    // update
    // =====================================
    update() {
        if (this.player && this.player.update) {
            this.player.update(this.cursors);
        }

        this.enemies.getChildren().forEach(enemy => {
            enemy.update?.();
        });
        this.enemies.getChildren().forEach(enemy => {
        if (enemy.y > 750 || enemy.x < -100 || enemy.x > 900) {
            this.enemies.remove(enemy, true, true); // グループから削除し、スプライトも完全に消去
        }
    });
    }
}