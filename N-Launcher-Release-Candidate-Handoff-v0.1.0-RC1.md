# N Launcher — Release Candidate Handoff v0.1.0 RC1

**Date**: 2026-07-07  
**Status**: RC READY  
**Phase**: 6H — Release Candidate Handoff  

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Project Name** | N Launcher |
| **Name Meaning** | "N" stands for Novart — representing the Novart Systems identity |
| **Type** | Windows 11 companion launcher |
| **Stack** | Tauri v2, Rust, Next.js 15 App Router, static export, Tailwind CSS v4 |
| **Build Environment** | Google Antigravity |
| **Official Project Path** | `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher` |
| **GitHub Repository** | https://github.com/aqueelfirdausi/N-Launcher.git |
| **Product Name** | N Launcher |
| **Identifier** | `com.novart.n-launcher` |
| **Publisher** | Novart Systems |
| **Version** | 0.1.0 |

> [!IMPORTANT]
> Always use the path `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher` (no space). The old path `C:\Users\Administrator\Desktop\Antigravity Projects\N-Launcher` (with a space) causes build-tool failures and must never be used.

---

## 2. Git State at RC

| Field | Value |
|---|---|
| **Branch** | `master` |
| **Remote** | `origin` → `https://github.com/aqueelfirdausi/N-Launcher.git` |
| **Latest Commit** | `75006c9 Fix Windows installer WebView2 loader packaging` |
| **Sync Status** | Local `master` fully synchronized with `origin/master` |
| **Working Tree** | Clean |

### Recent Commit Log
```
75006c9 Fix Windows installer WebView2 loader packaging
b7fbf16 Prepare NSIS packaging config
c68269e Add N Launcher app icon
e0c840e Clean up app metadata
9faf864 Add Phase 4 clean handoff
15186b7 Add Phase 4K tray menu controls
f360b3d Add Phase 4H footer hide control
08948d1 Add Phase 4E global hotkey summon
c5ca452 Add Phase 4B tray summon control
bd45d15 Add Phase 3M notepad launcher target
6b499ae Add Phase 3J Chrome launch
51d2aa8 Add Phase 3H VS Code launch
```

---

## 3. Release Candidate Artifacts

### NSIS Installer Setup
| Field | Value |
|---|---|
| **Path** | `src-tauri\target\release\bundle\nsis\N Launcher_0.1.0_x64-setup.exe` |
| **Size** | `4,503,885` bytes (~4.3 MB) |
| **Modified** | `7/7/2026 7:38:11 AM` |
| **Target** | NSIS (Windows) |
| **Install Mode** | `currentUser` — installs to `%LOCALAPPDATA%\N Launcher\` — no UAC required |

### Release Application Binary
| Field | Value |
|---|---|
| **Path** | `src-tauri\target\release\n-launcher-app.exe` |
| **Size** | `19,997,158` bytes (~19 MB) |
| **Modified** | `7/7/2026 7:38:11 AM` |

### Installed Folder Contents (after fix)
```
C:\Users\Administrator\AppData\Local\N Launcher\
  n-launcher-app.exe     (19,997,158 bytes)
  uninstall.exe          (    79,093 bytes)
  WebView2Loader.dll     (   160,320 bytes)
```

---

## 4. Completed Project Phases

### Phase 0 — Planning / Architecture
Defined the launcher concept, Novart identity, Tauri v2 + Next.js static export stack, and the security model (all app launches handled by the Rust backend, never from the frontend).

### Phase 1 — Static Launcher UI
Built the glassmorphic Next.js launcher UI with a left-side transparent panel, search input, app grid, footer with Power and Settings icons, and Tailwind v4 styling.

### Phase 2 — Native Tauri Window
Integrated the Next.js UI into a Tauri v2 frameless, transparent, always-on-top native window. Configured window decorations, transparency, and positioning.

### Phase 3 — Safe Real App Launching
Implemented the Rust IPC command architecture to launch real Windows applications (VS Code, Windows Terminal, Chrome, Files, Notepad) via `std::process::Command`. All launch logic is isolated in the Rust backend. No shell commands are exposed to the frontend. Verified each target launches correctly.

### Phase 4 — Summon / Hide / Tray / Hotkey UX
Built the full interactive UX layer:
- Global hotkey (`Ctrl+Alt+Space`) summons and focuses the launcher.
- Escape key cycles through three tiers: clear search → blur input → hide launcher.
- Footer Power icon hides the launcher.
- System tray with N Launcher icon, left-click show/focus, right-click menu with Show Launcher and Quit N Launcher.

### Phase 5 — Metadata / Icon / Release Readiness Reviews
- Reviewed and corrected all metadata (package.json, tauri.conf.json, Cargo.toml, layout.tsx).
- Changed Rust crate name from `app` to `n-launcher-app`.
- Generated full custom icon set from a 1024×1024 source PNG using `npm run tauri icon`.
- Established GitHub remote at `https://github.com/aqueelfirdausi/N-Launcher.git` and pushed all commits.
- Ran comprehensive release checklist audit.

