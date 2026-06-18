
import Phaser from "phaser";

import { saveScore } from "../../scoreAPI.js";

import DataManager
from "../../managers/DataManager";

export default class VideoScene extends Phaser.Scene {

    constructor() {

        super("VideoScene");
    }

    preload() {

        this.load.video(
            "endingVideo",
            "asset/ending.mp4"
        );
    }

    create() {

        this.cameras.main.setBackgroundColor("#000000");

        const video = this.add
            .video(
                this.scale.width / 2,
                this.scale.height / 2,
                "endingVideo"
            )
            .setOrigin(0.5);

        video.on("play", () => {

            const scale = Math.min(
                this.scale.width / video.width,
                this.scale.height / video.height
            );

            video.setScale(scale);
        });

        video.play();

        // =========================
        // 動画終了
        // =========================

        video.once(
            "complete",
            async () => {

                try {

                    // 欠勤回数送信
                    await saveScore(
                        DataManager.getPaidHolidays()
                    );

                    console.log(
                        "スコア送信成功"
                    );

                } catch (error) {

                    console.error(
                        "スコア送信失敗",
                        error
                    );
                }

                // リロード
                window.location.reload();
            }
        );
    }
}

