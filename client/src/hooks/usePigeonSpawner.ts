import { useState, useEffect, useRef, useCallback } from "react";
import { World, Bodies } from "matter-js";
import { SpawnedObject } from "./useProximityDetection";
import { useNavigate } from "react-router-dom";

export type SpawnerOptions = {
  maxPigeons?: number;
  minSpawnInterval?: number;
  maxSpawnInterval?: number;
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
  const navigate = useNavigate();

  useEffect(() => {
    if (pigeons.length > options.maxPigeons!) {
      navigate("/pigeon-ads");
      spawnBlockedRef.current = true;
    }
  }, [pigeons.length, options.maxPigeons, navigate]);

  const spawnPigeon = useCallback(() => {
    // Ensure there's a message to deliver and that spawning is not blocked
    if (!pigeonSprite || spawnBlockedRef.current || messages.length === 0)
      return;

    // Block spawning temporarily
    spawnBlockedRef.current = true;

    // Determine a random spawn location
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

    // Create the pigeon body
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

    // Add the new pigeon to the pigeons state
    setPigeons((prev) => [
      ...prev,
      {
        id: `${pigeonBody.id}`,
        x: spawnX,
        y: spawnY,
        payload: 0,
        body: pigeonBody,
      },
    ]);

    // Add the pigeon to the Matter.js physics world
    World.add(engine.world, pigeonBody);

    // Schedule the next spawn with a random delay
    const nextSpawnDelay =
      Math.random() * (options.maxSpawnInterval! - options.minSpawnInterval!) +
      options.minSpawnInterval!;
    setTimeout(() => {
      spawnBlockedRef.current = false;
      spawnPigeon(); // Recursively call to spawn the next pigeon at a random time
    }, nextSpawnDelay);
  }, [engine, pigeonSprite, messages.length, options]);

  // Initial spawn when messages are available
  useEffect(() => {
    if (messages.length > 0 && !spawnBlockedRef.current) {
      spawnPigeon();
    }
  }, [spawnPigeon, messages.length]);

  return { pigeons };
};
