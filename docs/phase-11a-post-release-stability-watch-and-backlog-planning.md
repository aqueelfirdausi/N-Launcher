# Phase 11A — Post-Release Stability Watch and Backlog Planning

This document establishes the post-release observation, bug intake, and prioritization plan for N Launcher following the successful `v0.1.0` release checkpoint.

---

## 1. Phase Title
```text
Phase 11A — Post-Release Stability Watch and Backlog Planning
```

---

## 2. Purpose
This phase establishes a calm, structured post-release stability-watch and backlog-prioritization process. Before initiating any new feature cycles (such as workspace multi-launching or custom shortcut editing), we must observe the stability of `v0.1.0` in real-world use, triage reports systematically, and plan the backlog safely.

---

## 3. Starting Repository and Release State
The official repository and release states verified at the beginning of this phase are:

* **Official Path**: `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher`
* **Branch**: `master`
* **Starting HEAD**: `8d6bee7` ("Add final v0.1.0 brochure asset")
* **Remote Tracking State**: `origin/master` (up to date)
* **Working-Tree State**: Clean (with untracked brochure asset `N-Launcher-Brochure-v0.1.0.png` present)
* **`v0.1.0` Tag State**: Annotated tag `v0.1.0` exists and is pushed to origin.
* **Tagged Commit**: `f1ef6f4` ("Add release publication review")
* **GitHub Release State**: Published successfully
* **Installer Asset State**: NSIS installer `N.Launcher_0.1.0_x64-setup.exe` remains attached to the GitHub release.

---

## 4. Current v0.1.0 Status
The `v0.1.0` release includes a Niagara-style glassmorphic left panel, priority app pinning, configurable workspaces, alphabetical index rail, global hotkey summon (`Ctrl + Alt + Space`), and safe Rust-controlled Start Menu application launching.

