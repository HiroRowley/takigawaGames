import Phaser from "phaser";
import DataManager from "../managers/DataManager.js";

import Stage1 from "../stages/Stage1.js";
import Stage2 from "../stages/Stage2.js";
import Stage3 from "../stages/Stage3.js";

import Player from "../objects/Player.js";
import Noda from "../objects/enemy/Noda.js";
import Yoshida from "../objects/enemy/Yoshida.js";
import Shimba from "../objects/enemy/Shimba.js";
import Ueno from "../objects/enemy/Ueno.js";

import Isu from "../objects/items/Isu.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init(data) {
        this.stageNumber = data?.stageNumber || 1;
    }

    preload() {
        this.load.image("isu", "/asset/isu.png");
        this.load.image("player_sleep", "/asset/takigawa/Animation/player.png");

        this.load.spritesheet("player", "/asset/takigawa/takigawaWalk10.png", {
            frameWidth: 597,
            frameHeight: 592
        });

        this.load.image("noda", "asset/noda/noda.png");
        this.load.image("yoshida", "asset/yoshida/yoshida.png");
        this.load.image("shimba", "asset/shimba/shimba.png");
        this.load.image("ueno", "asset/ueno/ueno.png");
        this.load.image("bullet", "asset/ueno/bullet.png");

        this.load.image("boss", "/asset/boss.png");
    }

    create() {
    this.grounds = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.traps = this.physics.add.group();
    this.bullets = this.physics.add.group();
    this.isus = this.physics.add.group();

    this.canMove = true;
    this.isSleeping = false;

    this.sleepCount = 0;
    this.boss = null;
    this.lateCount = 0;

    this.loadStageData();

    this.createGround();
    this.createPlayer();
    this.createIsu();

    this.setupCollisions();
}

    // =========================
    // プレイヤー
    // =========================
    createPlayer() {
    const px = this.getPixelX(this.playerSpawn.x);
    const py = this.getPixelY(this.playerSpawn.y);

    this.player = new Player(this, px, py);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.player.setCollideWorldBounds(true);
}

    // =========================
    // 椅子
    // =========================
    createIsu() {
    const list = this.stageData.isuList || [];

    list.forEach(pos => {
        const isu = new Isu(
            this,
            this.getPixelX(pos.x),
            this.getPixelY(pos.y),
            "isu"
        );

        isu.body.setSize(46, 77);
        isu.body.setOffset(0, 20);

        // ❌ this.isus.add(isu) は一旦やめる
        this.isuObjects = this.isuObjects || [];
        this.isuObjects.push(isu);
    });
}

    //地面

    createGround() {
    this.groundList = this.stageData.groundList || [];

    this.groundList.forEach(pos => {
        const px = this.getPixelX(pos.x);
        const py = this.getPixelY(pos.y);

        const ground = this.add.rectangle(px, py, this.TILE, this.TILE, 0x654321);

        this.physics.add.existing(ground, true); // ★static化
        this.grounds.add(ground);
    });
}
//     createGround() {
//     this.groundList = this.stageData.groundList || [];

//     this.groundList.forEach(pos => {
//         const px = this.getPixelX(pos.x);
//         const py = this.getPixelY(pos.y);

//         const ground = this.physics.add.staticImage(px, py, null);

//         ground.displayWidth = this.TILE;
//         ground.displayHeight = this.TILE;

//         ground.refreshBody(); // ←これ超重要

