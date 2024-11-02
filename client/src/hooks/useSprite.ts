import { useState } from "react";
export default function useSprite(
  path: string,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  scaleX: number,
  scaleY: number,
) {
  const canvasC = document.createElement("canvas");
  const ctx = canvasC.getContext("2d");
  const spriteSheet = new Image();
  spriteSheet.src = path;
  let spriteDataUrl = "";

  spriteSheet.onload = () => {
    if (!ctx) return;
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(spriteSheet, sx, sy, sw, sh, dx, dy, dw, dh);
    spriteDataUrl = canvasC.toDataURL();
  };
  return spriteDataUrl;
}
