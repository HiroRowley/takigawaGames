
import Phaser from "phaser";
import { getWorstScore } from "../scoreAPI";

export default class TitleScene extends Phaser.Scene {

    constructor() {

        super("TitleScene");
    }

    preload() {

        // 音声読み込み
        this.load.audio(
            "pressButton",
            "asset/sounds/pressButton.mp3"
        );

        // タイトル画像読み込み
        this.load.image(
            "titleLogo",
            "asset/title/タイトル.png"
        );
    }

    async create() {

        // 効果音生成
        this.pressButtonSound =
            this.sound.add("pressButton");

        // 画面サイズ取得
        const width = this.scale.width;
        const height = this.scale.height;

        // 背景画像
        const bg = this.add.image(
            width / 2,
            height / 2,
            "titleLogo"
        );

        // 必要なら画面フィット
        // bg.setDisplaySize(width, height);

        // =========================
        // 最悪記録取得
        // =========================

        let worstScoreText =
            "最大欠勤数 : 0";

        try {

            const data =
                await getWorstScore();

            // nullチェック
            if (
                data &&
                data.score !== undefined
            ) {

                worstScoreText =
                    `歴代総欠勤数 : ${data.score}`;
            }

        } catch (error) {

            console.error(
                "API取得失敗",
                error
            );
        }

        // =========================
        // スコア表示
        // =========================

        this.add.text(
            width / 2,
            height - 80,
            worstScoreText,
            {
                fontSize: "32px",
                color: "#ffffff",

                stroke: "#000000",
                strokeThickness: 6,

                fontStyle: "bold"
            }
        )
        .setOrigin(0.5);

        // =========================
        // Enter監視
        // =========================

        this.input.keyboard.on(
            "keydown-ENTER",
            () => {

                this.startGame();
            }
        );
    }

    // =========================
    // ゲーム開始
    // =========================

    startGame() {

        this.pressButtonSound.play({
            volume: 0.5
        });

        this.scene.start(
            "GameScene",
            {
                stage: 1
            }
        );
    }
}

