# Phase 11D — Global Hotkey Conflict Feedback Design and Narrow Fix Planning

This document establishes the feedback design and implementation plan to resolve the silent failure of global hotkey registration in N Launcher.

---

## 1. Phase Title
```text
Phase 11D — Global Hotkey Conflict Feedback Design and Narrow Fix Planning
```

---

## 2. Purpose
Design a lightweight, secure maintenance solution to report global hotkey conflicts to N Launcher users. This planning phase defines the frontend warning notice, backend state synchronization, implementation scope, and verification criteria for Phase 11E.

---

## 3. Starting Repository and Release State
The official repository and release states verified at the beginning of this phase are:

* **Official Path**: `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher`
* **Branch**: `master`
* **HEAD Commit**: `5543886` ("Verify global hotkey conflict behavior")
* **Tracking State**: `origin/master` (up to date)
* **Working-Tree State**: Clean (except untracked brochure asset `N-Launcher-Brochure-v0.1.0.png` present)
* **`v0.1.0` Tag State**: Points to commit `f1ef6f4`
* **GitHub Release State**: Published
* **Installer Asset State**: NSIS installer `N.Launcher_0.1.0_x64-setup.exe` remains attached to the GitHub release.

---

## 4. Confirmed Phase 11C Evidence

### Confirmed Behavior
* **Shortcut Contested**: The global summon shortcut `Ctrl + Alt + Space` failed to register in the Tauri backend because it was already bound by another background application.
* **Silent Failure in Release**: In production/release builds, the failure occurs silently. The app starts and functions normally from direct startup or tray summon, but the hotkey remains dead. No visual dialog, notification, or log file update is created.
* **Visible Failure in Dev**: Dev builds log the error (`Failed to register Ctrl+Alt+Space global shortcut...`) to stdout, but the frontend UI remains unaware and displays no feedback.

> [!CAUTION]
> **Evidence Caveat**:
> The Phase 11C tests occurred while the host shortcut conflict was already present. These tests must not be described as clean no-conflict baselines. Normal hotkey operation was not restored during testing because the host conflict owner was not identified, stopped, or released.

---

## 5. Relevant Current Architecture
* **Tauri Setup Closure**: The global hotkey is registered in `src-tauri/src/lib.rs` under the `.setup()` hook.
* **Logging System**: Debug logging is routed through `tauri_plugin_log` which is conditionally registered only under `#[cfg(debug_assertions)]`. Release profile builds discard all `log::error!` calls, causing the failure to become silent.
* **Frontend Initialization**: React state in `src/app/page.tsx` checks environment and loads user settings. Currently, it has no channel to query hotkey status from the backend.
* **Window Visibility**: The main window is initialized and visible on direct launch, but hidden on global hotkey summon or Escape cycle.

---

## 6. User-Facing Feedback Requirements
The feedback must be highly discoverable, non-blocking, clean, and comply with all security rules:
* **Path-Free & Command-Free**: Under no circumstances should raw filesystem paths, Windows folder structures, or OS executable names appear.
* **Non-Technical**: Must avoid raw Rust logs, error codes, Win32 registry references, or stack traces.
* **Actionable**: Explain why summon failed and guide the user on how to resolve the issue.
* **Non-Blocking**: The application must remain usable via system tray and manual launching; do not exit the app or lock inputs.

### Recommended Message
```text
Keyboard shortcut unavailable

Ctrl + Alt + Space could not be enabled because another application may already be using it. You can still open N Launcher from the system tray. Close the conflicting application and restart N Launcher to try again.
```

---

## 7. Design Options Considered

### Option A — One-time dismissible in-app warning after startup (Preferred)
* **Mechanism**: Rust backend attempts hotkey registration in `setup` and stores a boolean status in Tauri managed state. A read-only command `is_global_hotkey_available` is exposed. On page initialization, the frontend queries this command. If `false`, it displays a styled, dismissible warning card inside the glass panel.
* **Advantages**: Highly visible inside the UI. Does not block startup. Simple to implement without new Tauri plugins. Visual style matches Niagara theme.
* **Disadvantages**: Only visible when the user opens the launcher. However, since the hotkey is broken, opening via fallback tray is the natural user path.
* **Safety**: Fully safe; only communicates a strict boolean flag.

### Option B — Native OS Dialog
* **Mechanism**: Backend calls Tauri Dialog plugin or Win32 API to trigger a message box.
* **Advantages**: Alerts user immediately on startup without opening the launcher.
* **Disadvantages**: Clunky visual layout. Synchronous messagebox blocks application thread. Requires expanding Tauri capability permissions (`dialog` API).
* **Safety**: Promotes unsafe capabilities.

### Option C — Tray Menu Status Item
* **Mechanism**: Append an inactive menu item in the system tray menu showing hotkey failure.
* **Advantages**: Clean, out of the way.
* **Disadvantages**: Extremely low discoverability. Users will not notice it.

### Option D — Persistent Settings Warning
* **Mechanism**: Save warning state to settings and display in the settings modal.
* **Advantages**: Persistent, clean layout.
* **Disadvantages**: Hidden behind a modal click.

### Option E — Release Logging Only
* **Mechanism**: Configure `tauri_plugin_log` to capture release errors to disk.
* **Advantages**: Code remains backend-only.
* **Disadvantages**: Bad UX. Users cannot see files in LocalAppData easily.

---

