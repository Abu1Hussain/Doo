<h1 align="center">🌐 The Decision Engine</h1>

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/UI-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framework-React_Vite-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</div>

<br />

> **An autonomous AI system interface explicitly engineered to know when it is authorized to act, evaluating real-time telemetry against strict policy guardrails before executing commands.**

This repository contains the complete frontend architecture for **The Decision Engine**. Built with a meticulous, human-centric design language, this dashboard rejects generic template patterns in favor of high-readability typography, purposeful whitespace, and precise data hierarchy.

---

## 📑 Table of Contents
- [The 5 Core Functional Zones](#-the-5-core-functional-zones)
- [Design System & Color Theory](#-design-system--color-theory)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)

---

## ⚡ The 5 Core Functional Zones

To empower the underlying AI model with the exact telemetry, constraints, and operational context it requires to make a safe decision, the dashboard is structurally broken down into five dedicated zones:

1. **The Context & Environment Feed:** Real-time ingestion of world states, containing user authorization credentials, active time stamps, and server metrics.
2. **Explicit Intent Capture:** High-contrast configurator-style option chips that clearly isolate the "Target Object" from the "Proposed Command," ensuring clean data inputs.
3. **The Guardrails & Policy Matrix:** A modular interface of interactive utility cards displaying the running constraints and rules the AI must evaluate against.
4. **Evaluation Transparency Layer:** The focal centerpiece of the application. It visually steps through the policy checklist and displays the final authoritative state badge: `ALLOWED TO ACT` or `ACTION DENIED`.
5. **Human-in-the-Loop Override:** An automated conditional safety fallback mechanism that securely reveals an emergency authorization gateway only when risk levels are flagged as ambiguous or critical.

---

## 🎨 Design System & Color Theory

The interface uses an intentional, highly tailored color economy where bright accents never occupy more than 5% of the viewport canvas, creating an "expensive-looking" editorial layout.

### 🖤 Dark Mode System
* **Canvas Background:** Deep, premium Near-Black (`#272729` / `#000000`).
* **Success state (`ALLOWED TO ACT`):** Glacial Ice Cyan (`#64d2ff`) for sharp, readable telemetry.
* **Neutral State:** Neo-Indigo (`#5e5ce6`) for analytical processing metrics.
* **Warning state (`PENDING APPROVAL`):** Muted Amber (`#ff9f0a`) for a high-end metallic warning.

### 🤍 Light Mode System
* **Canvas Background:** Pure White (`#ffffff`) and refined Parchment (`#f5f5f7`).
* **Success state (`ALLOWED TO ACT`):** Spruce Ink (`#1a4329`) with translucent overlay fills.
* **Failure state (`ACTION DENIED`):** Sienna Terracotta (`#b54724`) for a sophisticated warning tone.
* **Primary Accent:** Deep Iris (`#3a36db`) for active layout highlights.

### 🗣️ Typography Scale
* **Hero Display:** 64px (Tracking -0.02em, Weight 600) for striking, readable clarity.
* **Paragraph Body Text:** 19px (Line-height 1.55, Weight 400) optimized for long-form reading comfort and zero accessibility eye-strain.

---

## 🗂️ Project Structure

The workspace is configured using a modern Vite + TypeScript build environment:

```text
THE-DECISION-ENGINE/
├── assets/             # Static media and design assets
├── src/                # Core React components and application logic
├── .env.example        # Environment variable templates
├── index.html          # Main HTML document entry point
├── package.json        # NPM dependencies and scripts
├── server.ts           # Backend/API routing logic
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite build tooling setup
