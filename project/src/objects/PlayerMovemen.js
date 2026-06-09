import Phaser from "phaser";
 
export default class PlayerMovement {
  constructor(scene) {
    this.scene = scene;
 
    this.idleFrame = {
      left: 1,
      right: 4,
      up: 7,
      down: 10
    };
 
    this.lastFacing = 'right';//最初の向きの初期値
  }
 
  createAnimations() {
    // 左向き歩行
    this.scene.anims.create({
      key: 'player-walk-left',
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 0,
        end: 2
      }),
      frameRate: 8,
      repeat: -1,
    });
 
    // 右向き歩行
    this.scene.anims.create({
      key: 'player-walk-right',
      frames: this.scene.anims.generateFrameNumbers('player', {
        start: 3,
        end: 5
      }),
      frameRate: 8,
      repeat: -1,
    });
  }
 
  move(player, cursors) {
 
  const onFloor =
    player.body.blocked.down ||
    player.body.touching.down;
 
  // 左
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
 
    if (onFloor) {
      player.anims.play('player-walk-left', true);
    }
 
    this.lastFacing = 'left';
  }
 
  // 右
  else if (cursors.right.isDown) {
    player.setVelocityX(160);
 
    if (onFloor) {
      player.anims.play('player-walk-right', true);
    }
 
    this.lastFacing = 'right';
  }
 
  // 停止
  else {
    player.setVelocityX(0);
 
    if (onFloor) {
      const idle = this.idleFrame[this.lastFacing];
      player.setFrame(idle);
    }
  }
 
  // ジャンプ
  if (Phaser.Input.Keyboard.JustDown(cursors.up) && onFloor){
    player.setVelocityY(-300);
  }
 
  // 空中
  if (!onFloor) {
    player.anims.stop();
    }
}
}
 