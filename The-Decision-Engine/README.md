<h1 align="center">🛡️ The Decision Engine</h1>

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/AI-Gemini_API-8E75B2?style=for-the-badge&logo=google" alt="Gemini API" />
  <img src="https://img.shields.io/badge/UI-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framework-React_Vite-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</div>

<br />

> **An autonomous security verification layer and guardrail system for AI Agents, ensuring safe tool execution, database access, and budget protection in real-time.**

---

## 📖 Overview
AI agents are incredibly powerful, yet they lack inherent boundaries. Granting an LLM direct access to system tools, financial API endpoints, or database tables exposes secure systems to catastrophic prompt-injection bypasses, unauthorized commands, and data leaks.

**The Decision Engine** serves as an intelligent, real-time Sentry guardrail. It sits securely between user/agent intent and critical back-end resources. By parsing proposed query payloads and analyzing contextual parameters—such as user authority levels, environmental time locks, and active system rules—it dynamically determines whether an action is **APPROVED**, **DENIED**, or requires **MULTI-FACTOR AUTHENTICATION (MFA)** before execution.

---

## ✨ Core Features & Visual Architecture

### 1. Interactive Sandbox Simulator
An operational playground allowing developers and judges to simulate Sentry guardrail behavior across diverse system commands:
- **Explicit Intent Capture:** Select a **Target System Object** (e.g., *Financial Ledger*, *PII Salary Database*, *API Gateway*, *DevOps Server*) and propose an **Action Command** (e.g., *Transfer Funds*, *Read Salary Records*, *Wipe Cache*, *Deploy Build*).
- **Simulated Intent Query Payload:** Input natural language strings representing agent intent to test compliance and bypass handling.

### 2. Premium Identity & Authority Management
- **Mock Identity / User Authority Selector:** A sleek dropdown featuring customizable user roles:
  - 👤 **Admin** (Clearance Level 3)
  - 📊 **Finance Manager** (Clearance Level 2)
  - 🛠️ **Customer Support** (Clearance Level 1)
  - 💻 **Junior Developer** (Clearance Level 1)
- **Clearance Badge:** Fully responsive UI badges indicating security levels and multi-factor authentication (MFA) enrollment states.

### 3. Contextual Environmental Constraints
A live variable simulator mimicking real-world runtime context parameters:
- **Simulated Environmental Clock:** Interactive slider to modify the system's operational hour to test time-locked actions (e.g., locking fund transfers outside 9 AM - 5 PM).
- **IP Location Tracking:** Dynamic spoofing of requests from domestic versus restricted international locations.

### 4. Domain-Specific Policy Specifications
A library of modular, domain-specific security rules evaluated in real-time:
- **Ledger Blueprints:** Preventing financial bleeding by setting volume-based transfer thresholds.
- **Salary DB Blueprints:** Protecting personal identifiable information (PII) against unauthorized reads.
- **DevOps Blueprints:** Eliminating catastrophic cache wipes or deployments triggered by unauthorized rolesHere is the ultimate, updated version of your `README.md`. It perfectly integrates the new Sentry guardrail details, the Gemini API environment setup, the hackathon pitch guide, and the specific `JetBrains Mono` visual identity. 

I have also formatted it strictly to ensure maximum scannability and impact for developers and hackathon judges.

Copy and paste this directly into your `README.md` file to overwrite the old text:

***

```markdown
<h1 align="center">🛡️ The Decision Engine</h1>

<div align="center">
  <img src="[https://img.shields.io/badge/Status-Active-success?style=for-the-badge](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)" alt="Status" />
  <img src="[https://img.shields.io/badge/UI-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss](https://img.shields.io/badge/UI-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss)" alt="Tailwind CSS" />
  <img src="[https://img.shields.io/badge/Framework-React_Vite-646CFF?style=for-the-badge&logo=vite](https://img.shields.io/badge/Framework-React_Vite-646CFF?style=for-the-badge&logo=vite)" alt="Vite" />
  <img src="[https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)" alt="TypeScript" />
</div>

<br />

> **An autonomous security verification layer and guardrail system for AI Agents, ensuring safe tool execution, database access, and budget protection in real-time.**

---

## 📖 Overview

AI agents are incredibly powerful, yet they lack inherent boundaries. Granting an LLM direct access to system tools, financial API endpoints, or database tables exposes secure systems to catastrophic prompt-injection bypasses, unauthorized commands, and data leaks.

**The Decision Engine** serves as an intelligent, real-time Sentry guardrail. It sits securely between user/agent intent and critical back-end resources. By parsing proposed query payloads and analyzing contextual parameters—such as user authority levels, environmental time locks, and active system rules—it dynamically determines whether an action is **APPROVED**, **DENIED**, or requires **MULTI-FACTOR AUTHENTICATION (MFA)** before execution.

---

## ✨ Core Features & Visual Architecture

### 1. Interactive Sandbox Simulator
An operational playground allowing developers and judges to simulate Sentry guardrail behavior across diverse system commands.
* **Zone 1 Intent Capture:** Select a Target System Object (e.g., Financial Ledger, PII Salary Database, API Gateway, DevOps Server).
* **Zone 1 Proposed Command:** Select the Action Command (e.g., Transfer Funds, Read Salary Records, Wipe Cache, Deploy Build).
* **Simulated Intent Query Payload:** Input natural language strings representing agent intent to test compliance and bypass handling.

### 2. Premium Identity & Authority Management
A sleek dropdown simulator featuring customizable user roles and responsive clearance badges indicating security levels and MFA enrolment states.
* 👤 **Admin:** Clearance Level 3
* 📊 **Finance Manager:** Clearance Level 2
* 🛠️ **Customer Support:** Clearance Level 1
* 💻 **Junior Developer:** Clearance Level 1

### 3. Contextual Environmental Constraints
A live variable simulator mimicking real-world runtime context parameters.
* **Simulated Environmental Clock:** Interactive slider to modify the system's operational hour to test time-locked actions (e.g., fund transfers locked outside 9 AM - 5 PM).
* **IP Location Tracking:** Dynamic spoofing of requests from domestic versus restricted international locations.

### 4. Domain-Specific Policy Specifications
A library of modular, domain-specific security rules evaluated in real-time.
* **Ledger Blueprints:** Preventing financial bleeding by setting volume-based transfer thresholds.
* **Salary DB Blueprints:** Protecting personal identifiable information (PII) against unauthorized reads.
* **DevOps Blueprints:** Eliminating catastrophic cache wipes or deployments triggered by unauthorized roles.

---

## 🛠️ Project Architecture

```text
├── root/
│   ├── server.ts          # Node.js/Express API backend & server-side Vite middleware
│   ├── package.json       # Node dependencies, build compilation, and start scripts
│   ├── .env.example       # Environment variable declarations (e.g. GEMINI_API_KEY)
│   ├── tsconfig.json      # TypeScript configuration parameters
│   └── src/
│       ├── App.tsx        # Sentry Interactive Client Dashboard
│       ├── types.ts       # TypeScript data models, preset users, and schemas
│       ├── main.tsx       # React client mount entrypoint
│       └── index.css      # Tailwind CSS variables, display typography, and smooth sliders
