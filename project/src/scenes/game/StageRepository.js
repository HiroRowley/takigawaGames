import Stage1 from "../../stages/Stage1.js";
import Stage2 from "../../stages/Stage2.js";
import Stage3 from "../../stages/Stage3.js";
import validateStageData from "../../stages/validateStageData.js";

const stages = new Map([
  [1, Stage1],
  [2, Stage2],
  [3, Stage3],
]);

export default class StageRepository {
  get(stageNumber) {
    const stageData = stages.get(stageNumber);
    if (!stageData) {
      throw new RangeError(`Stage ${stageNumber} is not registered.`);
    }

    const stage = validateStageData(stageData, stageNumber);

    return {
      raw: stage,
      tileSize: stage.TILE,
      groundList: stage.groundList ?? [],
      groundDecorationList: [
        ...(stage.pipeList ?? []).map((pipe) => ({
          texture: "pipe",
          depth: 10,
          ...pipe,
        })),
        ...(stage.groundDecorationList ?? []),
      ],
      pipeWarpList: stage.pipeWarpList ?? [],
      blockList: stage.blockList ?? [],
      hiddenBlockList: stage.hiddenBlockList ?? [],
      enemySpawnList: stage.enemySpawnList ?? [],
      trapList: stage.trapList ?? [],
      playerSpawn: stage.playerSpawn,
      goal: stage.goalPosition ?? stage.goal ?? null,
    };
  }
}
