/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Folder as FolderIcon, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { soundSystem } from "../utils/audio";
import { TreeItem } from "../types";

interface FolderProps {
  item: TreeItem;
  level?: number;
  onFileSelect?: (file: TreeItem) => void;
  key?: React.Key | number | string;
}

export default function Folder({ item, level = 0, onFileSelect }: FolderProps) {
  const [isOpen, setIsOpen] = useState(level === 0 || item.name === "src" || item.name === "agent");
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSystem.playClick();
    setIsOpen(!isOpen);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    // Subtle physical magnetic translation tracking
    const factor = 0.12;
    el.style.setProperty("--magnet-x", `${x * factor}px`);
    el.style.setProperty("--magnet-y", `${y * factor}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--magnet-x", "0px");
    el.style.setProperty("--magnet-y", "0px");
  };

  if (item.type === "file") {
    return (
      <div
        className="flex items-center gap-2 py-1 hover:bg-cyan-950/20 px-2 rounded cursor-pointer transition-all border border-transparent hover:border-cyan-500/15 group"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          soundSystem.playClick();
          if (onFileSelect) onFileSelect(item);
        }}
      >
        <FileText className="w-3.5 h-3.5 text-cyan-500 group-hover:text-cyan-400 group-hover:scale-105 transition-all" />
        <span className="font-mono text-2xs sm:text-xs text-gray-400 group-hover:text-cyan-300 transition-colors">
          {item.name}
        </span>
      </div>
    );
  }

  return (
    <div className="select-none">
      {/* Folder Header */}
      <div
        className="flex items-center justify-between py-1.5 px-2 hover:bg-cyan-950/15 rounded cursor-pointer transition-all border border-transparent hover:border-cyan-500/10 group/folder"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="w-3 h-3 text-cyan-600 group-hover/folder:text-cyan-400" />
          ) : (
            <ChevronRight className="w-3 h-3 text-cyan-600 group-hover/folder:text-cyan-400" />
          )}

          {/* Interactive Folder Icon Container with physical animations */}
          <div 
            className="relative w-5 h-4 flex items-center justify-center mr-1"
            style={{
              transform: isHovered ? "translateY(-2px)" : "translateY(0px)",
              transition: "transform 0.15s ease-out"
            }}
          >
            {/* .folder__back: base backplate */}
            <div className="absolute inset-0 bg-cyan-950/80 border border-cyan-800/50 rounded-xs" />

            {/* .paper blocks: nested paper stubs that slide up when open */}
            <div 
              className={`absolute w-3 h-3.5 bg-cyan-100 border border-cyan-300 rounded-2xs flex flex-col gap-[1.5px] p-[2px] transition-all duration-300 ${
                isOpen ? "opacity-100 -translate-y-2 scale-100" : "opacity-0 translate-y-0 scale-75"
              }`}
              style={{
                transform: isOpen ? "translate(-50%, -10px) rotate(5deg)" : "translate(-50%, 0) scale(0.8)",
                left: "50%"
              }}
            >
              <div className="w-full h-[1px] bg-cyan-400" />
              <div className="w-[80%] h-[1px] bg-cyan-400" />
              <div className="w-[60%] h-[1px] bg-cyan-400" />
            </div>

            {/* Left and right offset paper fans */}
            <div 
              className={`absolute w-3 h-3.5 bg-cyan-200 border border-cyan-400 rounded-2xs transition-all duration-300 ${
                isOpen ? "opacity-90 -translate-y-2 rotate-[-15deg] scale-95" : "opacity-0 translate-y-0"
              }`}
              style={{
                left: "40%",
                top: isOpen ? "-4px" : "0px",
                display: isOpen ? "block" : "none"
              }}
            />
            <div 
              className={`absolute w-3 h-3.5 bg-cyan-300 border border-cyan-400 rounded-2xs transition-all duration-300 ${
                isOpen ? "opacity-90 -translate-y-2 rotate-[15deg] scale-95" : "opacity-0 translate-y-0"
              }`}
              style={{
                left: "60%",
                top: isOpen ? "-4px" : "0px",
                display: isOpen ? "block" : "none"
              }}
            />

            {/* .folder__front: segmented covering flap */}
            <div 
              className="absolute inset-x-0 bottom-0 top-[2px] bg-cyan-900/95 border-t border-cyan-400/50 rounded-b-xs transition-all duration-300 origin-bottom"
              style={{
                transform: isOpen ? "skewX(8deg) scaleY(0.7) translateY(1.5px)" : "skewX(0deg) scaleY(1) translateY(0px)",
                opacity: isOpen ? 0.85 : 1
              }}
            />
          </div>

          <span className="font-mono text-2xs sm:text-xs text-cyan-400/90 group-hover/folder:text-cyan-300 font-medium">
            {item.name}
          </span>
        </div>

        <span className="font-mono text-4xs text-cyan-800 group-hover/folder:text-cyan-600">
          {isOpen ? "CLOSE" : "OPEN"}
        </span>
      </div>

      {/* Children tree items */}
      {isOpen && item.children && (
        <div className="border-l border-cyan-950/40 ml-3.5 my-0.5 flex flex-col gap-0.5">
          {item.children.map((child, i) => (
            <Folder key={i} item={child} level={level + 1} onFileSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
