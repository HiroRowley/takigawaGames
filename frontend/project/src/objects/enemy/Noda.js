import EnemyBase from "./EnemyBase.js";

export default class Noda extends EnemyBase {
    constructor(scene, x, y) {
        super(scene, x, y, "noda", {
            animation: {
                frames: [0, 1, 2, 3, 4, 5, 6, 7],
                frameRate: 10,
            },
            idleFrame: 0,
            flipXWhenMovingRight: true,
        });

        this.speed = 150;
        this.attackPower = 1;
        this.direction = -1;

        this.setDisplaySize(42, 64);
        this.setBodyDisplaySize(32, 58);
    }

    update(player) {
        super.update(player);

        if (!this.isDead) {
            this.movement.moveWalker(this);
        }
    }
}
