import Phaser from "phaser";
 
export default class EndingScene extends Phaser.Scene {

    constructor() {

        super("EndingScene");

    }
 
    create() {

        this.cameras.main.setBackgroundColor("#000");
 
        // ベースとなる共通のテキストスタイルを定義しておくと便利です

        const normalStyle = { fontSize: "24px", color: "#ffffff", align: "center" };

        const titleStyle = { fontSize: "32px", color: "#aaaaaa", align: "center", fontStyle: "italic" };

        const emphasisStyle = { fontSize: "36px", color: "#ffff00", align: "center", fontStyle: "bold" }; // 強調用！
 
        // 1. 作成者のブロック (y: 0)

        const creatorsText = this.add.text(0, 0, 

            "作成者\n\n田崎：stagesクラス enemyクラス\n\nローリー：ZOSSローリー レビュー全般\n\n上野：scenesクラス isu.js", 

            normalStyle

        ).setOrigin(0.5);
 
        // 2. 言語・フレームワークのブロック (y: 250)

        const techText = this.add.text(0, 250, 

            "使用言語：JavaScript\n\nフレームワーク：Phaser", 

            normalStyle

        ).setOrigin(0.5);
 
        // 3. 使用素材のブロック (y: 400)

        const assetsText = this.add.text(0, 400, 

            "使用素材：魔王魂 効果音ラボ", 

            normalStyle

        ).setOrigin(0.5);
 
        // 4. Special Thanks タイトル (y: 550)

        const stTitleText = this.add.text(0, 550, 

            "- Special Thanks -", 

            titleStyle

        ).setOrigin(0.5);
 
        // 5. ★強調したい人たちのブロック★ (y: 650)

        const stNamesText = this.add.text(0, 650, 

            "滝川 雅晴 さん\n\nテストプレイしてくれた26卒の皆様", 

            emphasisStyle

        ).setOrigin(0.5);
 
        // 6. 全てのテキストをコンテナにまとめる

        // 画面の下端（y=700など、画面サイズに合わせて調整）からスタートさせます

        const creditsContainer = this.add.container(400, 700, [

            creatorsText, 

            techText, 

            assetsText, 

            stTitleText, 

            stNamesText

        ]);
 
        // 7. スクロールさせる

        this.tweens.add({

            targets: creditsContainer,

            // 文字量が増えて縦に長くなったので、移動距離（y）を大きくして上までしっかり流し切る

            y: -1000, 

            // 文字数が多いので、ゆっくり読めるように時間も長くしました（15秒 = 15000ミリ秒）

            duration: 15000, 

            onComplete: () => {

                // エンドロールが終わった後の処理（タイトルに戻るなど）をここに書けます

                console.log("エンドロール終了！");

                this.scene.start("VideoScene");
            }

        });

    }

}
 