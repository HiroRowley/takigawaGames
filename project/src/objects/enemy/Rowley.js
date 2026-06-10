import EnemyBase from "./EnemyBase.js";

export default class Rowley extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, "rowley", {
            animation: {
                frames: [0, 1, 0, 1],
                frameRate: 6,
            },
            idleFrame: 0,
            flipXWhenMovingRight: true,
        });

        this.speed = 120;
        this.attackPower = 1;
        this.direction = -1;

        this.setFrame(0);
        this.setDisplaySize(56, 92);
        this.setBodyDisplaySize(42, 82);
    }

    update(player) {
        super.update(player);

        if (!this.isDead) {
            this.movement.moveWalker(this);
        }
    }
}
