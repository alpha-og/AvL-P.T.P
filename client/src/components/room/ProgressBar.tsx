import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, Fingerprint, Server } from "lucide-react";
import { T_Pigeon } from "@store/pigeonStore";

const ProgressBar = ({ items = [] }: { items: T_Pigeon[] }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const totalItems = items.length;
  const progress = totalItems ? Math.min((currentPhase / 4) * 100, 100) : 0;

  const phases = [
    {
      icon: <Fingerprint className="w-4 h-4" />,
      name: "Initializing Void Protocol",
      description: "Establishing connection to nowhere",
    },
    {
      icon: <Server className="w-4 h-4" />,
      name: "Quantum Tunneling",
      description: "Calculating imaginary transfer rates",
    },
    {
      icon: <Clock className="w-4 h-4" />,
      name: "Time Dilation",
      description: "Synchronizing with parallel universes",
    },
    {
      icon: <AlertCircle className="w-4 h-4" />,
      name: "Final Phase",
      description: "Preparing to fail gracefully",
    },
  ];

  useEffect(() => {
    if (totalItems > 0) {
      const interval = setInterval(() => {
        setCurrentPhase((prev) => (prev < 4 ? prev + 1 : prev));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [totalItems]);

  if (totalItems === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-sm">Awaiting Nonexistent Data</h3>
          <div className="alert alert-info">
            <AlertCircle className="w-4 h-4" />
            <span>Please provide items that won't be transferred</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title text-sm">Transfer Progress</h3>
          <div className="badge badge-primary">{totalItems} items queued</div>
        </div>

        {/* Main Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs opacity-75">Progress to Failure</span>
            <span className="text-xs opacity-75">{Math.round(progress)}%</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max="100"
          />
        </div>

        {/* Phases */}
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 ${
                index === currentPhase
                  ? "opacity-100"
                  : index < currentPhase
                    ? "opacity-50"
                    : "opacity-30"
              }`}
            >
              <div
                className={`badge badge-sm ${
                  index === currentPhase
                    ? "badge-primary animate-pulse"
                    : index < currentPhase
                      ? "badge-success"
                      : "badge-ghost"
                }`}
              >
                {phase.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{phase.name}</p>
                <p className="text-xs opacity-75">{phase.description}</p>
              </div>
              {index === currentPhase && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="stats bg-base-200 mt-4">
          <div className="stat">
            <div className="stat-title text-xs">Estimated Time</div>
            <div className="stat-value text-sm">∞</div>
            <div className="stat-desc">+/- eternity</div>
          </div>
          <div className="stat">
            <div className="stat-title text-xs">Transfer Speed</div>
            <div className="stat-value text-sm">0 B/s</div>
            <div className="stat-desc">Peak efficiency</div>
          </div>
        </div>

        {progress === 100 && (
          <div className="alert alert-error mt-4">
            <AlertCircle className="w-4 h-4" />
            <span>Transfer failed successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
