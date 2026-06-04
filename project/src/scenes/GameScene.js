import Phaser from "phaser";

import DataManager from "../managers/DataManager.js";
import StageData from "../stages/Stage1.js";

import Player from "../objects/Player.js";
import Enemy from "../objects/enemy/Enemy.js";
import Trap from "../objects/traps/Trap.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    // =========================
    // 初期データ受け取り
    // =========================
    init(data) {
        this.stageNumber = data?.stageNumber || 1;
    }

    // =========================
    // preload（アセット）
    // =========================
    preload() {
        this.load.image("player", "assets/player.png");
        this.load.image("enemy", "assets/enemy.png");
        this.load.image("trap", "assets/trap.png");
    }

    // =========================
    // create
    // =========================
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
            this.gameOver();
        });

        // ===== ゲーム初期化 =====
        this.createStage();
    }

    // =========================
    // ステージ生成
    // =========================
    createStage() {
        this.loadStageData();

        this.createPlayer();
        this.createEnemies();
        this.createTraps();
        
        this.setupCollisions();//ぶつかったときのルール設定
        this.setupPlayerDeathListener();//遅刻イベントの監視
    }

    // =========================
    // ステージ読み込み
    // =========================
    loadStageData() {
        this.stageData = StageData;//ステージのデータを持ってくる

        this.playerSpawn = this.stageData.playerSpawn;//プレイヤーの初期位置
        this.enemySpawnList = this.stageData.enemySpawnList;//敵をどこに出すか一覧
        this.trapList = this.stageData.trapList;//トラップ配置データ
        this.goalPosition = this.stageData.goalPosition;//ゴールの位置
    }

    // =========================
    // Player生成
    // =========================
    createPlayer() {
        this.player = new Player(
            this,
            this.playerSpawn.x,
            this.playerSpawn.y,
            "player"
        );

        this.add.existing(this.player);
        this.physics.add.existing(this.player);
    }

    // =========================
    // Enemy生成
    // =========================
    createEnemies() {
        this.enemies = [];

        this.enemySpawnList.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y, "enemy");
            this.add.existing(enemy);
            this.physics.add.existing(enemy);
            this.enemies.push(enemy);
        });
    }

    // =========================
    // Trap生成
    // =========================
    createTraps() {
        this.traps = [];

        this.trapList.forEach(pos => {
            const trap = new Trap(this, pos.x, pos.y, "trap");
            this.add.existing(trap);
            this.physics.add.existing(trap);
            this.traps.push(trap);
        });
    }

    // =========================
    // 衝突判定
    // =========================
    setupCollisions() {

    // プレイヤー vs 敵
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
        this.handlePlayerDamage(player, enemy);
    });

    // プレイヤー vs トラップ
    this.physics.add.overlap(this.player, this.traps, (player, trap) => {
        this.handlePlayerDamage(player, trap);
    });

    // 敵 vs トラップ
    this.physics.add.overlap(this.enemies, this.traps, (enemy, trap) => {
        this.handleEnemyDamage(enemy, trap);
    });

    // プレイヤー vs 地面
    this.physics.add.collider(this.player, this.ground);

    // 敵 vs 地面
    this.physics.add.collider(this.enemies, this.ground);
}

    // =========================
    // プレイヤー遅刻監視
    // =========================
    setupPlayerDeathListener() {
        this.player.on("late", () => {
            this.gameOver();
        });
    }

    // =========================
    // ダメージ処理
    // =========================
    handlePlayerDamage(player, damageSource) {
        const damage = damageSource.getDamage();
        player.takeDamage(damage);
    }

    // =========================
    // ゲームオーバー
    // =========================
    gameOver() {
        this.scene.start("ResultScene");
    }

    // =========================
    // update
    // =========================
    update() {
        if (this.player?.update) {
            this.player.update(this.input.keyboard.createCursorKeys());
        }
    }
    
}