export default class GameFlowController {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
  }

  registerPlayerEvents() {
    this.scene.player.on("late", () => this.gameOver());
  }

  handleEnemyStomp(enemy, player) {
    this.scene.enemyDownSound.play();
    player.setVelocityY(-300);

    if (typeof enemy.die === "function") {
      enemy.die();
    } else {
      enemy.destroy();
    }
  }

  handlePlayerDamage(player, damageSource) {
    if (!damageSource || typeof damageSource.getDamage !== "function") return;

    const damage = damageSource.getDamage();
    if (typeof damage !== "number" || !Number.isFinite(damage) || damage < 0) {
      throw new TypeError("Damage must be a non-negative finite number.");
    }

    player.takeDamage(damage);
  }

  enterPipe(warpData) {
    const scene = this.scene;
    if (scene.isWarping) return;
    scene.isWarping = true;
    scene.player.canMove = false;
    scene.player.body.enable = false;
    scene.player.setVelocity(0, 0);

    scene.tweens.add({
      targets: scene.player,
      y: scene.player.y + scene.TILE + 30,
      duration: 400,
      onComplete: () => {
        scene.player.setPosition(
          scene.getPixelX(warpData.exitX),
          scene.getPixelY(warpData.exitY)
        );
        scene.player.body.enable = true;
        scene.player.setVelocity(0, 0);
        scene.time.delayedCall(500, () => {
          scene.player.canMove = true;
          scene.isWarping = false;
        });
      },
    });
  }

  gameOver() {
    const scene = this.scene;
    if (scene.isGameOver) return;

    scene.isGameOver = true;
    scene.sound.stopAll();
    scene.gameoverSound.play({ loop: false, volume: 0.8 });
    scene.physics.pause();
    scene.enemies.getChildren().forEach((enemy) => enemy.anims?.pause());
    scene.player.setVelocity(0, 0);
    scene.cameras.main.shake(300, 0.03);

    scene.time.delayedCall(1000, () => {
      scene.physics.resume();
      scene.physics.world.timeScale = 2;
      scene.player.body.enable = false;
      scene.player.setVelocity(150, -400);
      scene.player.setAngularVelocity(600);
      scene.player.setGravityY(1200);

      this.gameState.resetPlayerData();
      scene.scene.start("ResultScene", {
        paidHolidays: this.gameState.getPaidHolidays(),
        stageNumber: scene.stageNumber,
      });
    });
  }

  nextStage() {
    const scene = this.scene;
    scene.sound.stopAll();
    if (scene._cleared) return;
    scene._cleared = true;

    if (scene.stageNumber === 3) {
      scene.physics.pause();
      scene.input.enabled = false;
      scene.scene.launch("StageClearTransitionScene", { next: "OfficeScene" });
      return;
    }

    const nextStage = scene.stageNumber + 1;
    this.gameState.setCurrentStage(nextStage);
    scene.scene.start("GameScene", { stageNumber: nextStage });
  }
}
