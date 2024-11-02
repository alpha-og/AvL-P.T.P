import { useEffect, useRef } from "react";
import { Engine, Render, World, Bodies, Runner } from "matter-js";

interface RendererOptions {
  background?: string;
}

export const useRenderer = (
  containerRef: React.MutableRefObject<HTMLDivElement | null>,
  options: RendererOptions = {},
) => {
  const engine = useRef(Engine.create());
  const render = useRef<Render | null>(null);
  const runner = useRef<Runner | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const height = containerRef.current.offsetHeight;
    const width = containerRef.current.offsetWidth;

    render.current = Render.create({
      element: containerRef.current,
      engine: engine.current,
      options: {
        width,
        height,
        wireframes: false,
        background: options.background || "#BBBBBB",
      },
    });

    // Add walls
    World.add(engine.current.world, [
      Bodies.rectangle(width / 2, height + 10, width, 20, {
        isStatic: true,
        friction: 10,
      }),
      Bodies.rectangle(width + 10, height / 2, 20, height, {
        isStatic: true,
        friction: 10,
      }),
      Bodies.rectangle(-10, height / 2, 20, height, {
        isStatic: true,
        friction: 10,
      }),
    ]);

    Runner.run(engine.current);
    Render.run(render.current);
    runner.current = Runner.create();
    Runner.run(runner.current, engine.current);

    return () => {
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
  }, []);

  return {
    engine: engine.current,
    render: render.current,
    runner: runner.current,
  };
};
