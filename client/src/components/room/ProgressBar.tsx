import { useState, useEffect } from "react";

type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
};

const progressPhrases = [
  "Locating pigeons...",
  "Feeding pigeons...",
  "Establishing flight paths...",
  "Deploying tiny helmets...",
  "Coordinating feathered couriers...",
  "Analyzing bird traffic...",
  "Preparing high-quality seeds...",
  "Calibrating wing strength...",
  "Gathering carrier pigeons...",
  "Double-checking pigeon GPS...",
];

const ProgressBar = ({ current, total, label }: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState(progressPhrases[0]);

  useEffect(() => {
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  }, [current, total]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomPhrase =
        progressPhrases[Math.floor(Math.random() * progressPhrases.length)];
      setCurrentPhrase(randomPhrase);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        {/* Label and Percentage Display */}
        <div className="flex items-center justify-between mb-2 text-xs md:text-sm lg:text-base">
          <span>{label || "Progress"}</span>
          <span>{Math.round(progress)}%</span>
        </div>

        {/* DaisyUI Progress Bar */}
        <progress
          className="progress progress-primary w-full"
          value={progress}
          max="100"
        ></progress>

        {/* Progress Text */}
        <div className="mt-2 text-xs md:text-sm lg:text-base text-gray-500">
          {currentPhrase}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
