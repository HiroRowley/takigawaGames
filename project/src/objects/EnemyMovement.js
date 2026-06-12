import Phaser from "phaser";

export default class EnemyMovement {
  constructor(scene) {
    this.scene = scene;
  }

  createAnimations(textureKey, config = null) {
    if (!config) return null;

    const animKey = `${textureKey}-walk`;

    if (this.scene.anims.exists(animKey)) return animKey;

    const frames = this.getAnimationFrames(textureKey, config.frames);
    if (frames.length === 0) return null;

    this.scene.anims.create({
      key: animKey,
      frames,
      frameRate: config.frameRate ?? 8,
      repeat: config.repeat ?? -1,
    });

    return animKey;
  }

  getAnimationFrames(textureKey, frames) {
    if (!Array.isArray(frames)) return [];

    return frames
      .map((frame) => this.normalizeFrame(textureKey, frame))
      .filter((frame) => frame !== null);
  }

  normalizeFrame(textureKey, frame) {
    if (typeof frame === "number") {
      const texture = this.scene.textures.get(textureKey);
      return texture?.has(frame) ? { key: textureKey, frame } : null;
    }

    if (typeof frame === "string") {
      if (!this.scene.textures.exists(frame)) return null;

      const texture = this.scene.textures.get(frame);
      return { key: frame, frame: texture.firstFrame };
    }

    if (frame?.key) {
      if (!this.scene.textures.exists(frame.key)) return null;

      const texture = this.scene.textures.get(frame.key);
      if (frame.frame === undefined) return { key: frame.key, frame: texture.firstFrame };

      return texture?.has(frame.frame) ? { key: frame.key, frame: frame.frame } : null;
    }

    return null;
  }

  moveWalker(enemy) {
    if (enemy.isDead) return;

    enemy.setVelocityX(enemy.speed * enemy.direction);
    this.handleWallCollision(enemy);
    this.applyDirectionFlip(enemy);

    const onFloor = enemy.body.blocked.down || enemy.body.touching.down;
    if (onFloor && enemy.walkAnimationKey && this.scene.anims.exists(enemy.walkAnimationKey)) {
      enemy.anims.play(enemy.walkAnimationKey, true);
    } else {
      enemy.anims.stop();
      this.setIdleFrame(enemy);
    }
  }

  applyDirectionFlip(enemy) {
    if (enemy.autoFlip === false) return;

    const flipXWhenMovingRight = enemy.flipXWhenMovingRight ?? true;
    enemy.setFlipX(enemy.direction === 1 ? flipXWhenMovingRight : !flipXWhenMovingRight);
  }

  setIdleFrame(enemy) {
    const textureKey = enemy.idleTextureKey || enemy.texture.key;
    if (!this.scene.textures.exists(textureKey)) return;

    if (enemy.idleFrame !== undefined && enemy.idleFrame !== null) {
      const texture = this.scene.textures.get(textureKey);
      if (texture?.has(enemy.idleFrame)) {
        enemy.setTexture(textureKey, enemy.idleFrame);
        return;
      }
    }

    enemy.setTexture(textureKey);
  }

  moveJumper(enemy, player) {
    if (enemy.isDead) return;
  }

  moveShooter(enemy, player) {
    if (enemy.isDead) return;
  }

  pipeEnemy(enemy) {
    if (enemy.isDead) return;
  }

  handleWallCollision(enemy) {
    if (enemy.body.blocked.left) {
      enemy.direction = 1;
    } else if (enemy.body.blocked.right) {
      enemy.direction = -1;
    }
  }

  detectPlayer(enemy, player) {
    return Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
  }
}
