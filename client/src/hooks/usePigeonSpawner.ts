import { useState, useEffect, useRef, useCallback } from "react";
import { World, Bodies } from "matter-js";
import { SpawnedObject } from "./useProximityDetection";

export type SpawnerOptions = {
  maxPigeons?: number;
  spawnInterval?: number;
  containerWidth: number;
  containerHeight: number;
};

export const usePigeonSpawner = (
  engine: Matter.Engine,
  pigeonSprite: string | null,
  messages: string[],
  options: SpawnerOptions,
) => {
  const [pigeons, setPigeons] = useState<SpawnedObject[]>([]);
  const spawnBlockedRef = useRef(false);

  const spawnPigeon = useCallback(() => {
    if (!pigeonSprite || spawnBlockedRef.current || messages.length === 0)
      return;
    if (pigeons.length >= (options.maxPigeons || 10)) {
      window.location.href = "/pigeon-ads";
    }

    spawnBlockedRef.current = true;
    const spawnSide = Math.random();
    let spawnX, spawnY;

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

    const pigeonBody = Bodies.circle(spawnX, spawnY, 20, {
      friction: 10,
      render: {
        sprite: {
          texture: pigeonSprite,
          xScale: 0.5,
          yScale: 0.5,
        },
      },
      mass: 1,
      restitution: 0.5,
      density: 0.001,
      frictionAir: 0.01,
    });

    setPigeons((prev) => [
      ...prev,
      {
        x: spawnX,
        y: spawnY,
        payload: 0,
        body: pigeonBody,
      },
    ]); // Update state instead of ref
    World.add(engine.world, pigeonBody);

    setTimeout(
      () => {
        spawnBlockedRef.current = false;
      },
      Math.random() * (options.spawnInterval || 5000),
    );
  }, [engine, pigeonSprite, messages.length, options, pigeons.length]);

  useEffect(() => {
    if (!spawnBlockedRef.current) {
      spawnPigeon();
    }
  }, [spawnPigeon]);

  return { pigeons }; // Return state instead of ref
};
