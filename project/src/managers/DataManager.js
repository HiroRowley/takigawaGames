import Phaser from "phaser";
import System from "../systems/System.js";

import GameScene from "../scenes/GameScene.js"

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

    this.hp = System.CONFIG.PLAYER.MAX_HP;

    // 有給（ゲーム内リソース）
    if (System.CONFIG.PLAYER.PAID_HOLIDAYS === undefined) {
      throw new Error(
        "PAID_HOLIDAYS is not defined in System.CONFIG.PLAYER"
      );
    }

    this.paidHolidays = System.CONFIG.PLAYER.PAID_HOLIDAYS;

    // =====================================================
    // ■ ステージ管理
    // =====================================================

    this.currentStage = System.CONFIG.START_STAGE;
    this.respawnStage = System.CONFIG.START_STAGE;
    this.holidayCounter = 1;

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
    
    this.hp = 5//Math.max(0, value);
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
    this.respawnStage = value;
  }

  // =========================================================
  // ■ リトライ処理
  // =========================================================

  resetPlayerData() {

    // 残機を減らす
    this.paidHolidays--;

    // HPだけ回復
    this.hp = System.CONFIG.PLAYER.MAX_HP;

    // ステージ復帰位置
    this.currentStage = this.respawnStage;

    // 遅刻回数
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
// ■ シングルトン
// =========================================================

const instance = new DataManager();
export default instance;