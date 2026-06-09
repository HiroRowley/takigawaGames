import Phaser from "phaser";
 
export default class EnemyMovement {
  constructor(scene) {
    this.scene = scene;
  }
 
  // =========================
  // アニメーション作成
  // =========================
  createAnimations() {
    this.scene.anims.create({
      key: 'enemy-walk',
      frames: this.scene.anims.generateFrameNumbers('enemy', {
        start: 0,
        end: 2
      }),
      frameRate: 6,
      repeat: -1,
    });
  }
 
  // =========================
  // 更新処理（毎フレーム）
  // =========================
  update(enemy) {
    // ここで敵タイプを判定して動きを切り替える
  }
 
  // =========================
  // クリボー系 noda（基本移動）
  // =========================
  moveWalker(enemy) {
    enemy.setVelocityX(-50);
    enemy.anims.play('enemy-walk', true);
  }
 
  // =========================
  // ジャンプ追従型 yoshida
  // =========================
  moveJumper(enemy, player) {
    // ひな型（まだ未実装）
    // 例：距離を見てジャンプする
  }
 
  jumpBehavior(enemy) {
    // ジャンプ処理だけ分離
  }
 
  // =========================
  // 射撃型 ueno
  // =========================
  moveShooter(enemy, player) {
    // 移動しない
  }
 
  shoot(enemy, player) {
    // ゾスを発射する処理
  }
 
  // =========================
  // 土管から出てくる敵　shimba
  // =========================
  pipeEnemy(enemy) {
    //初期は土管内で待機
  }
 
  pipeSpawn(enemy) {
    //一定時間ごとに上に出てくる
  }
 
  pipeHide(enemy) {
    //土管に戻る処理
  }
 
  // =========================
  // 共通ユーティリティ
  // =========================
  flipDirection(enemy) {
    // 壁に当たったら反転など
  }
 
  detectPlayer(enemy, player) {
    // プレイヤー検知（距離計算など）
  }
}