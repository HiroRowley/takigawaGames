import System from "../system/System.js";

/**
 * DataManager
 * =========================
 * ■ 役割
 * - プレイヤーの「状態」を管理する唯一の場所
 * - ステージ進行管理
 * - リトライ時のリセット処理
 *
 * ■ 重要思想（I Wanna系）
 * - 「死にゲー前提」なので状態管理はシンプルにする
 * - ロジックは持たない（絶対に）
 */

class DataManager {
  constructor() {
    // =========================
    // ■ プレイヤー状態
    // =========================
    this.hp = System.CONFIG.PLAYER.MAX_HP;

    // =========================
    // ■ ステージ進行
    // =========================
    this.currentStage = System.CONFIG.START_STAGE;

    // =========================
    // ■ スコア・リザルト用（必要なら）
    // =========================
    this.deathCount = 0;
  }

  // =========================================================
  // ■ HP管理
  // =========================================================

  getHP() {
    return this.hp;
  }

  setHP(value) {
    this.hp = value;
  }

  // =========================================================
  // ■ ステージ管理
  // =========================================================

  getCurrentStage() {
    return this.currentStage;
  }

  setCurrentStage(value) {
    this.currentStage = value;
  }

  // =========================================================
  // ■ プレイヤー死亡時などのリセット
  // =========================================================

  resetPlayerData() {
    // ---------------------------------
    // ■ HPを初期値に戻す
    // ---------------------------------
    this.hp = System.CONFIG.PLAYER.MAX_HP;

    // ---------------------------------
    // ■ ステージを初期状態へ戻す
    // ---------------------------------
    this.currentStage = System.CONFIG.START_STAGE;

    // ---------------------------------
    // ■ 死亡回数加算（I Wanna系では重要）
    // ---------------------------------
    this.deathCount++;
  }

  // =========================================================
  // ■ デバッグ・統計系
  // =========================================================

  getDeathCount() {
    return this.deathCount;
  }

  resetAll() {
    this.hp = System.CONFIG.PLAYER.MAX_HP;
    this.currentStage = System.CONFIG.START_STAGE;
    this.deathCount = 0;
  }
}

// =========================
// ■ シングルトン化
// =========================
const instance = new DataManager();
export default instance;