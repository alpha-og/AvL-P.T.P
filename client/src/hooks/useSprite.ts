import { useEffect, useState } from "react";

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
  const [spriteDataUrl, setSpriteDataUrl] = useState<string>("");

  useEffect(() => {
    const canvasC = document.createElement("canvas");
    const ctx = canvasC.getContext("2d");
    const spriteSheet = new Image();

    spriteSheet.src = path;

    spriteSheet.onload = () => {
      if (ctx) {
        // Set the canvas width and height to accommodate negative scaling
        canvasC.width = Math.abs(dw) * Math.abs(scaleX);
        canvasC.height = Math.abs(dh) * Math.abs(scaleY);

        // Save the context state before transformations
        ctx.save();

        // Translate to the center of the canvas
        ctx.translate(dw / 2, dh / 2);
        // Apply scaling for flipping
        ctx.scale(scaleX, scaleY);
        // Translate back to the top left corner for drawing
        ctx.translate(-dw / 2, -dh / 2);

        // Draw the sprite on the canvas
        ctx.drawImage(spriteSheet, sx, sy, sw, sh, dx, dy, dw, dh);

        // Restore the context to its original state
        ctx.restore();

        const dataUrl = canvasC.toDataURL();
        setSpriteDataUrl(dataUrl);
      }
    };

    return () => {
      // Clean up the image to avoid memory leaks
      spriteSheet.src = "";
    };
  }, [path, sx, sy, sw, sh, dx, dy, dw, dh, scaleX, scaleY]);

  return spriteDataUrl;
}
