import Phaser from "phaser";

export default class Isu extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setImmovable(true);

        this.setScale(0.1);
        this.setOrigin(0.5, 1);
    }


    // onSit(player) {
    //     if (this.isGameOver) return;

    //     this.sleepCount++;

    //     if (this.sleepCount >= this.maxSleep) {
    //         this.trigger(player);
    //     }
    // }

    // trigger(player) {
    //     this.isGameOver = true;

    //     player.setVelocity(0, 0);
    //     player.anims.stop();

    //     console.log("ゲームオーバーイベント");
    // }
}