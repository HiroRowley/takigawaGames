import Phaser from "phaser";

export default class OfficeScene extends Phaser.Scene {
    constructor() {
        super("OfficeScene");

        this.isTouchingGoal = false;
        this.touchTime = 0;
        this.reachedGoal = false; // ★追加（停止状態管理）
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");

        // ゴール
        this.goal = this.physics.add.staticImage(
            this.scale.width - 600,
            this.scale.height / 2,
            "checkIn"
        );

        // 判定エリア
        this.goalHitBox = this.add.rectangle(
            this.scale.width - 600,
            this.scale.height / 2,
            40,
            40,
            0x000000,
            0
        );

        this.physics.add.existing(this.goalHitBox, true);

        // プレイヤー
        this.player = this.physics.add.sprite(
            500,
            this.scale.height / 2,
            "takigawaWalk02"
        );

        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(false);

        // overlap（接触判定）
        this.physics.add.overlap(
            this.player,
            this.goalHitBox,
            () => {
                this.isTouchingGoal = true;
                this.reachedGoal = true; // ★ここで停止状態へ
            }
        );

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) {
        const speed = 200;

        // ★ゴールに到達したら完全停止
        if (this.reachedGoal) {
            this.player.setVelocity(0);
        } else {
            this.player.setVelocityX(speed); // ★右だけ移動

            // 左・上・下は禁止（無視）
        }

        // ★2秒カウント
        if (this.isTouchingGoal) {
            this.touchTime += delta;

            if (this.touchTime >= 2000) {
                this.scene.start("EndingScene");
            }
        } else {
            this.touchTime = 0;
        }

        // 毎フレームリセット
        this.isTouchingGoal = false;
    }
}