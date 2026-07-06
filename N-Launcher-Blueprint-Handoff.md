# N Launcher — Project Blueprint & Handoff

**Project identity:** N Launcher  
**Internal folder/repo name:** `n-launcher`  
**Meaning of “N”:** Novart / Novart Systems identity  
**Project type:** Side / personal / experimental Windows 11 companion utility  
**Build environment:** Google Antigravity 2.0  
**Development mode:** Planning first, Review-Driven Development, static shell before native actions  
**Primary architecture:** Tauri v2 Rust backend + Next.js static export frontend  
**Visual direction:** Niagara-style vertical launcher with ultra-fidelity violet glassmorphism  

---

## 1. Executive Summary

N Launcher is a minimal Windows 11 desktop companion launcher inspired by the ergonomic structure of Niagara Launcher. It is designed as a slim, single-column, frameless glass panel floating on the left side of the desktop.

The app is not intended to be a heavy commercial product at this stage. It is a side / personal / tryout project for learning, experimentation, and daily productivity. The project should be built in Google Antigravity, while Codex/Cortex should remain reserved for main or commercially important projects.

The first goal is not to build every system feature. The first goal is to create a beautiful, stable, reviewable visual shell that matches the provided mockup and can later receive safe native desktop actions.

---

## 2. Locked Project Identity

| Field | Decision |
|---|---|
| Public name | N Launcher |
| Folder name | `n-launcher` |
| Product family | Novart / Novart Systems utility |
| Platform | Windows 11 desktop |
| Nature | Side project / personal utility / experiment |
| Primary tool | Google Antigravity |
| Codex/Cortex usage | Do not use for this side project unless explicitly changed later |

---

## 3. Visual Source of Truth

A mockup has been created and approved as the visual reference for the project.

### Mockup description

The mockup shows a Windows 11 desktop with a slim vertical glass launcher panel docked/floating on the left side. It includes:

- rounded translucent glass panel
- deep violet / black ambient background
- search bar at the top
- vertical app list
- active item highlight with emerald/cyan glow
- A–Z alphabet scrubber rail on the right edge of the panel
- minimal footer icons for settings and power
- no native title bar or window decorations

### Locked visual decisions

| Area | Decision |
|---|---|
| Panel placement | Floating left-side vertical panel |
| Panel width | Around 340px |
| Panel height | Around 820–840px |
| Shape | Rounded vertical glass vessel |
| Theme | Deep violet / black glass ambiance |
| Active color | Emerald + cyan glow |
| Layout | Search top, app stream middle, utility footer bottom |
| Navigation accent | A–Z rail on right edge |
| First visible app list | VS Code, Terminal, Chrome, Files, Spotify |
| First build target | Static visual shell only |

---

## 4. Architecture Direction

### Recommended stack

```text
Tauri v2
Rust backend
Next.js App Router frontend
Next.js static export
Tailwind CSS v4
Windows 11 target
```

### Architecture principle

The frontend should first be treated as a static UI shell. Native functionality should be added only after the shell and window behavior are approved.

### Initial project boundaries

Do not implement unrestricted shell execution. Do not create arbitrary command-running features in the first version. Use a safe action registry later.

Recommended future safe action names:

```text
open_app
open_folder
open_url
focus_window_later
run_predefined_command_later
```

The frontend should never send arbitrary terminal strings such as unrestricted `cmd`, `powershell`, or shell commands.

---

## 5. Native Window Requirements

The intended Tauri window should eventually use the following window characteristics:

```json
{
  "width": 340,
  "height": 840,
  "resizable": false,
  "fullscreen": false,
  "decorations": false,
  "transparent": true,
  "alwaysOnTop": true,
  "skipTaskbar": true,
  "shadows": false
}
```

### Target placement

```text
X: 20
Y: 60
Width: 340px
Height: 840px
```

### Important native behavior

- frameless window
- transparent window composition
- no native title bar
- no Windows border artifact
- always-on-top behavior for quick access
- skip taskbar to avoid clutter
- progressive blur/vibrancy enhancement on Windows 11

