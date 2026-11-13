# Cinematic Portfolio — Development Log & Architecture Guide

**Project:** Personal Cinematic Portfolio for Dannana Srinivasa Rao  
**Directory:** `/Volumes/Personal Projects/IT Projects/profile-with-bootstrap`  
**GitHub Repository:** `https://github.com/srinivasaraodannana/profile-with-bootstrap`  
**Author:** Antigravity (Google DeepMind) & Dannana Srinivasa Rao  
**Date:** November 2026  

---

## 1. Executive Summary & Vision

This project transformed a traditional personal resume website into a **world-class, cinematic dark-luxury personal portfolio**. 

The design is directly inspired by modern high-end creative developer portfolios (such as the reference video showcase), integrating real footage of the author into a fluid, animated narrative.

### Core Visual Identity
- **Theme:** Dark Luxury / Industrial Cyberpunk.
- **Color Palette:**
  - Backgrounds: Obsidian `#040507` and Deep Charcoal `#07080b`.
  - Accent Color: **Industrial Neon Amber** (`#FF6B00`, `#FF851a`, `#FFA149`) with glowing edge lighting.
  - Text: Clean white `#FFFFFF`, steel gray `#94A3B8`, muted `#64748B`.
- **Typography Pairing:**
  - **Syne** (Google Fonts): Bold, ultra-wide sans-serif for oversized display headers.
  - **Playfair Display** (Google Fonts): Italic serif contrast for signature phrases (e.g., *"in the making."*, *"kit."*, *"recognition."*).
  - **Plus Jakarta Sans** (Google Fonts): Modern, crisp geometry for body text.
  - **JetBrains Mono** (Google Fonts): Technical monospaced typography for engineering metrics and code prompts.

---

## 2. The Signature Feature: Floating Video Persona

The hallmark of this portfolio is the **interactive, floating video character** that dynamically travels across the screen as the visitor scrolls.

