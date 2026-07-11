# Phase 11B — Post-Release Backlog Prioritization and First Maintenance Target Selection

This document establishes the backlog prioritization and selects the first post-release maintenance target for N Launcher.

---

## 1. Phase Title
```text
Phase 11B — Post-Release Backlog Prioritization and First Maintenance Target Selection
```

---

## 2. Purpose
This phase evaluates the backlog candidates identified in Phase 11A, reconciles the untracked brochure asset in the repository root, ranks tasks using a clear safety and priority rubric, and defines the scope of the next verification/maintenance phase.

---

## 3. Starting Repository and Release State
The official repository and release states verified at the beginning of this phase are:

* **Official Path**: `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher`
* **Branch**: `master`
* **HEAD Commit**: `80e80b6` ("Add post-release stability watch plan")
* **Remote Tracking State**: `origin/master` (up to date)
* **Working-Tree State**: Clean (except untracked brochure asset `N-Launcher-Brochure-v0.1.0.png` present)
* **`v0.1.0` Tag State**: Annotated tag `v0.1.0` exists, pointing to commit `f1ef6f4`
* **Tagged Release Commit**: `f1ef6f4` ("Add release publication review")
* **Published Release**: `N Launcher v0.1.0`
* **Installer Asset State**: Setup installer `N.Launcher_0.1.0_x64-setup.exe` remains attached to the GitHub release.

---

## 4. Untracked Brochure Asset Review
* **Exact Path**: `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher\N-Launcher-Brochure-v0.1.0.png`
* **Filename**: `N-Launcher-Brochure-v0.1.0.png`
* **File Type**: PNG Image (`image/png`)
* **Size**: `566,179` bytes (~552.9 KB)
* **Classification**: `C. A duplicate or temporary file that should be removed later`
* **Recommended Treatment**: The file is an intermediate visual export created just before the final version. The final visual asset `N-Launcher-Brochure-v0.1.0-final.png` (size `522,523` bytes) was already committed in the repository (commit `8d6bee7`). Therefore, `N-Launcher-Brochure-v0.1.0.png` is a duplicate temporary file and should be deleted in a future repository hygiene task.
* **Owner Verification**: No further owner verification is needed to determine that this file is an intermediate duplicate.

---

## 5. Evidence Sources Reviewed
* **`docs/phase-11a-post-release-stability-watch-and-backlog-planning.md`**: Outlined stability watch rules and candidate categories.
* **`N-Launcher-Final-Release-Handoff-v0.1.0.md`**: Recorded the final `v0.1.0` release status, features, and limitations.
* **`src-tauri/src/lib.rs`**: Reviewed global hotkey registration flow and release logging configurations.
* **`src-tauri/src/settings.rs`**: Reviewed settings serialization and automatic backup logic.

---

## 6. Candidate Evidence Table

| Candidate | Evidence Source | Confirmed / Unconfirmed | User Impact | Safety Impact | Frequency | Estimated Scope | Recommended Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Global Hotkey Conflict Silent Failure** | `src-tauri/src/lib.rs` | Unconfirmed | High | None | Low-Medium | Small | P2 |
| **Memory Growth Over Summon Cycles** | Phase 11A backlog | Unconfirmed | Medium | None | Low | Medium | P3 |
| **Focus Loss on Tray Menu Click** | Phase 11A backlog | Unconfirmed | High | None | Low | Small | P2 |
| **Start Menu Scan Latency (>500 apps)** | Phase 11A backlog | Unconfirmed | Medium | None | Low | Medium | P3 |
| **Settings Corruption Under Force Quit** | `src-tauri/src/settings.rs` | Unconfirmed | Low | None | Low | Small | P3 |
| **Untracked Brochure Asset Hygiene** | Git status check | Confirmed | None | None | High | Small | P4 |
| **Unsigned Installer Warning** | Phase 10B/10E limitations | Confirmed | Medium | None | High | Large | Future |
| **No Auto-Updater** | Phase 10B/10E limitations | Confirmed | Medium | None | High | Medium | Future |

---

## 7. Prioritized Backlog

### P0 — Security, privacy, destructive behavior, or data corruption
*No candidates meet this criteria.*

### P1 — Crash, startup failure, launch failure, or major core workflow regression
*No candidates meet this criteria.*

### P2 — Frequent reliability, focus, persistence, or navigation defect
* **Global Hotkey Conflict Silent Failure** (Unconfirmed): The primary summon hotkey (`Ctrl + Alt + Space`) could fail to register if occupied by another app. Currently, release builds compile out the log plugin, causing this registration error to fail silently with no user feedback. *Eligible for verification.*
* **Focus Loss on Tray Menu Click** (Unconfirmed): Focus state anomaly when window is summoned from the system tray menu. *Eligible for verification.*

### P3 — Low-frequency usability problem or accessibility issue
* **Settings Corruption Under Force Quit** (Unconfirmed): Potential settings corruption if process kills during write. (Low risk due to active `.json.bak` backup mechanisms). *Eligible for verification.*
* **Memory Growth Over Summon Cycles** (Unconfirmed): Memory usage tracking during repeated window summon/hide transitions. *Eligible for verification.*
* **Start Menu Scan Latency** (Unconfirmed): Potential startup latency when scanning Start Menu folders containing hundreds of items. *Eligible for verification.*

