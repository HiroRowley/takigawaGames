import Phaser from "phaser";

export default class Timer {
    constructor(scene, duration = 30) {
        this.scene = scene;
        this.duration = duration;

        this.startTime = 0;
        this.running = false;

        const { width } = this.scene.cameras.main;

        // ⭐ 共通位置（ここだけ変えれば全部動く）
        this.baseX = width / 2;
        this.baseY = 120;

        // 🟡 開始メッセージ（同じ位置）
        this.startText = this.scene.add.text(
            this.baseX,
            this.baseY,
            "30秒耐えろ！",
            {
                fontSize: "40px",
                color: "#ffffff",
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: { x: 16, y: 10 }
            }
        ).setOrigin(0.5);

        this.startText.setDepth(9999);

        this.text = null;

        this.scene.time.delayedCall(2000, () => {
            this.startText.destroy();
            this.createTimerText();
            this.start();
        });
    }

    createTimerText() {
        this.text = this.scene.add.text(
            this.baseX,
            this.baseY,   // ⭐ 完全に同じ位置
            this.duration.toFixed(2),
            {
                fontSize: "48px",
                color: "#ff0000",
                fontStyle: "bold",
            }
        ).setOrigin(0.5);

        this.text.setDepth(9999);
    }

    start() {
        this.startTime = this.scene.time.now;
        this.running = true;
    }

    update() {
        if (!this.running || !this.text) return;

        const elapsed = (this.scene.time.now - this.startTime) / 1000;
        const remaining = Math.max(this.duration - elapsed, 0);

        this.text.setText(remaining.toFixed(2));

        if (remaining <= 0) {
            this.running = false;
            this.onTimeout?.();
            this.text.setText("0.00");
        }
    }

    onTimeUp(callback) {
        this.onTimeout = callback;
    }
}