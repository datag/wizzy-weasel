# AGENTS.md - Projekt-Definition: EduPlay Kids

## 🎯 Projekt-Ziel
Entwicklung einer browserbasierten Lern-App (SPA) für Grundschulkinder. Fokus auf Gamification, Offline-First (LocalStorage) und intuitive Bedienung auf Tablets.

## 🛠 Tech-Stack
| Komponente       | Technologie                          |
| :--------------- | :----------------------------------- |
| **Framework** | Vue.js 3 (Composition API)           |
| **Build-Tool** | Vite                                 |
| **Sprache** | TypeScript                           |
| **State Mgmt** | Pinia (mit Persistence für LocalStorage) |
| **Styling** | Tailwind CSS                         |
| **i18n** | vue-i18n (DE/EN)                     |
| **Icons/Emoji** | Lucide-vue-next & Standard Emojis    |

---

## 🏗 Architektur-Richtlinien

### 1. Datenhaltung (Local-First)
- **User Profile:** Gespeichert im `LocalStorage`. Enthält Name, Avatar, Level, XP und den `Stamina`-Wert.
- **Settings:** Sprache (Locale), Sound-Optionen, OpenAI API Key (optional).
- **Persistence:** Pinia-Store nutzt `pinia-plugin-persistedstate`.

### 2. Layout & UI
- **Mobile First:** Optimiert für Tablets (Touch-Targets min. 44x44px).
- **Fullscreen Mode:** Button in der Navbar nutzt die Browsers-Fullscreen-API.
- **Navigation:** - Top-Bar: Logo (links), Stamina-Blitz & Profil-Status (rechts).
  - Main: Grid-Layout für Spielkacheln (Kategorien & Filter).
  - Game-View: Nutzt 100vh/100vw, blendet Standard-Navigation ggf. aus.

### 3. Internationalisierung (i18n/l10n)
- Automatische Erkennung via `navigator.language`.
- Unterstützung für Zahlenformate und Währungen via `Intl`-API.
- Fallback-Sprache: `de`.

---

## 🎮 Game-Logik: "Direction-Quix" (Demo-Game)
**Konzept:** Reaktionstest für Richtungsanweisungen.
- **Input:** Cursor-Tasten (Desktop) oder Swipe/Buttons (Tablet).
- **Variationen:** - Text-Modus: "links", "rechts", "oben", "unten".
  - Emoji-Modus: ⬅️, ➡️, ⬆️, ⬇️.
- **Erschwerung:** Zufällige Position auf dem Screen, wechselnde Farben, abnehmendes Zeitfenster pro Runde.
- **Scoring:** Erfolg erhöht XP, Fehler/Zeitüberschreitung verringert Stamina.

---

## 📂 Ordnerstruktur (Vorschlag)
```text
src/
├── assets/          # Global Styles, Fonts, SVGs
├── components/      
│   ├── ui/          # Wiederverwendbare UI-Elemente (Buttons, Cards)
│   ├── layout/      # Navbar, Fullscreen-Toggle, ProfileIndicator
│   └── games/       # Spiel-spezifische Komponenten
├── locales/         # i18n JSON Dateien (de.json, en.json)
├── stores/          # Pinia Stores (user.ts, settings.ts, game.ts)
├── views/           # Dashboard.vue, GameView.vue, Settings.vue
└── types/           # TS Interfaces (User, GameConfig, etc.)
