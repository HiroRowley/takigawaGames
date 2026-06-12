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

import Timer from "../timer/Timer.js";

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

        this.timer = new Timer(this, 30);
        this.timer.start();
    }

    // =========================
    // ★ここが追加：ステージクリア処理
    // =========================
    clearStage() {
        if (this.clearing) return;
        this.clearing = true;

        this.canMove = false;

        // ★画面を白くフェードアウト
        this.cameras.main.fadeOut(2000, 255, 255, 255);

        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("GameScene", {
            stageNumber: this.stageNumber + 1
            });
        });
    }

    // =========================
    createPlayer() {
        const px = this.getPixelX(this.playerSpawn.x);
        const py = this.getPixelY(this.playerSpawn.y);

        this.player = new Player(this, px, py);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player.setCollideWorldBounds(true);
    }

    createIsu() {
        const list = this.stageData.isuList || [];

        this.isuObjects = [];

        list.forEach(pos => {
            const isu = new Isu(
                this,
                this.getPixelX(pos.x),
                this.getPixelY(pos.y),
                "isu"
            );

            isu.body.setSize(46, 77);
            isu.body.setOffset(0, 20);

            this.isuObjects.push(isu);
        });
    }

    createGround() {
        this.groundList = this.stageData.groundList || [];

        this.groundList.forEach(pos => {
            const px = this.getPixelX(pos.x);
            const py = this.getPixelY(pos.y);

            const ground = this.add.rectangle(px, py, this.TILE, this.TILE, 0x654321);

            this.physics.add.existing(ground, true);
            this.grounds.add(ground);
        });
    }

    loadStageData() {
        const map = {
            1: Stage1,
            2: Stage2,
            3: Stage3
        };

        this.stageData = map[this.stageNumber];

        this.TILE = this.stageData.TILE || 64;
        this.playerSpawn = this.stageData.playerSpawn;

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

    setupCollisions() {
        this.physics.add.collider(this.player, this.grounds);

        this.physics.add.overlap(this.player, this.isuObjects, (player, isu) => {

            if (!isu.active) return;
            if (this.isSleeping) return;

            this.isSleeping = true;
            this.canMove = false;

            const ix = isu.x;
            const iy = isu.y;

            const sleep = this.add.image(ix, iy, "player_sleep");
            sleep.setOrigin(0.5, 1);
            sleep.setScale(0.1);

            player.setVisible(false);
            player.body.enable = false;

            isu.setVisible(false);
            isu.body.enable = false;

            this.time.delayedCall(3000, () => {

                sleep.destroy();

                isu.setPosition(ix, iy);
                isu.setVisible(true);
                isu.body.enable = true;

                player.setPosition(ix, iy);
                player.setVisible(true);
                player.body.enable = true;

                this.canMove = true;
                this.isSleeping = false;
            });

            // =========================
            // ★一定回数でステージクリア（例）
            // =========================
            this.sleepCount = (this.sleepCount || 0) + 1;

            if (this.sleepCount >= 5) {
                this.time.delayedCall(1000, () => {
                    this.clearStage();
                });
            }
        });
    }

    update(time, delta) {
        if (this.player?.update) {
            this.player.update(this.cursors, this.canMove);
        }

        this.timer?.update();
    }
}