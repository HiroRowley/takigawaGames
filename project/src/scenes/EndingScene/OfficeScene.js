import Phaser from "phaser";

export default class OfficeScene extends Phaser.Scene {
  constructor() {
    super("OfficeScene");
  }

  preload() {
    this.load.image("checkIn", "asset/checkIn.png");
    this.load.image(
      "endingTakigawa",
      "asset/takigawa/Animation/takigawaWalk02.png"
    );
  }

  create() {
    this.cameras.main.setBackgroundColor("#ffffff");
    this.reachedGoal = false;

    const centerY = this.scale.height / 2;
    const goalX = this.scale.width - 160;

    this.goal = this.physics.add.staticImage(goalX, centerY, "checkIn");
    this.goal.setDisplaySize(80, 80);

    this.player = this.physics.add.sprite(100, centerY, "endingTakigawa");
    this.player.setDisplaySize(90, 140);
    this.player.setCollideWorldBounds(true);
    this.player.body.setAllowGravity(false);

    this.physics.add.overlap(this.player, this.goal, () => {
      if (this.reachedGoal) return;
      this.reachedGoal = true;
      this.player.setVelocity(0);
      this.time.delayedCall(2000, () => this.scene.start("EndingScene"));
    });
  }

  update() {
    if (!this.reachedGoal) {
      this.player.setVelocityX(200);
    }
  }
}
