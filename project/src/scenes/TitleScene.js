import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super("TitleScene");
    }

    preload() {
        // 音声の読み込み
        this.load.audio(
            "pressButton",
            "asset/sounds/pressButton.mp3"
        );

        // タイトル画像の読み込み
        this.load.image(
            "titleLogo", 
            "asset/title/タイトル.png"
        );
    }

    create() {
        this.pressButtonSound = this.sound.add("pressButton");

        // 画面の幅と高さを自動取得
        const width = this.scale.width;
        const height = this.scale.height;

        // ==========================================
        // 【修正】画像を画面の真ん中にぴったり配置
        // ==========================================
        // 50, 50 からの配置ではなく、画面の中央（width/2, height/2）に配置します。
        const bg = this.add.image(width / 2, height / 2, "titleLogo");

        // 💡 もし画像が画面より大きすぎたり小さすぎたりする場合は、
        // 以下の行の先頭の「//」を消して有効化してください。画面サイズに強制フィットさせます。
        // bg.setDisplaySize(width, height);


        // ==========================================
        // 【修正】テキスト描画（this.add.text）を削除
        // ==========================================
        // 画像側に「滝川さんの大出勤」も「Press Enter to start」も
        // 最初から書き込まれているため、ここのテキスト処理はすべて不要になります。


        // Enter監視（この処理はそのまま残します）
        this.input.keyboard.on("keydown-ENTER", () => {
            this.startGame();
        });
    }

    // =========================
    // ゲーム開始
    // =========================
    startGame() {
        this.pressButtonSound.play({
            volume: 0.5
        });

        this.scene.start("GameScene", {
            stage: 1
        });
    }
}