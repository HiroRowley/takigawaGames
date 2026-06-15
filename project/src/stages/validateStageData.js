function requireFiniteCoordinate(value, path) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${path} must be a finite number.`);
  }
}

function validatePosition(position, path) {
  if (!position || typeof position !== "object") {
    throw new TypeError(`${path} is required.`);
  }

  requireFiniteCoordinate(position.x, `${path}.x`);
  requireFiniteCoordinate(position.y, `${path}.y`);
}

export default function validateStageData(stageData, stageNumber) {
  if (!stageData || typeof stageData !== "object") {
    throw new TypeError(`Stage ${stageNumber} data is missing.`);
  }

  if (!Number.isFinite(stageData.TILE) || stageData.TILE <= 0) {
    throw new RangeError(`Stage ${stageNumber} TILE must be greater than zero.`);
  }

  validatePosition(stageData.playerSpawn, `Stage ${stageNumber} playerSpawn`);

  const arrayFields = [
    "groundList",
    "groundDecorationList",
    "pipeList",
    "pipeWarpList",
    "blockList",
    "hiddenBlockList",
    "enemySpawnList",
    "trapList",
  ];

  for (const field of arrayFields) {
    if (stageData[field] !== undefined && !Array.isArray(stageData[field])) {
      throw new TypeError(`Stage ${stageNumber} ${field} must be an array.`);
    }
  }

  const goal = stageData.goalPosition ?? stageData.goal;
  if (goal !== undefined) {
    validatePosition(goal, `Stage ${stageNumber} goal`);

    for (const dimension of ["width", "height"]) {
      if (goal[dimension] !== undefined) {
        requireFiniteCoordinate(
          goal[dimension],
          `Stage ${stageNumber} goal.${dimension}`
        );

        if (goal[dimension] <= 0) {
          throw new RangeError(
            `Stage ${stageNumber} goal.${dimension} must be greater than zero.`
          );
        }
      }
    }
  }

  return stageData;
}
