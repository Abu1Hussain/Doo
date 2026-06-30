/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";

export default function HudCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();

    if (isTouchDevice) return;

    // Follow mouse with zero lag
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if mouse is over clickable or interactable elements
      const target = e.target as HTMLElement;
      if (target) {
        const isClickable =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("cursor-pointer") ||
          target.closest(".cursor-pointer");

        setIsHovered(!!isClickable);
      }
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Hide native cursor
    document.body.style.cursor = "none";
    const elementsToHide = document.querySelectorAll("a, button, input, select, [role='button']");
    elementsToHide.forEach((el) => {
      (el as HTMLElement).style.cursor = "none";
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "auto";
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      className="fixed pointer-events-none z-[999999] transition-transform duration-75 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Circle HUD element */}
      <div
        className={`absolute inset-0 rounded-full border border-cyan-400/40 transition-all duration-200 ${
          isHovered ? "w-8 h-8 opacity-100" : "w-0 h-0 opacity-0"
        } ${isActive ? "scale-[0.85] border-cyan-300" : "scale-100"}`}
        style={{
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Crosshair Hairlines */}
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Top tick */}
        <div
          className={`absolute w-[1.5px] h-1.5 bg-cyan-400 transition-all duration-100 ${
            isHovered ? "-translate-y-2" : "-translate-y-1"
          }`}
        />
        {/* Bottom tick */}
        <div
          className={`absolute w-[1.5px] h-1.5 bg-cyan-400 transition-all duration-100 ${
            isHovered ? "translate-y-2" : "translate-y-1"
          }`}
        />
        {/* Left tick */}
        <div
          className={`absolute h-[1.5px] w-1.5 bg-cyan-400 transition-all duration-100 ${
            isHovered ? "-translate-x-2" : "-translate-x-1"
          }`}
        />
        {/* Right tick */}
        <div
          className={`absolute h-[1.5px] w-1.5 bg-cyan-400 transition-all duration-100 ${
            isHovered ? "translate-x-2" : "translate-x-1"
          }`}
        />
      </div>
    </div>
  );
}