### A. Video Assets Used
Stored in the [`videos/`](file:///Volumes/Personal%20Projects/IT%20Projects/profile-with-bootstrap/videos/) folder:
1. `Man_waving_at_camera_9587db74_1080p.mp4` — High-definition studio footage of Srinivasa Rao waving and greeting visitors (used in the **Hero** section).
2. `Man_smiling_at_camera_63040544_1080p.mp4` — High-definition studio footage of Srinivasa Rao smiling confidently in a suit (used in **About Me** and **Skills**).
3. `Idle.mp4` & `Presenting.mp4` — Additional generated persona loops available for future section extensions.

### B. Seamless Black Blending (No Green Screen Needed)
Because the video was recorded against a dark studio background, we eliminated any rectangular video borders using pure CSS:
- `mix-blend-mode: screen;` — Leaves pure black (`#000000`) completely transparent while rendering bright pixels (face, shirt, suit lapels, tie).
- `mask-image: radial-gradient(ellipse at 50% 45%, black 50%, rgba(0,0,0,0.85) 70%, transparent 95%);` — Softens the edges of the video into a seamless vignette.
- `.persona-backlight` — An animated amber radial glow placed behind the character to emulate warm studio rim lighting.

### C. Scroll Choreography (GSAP ScrollTrigger)
Managed inside [`js/cinematic.js`](file:///Volumes/Personal%20Projects/IT%20Projects/profile-with-bootstrap/js/cinematic.js):
- **Hero Section (`state-hero`):** Character is anchored on the **right half** of the screen (`transform: translate(0, 0)`), actively looping Video 1 (waving).
- **About Me Section (`state-about`):** When the user scrolls into `#about`, ScrollTrigger triggers a 0.9s cubic-bezier transition gliding the character to the **left half** of the screen (`transform: translate(-50vw, 0)`). Video 1 crossfades into Video 2 (smiling).
- **Sites Section (`state-subtle`):** To give full visibility to the 6 industrial execution cards, the character scales slightly down and fades to subtle ambient opacity (`opacity: 0.12`).
- **Skills Section (`state-skills`):** Glides back to the **right half** of the screen alongside the interactive skills accordion.
- **Projects & Contact (`state-subtle`):** Character rests gently in the background so interactive cards and contact forms take priority.
- **Mobile/Tablet View (`max-width: 991px`):** The fixed stage automatically switches to a clean static banner above the hero content to prevent text overlap.

---

## 3. Technology Stack & Rationale

We selected **Option A: Pure Modern Vanilla**:
- **HTML5:** Clean, accessible semantic tags (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`).
- **Modern CSS (`css/cinematic.css`):**
  - CSS Custom Properties (`:root`) for instant theme customization.
  - CSS Grid and Flexbox for responsive alignment.
  - Glassmorphism (`backdrop-filter: blur(...)`).
  - Fluid typography via `clamp()`.
- **GSAP 3 + ScrollTrigger:** Industry standard for buttery-smooth timeline animations, scroll-linked choreography, and responsive media queries (`gsap.matchMedia()`).
- **Lenis (`@studio-freight/lenis`):** Inertial smooth wheel scrolling that locks perfectly with GSAP tick rates.
- **Bootstrap Icons (v1.11.3):** Crisp vector icons for UI elements and accolade badges.

### Why This Stack Was Chosen:
- **Zero Build Step:** Runs immediately in any browser without needing `npm install`, Node.js, Webpack, or Vite.
- **Blazing Fast Performance:** No framework overhead; raw DOM rendering and GPU-accelerated CSS transforms.
- **Zero Maintenance Deployment:** Deploys instantly to GitHub Pages or Netlify directly from the Git repository.

---

## 4. Section-by-Section Breakdown

| Section ID | Name | Key Highlights & Functionality |
| :--- | :--- | :--- |
| `#hero` | **Hero** | Oversized name typography, glowing role tag, elevator pitch, quick CTA buttons (`Explore My Work`, `Download Resume`, `About Me`), social links, and 4 high-impact counters (`35 MTPA`, `6.5L m³`, `57m Ø`, `1 Year`). |
| `#about` | **About Me** | Editorial layout (*"ENGINEER in the making."*). Highlights JSW Steel fast-track promotion, IS 456/10262 standards, and 6 metric cards with counting animations. Character sits on the left. |
| `#sites` | **Sites at JSW** | 6 technical cards showcasing the **Beneficiation Plant**, **Water Reservoir & Pump Houses**, **Thickeners (42, 45, 57m Ø)**, **Mill Foundations**, **Conveyors & Tunnels**, and **ECR Substations**. |
| `#skills` | **Toolkit** | Interactive accordion (*Civil Execution*, *QA/QC*, *3D Visualisation*, *Digital Automation*) with animated fill bars. Infinite marquee ticker at the bottom. Character sits on the right. |
| `#projects` | **Projects** | Flagship card for **G+1 Residence** (12.7 t BBS steel, full ARC+STR set) with Lightbox preview. Filterable grid (*All, Residential Architecture, 3D Visualisation, Web Apps*) linking to YouTube walkthroughs and Netlify apps. |
| `#journey` | **Journey & Honours** | 3-column board: Career Path (JSW, DGNP), Education (AUCE B.Tech 8.07 CGPA) + Certs, and Honours (*Top 40 Green Champion*, *Employee of the Month*, *DGNP 1st Prize*). |
| `#contact` | **Contact** | Direct 1-click **"Copy Email Address"** button with live clipboard feedback, contact coordinates (phone, location, LinkedIn, GitHub), and an interactive contact form. |
| `#cinematicLightbox` | **Lightbox Modal** | Full-screen image viewer with backdrop blur and escape key listener for high-res architectural renders. |

---

## 5. File Structure

```
profile-with-bootstrap/
├── index.html                      # Main cinematic portfolio entry point
├── index-bootstrap-backup.html     # Preserved backup of previous Bootstrap version
├── PORTFOLIO_DEV_LOG.md            # This documentation file
├── .gitignore                      # Git ignore rules (.DS_Store, .vscode, etc.)
├── Dannana_Srinivasa_Rao_Resume.pdf # Downloadable resume PDF
├── css/
│   ├── cinematic.css               # Core styling, animations, tokens, and responsive layout
│   └── portfolio.css               # Legacy stylesheet
├── js/
│   ├── cinematic.js                # Persona orchestration, Lenis scroll, filters, counters
│   └── portfolio.js                # Legacy script
├── videos/
│   ├── Man_waving_at_camera_9587db74_1080p.mp4   # Hero greeting video
│   ├── Man_smiling_at_camera_63040544_1080p.mp4  # About & Skills loop video
│   ├── Idle.mp4                                  # Standby video loop
│   └── Presenting.mp4                            # Presenting gesture video loop
└── img/
    ├── web/                        # Project renders, photos, screenshots
    ├── mockup/                     # Favicons and branding icons
    └── certificates/               # Credential badges
```

---

## 6. Maintenance & How-To Guide for Later

### How to Change the Accent Color
Open [`css/cinematic.css`](file:///Volumes/Personal%20Projects/IT%20Projects/profile-with-bootstrap/css/cinematic.css) and edit the root variables at the top:
```css
:root {
  --amber-core: #ff6b00;      /* Primary accent */
  --amber-bright: #ff851a;    /* Highlight tone */
  --amber-light: #ffa149;     /* Light text tone */
  --amber-glow: rgba(255, 107, 0, 0.35); /* Glow intensity */
}
```
*Tip: If you ever want to switch to Electric Cyan, simply change `--amber-core` to `#00f0ff`.*

### How to Add a New Project
In [`index.html`](file:///Volumes/Personal%20Projects/IT%20Projects/profile-with-bootstrap/index.html), duplicate a `<article class="project-card" data-category="...">` block inside `#projectsGrid`:
```html
<article class="project-card" data-category="residential viz">
  <div class="project-thumbnail">
    <img src="img/web/your-image.jpg" alt="Description" loading="lazy">
    <a href="https://youtu.be/..." target="_blank" class="project-play-icon">
      <i class="bi bi-play-fill"></i>
    </a>
  </div>
  <div class="project-body">
    <div class="project-meta-row">
      <span class="project-year">2026</span>
      <span class="project-category-tag">Category</span>
    </div>
    <h3 class="project-title">Project Name</h3>
    <p class="project-description">Brief summary of the engineering or design work.</p>
    <div class="project-action-links">
      <a href="..." target="_blank" class="project-link-btn"><i class="bi bi-youtube"></i> Walkthrough</a>
    </div>
  </div>
</article>
```

### How to Update Your Resume
Simply replace the file [`Dannana_Srinivasa_Rao_Resume.pdf`](file:///Volumes/Personal%20Projects/IT%20Projects/profile-with-bootstrap/Dannana_Srinivasa_Rao_Resume.pdf) in the root folder with your new PDF using the exact same name.

### How to Swap Persona Videos
To change either of the videos, replace the corresponding source in [`index.html`](file:///Volumes/Personal%20Projects/IT%20Projects/profile-with-bootstrap/index.html):
```html
<!-- Video 1 (Hero) -->
<video id="personaVideo1" ...>
  <source src="videos/Your_New_Video.mp4" type="video/mp4">
</video>
```
*Note: Ensure your new video is recorded on a pure black backdrop so `mix-blend-mode: screen` blends automatically.*

---

## 7. Git & GitHub Deployment History

- **Commit 1 (`7c4ea0d`):** Upgraded codebase to cinematic dark luxury portfolio with video persona, GSAP smooth scroll, and Lenis engine.
- **Remote:** `https://github.com/srinivasaraodannana/profile-with-bootstrap.git`
- **Branch:** `master`
- **Live URL:** `https://srinivasaraodannana.github.io/profile-with-bootstrap/`
