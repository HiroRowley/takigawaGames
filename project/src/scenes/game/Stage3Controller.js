import Phaser from "phaser";
import Noda from "../../objects/enemy/Noda.js";
import Rowley from "../../objects/enemy/Rowley.js";
import Timer from "../../timer/Timer.js";

export default class Stage3Controller {
  constructor(scene) {
    this.scene = scene;
  }

  create() {
    if (this.scene.stageNumber !== 3) return;

    this.scene.timer = new Timer(this.scene, 30);
    this.scene.timer.onTimeUp(() => this.spawnGoal());
  }

  update(time) {
    if (this.scene.stageNumber !== 3) return;

    this.scene.timer?.update();
    const hasRowley = this.scene.enemies
      .getChildren()
      .some((enemy) => enemy instanceof Rowley);

    if (hasRowley && time > this.scene.enemySpawnTimer) {
      this.scene.enemySpawnTimer = time + 4000;
      this.spawnEnemy();
    }
  }

  spawnEnemy() {
    const enemy = new Noda(
      this.scene,
      Phaser.Math.Between(100, 700),
      0
    );
    this.scene.enemies.add(enemy);
  }

  spawnGoal() {
    const scene = this.scene;
    const employeeCard = scene.add.image(
      scene.getPixelX(23),
      -100,
      "syainsyo"
    );
    employeeCard.setDisplaySize(64, 64).setDepth(1000);

    scene.tweens.add({
      targets: employeeCard,
      y: 370,
      duration: 4500,
      ease: "Power2",
      onComplete: () => {
        scene.physics.add.existing(employeeCard, true);
        scene.physics.add.overlap(scene.player, employeeCard, () => {
          if (scene.isClearing) return;
          scene.isClearing = true;
          employeeCard.destroy();
          scene.nextStage();
        });
      },
    });
  }
}
