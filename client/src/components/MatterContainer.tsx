import { useEffect, useRef } from "react";
import { Engine, Render, World, Bodies, Runner } from "matter-js";
import pigeonSpriteSheet from "./assets/pigeon_sprite_sheet.png";
let pigeon = "";

export default function MatterContainer() {
  const canvas = useRef<HTMLDivElement>(); //Your div element

  //Matter.js references
  const engine = useRef(Engine.create());
  const render = useRef<Render | null>(null);
  const runner = useRef<Runner | null>(null);

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
      pigeon = canvasC.toDataURL();
    };

    initializeRenderer(); //Initialize Matter.js objects
    const interval = setInterval(() => {
      const height = canvas.current!.offsetHeight;
      const width = canvas.current!.offsetWidth;
      World.add(
        engine.current.world,
        Bodies.circle(Math.random() * width, Math.random() * height, 20, {
          friction: 10,
          render: {
            sprite: {
              texture: pigeon,
              xScale: 0.5,
              yScale: 0.5,
            },
          },
          mass: 1,
          restitution: 0.5,
          density: 0.001,
          frictionAir: 0.01,
        }),
      );
    }, 1000); //Add a new pigeon every 1000 ms

    return () => {
      //Done when the component closes. Do the opposite.
      clearInterval(interval);
      clearRenderer(); //Remove all data from Matter.js
    };
  }, []);

  return (
    <>
      <div
        ref={canvas as unknown as React.RefObject<HTMLDivElement>}
        className="bg-white h-[85%] w-full flex justify-center items-center rounded-[12px] border-[3px] border-slate-800 overflow-hidden"
      ></div>
      <div className="join w-full ">
        <input
          type="text"
          placeholder="Enter a message"
          className="input join-item w-full focus:outline-none"
        />
        <button className="btn join-item">Send</button>
      </div>
    </>
  );
}
