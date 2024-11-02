import { type RefObject, useEffect, useRef, useState } from "react";
import { Engine, Render, World, Bodies, Runner, Body } from "matter-js";
import pigeonSpriteSheet from "@assets/pigeon_sprite_sheet.png";
import { usePigeonStore } from "@/store/pigeonStore";

// Function to move bodies toward a specific point

export default function MatterContainer() {
  const canvas = useRef<HTMLDivElement>();
  const { pigeons } = usePigeonStore();

  const engine = useRef(Engine.create());
  const render = useRef<Render | null>(null);
  const runner = useRef<Runner | null>(null);
  const pigeonBodies = useRef<Map<string, Matter.Body>>(new Map());
  const [pigeonSprite, setPigeonSprite] = useState<string>("");

  const initializeRenderer = () => {
    if (!canvas.current) return;

    const height = canvas.current.offsetHeight;
    const width = canvas.current.offsetWidth;

    render.current = Render.create({
      element: canvas.current,
      engine: engine.current,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: "#BBBBBB",
      },
    });

    World.add(engine.current.world, [
      Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true }),
      Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true }),
      Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true }),
    ]);

    Runner.run(engine.current);
    Render.run(render.current);
    runner.current = Runner.create();
    Runner.run(runner.current, engine.current);
  };

  const clearRenderer = () => {
    if (render.current) {
      Render.stop(render.current);
      Runner.stop(runner.current!);
      render.current.canvas.remove();
    }
    if (engine.current) {
      World.clear(engine.current.world, true);
      Engine.clear(engine.current);
    }
  };

  useEffect(() => {
    initializeRenderer();

    const canvasC = document.createElement("canvas");
    canvasC.width = 128; // Set canvas size to match final sprite size
    canvasC.height = 128;
    const ctx = canvasC.getContext("2d");

    const spriteSheet = new Image();
    spriteSheet.src = pigeonSpriteSheet;
    spriteSheet.onload = () => {
      if (!ctx) return;
      // Draw specific frame from sprite sheet
      // Assuming first frame is at 0,0 and each frame is 600x600
      ctx.drawImage(spriteSheet, 0, 0, 600, 600, 0, 0, 128, 128);

      const spriteDataUrl = canvasC.toDataURL();
      console.log("Sprite extracted successfully");
      setPigeonSprite(spriteDataUrl);
    };

    return () => {
      clearRenderer();
    };
  }, []);

  useEffect(() => {
    if (!pigeonSprite) return;

    const existingBodies = pigeonBodies.current;

    pigeons.forEach((pigeon) => {
      let body = existingBodies.get(pigeon.id);

      if (!body) {
        body = Bodies.circle(pigeon.x, pigeon.y, 20, {
          friction: 10,
          render: {
            sprite: {
              texture: pigeonSprite, // Use the extracted sprite data URL
              xScale: 0.5,
              yScale: 0.5,
            },
          },
          mass: 1,
          restitution: 0.5,
          density: 0.001,
          frictionAir: 0.01,
        });
        World.add(engine.current.world, body);
        existingBodies.set(pigeon.id, body);
      } else {
        Body.setPosition(body, { x: pigeon.x, y: pigeon.y });
      }
    });

    existingBodies.forEach((body, id) => {
      if (!pigeons.find((p) => p.id === id)) {
        World.remove(engine.current.world, body);
        existingBodies.delete(id);
      }
    });
  }, [pigeons, pigeonSprite]);

  return (
    <div
      ref={canvas as unknown as RefObject<HTMLDivElement>}
      className="bg-white h-full w-full flex justify-center items-center rounded-[12px] border-[3px] border-slate-800 overflow-hidden"
    ></div>
  );
}