//         this.grounds.add(ground);
//     });
// }

    // =========================
    // ステージ
    // =========================
    loadStageData() {
        const map = {
            1: Stage1,
            2: Stage2,
            3: Stage3
        };

        this.stageData = map[this.stageNumber];

        this.TILE = this.stageData.TILE || 64;
        this.playerSpawn = this.stageData.playerSpawn;
        this.goalData = this.stageData.goal;

         if (!this.stageData.isuList) {
        this.stageData.isuList = [
            { x: 10, y: 18 },
            { x: 25, y: 18 },
        ];
    }
    }

    getPixelX(x) {
        return x * this.TILE + this.TILE / 2;
    }

    getPixelY(y) {
        return y * this.TILE + this.TILE / 2;
    }

    // =========================
    // コライダー
    // =========================
    setupCollisions() {

    this.physics.add.collider(this.player, this.grounds);

    this.physics.add.overlap(this.player, this.isuObjects, (player, isu) => {

        if (!isu.active) return;

        const ix = isu.x;
        const iy = isu.y;

        const px = player.x;
        const py = player.y;

        // 二重発動防止
        if (this.isSleeping) return;
        this.isSleeping = true;

        this.canMove = false;

        // =========================
        // ★追加：睡眠カウント＆ボス処理
        // =========================
        this.sleepCount = (this.sleepCount || 0) + 1;
        this.lateCount = this.lateCount || 0;

        if (this.sleepCount % 3 === 0) {

            this.lateCount++;

            if (!this.boss) {
                this.boss = this.add.image(
                    this.player.x,
                    this.player.y - 200,
                    "boss"
                );

                this.boss.setScale(0.5);
                this.boss.setDepth(1000);

                // =========================
                // ★コメント表示（0.5秒後）
                // =========================
                this.time.delayedCall(500, () => {
                    this.lateText = this.add.text(
                        this.cameras.main.centerX,
                        this.cameras.main.height - 80,
                        "滝川さんは眠ってしまった、、、\n上司に怒られて、遅刻確定、",
                        {
                            fontSize: "24px",
                            color: "#ffffff",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            padding: { x: 10, y: 10 },
                        }
                    );

                    this.lateText.setOrigin(0.5, 0.5);
                    this.lateText.setDepth(2000);
                });

                // =========================
                // ★boss削除（5秒後）
                // =========================
                this.time.delayedCall(5000, () => {
                    if (this.boss) {
                        this.boss.destroy();
                        this.boss = null;
                    }

                    if (this.lateText) {
                        this.lateText.destroy();
                        this.lateText = null;
                    }
                });
            }

            console.log("遅刻発生:", this.lateCount);
        }

        // =========================
        // ① その場で即sleep表示
        // =========================
        const sleep = this.add.image(ix, iy, "player_sleep");
        sleep.setOrigin(0.5, 1);
        sleep.setScale(0.1);

        player.setVisible(false);
        player.body.enable = false;

        isu.setVisible(false);
        isu.body.enable = false;

        // =========================
        // ② 3秒後に復帰
        // =========================
        this.time.delayedCall(3000, () => {

            sleep.destroy();

            isu.setPosition(ix, iy);
            isu.setVisible(true);
            isu.body.enable = true;

            const offsetX = isu.displayWidth * 0.3;

            player.setPosition(ix + offsetX, iy);
            player.setVisible(true);
            player.body.enable = true;

            this.canMove = true;
            this.isSleeping = false;
        });
    });
}

    createSleepPlayers() {
    const list = this.stageData.playerSleepList || [];

    list.forEach(pos => {
        const sleep = this.add.image(
            this.getPixelX(pos.x),
            this.getPixelY(pos.y),
            "player_sleep"
        );

        sleep.setVisible(false);
        sleep.setDepth(10);

        this.playerSleepGroup.add(sleep);
    });
}

    update() {
    if (this.player?.update) {
        this.player.update(this.cursors, this.canMove);
    }
}

    // setupCollisions() {
    //     this.physics.add.collider(this.player, this.grounds);

    //     this.physics.add.overlap(this.player, this.isus, (player, isu) => {

    //         isu.onSit(player);

    //         // ★安全ガード（超重要）
    //         if (!this.playerSit) return;

    //         this.player.setVisible(false);
    //         this.player.body.enable = false;

    //         this.playerSit.setPosition(player.x, player.y);
    //         this.playerSit.setVisible(true);

    //         this.time.delayedCall(2000, () => {
    //             this.player.setVisible(true);
    //             this.player.body.enable = true;
    //             this.playerSit.setVisible(false);
    //         });
    //     });

    //     // // ★ゴール（安全版）
    //     // if (this.goalData) {
    //     //     this.goalSprite = this.physics.add.staticSprite(
    //     //         this.getPixelX(this.goalData.x),
    //     //         this.getPixelY(this.goalData.y),
    //     //         "goal"
    //     //     );

    //     //     this.physics.add.overlap(this.player, this.goalSprite, () => {
    //     //         this.scene.restart();
    //     //     });
    //     // }
}