### Caution

The hardest technical part will likely be:

```text
Windows 11 + Tauri v2 + transparent webview + native blur/vibrancy + no border artifacts
```

This should be treated as progressive enhancement, not as a blocker for the first static shell.

---

## 6. UI Component Plan

### A. Top Zone — Global Search / Command Line

Purpose: quick filtering and future command launcher behavior.

Initial build:

- borderless input
- search icon
- placeholder text: `Search apps, files, web...`
- subtle violet underline / glow
- optional `Alt + Space` badge later

Do not implement real global hotkey in Phase 1.

---

### B. Middle Zone — Vertical Niagara Stream

Purpose: app launcher list.

Initial visible items:

```text
VS Code
Terminal
Chrome
Files
Spotify
```

Each item should include:

- icon plate
- app name
- clean spacing
- hover state
- selected/active state

The active item style from the mockup should be preserved:

- faint internal glass gradient
- thin emerald/cyan glowing border
- soft outer glow
- premium glass feel

Secondary metadata such as ports or repo names should be deferred until later.

---

### C. Bottom Zone — Utility Tray

Purpose: minimal system controls.

Initial visible items:

```text
Settings
Power
```

Keep this area simple. Do not add many footer buttons in the first build.

---

### D. Right Edge — Alphabet Scrubber Rail

Purpose: Niagara-style identity and future fast navigation.

Initial rail string:

```text
#ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

Initial behavior:

- visual only
- hover color/scale allowed
- no complex navigation required in Phase 1

Future behavior:

- hover letter to jump to section
- mouse wheel scrubbing
- drag-to-scrub navigation

---

## 7. Recommended Build Strategy

The original three-phase pipeline should be refined into a safer staged process.

### Phase 0 — Architecture Artifact Only

Antigravity should not create the full app immediately.

It should first output a review artifact containing:

- proposed folder tree
- package choices
- Tauri configuration plan
- Rust command list
- frontend component map
- known risk notes
- exact items it will not implement yet

Stop after this artifact and wait for approval.

---

### Phase 1 — Static UI Shell

Goal: match the mockup visually.

Implement:

- Next.js static export frontend
- Tailwind CSS v4 styling
- launcher panel layout
- search input
- app list with mock data
- active selected item style
- alphabet rail
- footer icons
- responsive/static desktop-safe layout

Do not implement:

- native command execution
- app launching
- folder opening
- port detection
- global hotkey
- packaging

Stop after UI preview and screenshots.

---

### Phase 2 — Tauri Window Integration

Goal: make the UI appear as a native floating Windows panel.

Implement:

- Tauri v2 shell
- frameless window
- transparent window
- fixed dimensions
- left-side panel placement
- always-on-top behavior
- skip taskbar behavior
- basic close/dev controls only if necessary

Validate:

- window opens correctly
- no title bar
- no visible border artifact if possible
- transparent panel behaves acceptably
- UI remains readable

---

### Phase 3 — Windows Blur / Vibrancy Enhancement

Goal: improve native glass feel.

Implement carefully:

- Windows-only vibrancy/blur integration
- guarded Rust OS hooks
- fallback if vibrancy fails
- no crash if blur is unsupported

Important: the app should still work even if native blur fails.

---

### Phase 4 — Safe Native Actions

Goal: allow controlled launcher behavior.

Use a safe registry only.

Allowed early actions:

```text
open_app
open_folder
open_url
```

Do not allow arbitrary frontend-provided shell commands.

Example approach:

```text
Frontend sends: { action: "open_app", targetId: "vscode" }
Backend maps targetId to a predefined safe path/action.
```

---

### Phase 5 — Productivity Intelligence Later

Possible future features:

- show running localhost ports
- show active Git repo name
- recent folders
- pinned projects
- hotkey summon/hide
- JSON-based launcher config
- fuzzy app search
- project workspace shortcuts
- theme variants

These are not part of the first build.

---

## 8. Antigravity Phase 0 Copy-Paste Prompt

Use this as the first prompt inside Google Antigravity when starting the project.

```text
You are building a side/personal Windows 11 utility project named “N Launcher”.

