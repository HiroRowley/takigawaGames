import Phaser from "phaser";
import EnemyMovement from "../EnemyMovement.js";

export default class EnemyBase extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = 100;
        this.attackPower = 1;
        this.direction = -1;
        this.isDead = false;

        this.autoFlip = config.autoFlip ?? true;
        this.flipXWhenMovingRight = config.flipXWhenMovingRight ?? true;
        this.idleTextureKey = config.idleTextureKey || texture;
        this.idleFrame = config.idleFrame ?? null;

        this.movement = new EnemyMovement(scene);
        this.walkAnimationKey = this.movement.createAnimations(texture, config.animation);
    }

    getDamage() {
        return this.attackPower;
    }

    setBodyDisplaySize(width, height, center = true) {
        if (!this.body) return;

        const sourceWidth = width / Math.abs(this.scaleX || 1);
        const sourceHeight = height / Math.abs(this.scaleY || 1);
        this.body.setSize(sourceWidth, sourceHeight, center);
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;

        this.anims.stop();
        this.body.enable = false;

        this.scene.tweens.add({
            targets: this,
            y: this.y - 50,
            angle: 180,
            duration: 200,
            ease: "Power1.easeOut",
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    y: 800,
                    angle: 360,
                    duration: 500,
                    ease: "Power1.easeIn",
                    onComplete: () => {
                        this.destroy();
                    }
                });
            }
        });
    }

    update(player) {
        if (this.isDead) return;
    }
}
