import { useRef } from "react";
import { useRenderer } from "@hooks/useRenderer";
import { usePigeonSpawner } from "@hooks/usePigeonSpawner";
import { useCharacterBody } from "@hooks/useCharacterBody";
import { usePigeonMovement } from "@hooks/usePigeonMovement";
import {
  SpawnedObject,
  useProximityDetection,
} from "@hooks/useProximityDetection";
import useSocketIo from "@hooks/useSocketIo";
import useSprite from "@hooks/useSprite";
import { useRoomStore } from "@store/roomStore";
import { useMessageStore } from "@/store/messageStore";
import pigeonSpriteSheet from "@assets/pigeon_sprite_sheet.png";
import idleManSpriteSheet from "@assets/idle_man_sprite_sheet.png";

export default function SenderView() {
  const canvas = useRef<HTMLDivElement>(null);
  const socket = useSocketIo();
  const { messages, dequeueByte } = useMessageStore();
  const { room } = useRoomStore();

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

  const containerWidth = canvas.current?.offsetWidth ?? 0;
  const containerHeight = canvas.current?.offsetHeight ?? 0;

  const { pigeons } = usePigeonSpawner(engine, pigeonSprite, messages, {
    maxPigeons: 1000,
    minSpawnInterval: 1,
    maxSpawnInterval: 5,
    containerWidth,
    containerHeight,
  });

  const senderBody = useCharacterBody(engine, senderSprite, {
    x: 30,
    y: containerHeight - 48,
  });

  const receiverBody = useCharacterBody(engine, receiverSprite, {
    x: containerWidth - 30,
    y: containerHeight - 48,
    flipped: true,
  });

  usePigeonMovement(engine, pigeons, senderBody, socket, room);
  // useProximityDetection({
  //   spawnedObjects: pigeons,
  //   staticObject: receiverBody!,
  //   proximityThreshold: 20,
  //   engine,
  //   world: engine.world,
  //   action: (spawnedBody: SpawnedObject) => {
  //     console.log("Proximity detected!");
  //     spawnedBody.payload = dequeueByte();
  //   },
  // });
  //
  return (
    <div
      ref={canvas}
      className="bg-white h-full w-full flex justify-center items-center rounded-[12px] border-[3px] border-slate-800 overflow-hidden"
    />
  );
}
