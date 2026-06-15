# 前回から現在までの変更点

## 対象範囲

- 変更前: `45ae153` Stage3クリア後のエンディング演出を追加
- 変更後: `3d5e430` GameSceneの責務を分離して状態管理とテストを整備
- 変更規模: 23ファイル、1,160行追加、1,441行削除

## 変更目的

肥大化していた `GameScene.js` の責務を分離し、状態の持ち越しによるバグを防止しました。あわせて、HP・ステージデータ・ダメージ処理の入力検証と自動テストを追加しています。

## GameSceneの責務分離

`GameScene.js` が直接担当していた処理を、次のクラスへ分離しました。

| クラス | 責務 |
| --- | --- |
| `GameAssetLoader` | ゲームで使用する画像・音声の読み込み |
| `StageRepository` | Stage1～3の取得とデータの正規化 |
| `StageBuilder` | 地面、装飾、土管、ワープ領域の生成 |
| `GameObjectFactory` | プレイヤー、敵、罠、ブロック、ゴールの生成 |
| `CollisionManager` | 敵、罠、弾、土管、ゴールの衝突判定登録 |
| `GameFlowController` | ダメージ、ゲームオーバー、ステージ遷移、ワープ |
| `Stage3Controller` | タイマー、雑魚生成、社員証出現などStage3固有処理 |
| `GameHUD` | HPと有給の画面表示 |
| `GameAudioController` | 効果音の生成とステージ別BGM再生 |

現在の `GameScene` は、Phaserのライフサイクルと各担当クラスの呼び出し順を主に管理します。

```text
GameScene
├─ init()      シーン状態を初期化
├─ preload()   アセット読み込みを依頼
├─ create()    各担当クラスを生成・実行
└─ update()    プレイヤー、敵、Stage3、HUDを更新
```

## 状態管理

### GameStateの追加

`DataManager.js` に直接記述されていた状態管理を `GameState.js` へ移しました。

- HP
- 有給数
- 現在ステージ
- リスポーン対象ステージ
- 遅刻回数
- Shimba用カウンター

`DataManager.js` は、ゲーム設定から `GameState` のインスタンスを生成して公開するだけの役割になりました。

### 入力値の検証

次の不正値を状態へ設定できないようにしました。

- `null`
- 空文字
- `NaN`
- `Infinity`
- 0以下または小数のステージ番号

有給数については、仕様どおり死亡による負数を許可しています。

### シーン状態の初期化

`createGameSceneState.js` を追加し、ステージ開始ごとに次の値を初期化するようにしました。

- `_cleared`
- `isGameOver`
- `isClearing`
- `isWarping`
- `enemySpawnTimer`
- `timer`
- `stageData`
- `goalData`

これにより、前のステージの状態が次のステージへ残る問題を防止しています。

## バグ修正

### HP処理

- `setHP()` が常に固定値を設定する問題を修正
- ダメージに応じてHPが減少するように修正
- HPが0未満にならないように制限
- ダメージ値が不正な場合は明確な例外を送出

### ダメージ元の伝播

`GameScene` から `Player.takeDamage()` へダメージ元を渡すようにしました。これにより、攻撃元の位置を使ったノックバックが機能します。

### Cloudの接触処理

- 到達不能だったCloud固有の接触処理を修正
- Cloudを専用グループで判定
- Cloud自身をダメージ元としてPlayerへ渡すように変更
- 未使用のimportと空の `update()` を削除

### Stage2からStage3への遷移

ステージクリア済みフラグが次のステージへ残り、Stage2からStage3へ進めなくなる問題を修正しました。

### 物理状態の復元

シーン開始時に物理処理、入力、物理時間倍率を通常状態へ戻すようにしました。ゲームオーバーやStage3終了後の状態が再利用されることを防ぎます。

## Rowley

実際の行動を制御していなかった次のフェーズ管理を削除しました。

- `phase`
- `phaseTimer`
- `move / laser / dash` の見かけ上の切り替え処理

Rowleyを倒せない仕様と、既存のレーザー・移動・ダッシュ処理は維持しています。

## ステージデータ検証

`validateStageData.js` を追加し、ステージ生成前に以下を確認します。

- ステージデータの存在
- 正しいタイルサイズ
- プレイヤー初期位置
- 配列項目の型
- ゴール座標
- ゴールの幅と高さ

未登録ステージや不正データの場合、後続処理で不明瞭なエラーを起こさず、原因を示す例外を送出します。

## テスト

Node.js標準のテストランナーを使用したテストを追加しました。新しい依存パッケージはありません。

### テスト対象

- HP減少と0未満の防止
- 状態値の不正入力
- 有給の負数許可
- ステージ番号の検証
- シーン開始時の状態初期化
- Stage1～3のデータ検証
- StageRepositoryの正規化
- 二重ステージ遷移の防止
- Stage3からエンディングへの遷移

### 実行結果

```text
npm test
13 tests passed
```

```text
npm run build
build succeeded
```

## package.json

追加したのは実行スクリプトだけです。

```json
{
  "scripts": {
    "dev": "vite",
    "test": "node --test --test-isolation=none",
    "build": "vite build"
  }
}
```

- 新しい依存パッケージなし
- `package-lock.json` の変更なし
- `npm install` 不要

## 現在の構成

```text
project/
├─ src/
│  ├─ managers/
│  │  ├─ DataManager.js
│  │  └─ GameState.js
│  ├─ scenes/
│  │  ├─ GameScene.js
│  │  ├─ createGameSceneState.js
│  │  └─ game/
│  │     ├─ CollisionManager.js
│  │     ├─ GameAssetLoader.js
│  │     ├─ GameAudioController.js
│  │     ├─ GameFlowController.js
│  │     ├─ GameHUD.js
│  │     ├─ GameObjectFactory.js
│  │     ├─ Stage3Controller.js
│  │     ├─ StageBuilder.js
│  │     └─ StageRepository.js
│  └─ stages/
│     ├─ Stage1.js
│     ├─ Stage2.js
│     ├─ Stage3.js
│     └─ validateStageData.js
└─ test/
   ├─ GameFlowController.test.js
   ├─ GameState.test.js
   ├─ StageRepository.test.js
   ├─ createGameSceneState.test.js
   └─ validateStageData.test.js
```



