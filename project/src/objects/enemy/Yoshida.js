import EnemyBase from "./EnemyBase.js";

export default class Yoshida extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, "yoshida", {
            animation: {
                frames: [
                    "yoshida",
                    "yoshida-walk-2",
                    "yoshida-walk-3",
                    "yoshida-walk-4",
                    "yoshida-walk-3",
                    "yoshida-walk-2",
                ],
                frameRate: 8,
            },
            flipXWhenMovingRight: false,
            idleTextureKey: "yoshida",
        });

        this.speed = 150;
        this.attackPower = 1;
        this.direction = -1;
        this.jumpVelocity = -500;

        this.setDisplaySize(76, 65);
        this.setBodyDisplaySize(46, 58);

        this.scene.events.on("playerjump", this.respondToPlayerJump, this);

        this.on("destroy", () => {
            this.scene.events.off("playerjump", this.respondToPlayerJump, this);
        });
    }

    respondToPlayerJump() {
        if (this.isDead || !this.body.blocked.down) return;
        this.setVelocityY(this.jumpVelocity);
    }

    update(player) {
        super.update(player);

        if (!this.isDead) {
            this.movement.moveWalker(this);
        }
    }
}
