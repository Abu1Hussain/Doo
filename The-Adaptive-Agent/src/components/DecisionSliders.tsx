/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { soundSystem } from "../utils/audio";
import { Sliders, Shield, AlertTriangle, ShieldAlert, Timer } from "lucide-react";

interface DecisionSlidersProps {
  driftSensitivity: number;
  onDriftSensitivityChange: (val: number) => void;
  autonomyCeiling: number; // 1 to 5
  onAutonomyCeilingChange: (val: number) => void;
  reversalCooldown: number; // 0 to 60 seconds
  onReversalCooldownChange: (val: number) => void;
  isCooldownCounting: boolean;
  cooldownProgress: number; // 0 to 1
  cooldownTimeLeft: number; // in seconds
  onCooldownFinished: () => void;
}

const autonomySteps = [
  "ALWAYS ASK",
  "LOW THRESHOLD ONLY",
  "MODERATE ADAPTATION",
  "HIGH AUTONOMY",
  "FULLY AUTONOMOUS"
];

export default function DecisionSliders({
  driftSensitivity,
  onDriftSensitivityChange,
  autonomyCeiling,
  onAutonomyCeilingChange,
  reversalCooldown,
  onReversalCooldownChange,
  isCooldownCounting,
  cooldownProgress,
  cooldownTimeLeft,
  onCooldownFinished,
}: DecisionSlidersProps) {
  const [activeSlider, setActiveSlider] = useState<"sensitivity" | "autonomy" | "cooldown" | null>(null);
  const [isDraggingSens, setIsDraggingSens] = useState(false);
  const [isDraggingAuto, setIsDraggingAuto] = useState(false);
  const [isDraggingCool, setIsDraggingCool] = useState(false);

  // Play click sounds on slide trigger release
  const handleRelease = (slider: "sensitivity" | "autonomy" | "cooldown") => {
    soundSystem.playClick();
    setActiveSlider(null);
    if (slider === "sensitivity") setIsDraggingSens(false);
    if (slider === "autonomy") setIsDraggingAuto(false);
    if (slider === "cooldown") setIsDraggingCool(false);
  };

  // Convert seconds into MM:SS
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="border border-cyan-950/20 p-5 bg-[#08080d] rounded-lg select-none relative overflow-hidden flex flex-col gap-6">
      
      {/* Header bar */}
      <div className="flex justify-between items-center border-b border-cyan-950/40 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-500" />
          <h4 className="font-display font-medium text-xs sm:text-sm text-cyan-100 uppercase tracking-wider">
            Adaptation Decision Sliders
          </h4>
        </div>
        <span className="text-4xs font-mono text-cyan-600 uppercase tracking-widest">[CONSOLE_MIXER_BLOCK]</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* SLIDER A: Drift Sensitivity */}
        <div
          id="slider-block-sensitivity"
          className={`md:col-span-4 p-3 rounded-md border transition-all duration-300 relative ${
            activeSlider === "sensitivity" ? "border-cyan-500/20 bg-cyan-950/5" : "border-transparent"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-3xs font-mono text-cyan-500 uppercase tracking-wider font-semibold">
              DRIFT SENSITIVITY
            </span>
            <span className="font-mono text-xs text-white px-1.5 py-0.5 bg-cyan-950 border border-cyan-800/30 rounded">
              {driftSensitivity}
            </span>
          </div>

          <p className="text-4xs text-gray-500 leading-snug font-sans mb-4">
            Low values ignore minor noise. High values trigger plan checks on any micro deviation.
          </p>

          <div className="relative pt-2 pb-4">
            {/* Ruler tick marks */}
            <div className="flex justify-between px-1 mb-1.5 text-5xs font-mono text-cyan-800">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>

            {/* Slider track */}
            <div className="relative h-2.5 w-full bg-cyan-950/50 rounded border border-cyan-950/30 inset-shadow-xs">
              <input
                type="range"
                min="0"
                max="100"
                value={driftSensitivity}
                onFocus={() => setActiveSlider("sensitivity")}
                onMouseDown={() => setIsDraggingSens(true)}
                onMouseUp={() => handleRelease("sensitivity")}
                onTouchStart={() => setIsDraggingSens(true)}
                onTouchEnd={() => handleRelease("sensitivity")}
                onChange={(e) => onDriftSensitivityChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {/* Active fill */}
              <div
                className="absolute left-0 top-0 h-full bg-cyan-950/80 border-r border-cyan-500/30 rounded-l"
                style={{ width: `${driftSensitivity}%` }}
              />

              {/* Console slider fader cap */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-6 bg-cyan-400 border border-cyan-300 rounded shadow-md cursor-pointer transition-all flex flex-col justify-between p-[2px] ${
                  isDraggingSens ? "shadow-[0_0_12px_#22d3ee] scale-105" : ""
                }`}
                style={{ left: `${driftSensitivity}%` }}
              >
                <div className="w-full h-[1.5px] bg-cyan-800/60" />
                <div className="w-full h-[1.5px] bg-cyan-800" />
                <div className="w-full h-[1.5px] bg-cyan-800/60" />
              </div>
            </div>
          </div>
        </div>

        {/* SLIDER B: Autonomy Ceiling */}
        <div
          id="slider-block-autonomy"
          className={`md:col-span-4 p-3 rounded-md border transition-all duration-300 relative ${
            activeSlider === "autonomy" ? "border-cyan-500/20 bg-cyan-950/5" : "border-transparent"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-3xs font-mono text-cyan-500 uppercase tracking-wider font-semibold">
              AUTONOMY CEILING
            </span>
            <span className="font-mono text-3xs text-cyan-300 px-1.5 py-0.5 bg-cyan-950 border border-cyan-800/30 rounded">
              Lvl {autonomyCeiling}
            </span>
          </div>

          <p className="text-4xs text-gray-500 leading-snug font-sans mb-4">
            Defines the maximum severity of environment change the agent resolves without explicit confirmation.
          </p>

          <div className="relative pt-2 pb-4">
            {/* Notches layout */}
            <div className="flex justify-between px-1 mb-1.5 text-5xs font-mono text-cyan-800">
              <span>L1</span>
              <span>L2</span>
              <span>L3</span>
              <span>L4</span>
              <span>L5</span>
            </div>

            {/* Slider track */}
            <div className="relative h-2.5 w-full bg-cyan-950/50 rounded border border-cyan-950/30">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={autonomyCeiling}
                onFocus={() => setActiveSlider("autonomy")}
                onMouseDown={() => setIsDraggingAuto(true)}
                onMouseUp={() => handleRelease("autonomy")}
                onTouchStart={() => setIsDraggingAuto(true)}
                onTouchEnd={() => handleRelease("autonomy")}
                onChange={(e) => onAutonomyCeilingChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {/* Notch tick points */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1.5 pointer-events-none">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${
                      autonomyCeiling >= idx ? "bg-cyan-500/60" : "bg-cyan-950"
                    }`}
                  />
                ))}
              </div>

              {/* Console slider fader cap */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-6 bg-cyan-400 border border-cyan-300 rounded shadow-md cursor-pointer transition-all flex flex-col justify-between p-[2px] ${
                  isDraggingAuto ? "shadow-[0_0_12px_#22d3ee] scale-105" : ""
                }`}
                style={{ left: `${((autonomyCeiling - 1) / 4) * 100}%` }}
              >
                <div className="w-full h-[1.5px] bg-cyan-800/60" />
                <div className="w-full h-[1.5px] bg-cyan-800" />
                <div className="w-full h-[1.5px] bg-cyan-800/60" />
              </div>
            </div>
          </div>

          <div className="mt-1 text-center font-mono text-3xs text-cyan-400 font-semibold uppercase tracking-wider">
            {autonomySteps[autonomyCeiling - 1]}
          </div>
        </div>

        {/* SLIDER C: Plan Reversal Cooldown */}
        <div
          id="slider-block-cooldown"
          className={`md:col-span-4 p-3 rounded-md border transition-all duration-300 relative ${
            activeSlider === "cooldown" ? "border-cyan-500/20 bg-cyan-950/5" : "border-transparent"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-3xs font-mono text-cyan-500 uppercase tracking-wider font-semibold">
              PLAN REVERSAL COOLDOWN
            </span>
            <span className="font-mono text-xs text-white px-1.5 py-0.5 bg-cyan-950 border border-cyan-800/30 rounded">
              {reversalCooldown}s
            </span>
          </div>

          <p className="text-4xs text-gray-500 leading-snug font-sans mb-4">
            Minimum latency required after detecting drift before committing to revised plans. Prevents signal thrashing.
          </p>

          <div className="grid grid-cols-12 gap-3 items-center">
            
            {/* Slider control */}
            <div className="col-span-8 relative pt-2 pb-4">
              <div className="flex justify-between px-1 mb-1.5 text-5xs font-mono text-cyan-800">
                <span>0s</span>
                <span>30s</span>
                <span>60s</span>
              </div>

              <div className="relative h-2.5 w-full bg-cyan-950/50 rounded border border-cyan-950/30">
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={reversalCooldown}
                  disabled={isCooldownCounting}
                  onFocus={() => setActiveSlider("cooldown")}
                  onMouseDown={() => setIsDraggingCool(true)}
                  onMouseUp={() => handleRelease("cooldown")}
                  onTouchStart={() => setIsDraggingCool(true)}
                  onTouchEnd={() => handleRelease("cooldown")}
                  onChange={(e) => onReversalCooldownChange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-not-allowed z-10 disabled:cursor-not-allowed"
                />

                {/* Active fill */}
                <div
                  className="absolute left-0 top-0 h-full bg-cyan-950/80 border-r border-cyan-500/30 rounded-l"
                  style={{ width: `${(reversalCooldown / 60) * 100}%` }}
                />

                {/* Slider fader thumb */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 -ml-2.5 w-5 h-6 bg-cyan-400 border border-cyan-300 rounded shadow-md transition-all flex flex-col justify-between p-[2px] ${
                    isCooldownCounting ? "opacity-30 cursor-not-allowed bg-cyan-800" : "cursor-pointer"
                  } ${isDraggingCool ? "shadow-[0_0_12px_#22d3ee]" : ""}`}
                  style={{ left: `${(reversalCooldown / 60) * 100}%` }}
                />
              </div>
            </div>

            {/* Live countdown timer display */}
            <div className="col-span-4 flex flex-col items-center justify-center p-2.5 border border-cyan-950 bg-[#06060c] rounded text-center relative overflow-hidden">
              {isCooldownCounting ? (
                <>
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    {/* SVG circular progress indicator draining */}
                    <svg className="w-8 h-8 transform -rotate-90 absolute">
                      <circle cx="16" cy="16" r="13" className="stroke-cyan-950 fill-none" strokeWidth="2.5" />
                      <circle
                        cx="16"
                        cy="16"
                        r="13"
                        className="stroke-cyan-400 fill-none transition-all duration-1000"
                        strokeWidth="2.5"
                        strokeDasharray={2 * Math.PI * 13}
                        strokeDashoffset={(1 - cooldownProgress) * (2 * Math.PI * 13)}
                      />
                    </svg>
                    <Timer className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  </div>
                  <span className="font-mono text-2xs font-semibold text-cyan-300 mt-1">
                    {formatTime(cooldownTimeLeft)}
                  </span>
                  <span className="text-5xs font-mono text-cyan-600 uppercase tracking-widest leading-none">CD_LOCK</span>
                </>
              ) : (
                <>
                  <Timer className="w-5 h-5 text-cyan-900 mb-0.5" />
                  <span className="font-mono text-xs text-cyan-800">READY</span>
                  <span className="text-5xs font-mono text-cyan-900 uppercase">STANDBY</span>
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
