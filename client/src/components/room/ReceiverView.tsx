import { useRef, useEffect, useState } from "react";
import { Bodies, World, Body } from "matter-js";
import { useRenderer } from "@hooks/useRenderer";
import { useCharacterBody } from "@hooks/useCharacterBody";
import { usePigeonStore } from "@/store/pigeonStore";
import useSprite from "@hooks/useSprite";
import pigeonSpriteSheet from "@assets/pigeon_sprite_sheet.png";
import idleManSpriteSheet from "@assets/idle_man_sprite_sheet.png";

export default function ReceiverView() {
  const canvas = useRef<HTMLDivElement>(null);
  const { pigeons } = usePigeonStore();
  const pigeonBodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (canvas.current) {
      setDimensions({
        width: canvas.current.offsetWidth,
        height: canvas.current.offsetHeight,
      });
    }
  }, []);

  const { engine } = useRenderer(canvas, { background: "#BBBBBB" });

  // Load sprites
  const pigeonSprite = useSprite(
    pigeonSpriteSheet,
    0,
    0,
    600,
    600,
    0,
    0,
    128,
    128,
    1,
    1,
  );
  const receiverSprite = useSprite(
    idleManSpriteSheet,
    0,
    0,
    64,
    64,
    0,
    0,
    128,
    128,
    -1,
    1,
  );

  // Create receiver character
  useCharacterBody(engine, receiverSprite, {
    x: dimensions.width - 30,
    y: dimensions.height - 48,
    flipped: true,
  });

  // Debug bounds visual
  useEffect(() => {
    if (!engine || !engine.world) return;

    // Add invisible boundary walls for debugging
    const walls = [
      Bodies.rectangle(dimensions.width / 2, -10, dimensions.width, 20, {
        isStatic: true,
        render: { visible: false },
      }), // top
      Bodies.rectangle(
        dimensions.width / 2,
        dimensions.height + 10,
        dimensions.width,
        20,
        { isStatic: true, render: { visible: false } },
      ), // bottom
      Bodies.rectangle(-10, dimensions.height / 2, 20, dimensions.height, {
        isStatic: true,
        render: { visible: false },
      }), // left
      Bodies.rectangle(
        dimensions.width + 10,
        dimensions.height / 2,
        20,
        dimensions.height,
        { isStatic: true, render: { visible: false } },
      ), // right
    ];

    World.add(engine.world, walls);

    return () => {
      World.remove(engine.world, walls);
    };
  }, [engine, dimensions]);

  // Sync physics bodies with pigeon state
  useEffect(() => {
    if (!pigeonSprite || !engine || !engine.world || dimensions.width === 0)
      return;

    const pigeonBodies = pigeonBodiesRef.current;

    // Create or update pigeon bodies based on state
    pigeons.forEach((pigeon) => {
      let body = pigeonBodies.get(pigeon.id);

      // Ensure pigeon position is within bounds
      const boundedX = Math.max(20, Math.min(pigeon.x, dimensions.width - 20));
      const boundedY = Math.max(20, Math.min(pigeon.y, dimensions.height - 20));

      if (!body) {
        // Create new pigeon body if it doesn't exist
        body = Bodies.circle(boundedX, boundedY, 20, {
          isStatic: true,
          friction: 10,
          render: {
            sprite: {
              texture: pigeonSprite,
              xScale: 0.5,
              yScale: 0.5,
            },
          },
          collisionFilter: {
            group: -1, // Negative group means it won't collide with others in same group
          },
        });
        World.add(engine.world, body);
        pigeonBodies.set(pigeon.id, body);
      } else {
        // Update position with smooth transition
        const currentPos = body.position;
        const dx = boundedX - currentPos.x;
        const dy = boundedY - currentPos.y;

        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          Body.setPosition(body, {
            x: boundedX,
            y: boundedY,
          });
        }
      }
    });

    // Remove bodies for pigeons that no longer exist in state
    pigeonBodies.forEach((body, id) => {
      if (!pigeons.find((p) => p.id === id)) {
        World.remove(engine.world, body);
        pigeonBodies.delete(id);
      }
    });

    return () => {
      pigeonBodies.forEach((body) => {
        World.remove(engine.world, body);
      });
      pigeonBodies.clear();
    };
  }, [engine, pigeonSprite, pigeons, dimensions]);

  return (
    <div
      ref={canvas}
      className="bg-white h-full w-full flex justify-center items-center rounded-[12px] border-[3px] border-slate-800 overflow-hidden"
    />
  );
}
