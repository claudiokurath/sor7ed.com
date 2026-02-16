# SOR7ED SYSTEM ARCHITECTURE: THE BIBLE
**Last Updated:** February 16, 2026
**Status:** Live Production (V1.2)
**Brand Voice:** Stealth Luxury / Neuro-Divergent Protocol

---

## 🏗️ 1. Project Foundations

### **Core Identity**
SOR7ED is a **High-Fidelity Executive Function Platform** designed specifically for neurodivergent minds (ADHD/Autism) with a "Stealth Luxury," minimalist aesthetic.

*   **Front End:** React + TypeScript (Next.js/Vite Architecture)
*   **Back End:** Notion API (Headless CMS) + Serverless Functions (`api/`)
*   **AI Engine:** Gemini 2.0 Flash (Automated Content Generation)
*   **Infrastructure:** Vercel (Hosting) + GitHub (Repo)

### **Key Site Architecture**
1.  **THE LOGO (Hero)**: Replaced generic title text with `public/logo.png`.
2.  **THE FOUNDATION (Vectors)**: Explains the "7 Branches of Life" system.
3.  **THE LAB (Registry)**: The interactive tools section (renamed from "Registry").
4.  **THE INSIGHTS (Blog)**: Deep analysis and protocols.

---

## 🧪 2. THE LAB: Interactive Tool Registry

The "Lab" is the heart of the application, featuring **43+ Tools** powered by Notion but rendered as **Interactive React Components**.

### **a) Custom High-Fidelity Apps (Hardcoded)**
These are fully engineered React applications embedded directly into the homepage for instant utility:
*   **NoiseMixer (`NoiseMixer.tsx`)**: Generates real-time Brown, Pink, and White noise for sensory gating. Users can mix volumes independently.
*   **BodyDouble (`BodyDouble.tsx`)**: A presence simulator with task timer and randomized motivational prompts ("Are you still on track?").
*   **CommunicationBridge (`CommunicationBridge.tsx`)**: An "Email Shield" that sanitizes raw emotional input into corporate-safe language.
*   **DopamineMenu (`DopamineMenu.tsx`)**: Generates low-friction activity lists.
*   **TaskBreaker (`TaskBreaker.tsx`)**: Deconstructs overwhelming tasks into atomic steps.
*   **MoodTracker (`MoodTracker.tsx`)**: Logs biometric/emotional states.
*   **RoutineBuilder (`RoutineBuilder.tsx`)**: Sequences daily habits.
*   **SocialSimulator (`SocialSimulator.tsx`)**: Practices social scripts.
*   **TimeVisualizer (`TimeVisualizer.tsx`)**: Visualizes time blindness.
*   **FocusTimer (`FocusTimer.tsx`)**: Pomodoro-style timer.
*   **SensoryFidget (`SensoryFidget.tsx`)**: Visual interactive fidget tool.

### **b) The "Dynamic Engine" (`DynamicTool.tsx`)**
For the remaining ~30 tools defined in Notion, the system uses a **Universal Renderer**:
*   Reads a **JSON Schema** from the Notion `Template` property.
*   Auto-generates UI (Inputs, Sliders, Toggles).
*   Runs logic defined in the schema.
*   Displays a "Premium Operational Guide" with export-to-PDF functionality.

---

## 🧠 3. Content Architecture & Automation

The entire site's content is **AI-Generated and Managed via Notion**.

### **Master Notion Database Integration**
*   **Tools Database ID:** `2fb0d6014acc80699332d6e01539deb2`
*   **Blog Database ID:** `2d80d6014acc8057bbb9e15e74bf70c6`

### **Automation Script: `rebuild_tools_content.py`**
"The Ultimate Protocol Architect v2.0"
*   **Purpose:** Resets and rebuilds EVERY tool in Notion to eliminate placeholders.
*   **Features:**
    *   **Gemini 2.0 Integration:** Writes high-fidelity copy for `Problem Statement`, `How It Works`, `Who It's For`.
    *   **Schema Generation:** Auto-codes valid JSON logic for the website UI.
    *   **Unique Keywords:** Scans existing triggers to ensure every tool has a unique WhatsApp keyword (differentiates generic terms like "FOCUS").
    *   **Dynamic Pricing:** Assigns a `Credit Cost` (Price: £19-£49) to each tool based on complexity.

### **Automation Script: `rebuild_blog_content.py`**
"The Insight Engine"
*   **Purpose:** Generates 80+ articles with "Neuro-Shift" frameworks.
*   **Features:**
    *   Writes structured content with TL;DRs and bold formatting.
    *   Auto-selects the correct "Life Vector" (Mind, Body, Wealth, etc.).

---

## 📱 4. Conversion & Monetization Infrastructure

### **WhatsApp Ecosystem (Dual-Line Strategy)**
The system routes users to specific numbers based on intent:
1.  **Concierge Line (`+44 7360 277713`)**: General inquiries, human support.
    *   *Trigger:* "Message Concierge" button in Hero.
2.  **Tool Deployment Line (`+44 7966 628285`)**: Automated protocol delivery.
    *   *Trigger:* "Deploy to WhatsApp" button inside tools.
    *   *Action:* User texts a specific KEYWORD (e.g., "DOPAMINE") to receive the tool instantly.

### **Monetization (The Export)**
*   **System Documentation**: Every tool offers a downloadable PDF guide.
*   **Pricing Display**: The download button dynamically displays the cost (e.g., `[ EXPORT SYSTEM DOCUMENTATION • £19 ]`) pulled from Notion's `Credit Cost` field.

---

## 📂 5. File Structure Overview

### **/src/pages**
*   `Home.tsx`: The single-page application orchestrator. Manages sections (Hero, Lab, Blog), routing, and modal states.

### **/src/components/tools**
*   Contains all 13 interactive tool components (`.tsx`).
*   `DynamicTool.tsx`: The generic renderer for Notion-based tools.

### **/api**
*   `tools.ts`: Serverless function. Fetches active tools from Notion, maps `Credit Cost` to `price`.
*   `posts.ts`: Serverless function. Fetches published blog posts.
*   `bot.ts`: Helper for potential bot logic (reference).

### **/scripts**
*   (40+ Scripts) Key ones:
    *   `rebuild_tools_content.py`: **CRITICAL** - Runs the AI architect.
    *   `rebuild_blog_content.py`: **CRITICAL** - Content engine.
    *   `list_tools_status.py`: Diagnostic.

---

## ✅ 6. Current Status & Next Steps

### **Accomplished**
1.  **Total Rebrand:** "The Lab" name adopted, Logo deployed, "Registry" name retired.
2.  **Interactive Apps:** `NoiseMixer`, `BodyDouble`, `CommunicationBridge` fully functional.
3.  **Content Fill:** All 43 tools and 80 blogs populated with high-quality AI content.
4.  **Routing:** WhatsApp traffic correctly split between two numbers.
5.  **Pricing:** Dynamic pricing displayed on frontend.

### **Pending / Maintenance**
*   **Logo Asset:** Ensure `public/logo.png` is the final high-res version (currently a placeholder or text file).
*   **Deployment:** `package-lock.json` was cleared to fix build permissions; monitor Vercel logs for successful cold build.
