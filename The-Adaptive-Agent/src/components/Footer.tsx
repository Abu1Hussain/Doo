/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Github, Twitter, Linkedin, Instagram, HelpCircle, Compass, Home, BookOpen, MessageSquare } from "lucide-react";
import { soundSystem } from "../utils/audio";

export default function Footer() {
  const handleSocialHover = () => {
    soundSystem.playClick();
  };

  return (
    <footer className="relative bg-[#040407] border-t border-cyan-950/20 pt-16 pb-8 overflow-hidden w-full select-none">
      
      {/* -------------------- SVG PARALLAX WAVES SYSTEM -------------------- */}
      <div className="absolute top-0 left-0 w-full h-12 overflow-hidden pointer-events-none -translate-y-full">
        <svg
          className="absolute bottom-0 w-full h-12 min-h-12 max-h-12"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax-waves">
            {/* Wave 4: Backmost slowest */}
            <use
              href="#gentle-wave"
              x="48"
              y="0"
              className="fill-cyan-500/10"
              style={{
                animation: "wave-move 14s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite",
              }}
            />
            {/* Wave 3: Mid back */}
            <use
              href="#gentle-wave"
              x="48"
              y="3"
              className="fill-cyan-500/20"
              style={{
                animation: "wave-move 9s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite",
              }}
            />
            {/* Wave 2: Mid front */}
            <use
              href="#gentle-wave"
              x="48"
              y="5"
              className="fill-cyan-500/40"
              style={{
                animation: "wave-move 7s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite",
              }}
            />
            {/* Wave 1: Frontmost opaque wave */}
            <use
              href="#gentle-wave"
              x="48"
              y="7"
              className="fill-[#040407]"
              style={{
                animation: "wave-move 4s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite",
              }}
            />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8 relative z-10">
        
        {/* Social Icons Row with custom hover lifting & synthesis chimes */}
        <div className="flex gap-4">
          {[
            { Icon: Github, label: "GitHub", href: "https://github.com" },
            { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
            { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
            { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
          ].map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={handleSocialHover}
              className="w-10 h-10 rounded-full border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all duration-300 hover:-translate-y-[8px] hover:shadow-[0_4px_12px_rgba(34,211,238,0.3)] cursor-pointer"
              title={label}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Horizontal Navigation Menu */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-3xs sm:text-2xs font-mono text-gray-500">
          {[
            { icon: Home, label: "Home" },
            { icon: Compass, label: "Scenarios" },
            { icon: BookOpen, label: "Dossiers" },
            { icon: HelpCircle, label: "About" },
            { icon: MessageSquare, label: "Contact" },
          ].map(({ icon: NavIcon, label }) => (
            <button
              key={label}
              onClick={() => {
                soundSystem.playClick();
              }}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <NavIcon className="w-3.5 h-3.5 text-cyan-600" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Copyright attribution & branding */}
        <div className="text-center font-sans text-3xs text-gray-600 flex flex-col gap-1.5">
          <p className="font-semibold text-gray-500 tracking-wider">
            THE ADAPTIVE AGENT — HUD MISSION CONTROL
          </p>
          <p className="font-light">
            © {new Date().getFullYear()} Google AI Studio Build Challenge. Active Cognitive Telemetry Engine.
          </p>
        </div>

      </div>

      {/* Embedded CSS Wave Animations keyframe rules */}
      <style>{`
        @keyframes wave-move {
          0% { transform: translate3d(-90px, 0, 0); }
          100% { transform: translate3d(85px, 0, 0); }
        }
      `}</style>
    </footer>
  );
}
