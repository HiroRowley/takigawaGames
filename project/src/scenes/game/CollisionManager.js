import Shimba from "../../objects/enemy/Shimba.js";

export default class CollisionManager {
  constructor(scene) {
    this.scene = scene;
  }

  register() {
    const scene = this.scene;
    const { physics, player } = scene;

    physics.add.collider(player, scene.grounds);
    physics.add.collider(scene.enemies, scene.grounds);
    physics.add.collider(scene.banes, scene.grounds);

    physics.add.overlap(player, scene.enemies, (target, enemy) => {
      const canStomp =
        !(enemy instanceof Shimba) &&
        target.body.velocity.y > 0 &&
        target.body.bottom <= enemy.body.top + 15;

      if (canStomp) {
        scene.handleEnemyStomp(enemy, target);
      } else {
        scene.handlePlayerDamage(target, enemy);
      }
    });

    physics.add.overlap(
      player,
      scene.lasers,
      scene.handlePlayerDamage,
      null,
      scene
    );
    physics.add.overlap(
      player,
      scene.bullets,
      scene.handlePlayerDamage,
      null,
      scene
    );

    physics.add.collider(player, scene.blocks, (target, block) => {
      const hitFromBelow =
        target.body.touching.up && block.body.touching.down;
      if (hitFromBelow && typeof block.hit === "function") {
        block.hit(target);
      }
    });

    if (scene.goalZone) {
      physics.add.overlap(player, scene.goalZone, () => scene.nextStage());
    }

    physics.add.collider(scene.uenos, scene.yoshidas, (_ueno, yoshida) => {
      yoshida.direction *= -1;
      yoshida.x += yoshida.direction === 1 ? 4 : -4;
    });

    physics.add.overlap(player, scene.pipeWarps, (_target, pipe) => {
      if (scene.cursors.down.isDown) {
        scene.enterPipe(pipe.warpData);
      }
    });

    physics.add.collider(player, scene.banes, (target, bane) => {
      if (target.body.velocity.y > 0 && typeof bane.bounce === "function") {
        bane.bounce(target);
      }
    });

    physics.add.collider(player, scene.traps, (target, trap) => {
      const hitFromBelow =
        target.body.touching.up && trap.body.touching.down;
      if (hitFromBelow && typeof trap.hit === "function") {
        trap.hit(target);
      }
    });

    physics.add.overlap(player, scene.clouds, (target, cloud) => {
      cloud.onPlayerOverlap?.(target);
    });

    physics.add.overlap(player, scene.traps, (target, trap) => {
      trap.activate?.(target);
    });

    physics.add.overlap(player, scene.blocks, (target, block) => {
      if (!block.hidden) return;

      const hitFromBelow =
        target.body.velocity.y < 0 &&
        target.body.touching.up &&
        block.body.touching.down;
      if (hitFromBelow && typeof block.hit === "function") {
        block.hit(target);
      }
    });
  }
}
