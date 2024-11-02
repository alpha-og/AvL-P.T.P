import { useEffect } from "react";
import { Events, Body, Engine } from "matter-js";
import { Socket } from "socket.io-client";
import { SpawnedObject } from "./useProximityDetection";

export const usePigeonMovement = (
  engine: Engine,
  pigeons: SpawnedObject[],
  target: Body | null,
  socket: Socket,
  room: string,
) => {
  useEffect(() => {
    if (!target || pigeons.length === 0) return;

    const updateHandler = () => {
      pigeons.forEach(({ body }) => {
        if (!body) return;
        const dx = target.position.x - body.position.x;
        const dy = target.position.y - body.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceMagnitude = 0.001;

        const force = {
          x: (forceMagnitude * dx) / distance,
          y: (forceMagnitude * dy) / distance,
        };

        Body.applyForce(body, body.position, force);
      });

      // const updatedPigeons = pigeons.map((pigeon) => ({
      //   id: pigeon.id,
      //   x: pigeon.x,
      //   y: pigeon.y,
      // }));

      // socket.emit("update_pigeon", { room, pigeons: updatedPigeons });
    };

    Events.on(engine, "beforeUpdate", updateHandler);

    return () => {
      Events.off(engine, "beforeUpdate", updateHandler);
    };
  }, [engine, pigeons, target, room, socket]); // Added pigeons to dependencies
};
