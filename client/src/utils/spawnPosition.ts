import { SpawnerOptions } from "@hooks/usePigeonSpawner";
export const getRandomSpawnPosition = (options: SpawnerOptions) => {
  const spawnSide = Math.random();
  let spawnX = 0,
    spawnY = 0;

  if (spawnSide < 0.33) {
    spawnX = Math.random() * options.containerWidth;
    spawnY = -20;
  } else if (spawnSide < 0.66) {
    spawnX = -20;
    spawnY = Math.random() * options.containerHeight;
  } else {
    spawnX = options.containerWidth + 20;
    spawnY = Math.random() * options.containerHeight;
  }

  return { x: spawnX, y: spawnY };
};
