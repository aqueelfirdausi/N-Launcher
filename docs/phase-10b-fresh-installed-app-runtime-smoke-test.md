# Phase 10B — Fresh Installed-App Runtime Smoke Test

This document summarizes the installation verification, runtime testing, and manual visual smoke checks for the N Launcher release build.

---

## 1. Goal
Verify the actual packaged installer and installed Windows app runtime before any GitHub tag, release publication, signing, updater, or release notes work.

---

## 2. Starting Git State
* **Branch**: `master` tracking `origin/master`
* **Latest Synced Commit**: `ddc8b51` (Add release preparation audit)
* **Working Tree**: Clean

---

## 3. Installer Artifact Tested
* **Setup Installer Path**: `src-tauri/target/release/bundle/nsis/N Launcher_0.1.0_x64-setup.exe`
* **Installer File Size**: `4,553,106` bytes

---

## 4. Installed Folder & Files Verification
* **Target Installation Folder**: `C:\Users\Administrator\AppData\Local\N Launcher`
* **Installed Folder Existence**: Confirmed (`True`)
* **Files Verified**:

| File Name | Size (Bytes) | Description |
|---|---|---|
| `n-launcher-app.exe` | `20,128,833` | Core application binary |
| `uninstall.exe` | `79,093` | Uninstallation executable |
| `WebView2Loader.dll` | `160,320` | Bundled WebView2 system loader |

*`WebView2Loader.dll` is correctly present in the installed app folder.*

---

## 5. Installed App Process Status
* **Process Name**: `n-launcher-app`
* **PID Observed**: `7396`
* **Launch Source**: Started successfully from installed folder location.

---

## 6. Human Visual Smoke Checklist
* **Verdict**: **PASS** — everything looks good.

| Check | Result |
|---|---|
| N Launcher window opened visibly | **PASS** |
| Glass/Niagara panel rendered correctly | **PASS** |
| Priority section visible | **PASS** |
| Workspaces section visible | **PASS** |
| All Apps section visible | **PASS** |
| Search functionality works | **PASS** |
| Escape key behavior works | **PASS** |
| Ctrl + Alt + Space global summon/focus works | **PASS** |
| System tray icon and right-click menu work | **PASS** |
| Built-in application launching works | **PASS** |
| Discovered Start Menu apps launch successfully | **PASS** |
| Priority pin/unpin works | **PASS** |
| Workspace expand/collapse list works | **PASS** |
| No absolute executable paths appear in the UI | **PASS** |
| No target shortcut paths appear in the UI | **PASS** |
| No raw or unhandled exceptions/error messages shown | **PASS** |

---

## 7. Safety Boundary Review
* **Verdict**: **PASS**
* **Safety Details**:
  - No source code files modified.
  - No installer configuration parameters modified.
  - No application version numbers modified.
  - No git tags created.
  - No GitHub Release created.
  - No Tauri capability permissions expanded.
  - No Start Menu shortcuts or registry configurations modified by this testing process.

---

## 8. Recommended Next Phase
`Phase 10C — Version Tagging and Release Publication Review`
