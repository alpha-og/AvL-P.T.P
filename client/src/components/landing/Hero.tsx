import React, { useEffect } from "react";
import pigeonSpriteSheet from "../../assets/pigeon_sprite_sheet.png";
const canvasHeight = 128;
const canvasWidth = 128;

const Hero = () => {
  const [pigeon, setPigeon] = React.useState("");
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    const spriteSheet = new Image();
    spriteSheet.src = pigeonSpriteSheet;

    spriteSheet.onload = () => {
      if (!ctx) return;
      ctx.drawImage(
        spriteSheet,
        64,
        0,
        512,
        512,
        0,
        0,
        canvasWidth,
        canvasHeight,
      );
      setPigeon(canvas.toDataURL());
    };
  }, []);
  return (
    <div className="hero min-h-screen bg-base-200">
      {/* Constrain the max width for larger screens */}
      <div className="hero-content max-w-screen-lg w-full flex flex-col lg:flex-row items-center lg:items-start px-4">
        {/* Left: Pigeon Animation */}
        <div className="w-48 h-48 lg:w-96 lg:h-96 bg-cover bg-center">
          <img
            src={pigeon}
            alt="Animated Pigeon"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right: Hero Text Content */}
        <div className="text-center lg:text-left lg:w-1/2 space-y-4 px-4 py-8 lg:py-0">
          <h1 className="text-4xl lg:text-5xl font-bold">
            Welcome to <span className="text-primary">AvL P.T.P</span>
          </h1>
          <p className="py-4 max-w-md lg:max-w-lg text-lg text-gray-600 mx-auto lg:mx-0">
            The world's most{" "}
            <span className="text-secondary font-bold">annoying</span> way to
            send files and messages. Watch as our{" "}
            <span className="italic">rebellious</span> pigeons procrastinate,
            zigzag, and lose your data along the way. Good luck getting anything
            across!
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 pt-6 justify-center lg:justify-start">
            <a href="/room" className="btn btn-primary btn-lg w-full lg:w-auto">
              Get Started
            </a>
            <a
              href="#features"
              className="btn btn-secondary btn-lg w-full lg:w-auto"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
