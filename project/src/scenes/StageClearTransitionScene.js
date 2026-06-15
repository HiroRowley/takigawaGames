import Phase from "phaser";

export default class StageClearTransitionScene extends Phaser.Scene {
    create() {
        const white = this.add.rectangle(
            0, 0,
            this.scale.width,
            this.scale.height,
            0xffffff
        ).setOrigin(0);

        white.alpha = 0;

        this.tweens.add({
            targets: white,
            alpha: 1,
            duration: 2000,
            onComplete: () => {
                this.scene.start("OfficeScene");
            }
        });
    }
}