### Phase 6 — Packaging / Installer / WebView2 Fix / RC Testing
- Configured NSIS packaging in `tauri.conf.json` (`targets: ["nsis"]`, `currentUser`, `publisher: "Novart Systems"`).
- Built the first NSIS installer successfully.
- Diagnosed and fixed the `WebView2Loader.dll was not found` error caused by building on the GNU Rust toolchain.
- Bundled `WebView2Loader.dll` via `bundle.resources` in `tauri.conf.json`.
- Ran full install/runtime/uninstall smoke tests and confirmed RC READY.

---

## 5. Current Working Features

| Feature | Status |
|---|---|
| Frameless transparent native launcher window | ✅ Working |
| Left-side glassmorphic panel | ✅ Working |
| App grid with launch targets | ✅ Working |
| Search/filtering input | ✅ Working |
| Search input autofocus on show | ✅ Working |
| Escape tier 1: clear search text | ✅ Working |
| Escape tier 2: blur input | ✅ Working |
| Escape tier 3: hide launcher | ✅ Working |
| Footer Power icon hides launcher | ✅ Working |
| Tray icon (custom N Launcher icon) | ✅ Working |
| Tray left-click → show/focus launcher | ✅ Working |
| Tray right-click → Show Launcher | ✅ Working |
| Tray right-click → Quit N Launcher | ✅ Working |
| Ctrl+Alt+Space global hotkey summon | ✅ Working |
| Launch: VS Code | ✅ Working |
| Launch: Windows Terminal | ✅ Working |
| Launch: Google Chrome | ✅ Working |
| Launch: Files (Explorer) | ✅ Working |
| Launch: Notepad | ✅ Working |
| Custom N Launcher icon (all sizes) | ✅ Working |
| NSIS installer | ✅ Working |
| currentUser install (no UAC) | ✅ Working |
| Installs to `%LOCALAPPDATA%\N Launcher\` | ✅ Working |
| Start Menu shortcut | ✅ Working |
| Desktop shortcut | ✅ Working |
| Clean uninstall (no leftovers) | ✅ Working |
| WebView2Loader.dll bundled in installer | ✅ Fixed in `75006c9` |

---

## 6. Security Boundaries

The following capabilities are intentionally excluded and will remain excluded unless explicitly planned:

- Frontend-side executable path invocation
- Frontend-side shell command execution
- `tauri-plugin-shell` or any shell plugin
- `cmd.exe` or PowerShell launcher exposure
- Arbitrary shell execution of any kind
- Backend database, auth, or cloud integrations
- Tauri updater plugin
- GitHub Actions CI/CD pipelines
- GitHub release tags or release artifacts

All application launches are handled exclusively by the Rust backend via `std::process::Command` with fixed, hardcoded safe paths. The frontend only sends named IPC event strings.

---

## 7. Intentional Non-Features

| Non-Feature | Notes |
|---|---|
| **Settings implementation** | Settings button is visual-only. No settings modal, page, or config file exists. |
| **Startup/autostart** | App is manual-launch only. No registry Run keys or startup folder entries are created. |
| **Updater** | No `tauri-updater` plugin is configured. |
| **Code signing certificate** | Installer is unsigned. Windows SmartScreen "Unknown Publisher" warning is expected on first run. |
| **GitHub Releases** | No GitHub release tags or release packages have been created. |

---

## 8. WebView2Loader.dll Packaging Fix

### Problem
After the first NSIS installer build (Phase 6B), launching the installed app showed a Windows system error:
> *"The code execution cannot proceed because WebView2Loader.dll was not found. Reinstalling the program may fix this problem."*

### Root Cause
The active Rust toolchain was `stable-x86_64-pc-windows-gnu` (GNU target). When building with the GNU toolchain, Tauri generates `WebView2Loader.dll` in `target\release\` alongside the executable. However, the Tauri NSIS bundler does **not** automatically include this DLL in the installer package when using the GNU toolchain.

### Why MSVC Toolchain Switch Was Not Used
The MSVC Rust toolchain (`stable-x86_64-pc-windows-msvc`) is installed on this machine, but the Visual Studio Build Tools C++ workload (which provides `link.exe`) is **not installed**. Attempting to switch to the MSVC toolchain and run `cargo check` failed immediately with:
```
error: linker `link.exe` not found
note: the msvc targets depend on the msvc linker but `link.exe` was not found
```

### Fix Applied (Commit `75006c9`)
The correct Tauri-supported fix without requiring MSVC:
1. Copied the locally-built `WebView2Loader.dll` (`160,320` bytes) from `target\release\` into `src-tauri/resources/`.
2. Added a `bundle.resources` map to `tauri.conf.json`:
   ```json
   "resources": {
     "resources/WebView2Loader.dll": "WebView2Loader.dll"
   }
   ```
   This instructs the Tauri NSIS bundler to copy the DLL into the install root alongside `n-launcher-app.exe`.

### Verification
After the fix, the installed folder contained `WebView2Loader.dll` and the app launched without any DLL error.

---

## 9. Verification Results

| Check | Result |
|---|---|
| `npm run build` (Next.js static export) | **PASS** |
| `cargo check` (Rust compile check) | **PASS** |
| `npm run tauri build` (full release build) | **PASS** |
| NSIS installer generated | **PASS** |
| Silent install (no UAC prompt) | **PASS** |
| Install location: `%LOCALAPPDATA%\N Launcher\` | **PASS** |
| Installed files: exe + uninstaller + DLL | **PASS** |
| `WebView2Loader.dll was not found` error | **FIXED** |
| Installed app launch stability | **PASS** (~29 MB stable working set) |
| Start Menu shortcut created | **PASS** |
| Desktop shortcut created | **PASS** |
| Registry metadata: name, publisher, version | **PASS** |
| Autostart entry not present | **PASS** |
| Silent uninstall (exit code 0) | **PASS** |
| Uninstall cleanup: folder, shortcuts, registry | **PASS** (zero leftovers) |
| Final git status | **Clean** |

> [!NOTE]
> Full hands-on visual UI interaction (clicking search, typing, escape cycles, tray icon clicks, hotkey summon, launch target clicks) was verified during Phases 3–4 development and confirmed stable. The only blocking issue for RC was the missing DLL, which is now resolved. **Final human visual verification of the installed app is recommended before public distribution.**

---

## 10. RC Decision

**Release Candidate Status: RC READY**

N Launcher v0.1.0 RC1 is ready for controlled local testing and private review. The NSIS installer builds successfully, installs cleanly without administrative privileges, runs stably, and uninstalls completely. All intentional non-features are confirmed absent. The WebView2 loader dependency is correctly bundled.

The app is **not yet recommended for public distribution** because:
- The installer is unsigned (SmartScreen warning expected).
- No GitHub Release or release tag has been created.
- Final human visual UI verification is recommended before broader sharing.

---

## 11. Future Work

### Deferred (Ready to Plan When Needed)

| Item | Priority |
|---|---|
| Final human visual UI checklist (if not yet done) | High — before sharing |
| Settings architecture and implementation | Medium |
| Startup/autostart toggle in Settings | Medium |
| Signed installer (code signing certificate) | Medium |
| GitHub Release tag and release notes | Low |
| GitHub Actions CI/CD | Low |
| App order/customization settings | Low |
| Broader machine compatibility testing | Low |

---

## 12. Recommended Next Phases

| Phase | Description |
|---|---|
| **6I** | Optional Final Human UI Checklist — if full interactive UI has not yet been manually verified |
| **6J** | Optional GitHub Release Planning — creating a v0.1.0 git tag and GitHub Release |
| **7A** | Settings Architecture Planning — designing the settings config system |
| **7B** | Startup/Autostart Planning — implementing a toggle for Windows startup behavior |

---

## 13. Next Chat Starter Prompt

Use the following to resume N Launcher development in a new session:

```
We are continuing N Launcher after Phase 6H.

Official project folder:
C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher

Do not use this old path:
C:\Users\Administrator\Desktop\Antigravity Projects\N-Launcher

GitHub repo:
https://github.com/aqueelfirdausi/N-Launcher.git

Current branch:
master tracking origin/master

Latest synced commit:
[INSERT LATEST COMMIT HASH AND MESSAGE]

Previous phase:
Phase 6H — Release Candidate Handoff completed with PASS.
RC status: RC READY (v0.1.0 RC1)

Key facts:
- Stack: Tauri v2, Rust, Next.js 15 App Router, static export, Tailwind CSS v4
- Rust toolchain: stable-x86_64-pc-windows-gnu (MSVC linker not available)
- WebView2Loader.dll is bundled via bundle.resources in tauri.conf.json
- NSIS installer uses currentUser install mode (no UAC)
- Installs to: %LOCALAPPDATA%\N Launcher\
- Settings icon is visual-only (no Settings implementation)
- No startup/autostart
- No updater
- No signing certificate
- No GitHub Release created yet

Current phase:
[INSERT NEXT PHASE NAME AND GOAL]
```

---

*N Launcher v0.1.0 RC1 — Novart Systems — 2026-07-07*
