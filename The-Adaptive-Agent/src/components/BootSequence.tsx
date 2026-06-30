/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";
import { soundSystem } from "../utils/audio";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if session booted to prevent repeating on refresh
    const hasBooted = sessionStorage.getItem("adaptive_agent_booted");
    if (hasBooted) {
      onComplete();
      return;
    }

    // Step 0: Horizontal CRT line expands
    soundSystem.playPowerOn();
    
    // Animate CRT expansion
    const t0 = setTimeout(() => {
      setStep(1); // Show terminal line 1
    }, 450);

    // Typing effect for lines
    const line1 = "ADAPTIVE INTELLIGENCE COGNITIVE ENGINE V2.0\n";
    const line2 = "INITIALIZING CORE DECISION PIPELINES...\n";
    const line3 = "VERIFYING ENVIRONMENT TELEMETRY CHANNELS...\n";
    const line4 = "LOADING DRIFT COMPARISON MATRIX... [OK]\n";
    const line5 = "SYSTEMS FUNCTIONAL. WELCOME TO COMMAND CONSOLE.";
    const fullText = line1 + line2 + line3 + line4 + line5;
    
    let currentIndex = 0;
    let typingTimer: NodeJS.Timeout;

    const t1 = setTimeout(() => {
      typingTimer = setInterval(() => {
        if (currentIndex < fullText.length) {
          setText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
          // Play micro click on random letters
          if (currentIndex % 3 === 0) {
            soundSystem.playClick();
          }
        } else {
          clearInterval(typingTimer);
          // Auto transition to main dashboard
          setTimeout(() => {
            setStep(2); // Expand vertically and finish
            setTimeout(() => {
              sessionStorage.setItem("adaptive_agent_booted", "true");
              onComplete();
            }, 400);
          }, 800);
        }
      }, 15); // rapid fast typing
    }, 600);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearInterval(typingTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    soundSystem.playClick();
    sessionStorage.setItem("adaptive_agent_booted", "true");
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#020204] z-[99999] flex flex-col items-center justify-center font-mono select-none overflow-hidden text-cyan-400">
      {/* CRT expansion horizontal line */}
      {step === 0 && (
        <div className="w-0 h-[2px] bg-cyan-400 animate-[expand-width_0.4s_ease-out_forwards]" />
      )}

      {/* Typing Terminal */}
      {step === 1 && (
        <div className="w-full max-w-xl px-6 py-8 border border-cyan-900/30 bg-[#06060b] rounded shadow-2xl relative overflow-hidden">
          {/* Ambient scanner sweep inside the boot logger */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 shadow-[0_0_10px_#22d3ee] animate-[scanline-drift_4s_linear_infinite]" />
          
          <div className="flex justify-between items-center border-b border-cyan-900/40 pb-2 mb-4 text-xs text-cyan-600">
            <span>[SYS MONITOR TERMINAL - BOOT]</span>
            <span className="animate-pulse">● COGNITIVE LINKING</span>
          </div>

          <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap min-h-[140px] text-cyan-300">
            {text}
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSkip}
              className="text-2xs uppercase border border-cyan-500/30 px-3 py-1 text-cyan-400 hover:bg-cyan-950/40 hover:border-cyan-400 transition-all cursor-pointer rounded"
            >
              Skip Init Sequence [Esc]
            </button>
          </div>
        </div>
      )}

      {/* vertical split expansion transition */}
      {step === 2 && (
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full h-1/2 bg-[#020204] border-b border-cyan-500/50 animate-[slide-up_0.4s_ease-in_forwards]" />
          <div className="w-full h-1/2 bg-[#020204] border-t border-cyan-500/50 animate-[slide-down_0.4s_ease-in_forwards]" />
        </div>
      )}

      {/* CSS Keyframes injected here for quick boot effects */}
      <style>{`
        @keyframes expand-width {
          0% { width: 0%; opacity: 0.2; }
          100% { width: 100%; opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes slide-down {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        @keyframes scanline-drift {
          0% { transform: translateY(0); }
          100% { transform: translateY(300px); }
        }
      `}</style>
    </div>
  );
}
