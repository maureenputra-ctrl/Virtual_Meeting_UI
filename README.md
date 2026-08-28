<div align="center">

# RDS Meet

An interactive front-end prototype exploring what a meeting platform looks like when it's designed by studying where Zoom, Google Meet, Microsoft Teams, and Webex fall short, then deliberately keeping what works, fixing what's broken, and adding what's missing.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=111)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&labelColor=111)](https://vitejs.dev)
[![Lucide](https://img.shields.io/badge/Icons-Lucide-014592?labelColor=111)](https://lucide.dev)
[![Status](https://img.shields.io/badge/status-prototype-yellow?labelColor=111)]()

**[🔗 Live demo](https://maureenputra-ctrl.github.io/virtual_meeting_UI/)**

</div>

---

## About this project

RDS Meet started as a competitive research exercise: study four major video conferencing platforms, evaluate them against a consistent set of criteria, and turn the findings into concrete product decisions. 

Every screen shown here is functional, not a static mockup: the lobby lists real meetings, the pre-join screen previews your actual webcam, the whiteboard draws, breakout rooms drag and drop, and the replay screen jumps between auto-generated chapters.

This repository contains the prototype UI. The research and business case behind it, competitive teardown, feature gap analysis, roadmap, and monetization model is summarized below and detailed in [`RDS_Meet_Presentation.pptx`](./RDS_Meet_Presentation.pptx).

## Research approach
| Step | What we did |
|---|---|
| **Select** | Chose 4 platforms by global market share: Zoom, Google Meet, Microsoft Teams, Webex |
| **Evaluate** | Scored each against 5 consistent criteria: interface design, navigation, in-meeting collaboration, post-meeting intelligence, and pricing-to-value |
| **Categorise** | Sorted every finding into **Keep**, **Fix**, or **Add** |
| **Build** | Turned the findings into concrete requirements for this prototype |

**Keep** - grid view, breakout rooms, polls, reactions, calendar integration, whiteboard, post-meeting file retrieval: proven patterns worth preserving.

**Fix** - cluttered navigation, inconsistent cross-platform design, one-way screen sharing, clunky breakout room assignment, whiteboards with no persistence.

**Add** - real-time participant analytics, auto-chapter meeting replay, a per-meeting engagement dashboard, and an AI-generated meeting summary, features no competitor offers well, or at all, without an extra add-on fee.

## Features implemented in this prototype

- **Lobby & dashboard** - today's meetings at a glance, live-badge indicators, quick join
- **Pre-join screen** - real webcam preview, mic/camera toggle before entering
- **Grid & speaker view** - dynamic participant layouts with pinning
- **Space Rooms** - an experimental spatial mode where participants sit in a themed virtual room instead of a static grid
- **Collaborative whiteboard** - draw, add sticky notes, undo/redo
- **Breakout rooms** - drag-and-drop participant assignment
- **Hand raise & reactions** - real-time, low-friction non-verbal feedback
- **Screen sharing & recording** - with a live REC indicator
- **Chat** - in-meeting messaging with toast notifications
- **Meeting replay** - auto-chapter segmentation with per-chapter jump navigation
- **Meeting history & analytics** - duration, engagement score, participation %, action items
- **Calendar** - view and join scheduled meetings
- **Settings** - appearance (light/dark), camera preview, meeting preferences
- **Command palette** - global search (⌘K)

## Tech stack

- **[React 18](https://react.dev)** - UI, all in a single self-contained component tree
- **[Vite](https://vitejs.dev)** - dev server & build tooling
- **[Lucide React](https://lucide.dev)** - icon set
- No backend, no external API calls - all data is mocked in-memory to keep the prototype fully self-contained and demo-ready


## Project structure

```
.
├── virtual_meeting_ui.jsx          # Main application — all screens & UI logic
├── src/
│   └── main.jsx               # React entry point
├── index.html                  # Vite HTML entry
├── RDS_Meet_Presentation.pptx  # Research & product strategy deck
├── vite.config.js
└── package.json
```

## Background & context

This project was built during an IT development internship, centred around a simple question: *how could quality of life features from different virtual meeting apps be put into a single app?* The accompanying deck covers the full picture including: market sizing, a phased roadmap, go-to-market strategy, and revenue projections. But this repository is focused specifically on the interactive prototype that came out of that process.

## Author

**Maureen F. Putra**

---

<div align="center">
<sub>Built with React + Vite · Prototype for research & educational purposes</sub>
</div>
