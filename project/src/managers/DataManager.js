import System from "../system/System.js";

/**
 * DataManager
 * =========================================================
 * ■ 役割
 * - プレイヤー状態の一元管理
 * - ステージ進行管理
 * - リトライ処理（遅刻後復帰）
 *
 * ■ 設計書準拠
 * - resetPlayerData() を使用する
 * - 状態管理のみ担当（ロジックは持たない）
 */

class DataManager {
  constructor() {
    // =====================================================
    // ■ プレイヤー状態
    // =====================================================

    // HP（2想定：I Wanna系）
    this.hp = System.CONFIG.PLAYER.MAX_HP;

    // 有給（ゲーム内リソース）
    this.paidHolidays = System.CONFIG.PLAYER.PAID_HOLIDAYS ?? 0;

    // =====================================================
    // ■ ステージ管理
    // =====================================================

    // 現在のステージ
    this.currentStage = System.CONFIG.START_STAGE;

    // リスポーン用ステージ（遅刻後の復帰位置）
    this.respawnStage = System.CONFIG.START_STAGE;

    // =====================================================
    // ■ 遅刻カウント
    // =====================================================

    this.lateCount = 0;
  }

  // =========================================================
  // ■ HP管理
  // =========================================================

  getHP() {
    return this.hp;
  }

  setHP(value) {
    // HPは0未満にならない（0 = 遅刻状態）
    this.hp = Math.max(0, value);
  }

  // =========================================================
  // ■ 有給管理
  // =========================================================

  getPaidHolidays() {
    return this.paidHolidays;
  }

  setPaidHolidays(value) {
    this.paidHolidays = value;
  }

  // =========================================================
  // ■ ステージ管理
  // =========================================================

  getCurrentStage() {
    return this.currentStage;
  }

  setCurrentStage(value) {
    this.currentStage = value;

    // 現在ステージをリスポーン基準として保存
    this.respawnStage = value;
  }

  // =========================================================
  // ■ リトライ処理
  // =========================================================

  resetPlayerData() {
    // HPを初期値へ戻す
    this.hp = System.CONFIG.PLAYER.MAX_HP;

    // 有給も初期値へ戻す
    this.paidHolidays = System.CONFIG.PLAYER.PAID_HOLIDAYS ?? 0;

    // ステージは最初ではなく「直前ステージ」に戻す
    this.currentStage = this.respawnStage;

    // 遅刻回数を加算
    this.lateCount++;
  }

  // =========================================================
  // ■ デバッグ・統計
  // =========================================================

  getLateCount() {
    return this.lateCount;
  }
}

// =========================================================
// ■ シングルトン（ゲーム全体共有）
// =========================================================

const instance = new DataManager();
export default instance;