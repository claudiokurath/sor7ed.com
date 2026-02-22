# SOR7ED Master Code Document - MARCH 2026 EDITION

This is the consolidated source of truth for the SOR7ED website, reflecting the latest "Stealth Luxury" cinematic design.

## 🎨 Global Styling (src/index.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-border; }
  body { @apply bg-black text-white antialiased; }
  html { scroll-behavior: smooth; }
}

@layer components {
  .btn-primary {
    @apply inline-block bg-sor7ed-yellow text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105;
  }
  .stealth-card {
    @apply bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-500;
  }
  .bg-grid {
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 50px 50px;
  }
}

/* Animations */
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-in { animation-fill-mode: both; }
.fade-in { animation: fade-in 1s ease-out; }
.slide-in-from-bottom-20 { animation: slide-up 1s ease-out; }
```

## 🛠 Tools Engine (src/pages/Tools.tsx)
Includes the hero banner with Midjourney inspiration image and cinematic background.

## 📝 Blog Repository (src/pages/Blog.tsx)
Consistent with the app aesthetic, featuring branch filtering and stealth cards.

## 🔐 The Vault (src/pages/Vault.tsx)
Secure member area with magic link authentication and protocol management.

## 📱 Core Layout (src/App.tsx)
Routing and global structure.

## 🔌 API Routes (api/tools.ts, api/articles.ts, api/signup.ts)
Notion integration and CRM sync.
