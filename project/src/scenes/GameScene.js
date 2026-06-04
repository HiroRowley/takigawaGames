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

        this.deathCount=0;//初期化
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

        //追加
        this.createPlayer();
        this.createEnemies();
        this.createTraps();
        this.setupCollisions();
    }

    // =========================
    // ステージ生成
    // =========================
    createStage() {
        this.loadStageData();

        this.createGround();

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
    this.enemies = this.physics.add.group();

    this.enemySpawnList.forEach(pos => {//ステージデータにある敵の位置を順番に処理
        const enemy = new Enemy(this, pos.x, pos.y, "enemy");//敵を生成

        this.enemies.add(enemy);//グループに追加
    });
}

    // =========================
    // Trap生成
    // =========================
    createTraps() {

    // トラップ用のGroupを作る（物理付き）
    this.traps = this.physics.add.group();

    // ステージデータの配置情報を元に生成
    this.trapList.forEach(pos => {

        // トラップを生成
        const trap = new Trap(this, pos.x, pos.y, "trap");

        // グループに追加（Phaserが管理してくれる）
        this.traps.add(trap);
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

    // すでに無敵状態ならダメージを無効化
    // （連続でダメージを受けるのを防ぐ）
    if (this.player.isInvincible) return;

    // ダメージ元（敵やトラップ）からダメージ量を取得
    const damage = damageSource.getDamage();

    // プレイヤーにダメージを与える
    // （Playerクラス側のHPを減らす処理）
    player.takeDamage(damage);

    // 無敵状態にする（一定時間ダメージ無効）
    this.player.isInvincible = true;

    // ダメージ演出（プレイヤーを赤くする）
    player.setTint(0xff0000);

    // 1秒後に無敵解除＆見た目を元に戻す
    this.time.delayedCall(1000, () => {
        player.clearTint();              // 色を元に戻す
        this.player.isInvincible = false; // 無敵解除
    });

    // HPが0以下になったらゲームオーバー
    if (player.hp <= 0) {
        this.gameOver();
    }
}

    // =========================
    // ゲームオーバー
    // =========================
    gameOver() {
    // 遅刻回数カウント
    this.deathCount++;

    // 物理停止（全部止める）
    this.physics.pause();

    // プレイヤー演出（今のところ赤くなる、後から変更可能）
    this.player.setTint(0xff0000);

    // 少し待ってからリスタート
    this.time.delayedCall(1000, () => {

        // 物理再開
        this.physics.resume();

        // プレイヤー初期化（ステージ開始位置に戻す）
        this.player.setPosition(
            this.playerSpawn.x,
            this.playerSpawn.y
        );

        // 状態リセット
        this.player.hp = 3;
        this.player.clearTint();
        this.player.isInvincible = false;

        // ⚠ ステージはそのまま（敵・トラップはリセットしない）
    });
}

    // =========================
    // update
    // =========================
    update() {
    this.player.update(this.input.keyboard.createCursorKeys());//キーボード入力を渡す

    this.enemies.children.iterate(enemy => {//敵の更新
        enemy.update?.();
    });

    this.traps.children.iterate(trap => {//トラップの更新
        trap.update?.();
    });
}
    
}