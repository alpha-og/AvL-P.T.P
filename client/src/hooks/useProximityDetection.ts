import { useEffect, useRef } from "react";
import Matter from "matter-js";

const { Events } = Matter;

export type SpawnedObject = {
  id: string;
  x: number;
  y: number;
  payload: number;
  body: Matter.Body | null;
};

export type StaticObject = {
  x: number;
  y: number;
  width: number;
  height: number;
  body: Matter.Body;
};

export type UseProximityDetectionProps = {
  spawnedObjects: SpawnedObject[];
  staticObject: Matter.Body;
  proximityThreshold: number;
  engine: Matter.Engine;
  world: Matter.World;
  action: (spawnedBody: SpawnedObject) => void;
};

export const useProximityDetection = ({
  spawnedObjects,
  staticObject,
  proximityThreshold,
  engine,
  world,
  action,
}: UseProximityDetectionProps) => {
  const staticBodyRef = useRef<Matter.Body>(staticObject);

  useEffect(() => {
    // Define a collision filter function
    const collisionFilter = (event: Matter.IEventCollision<Matter.Engine>) => {
      const pairs = event.pairs;

      // Loop through each pair of colliding bodies
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Check if one of the bodies is the static body
        if (
          bodyA === staticBodyRef.current ||
          bodyB === staticBodyRef.current
        ) {
          const spawnedBody = bodyA === staticBodyRef.current ? bodyB : bodyA;

          // Check if the spawned body is within the proximity threshold
          const distance = Matter.Vector.magnitude(
            Matter.Vector.sub(
              spawnedBody.position,
              staticBodyRef.current.position,
            ),
          );
          if (distance <= proximityThreshold) {
            // Find the corresponding spawned object and update its payload
            const spawnedObject = spawnedObjects.find(
              (obj) => obj.body === spawnedBody,
            );
            if (spawnedObject) {
              action(spawnedObject);
            }
          }
        }
      }
    };

    // Subscribe to the 'collisionActive' event
    Events.on(engine, "collisionActive", collisionFilter);

    // Clean up function
    return () => {
      Events.off(engine, "collisionActive", collisionFilter);
    };
  }, [spawnedObjects, staticObject, proximityThreshold, engine, world]);

  return null;
};