The manual runtime smoke test (conducted in Phase 10B) successfully verified that the installer creates the `%LOCALAPPDATA%\N Launcher\` folder containing the app executable, uninstaller, and the bundled `WebView2Loader.dll`. All core functionalities, including summon hotkey, settings persistence, Start Menu app discovery, and safe launching, passed their initial smoke tests. No further live testing was performed during this planning phase.

---

## 5. Stability-Watch Plan
To maintain high confidence in the `v0.1.0` release without disrupting the user, a lightweight stability-watch plan is established for owner/developer testing. 

### Observation Focus Areas
* **Launcher Startup**: Ensure the app launches quickly without errors and initializes the system tray.
* **Installed-App Startup**: Validate local execution and WebView2 load times.
* **Tray Summon and Menu Behavior**: Verify that clicking the tray icon and using tray menus performs reliably.
* **Hotkey Summon/Focus (`Ctrl + Alt + Space`)**: Confirm the window is summoned instantly and takes keyboard focus.
* **Search Responsiveness**: Verify search input filters results interactively without lag.
* **Escape Clear/Blur/Hide Behavior**: Ensure the three-stage Escape key navigation (Clear Search -> Blur Input -> Hide Window) behaves consistently.
* **Start Menu Discovery**: Verify all appropriate Start Menu shortcut links are parsed, deduplicated, and listed.
* **Built-in and Discovered-App Launching**: Confirm targets (VS Code, Chrome, Notepad, Files, Terminal) and discovered shortcuts execute.
* **Priority Pin/Unpin Persistence**: Confirm that pinning changes are saved and persist on application restarts.
* **Workspace Persistence**: Check that workspaces list configuration, renaming, and app memberships persist.
* **Settings Persistence**: Ensure custom opacity and color preset changes persist.
* **Crash, Freeze, Duplicate-Process, or Focus Issues**: Watch for multi-instance startup edge cases or lost-focus states.
* **Safe and Path-Free Error Messages**: Verify no raw filesystem paths or OS exception details leak to the UI.
* **Windows SmartScreen Reports**: Monitor any issues or user feedback regarding SmartScreen warnings due to the unsigned installer.

> [!IMPORTANT]
> **No Telemetry**: To protect user privacy and minimize complexity, this watch plan is strictly local. No telemetry, background reporting, analytics, or automated data collection will be introduced.

---

## 6. Bug-Intake Plan
When a stability issue or behavior anomaly is noticed, it must be recorded using the following intake template:

```text
Date and time:
Installed or development build:
Windows version:
Action performed:
Expected result:
Actual result:
Reproduction frequency:
Screenshot or screen recording, when useful:
Severity:
Safety or privacy impact:
```

### Severity Definitions

* **Critical**: The application crashes, freezes, fails to launch, leaks private system information, or causes data corruption or loss.
* **High**: A core feature (e.g., launching, global summoning, or settings persistence) is broken or fails frequently.
* **Medium**: A minor feature is broken, or a core feature has a workaround but behaves inconsistently.
* **Low**: Cosmetic visual bugs, minor padding/alignment issues, or non-disruptive linter warning concerns.
* **Cosmetic**: Minor layout polish, hover glow refinements, or typography adjustments that do not impact functionality.

---

## 7. Backlog Categories
Future work is organized into structured categories. Unconfirmed issues are marked as `Needs verification.` to avoid pre-emptively introducing untested bugs.

### A. Release-blocking or stability defects
*Focuses on crash, freeze, or launch blocker bugs.*
* Memory usage increase under long idle periods (summon/hide cycles). `Needs verification.`
* Window focus loss when clicking tray menu under specific Windows setups. `Needs verification.`

### B. Launching and discovery reliability
*Focuses on improving Start Menu scanning and shortcut target execution.*
* Scan time optimization when the user has >500 Start Menu shortcuts. `Needs verification.`
* Handling non-standard shortcut types (e.g., steam URL shortcuts or Windows Store Apps shortcuts without standard AppIDs). `Needs verification.`

### C. Tray, hotkey, focus, and window behavior
*Focuses on global keyboard summons, tray icons, and window state rules.*
* Global hotkey conflicts when another application registers `Ctrl + Alt + Space` first. `Needs verification.`
* Window flickering during initial summon on multi-monitor setups. `Needs verification.`

### D. Search and navigation usability
*Focuses on filtering, input focus, scroll rail, and key events.*
* Exact character match boosting in search results (e.g., typing "code" should rank VS Code first before other matches). `Needs verification.`
* Sidebar rail scroll offset alignment on high-DPI screens. `Needs verification.`

### E. Priority and workspace persistence
*Focuses on settings file storage and config migrations.*
* Settings.json file corruption recovery if the application process is terminated mid-write. `Needs verification.`
* Syncing pinned items when a Start Menu shortcut is deleted/renamed externally by an uninstaller. `Needs verification.`

### F. Visual polish and accessibility
*Focuses on glassmorphism look-and-feel, themes, and screen reader markup.*
* Contrast enhancement for text elements under very light backgrounds in "Soft Glass" theme. `Needs verification.`
* Keyboard screen-reader (accessibility/ARIA) tags for all apps list elements. `Needs verification.`

### G. Installer, signing, and distribution
*Focuses on NSIS, DLL bundling, signing keys, and packaging.*
* Code signing setup with local self-signed certificate for internal developer distributions. `Needs verification.`
* Optimizing NSIS installer compression format to reduce executable size. `Needs verification.`

### H. Deferred feature design reviews
*Focuses on architecture research for features postponed in v0.1.0.*
* Workspace multi-launch batching logic (how to open multiple apps without focus stealing or races). `Needs verification.`
* Secure custom shortcut editor layout (safeguarding path entry and verifying executable targets). `Needs verification.`

### I. Documentation and release operations
*Focuses on guides, developer docs, CI pipelines, and tagging rules.*
* Creating automated GitHub Actions workflow files for build and check runs. `Needs verification.`
* Formatting developer documentation for setting up the environment under WSL or other setups. `Needs verification.`

---

## 8. Prioritization Rules
Post-release defects and security concerns take priority over new features. The prioritization sequence is strictly defined as:

1. **Security or privacy issue** (e.g., path leakage, unauthorized file execution).
2. **Data-loss or settings-corruption issue** (e.g., settings.json reset).
3. **Crash or inability to launch**.
4. **Core workflow regression** (e.g., launcher fails to summon or launch apps).
5. **Frequent usability problem** (e.g., search focus lagging).
6. **Cosmetic or optional enhancement** (e.g., theme adjustments).
7. **New feature** (e.g., workspace multi-launch).

---

## 9. Locked Safety Boundaries
To maintain the security and design integrity of N Launcher, the following safety boundaries remain locked and must not be altered:

* Frontend sends only safe app IDs.
* Rust backend owns actual launch resolution.
* No executable paths exposed to the frontend.
* No shortcut targets exposed to the frontend.
* No frontend-provided command strings.
* No frontend-provided command arguments.
* No shell plugin.
* No unnecessary Tauri capability expansion.
* No Registry modification.
* No Windows folder modification.
* No Start Menu shortcut creation, editing, moving, renaming, or deletion.
* No workspace multi-launch implementation without a dedicated design review.
* No custom app-path editor without a dedicated security review.
* No installer configuration changes in this phase.
* No tag movement.
* No release-asset replacement.
* No version-number change.

---

## 10. Deferred Items
The following items remain strictly out of scope for the current phase and are deferred:

* Workspace multi-launch
* Custom app editor
* Custom app path editing
* Custom hotkey editor
* Installer signing
* Auto-updater
* Autostart/startup behavior changes
* Broader public distribution

---

## 11. Recommended Next Phase
Since no release defects have been verified in this phase, we recommend proceeding to:

```text
Phase 11B — Post-Release Backlog Prioritization and First Maintenance Target Selection
```

This next phase must remain a review/selection phase unless a specific verified defect is identified that justifies a narrowly scoped maintenance fix.

---

## 12. Final Decision
```text
PASS
```

### Explanation of Decision
All verification checks on the `v0.1.0` release state succeeded. The master branch is clean and aligned with remote, the tag `v0.1.0` points to the correct handoff commit `f1ef6f4`, the GitHub release is successfully published, and the setup installer asset is intact. The documentation-first watch plan and backlog categories are fully established without modifications to application code.
