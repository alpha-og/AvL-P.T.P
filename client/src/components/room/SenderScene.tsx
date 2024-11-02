import { type RefObject, useEffect, useRef, useState } from "react";
import {
  Engine,
  Render,
  World,
  Bodies,
  Runner,
  Events,
  Composite,
  Body,
} from "matter-js";
import useSocketIo from "@hooks/useSocketIo";
import useSprite from "@hooks/useSprite";
import pigeonSpriteSheet from "@assets/pigeon_sprite_sheet.png";
import idleManSpriteSheet from "@assets/idle_man_sprite_sheet.png";
import { useRoomStore } from "@store/roomStore";

export default function MatterContainer() {
  const canvas = useRef<HTMLDivElement>(); //Your div element
  const socket = useSocketIo();

  const { room } = useRoomStore();
  //Matter.js references
  const engine = useRef(Engine.create());
  const render = useRef<Render | null>(null);
  const runner = useRef<Runner | null>(null);

  const [spawnDelay, setSpawnDelay] = useState(0);

  // load sprites

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
  const senderSprite = useSprite(
    idleManSpriteSheet,
    0,
    0,
    64,
    64,
    0,
    0,
    128,
    128,
    1,
    1,
  );
  const receiverSprite = useSprite(
    idleManSpriteSheet,
    64,
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

  const [senderBody, setSenderBody] = useState<Body | null>(null);
  const [receiverBody, setReceiverBody] = useState<Body | null>(null);
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

  const moveBodies = (target: { x: number; y: number }) => {
    Composite.allBodies(engine.current.world).forEach((body) => {
      if (body) {
        const dx = target.x - body.position.x;
        const dy = target.y - body.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceMagnitude = Math.min(0.05 * distance, 0.5); // Adjust force strength

        const force = {
          x: (forceMagnitude * dx) / distance,
          y: (forceMagnitude * dy) / distance,
        };

        Body.applyForce(body, body.position, force);
      }
    });
  };

  //This will only run once. It will initialize the Matter.js render and add the mouse listener.
  useEffect(() => {
    initializeRenderer(); //Initialize Matter.js objects

    return () => {
      //Done when the component closes. Do the opposite.
      clearRenderer(); //Remove all data from Matter.js
    };
  }, []);
  useEffect(() => {
    console.log(socket);
    const updatePigeons = () => {
      const updatedPigeons = pigeons.map((pigeon) => {
        return {
          id: pigeon.id,
          x: pigeon.position.x,
          y: pigeon.position.y,
        };
      });
      const payload = {
        room,
        pigeons: updatedPigeons,
      };
      socket.emit("update_pigeon", payload);
    };
    const engineCurrent = engine.current;
    Events.on(engineCurrent, "beforeUpdate", updatePigeons);
    return () => {
      Events.off(engineCurrent, "beforeUpdate", updatePigeons);
    };
  }, [room, pigeons, socket]);

  useEffect(() => {
    if (!senderSprite) return;
    const height = canvas.current!.offsetHeight;
    const width = canvas.current!.offsetWidth;
    const senderBody = Bodies.circle(30, height - 48, 20, {
      isStatic: true,
      friction: 5,
      render: {
        sprite: {
          texture: senderSprite,
          xScale: 1,
          yScale: 1,
        },
      },
      mass: 1,
      restitution: 0.5,
      density: 0.001,
      frictionAir: 0.01,
    });
    // if (senderBody) {
    //   setSenderBody(senderBody);
    // } else {
    World.add(engine.current.world, senderBody);
    // }
  }, [senderSprite, senderBody]);

  useEffect(() => {
    if (!receiverSprite) return;
    const height = canvas.current!.offsetHeight;
    const width = canvas.current!.offsetWidth;
    const receiverBody = Bodies.circle(width - 30, height - 48, 20, {
      isStatic: true,
      friction: 5,
      render: {
        sprite: {
          texture: receiverSprite,
          xScale: 1,
          yScale: 1,
        },
      },
      mass: 1,
      restitution: 0.5,
      density: 0.001,
      frictionAir: 0.01,
    });
    World.add(engine.current.world, receiverBody);
  }, [receiverSprite, receiverBody]);

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

      const delay = Math.random() * 5000;
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
