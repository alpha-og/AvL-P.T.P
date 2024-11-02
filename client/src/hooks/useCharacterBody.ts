import { useEffect, useRef } from "react";
import { Bodies, World } from "matter-js";

interface CharacterOptions {
  x: number;
  y: number;
  isStatic?: boolean;
  flipped?: boolean;
}

export const useCharacterBody = (
  engine: Matter.Engine,
  sprite: string | null,
  options: CharacterOptions,
) => {
  const characterBodyRef = useRef<Matter.Body | null>(null);

  useEffect(() => {
    if (!sprite) return;

    const body = Bodies.circle(options.x, options.y, 20, {
      isStatic: options.isStatic ?? true,
      friction: 5,
      render: {
        sprite: {
          texture: sprite,
          xScale: options.flipped ? -1 : 1,
          yScale: 1,
        },
      },
      mass: 1,
      restitution: 0.5,
      density: 0.001,
      frictionAir: 0.01,
    });

    characterBodyRef.current = body;
    World.add(engine.world, body);

    return () => {
      if (characterBodyRef.current) {
        World.remove(engine.world, characterBodyRef.current);
      }
    };
  }, [sprite, engine, options.x, options.y, options.flipped, options.isStatic]);

  return characterBodyRef.current;
};
