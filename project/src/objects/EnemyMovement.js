import Phaser from "phaser";

export default class EnemyMovement {
  constructor(scene) {
    this.scene = scene;
  }

  // =========================
  // アニメーション作成
  // =========================
  createAnimations(textureKey) {
    const animKey = `${textureKey}-walk`;
    
    // 既に存在する場合は作成しない
    if (this.scene.anims.exists(animKey)) return;

    // 0 -> 1 -> 2 -> 1 の順で滑らかにループ（主人公と同じ3コマ構成を想定）
    this.scene.anims.create({
      key: animKey,
      frames: [
        { key: textureKey, frame: 0 },
        { key: textureKey, frame: 1 },
        { key: textureKey, frame: 2 },
        { key: textureKey, frame: 1 }
      ],
      frameRate: 8,
      repeat: -1,
    });
  }

  // =========================
  // クリボー系 noda（基本移動）
  // =========================
  moveWalker(enemy) {
    if (enemy.isDead) return;

    // 物理移動
    enemy.setVelocityX(enemy.speed * enemy.direction);

    // 壁衝突で反転
    this.handleWallCollision(enemy);

    // 向きに応じて画像を反転 (元の画像が左向きなら、右移動(direction=1)のときにflipX=true)
    enemy.setFlipX(enemy.direction === 1);

    // 地地にいるなら歩行アニメーション再生
    const onFloor = enemy.body.blocked.down || enemy.body.touching.down;
    if (onFloor) {
      enemy.anims.play(`${enemy.texture.key}-walk`, true);
    } else {
      enemy.anims.stop();
      enemy.setFrame(1); // 空中では中間フレーム
    }
  }

  // =========================
  // ジャンプ追従型 yoshida (ひな型)
  // =========================
  moveJumper(enemy, player) {
    if (enemy.isDead) return;
    // 今後ここにジャンプAIを実装
  }

  // =========================
  // 射撃型 ueno (ひな型)
  // =========================
  moveShooter(enemy, player) {
    if (enemy.isDead) return;
    // 今後ここに射撃AIを実装
  }

  // =========================
  // 土管から出てくる敵 shimba (ひな型)
  // =========================
  pipeEnemy(enemy) {
    if (enemy.isDead) return;
    // 今後ここに土管AIを実装
  }

  // =========================
  // 共通ユーティリティ
  // =========================
  handleWallCollision(enemy) {
    if (enemy.body.blocked.left) {
      enemy.direction = 1;
    } else if (enemy.body.blocked.right) {
      enemy.direction = -1;
    }
  }

  detectPlayer(enemy, player) {
    // プレイヤーとの距離計算用
    return Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
  }
}