Project identity:
- Public app name: N Launcher
- Folder/repo name: n-launcher
- Meaning of “N”: Novart / Novart Systems identity
- Platform: Windows 11 desktop
- Build environment: Google Antigravity
- Project type: personal/side/experimental utility

Primary architecture target:
- Tauri v2 Rust backend
- Next.js App Router frontend
- Next.js static export
- Tailwind CSS v4
- Windows 11 frameless transparent panel

Visual direction:
Create a Niagara Launcher-inspired vertical desktop launcher. It should look like a slim, floating, left-side glass panel with deep violet/black ambiance, premium transparent glass, emerald/cyan active glow, search at the top, vertical app stream in the middle, A–Z scrubber rail on the right edge, and settings/power icons at the bottom.

The provided mockup is the visual source of truth. Match its proportions and visual feeling before adding advanced functionality.

Critical RDD rule:
Do not create source directories, install dependencies, compile crates, or implement code yet. First output a reviewable Phase 0 architecture artifact only.

Your Phase 0 artifact must include:
1. Proposed folder structure
2. Package/dependency plan
3. Tauri v2 window configuration plan
4. Rust backend command plan
5. Frontend component map
6. Styling/theme token plan
7. Risk notes for Windows transparency/vibrancy
8. Clear list of features intentionally deferred
9. Confirmation that no arbitrary shell command execution will be implemented

Hard constraints:
- No unrestricted shell command execution
- No arbitrary cmd/powershell executor
- No app launching in Phase 1
- No global hotkey in Phase 1
- No port detection in Phase 1
- No production packaging in Phase 1
- Static UI shell first

Target Tauri window behavior later:
- width: 340
- height: 840
- x: 20
- y: 60
- resizable: false
- fullscreen: false
- decorations: false
- transparent: true
- alwaysOnTop: true
- skipTaskbar: true
- shadows: false

Initial Phase 1 UI data:
- VS Code
- Terminal
- Chrome
- Files
- Spotify

Initial layout:
- Top: borderless search field with placeholder “Search apps, files, web...”
- Middle: vertical app list with icon + app name
- Active item: emerald/cyan glowing glass border
- Right edge: #ABCDEFGHIJKLMNOPQRSTUVWXYZ rail
- Bottom: settings and power icons

Stop after the Phase 0 artifact and wait for review approval before implementing anything.
```

---

## 9. Do-Not-Do List

For the first build, do not do these:

```text
Do not create arbitrary shell executor.
Do not run unrestricted user commands from frontend.
Do not overbuild backend features.
Do not add database.
Do not add cloud backend.
Do not add auth.
Do not add auto-update.
Do not add installer packaging yet.
Do not add complex app discovery yet.
Do not add port detection yet.
Do not add too many footer utilities.
Do not change the visual direction away from the mockup.
```

---

## 10. First Success Criteria

The first successful milestone is not a complete launcher.

The first successful milestone is:

```text
A beautiful static N Launcher UI shell that visually matches the mockup and runs locally in a reviewable state.
```

Success means:

- panel shape is correct
- proportions feel right
- glass/violet mood is close to mockup
- app list renders cleanly
- active item style feels premium
- A–Z rail appears correctly
- footer icons are minimal
- no backend risk introduced

---

## 11. Suggested Next Chat Starting Message

When opening a new chat/session, paste this short starter before the full handoff if needed:

```text
We are starting a side project named N Launcher in Google Antigravity, not Codex/Cortex. It is a Windows 11 Niagara-style glassmorphic launcher using Tauri v2 + Next.js static export. We are in planning/RDD mode. First step is Phase 0 architecture artifact only, no implementation yet. Use the attached handoff as the source of truth.
```

---

## 12. Current Status

```text
Status: Planning complete
Name: Locked as N Launcher
Visual direction: Locked from mockup
Architecture: Tentatively approved with safety guardrails
Next action: Create local project folder and begin Antigravity Phase 0 artifact review
Implementation: Not started yet
```

