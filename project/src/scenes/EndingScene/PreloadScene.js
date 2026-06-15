import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        console.log("アセット読み込み中...");

        // ここに全部まとめる
        this.load.image("checkIn", "asset/checkIn.png");
        this.load.image("takigawaWalk02", "asset/takigawa/Animation/takigawaWalk02.png");

        // 既存のやつもここに移す
        this.load.image("player", "asset/takigawa/player.png");
    }

    create() {
        this.scene.start("TitleScene");
    }
}