import { type RefObject, useEffect, useRef, useState } from "react";
import { Engine, Render, World, Bodies, Runner } from "matter-js";
import pigeonSpriteSheet from "@assets/pigeon_sprite_sheet.png";

export default function MatterContainer() {
  const canvas = useRef<HTMLDivElement>(); //Your div element

  //Matter.js references
  const engine = useRef(Engine.create());
  const render = useRef<Render | null>(null);
  const runner = useRef<Runner | null>(null);
  const [spawnDelay, setSpawnDelay] = useState(0);
  const [pigeonSprite, setPigeonSprite] = useState<string>("");
  const [pigeons, setPigeons] = useState<Matter.Body[]>([]);
  const [spawnBlocked, setSpawnBlocked] = useState(false);

  //Initialize everything from Matter.js
  const initializeRenderer = () => {
    if (!canvas.current) return; //It's good to always check if your reference exists.

    const height = canvas.current.offsetHeight; //div height
    const width = canvas.current.offsetWidth; //div width

    render.current = Render.create({
      //Start renderer, per Matter.js docs.
      element: canvas.current, //Our JSX element
      engine: engine.current, //The engine
      options: {
        width: width,
        height: height,
        wireframes: false, //Just for testing. Remove all colors and details.
        background: "#BBBBBB", //Background color
      },
    });

    // Adding the objects to the engine.
    World.add(engine.current.world, [
      Bodies.rectangle(width / 2, height + 10, width, 20, {
        isStatic: true,
        friction: 10,
      }), //Floor
      Bodies.rectangle(width + 10, height / 2, 20, height, {
        isStatic: true,
        friction: 10,
      }), //Right wall
      Bodies.rectangle(-10, height / 2, 20, height, {
        isStatic: true,
        friction: 10,
      }), //Left wall
    ]);

    // Start the engine, the renderer, and the runner. As defined in Matter.js documentation
    Runner.run(engine.current);
    Render.run(render.current);
    runner.current = Runner.create();
    Runner.run(runner.current, engine.current);
  };

  //Remove everything when closed. Self-explanatory.
  const clearRenderer = () => {
    if (!render.current) return;
    Render.stop(render.current);
    Runner.stop(runner.current!);
    render.current.canvas.remove();

    if (!engine.current) return;
    World.clear(engine.current.world, true);
    Engine.clear(engine.current);
  };

  //This will only run once. It will initialize the Matter.js render and add the mouse listener.
  useEffect(() => {
    const canvasC = document.createElement("canvas");
    const ctx = canvasC.getContext("2d");
    const spriteSheet = new Image();
    spriteSheet.src = pigeonSpriteSheet;

    spriteSheet.onload = () => {
      if (!ctx) return;
      ctx.drawImage(spriteSheet, 0, 0, 600, 600, 0, 0, 128, 128);
      setPigeonSprite(canvasC.toDataURL());
    };

    initializeRenderer(); //Initialize Matter.js objects
    return () => {
      //Done when the component closes. Do the opposite.
      clearRenderer(); //Remove all data from Matter.js
    };
  }, []);

  useEffect(() => {
    if (!pigeonSprite || spawnBlocked) return;
    const timeout = setTimeout(() => {
      if (pigeons.length >= 10) return;
      setSpawnBlocked(true);
      const height = canvas.current!.offsetHeight;
      const width = canvas.current!.offsetWidth;
      const pigeonBody = Bodies.circle(
        Math.random() * width,
        Math.random() * height,
        20,
        {
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
        },
      );
      setPigeons((prev) => [...prev, pigeonBody]);

      World.add(engine.current.world, pigeonBody);

      const delay = Math.random() * 1000;
      setSpawnBlocked(false);
      setSpawnDelay(delay);
    }, spawnDelay);
    return () => clearTimeout(timeout);
  }, [spawnDelay, pigeonSprite, spawnBlocked, pigeons]);

  return (
    <div
      ref={canvas as unknown as RefObject<HTMLDivElement>}
      className="bg-white h-full w-full flex justify-center items-center rounded-[12px] border-[3px] border-slate-800 overflow-hidden"
    ></div>
  );
}