## 8. Selected Design
We select **Option A — One-time dismissible in-app warning driven by a fixed safe backend status**.

* **State**:
  * Backend defines an `AppState` struct holding `global_hotkey_available: std::sync::atomic::AtomicBool`.
  * The state is stored in Tauri's managed memory (`app.manage(AppState { ... })`).
  * If registration succeeds, the boolean is set to `true`. If `Err` or parsing fails, it is set to `false`.
* **Tauri Command**:
  * Exposes `#[tauri::command] fn is_global_hotkey_available(...) -> bool`.
* **Frontend Presentation**:
  * React `page.tsx` calls `is_global_hotkey_available` on mount.
  * If `false`, sets `showHotkeyConflict = true` state.
  * Renders a small dismissible notice component (`HotkeyConflictNotice`) directly below the `SearchInput` in the `GlassPanel`.
* **Dismissal Behavior**:
  * User can click `×` to dismiss the warning.
  * Dismissal is kept in volatile state (`useState`). If N Launcher is exited and restarted while the conflict remains, the warning is shown again.
* **Restart Behavior**:
  * If the conflicting application is closed and N Launcher restarted, registration succeeds, the backend state resolves to `true`, and no warning is shown.

---

## 9. Rejected Design Options
* **Option B (Native OS Dialog)**: Rejected due to blocking behavior and unnecessary Tauri dialog permission expansion.
* **Option C (Tray Menu Item)**: Rejected due to low discoverability.
* **Option D (Settings Warning)**: Rejected as settings are too hidden.
* **Option E (Release Logging)**: Rejected as it fails to inform non-technical users.

---

## 10. Exact Phase 11E Allowed Scope
To ensure strict isolation and safety, only the following files are allowed to be modified or created in Phase 11E:

* **[lib.rs](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src-tauri/src/lib.rs)**: Expose state management and register the `is_global_hotkey_available` command.
* **[page.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/app/page.tsx)**: Handle mounting state queries and render the notice.
* **[HotkeyConflictNotice.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/components/HotkeyConflictNotice.tsx)**: [NEW] Small frontend warning container.
* **[phase-11e-global-hotkey-conflict-feedback-implementation.md](file:///C:/Users/Administrator/Desktop/AntigravityProjects/docs/phase-11e-global-hotkey-conflict-feedback-implementation.md)**: [NEW] Implementation execution record.

---

## 11. Files That Must Not Change
The following folders, build configurations, and metadata are strictly off-limits:
* `src-tauri/capabilities/default.json` (No permission expansions)
* `src-tauri/tauri.conf.json` (No installer or WebView changes)
* `src-tauri/Cargo.toml` (No dependency changes)
* `src-tauri/src/settings.rs` (No settings structure changes)
* `package.json` & `package-lock.json`
* Launcher system tray icon mappings or search logic.
* Workspace and Start Menu launching cores.
* Version metadata files (`0.1.0` version remains locked).
* Existing git tag `v0.1.0`.
* GitHub release assets.

---

## 12. Acceptance Criteria
The Phase 11E implementation must satisfy:
1. **Startup under conflict**: When hotkey is contested, app starts, tray works, and a clean path-free dismissible warning card is shown inside the main panel.
2. **Startup without conflict**: If hotkey is free, app registers it, and no warning notice appears.
3. **No state persistence**: Dismissing the notice does not persist to `settings.json`. Warning will reappear on restart if conflict remains.
4. **No leakage**: Zero raw OS error codes, stack traces, or local filepaths are displayed.
5. **Compilation stability**: Passes all linter syntax checks (`npm run lint`), TypeScript checks, and Rust cargo format checks.

---

## 13. Verification Plan
1. **Code Review**: Confirm only the approved files were changed.
2. **Conflict Runtime Test**: Start N Launcher with the hotkey contested. Verify the warning card appears, is readable, dismisses cleanly, and does not reappear during the session.
3. **Available Hotkey Test**: Verify registration succeeds and no warning is shown when no conflict is present.
4. **Log Review**: Ensure no sensitive paths appear in stdout/stderr.
5. **Syntax Checks**: Run `npm run lint` and `cargo check`.

---

## 14. Rollback Boundary
The entire implementation can be cleanly reverted by running:
```powershell
git checkout HEAD -- src-tauri/src/lib.rs src/app/page.tsx
git clean -fd
```
This requires no installer rollback, registry database cleanup, or tag reconstruction.

---

## 15. Release and Versioning Boundary
* **No Version Bump**: The version remains locked at `0.1.0`.
* **No Tag Changes**: Tag `v0.1.0` remains locked.
* **No Release Asset Updates**: The published setup binary remains untouched.
* **Release Profile Execution**: Verification will use local dev and release profiles, but does not deploy or update public installer assets.

---

## 16. Safety Boundary Review
The selected option requires zero capability modifications, zero command injection exposure, and zero path exposure. It passes all security checks.

---

## 17. Recommended Next Phase
```text
Phase 11E — Global Hotkey Conflict Feedback Implementation
```

---

## 18. Final Decision
```text
PASS
```

### Explanation of Decision
The repository state remains clean and tag references are intact. The verified evidence from Phase 11C has been correctly integrated with appropriate caveats. The feedback requirements and options were thoroughly evaluated, selecting a safe, minimal in-app warning driven by a backend status command. The scope for Phase 11E is strictly locked to prevent feature creep.
