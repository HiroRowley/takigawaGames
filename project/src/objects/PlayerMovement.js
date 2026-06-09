import Phaser from "phaser";

export default class PlayerMovement {
  constructor(scene) {
    this.scene = scene;

    // 待機フレーム（3コマしかないので、真ん中の1番を待機にする）
    this.idleFrame = 1; 

    this.lastFacing = 'right';
  }

 createAnimations() {
    // 既に存在する場合は作成しない
    if (this.scene.anims.exists('player-walk')) return;

    // 歩行アニメーション（0 -> 1 -> 2 -> 1 の順で滑らかにループさせる）
    this.scene.anims.create({
      key: 'player-walk',
      frames: [
        { key: 'player', frame: 0 },
        { key: 'player', frame: 1 },
        { key: 'player', frame: 2 },
        { key: 'player', frame: 1 }
      ],
      frameRate: 8, // 元の10だと少し速すぎるかもしれないので、8〜10でお好みで調整してください
      repeat: -1,   // 無限ループ
    });
  }

  move(player, cursors) {
    const onFloor = player.body.blocked.down || player.body.touching.down;

    // 左移動
    if (cursors.left.isDown) {
      player.setVelocityX(-player.moveSpeed);
      player.setFlipX(true); // 画像を左に反転

      if (onFloor) {
        player.anims.play('player-walk', true);
      }
      this.lastFacing = 'left';
    }
    // 右移動
    else if (cursors.right.isDown) {
      player.setVelocityX(player.moveSpeed);
      player.setFlipX(false); // 画像を右向き（元のまま）に戻す

      if (onFloor) {
        player.anims.play('player-walk', true);
      }
      this.lastFacing = 'right';
    }
    // 停止
    else {
      player.setVelocityX(0);

      if (onFloor) {
        player.anims.stop();
        player.setFrame(this.idleFrame); // 待機フレームを表示
      }
    }

    // ジャンプ（ JustDown を使うことで1回押しに対応）
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && onFloor) {
      player.setVelocityY(-player.jumpPower);
      this.scene.events.emit('playerjump');
    }

    // 空中での制御
    if (!onFloor) {
      player.anims.stop();
      // ジャンプ中は真ん中のコマで固定するなどの演出
      player.setFrame(0);
    }
  }
}