### P4 — Cosmetic refinement, documentation, or optional enhancement
* **Untracked Brochure Asset Hygiene** (Confirmed): Removal of intermediate duplicate file `N-Launcher-Brochure-v0.1.0.png`. *Eligible for repository hygiene.*

### Future — New feature or deferred design work
* **Unsigned Installer (Windows SmartScreen Warning)**: Deferred until code signing certificate infrastructure is established.
* **No Auto-Updater**: Deferred until remote host update distribution is scheduled.
* **Workspace Multi-Launch**: Deferred until multi-launch batch design is finalized.
* **Custom App Editor**: Deferred until security model for custom target input is defined.

---

## 8. Confirmed Defects
```text
No confirmed post-release defects were identified during this review.
```

---

## 9. Unconfirmed Risks Requiring Verification
* **Global Hotkey Conflict Silent Failure**: Contested hotkey binding leads to silent summon failure in release builds.
* **Focus Loss on Tray Menu Click**: Lost input focus when summoning the window from the system tray menu.
* **Start Menu Scan Latency**: Slow search or scan times when crawling directories with >500 shortcuts.
* **Memory Growth Over Summon Cycles**: Memory usage accumulation during sumon/hide loops.
* **Settings Corruption Recovery**: Potential failure cases during settings file write operations.

---

## 10. Deferred Features and Enhancements
* Workspace multi-launch
* Custom app editor
* Custom app path editing
* Custom hotkey editor
* Installer signing
* Auto-updater
* Autostart/startup behavior changes
* Broader public distribution

---

## 11. Selected First Maintenance Target
* **Selected Target**: `B. A narrow verification/reproduction task for the highest-risk unconfirmed issue (Silent global hotkey conflict failure)`
* **Why Selected**: The global hotkey is the primary method of summoning N Launcher. If `ctrl+alt+space` is already bound by another background application on the host OS, Tauri's `register` function returns an `Err`. In release mode, the error is printed to the console/log via `log::error!`, but since `tauri_plugin_log` is omitted in the release build profile, the error is completely lost and the hotkey remains unresponsive without any user feedback.
* **Why Other Candidates Were Not Selected**: Focus, scan latency, and memory growth are lower priority UX issues. Settings corruption already has a robust `.json.bak` rename mechanism. The brochure asset hygiene task does not impact product runtime stability.
* **Phase Type**: Verification/reproduction task.

---

## 12. Proposed Phase 11C Scope

### Title
```text
Phase 11C — Global Hotkey Conflict Behavior Verification
```

### Purpose
Verify the behavior of N Launcher when `Ctrl + Alt + Space` is contested by another background process. Test how the Tauri backend handles registration errors in debug and release builds, and draft a path-free reporting scheme to alert the user.

### Allowed Files to Review/Modify
* `src-tauri/src/lib.rs` (Temporary test code to simulate register error or log capture)
* `src-tauri/src/main.rs`
* `src-tauri/Cargo.toml`
* `src-tauri/capabilities/default.json`

### Files Stated as Off-Limits
* All frontend source files (`src/` directory).
* All installer configuration files (`tauri.conf.json` packaging options).
* Rust settings manager (`src-tauri/src/settings.rs`).

### Verification Steps
1. Spawn a small background utility or script that registers the global shortcut `Ctrl + Alt + Space` on the host machine.
2. Run N Launcher in development mode (`npm run tauri dev`) and observe the terminal log output when registration fails.
3. Build and package a temporary release build, run it, and confirm the silent failure behavior.
4. Investigate the feasibility of catching the registration `Err` and alerting the user via a system tray notification or a safe user-facing dialog on startup.

### Acceptance Criteria
* Documented analysis of N Launcher behavior when the shortcut is blocked.
* Verified error logging path in debug mode.
* Verification of silent failure in release builds.
* Clear proposal for safe, path-free notification methods to notify users of hotkey registration failure.

### Required Verification Commands
* `npm run tauri dev`
* `cargo check --manifest-path src-tauri/Cargo.toml`

### Rollback Boundary
All temporary testing blocks, logging hooks, or registry simulations must be reverted at the end of the phase. No persistent changes to application code should be committed.

### Stop Condition
If it is determined that Tauri automatically reports conflicts or if the error is unrecoverable without significant code expansion, document the findings and stop.

---

## 13. Safety Boundary Review
The selected verification target does not modify the frontend launch interfaces, command arguments, installer configurations, version tags, or release assets. It complies fully with all locked security boundaries.

---

## 14. Final Decision
```text
PASS
```

### Explanation of Decision
The repository, branches, and release assets are in the exact expected states. The untracked brochure asset was successfully classified as a duplicate temporary file (`N-Launcher-Brochure-v0.1.0.png`) that was superseded by the committed final version. The backlog candidates were prioritized correctly using the rubric, and a narrow verification task for the highest-risk unconfirmed issue (silent hotkey conflict) was selected for the next phase.
