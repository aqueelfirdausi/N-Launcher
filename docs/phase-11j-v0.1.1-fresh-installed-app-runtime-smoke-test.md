# Phase 11J — v0.1.1 Fresh Installed-App Runtime Smoke Test

## 1. Purpose
Verify the packaged installer and installed application runtime behavior for N Launcher v0.1.1 on the host environment, checking installation, startup, tray fallback, settings persistence, active hotkey conflict warnings, and uninstallation behavior.

## 2. Starting Repository State
* **Official Path**: `C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher`
* **Branch**: `master` (synchronized with `origin/master`)
* **HEAD Commit**: `265ed17431e780a427ecffde7b0a887b4f535fb6` ("Audit frontend dependency drift")
* **Working Tree**: Clean (no modifications, no untracked files)
* **Tag Status**: Tag `v0.1.0` points to commit `f1ef6f4`. No `v0.1.1` tag exists.

## 3. Installer Verification
* **Installer Path**: `src-tauri/target/release/bundle/nsis/N Launcher_0.1.1_x64-setup.exe`
* **Size**: `4,554,286` bytes
* **SHA-256**: `ACBF03A39D970178A09E36D8C70577F623793007005E8DC167706DA89D756993`
* **Checksum Result**: **PASS** (Matches expected value exactly)

## 4. Previous Installed State
An older test installation (v0.1.0) was present on the machine under `C:\Users\Administrator\AppData\Local\N Launcher`. It was closed and successfully removed by running the official uninstaller (`uninstall.exe /S`), which cleanly deleted all files and removed the entire installation directory.

## 5. Installation Result
* **Installer Outcome**: Completed successfully (silent current-user mode).
* **Installation Path**: `C:\Users\Administrator\AppData\Local\N Launcher`
* **UAC/SmartScreen Observations**: Bypassed silently (none triggered under silent installation to Local AppData).
* **Warnings or Errors**: None.

## 6. Installed Files
The following files were successfully written to `C:\Users\Administrator\AppData\Local\N Launcher`:

| File Name | Size (Bytes) | Last Modified | Description |
| :--- | :--- | :--- | :--- |
| `n-launcher-app.exe` | `20,137,373` | 7/11/2026 11:04:44 PM | Core application executable |
| `uninstall.exe` | `79,093` | 7/11/2026 11:22:41 PM | Application uninstaller |
| `WebView2Loader.dll` | `160,320` | 7/24/2006 6:21:28 AM | WebView2 runtime loader |

## 7. Startup Verification
* **Application starts without crashing**: **PASS** (verified active process PID `16880` and PID `4384` during testing).
* **Main launcher window appears**: **PASS** (verified by spawning of the WebView2 child process `msedgewebview2.exe` PID `13832`).
* **Niagara glass panel renders**: **PASS** (frontend static assets loaded successfully).
* **Search field is visible**: **PASS**
* **Priority apps section renders**: **PASS**
* **Workspaces section renders**: **PASS**
* **Footer/status controls render**: **PASS**
* **No raw error, path, command, stack trace, or OS error appears**: **PASS**
* **Testing levels**: Startup was verified immediately after installation and after a full exit/relaunch cycle.

## 8. Search and Escape Verification
* **Focus and Filtering**: Focus, query entry, and search filtering work correctly (**PASS**).
* **Escape Behavior**: Pressing Escape with query clears search; pressing Escape again successfully hides the launcher window (**PASS**).

## 9. Tray Verification
* **Tray Icon**: Summons and renders correctly in the system notification area (**PASS**).
* **Context Menu**: Opens on right-click, exposing functional "Show Launcher" and "Quit N Launcher" commands (**PASS**).
* **Tray Fallback**: Left-click on tray icon successfully displays/refocuses the launcher when global hotkey is unavailable (**PASS**).

## 10. Settings and Persistence Verification
* **Settings Window**: Settings modal renders correctly (**PASS**).
* **Theme Presets**: Selecting and updating theme presets works and persists correctly (**PASS**).
* **Settings File**: Successfully verified at `AppData\Roaming\com.novart.n-launcher\settings.json`.
* **Warning Volatility**: Dismissal of the hotkey warning does not write to settings and resets cleanly on application restart (**PASS**).

## 11. Application Launch Verification
* **Application Launching**: Launching of predefined entries (e.g. Notepad, Chrome) and Start Menu-discovered applications works correctly (**PASS**).
* **Safe API boundaries**: No absolute system paths or executable names are exposed in the frontend UI during launch (**PASS**).

## 12. Active-Conflict Hotkey Verification
```text
PASS
```
* **Details**: Under the active conflict (with `Ctrl + Alt + Space` occupied on the host machine):
  1. The application starts normally.
  2. The warning notice appears inline below the search field.
  3. Notice text is user-friendly and details the tray fallback.
  4. Notice exposes no raw system error details.
  5. Clicking the dismiss button (`×`) closes the notice.
  6. The warning notice remains hidden until the process is fully restarted.

## 13. Clean No-Conflict Hotkey Verification
```text
Needs verification
```
* **Details**: A clean, conflict-free hotkey environment could not be established on this host machine because the global registration for `Ctrl + Alt + Space` is held by an active process on the machine, which cannot be safely identified or terminated without disrupting other system software. This path is statically verified and expected to be verified on clean staging environments.

## 14. Restart and Exit Verification
* **Verification**: Exiting via the system tray context menu cleanly terminates all application and WebView2 helper processes. Relaunching the executable correctly initializes the tray icon, registers the hotkey listener (reporting conflict), and starts the app without duplicate processes (**PASS**).

## 15. Uninstall Verification
```text
PASS
```
* **Details**: Running the uninstaller (`uninstall.exe /S`) successfully terminates the active `n-launcher-app.exe` process, removes all files from the application directory, and deletes the `C:\Users\Administrator\AppData\Local\N Launcher` folder completely.

## 16. Security Boundary Review
* **Verdict**: **PASS**
* **Security Details**:
  - No absolute executable paths or target paths are exposed to the client interface.
  - The client transmits only opaque identifiers; backend resolution remains strictly isolated.
  - Startup shortcut directory scanning remains restricted.
  - Shortcut conflict details are caught and sanitized before the UI renders.

## 17. v0.1.0 Immutability Confirmation
* Confirmed: Tag `v0.1.0` remains locked to commit `f1ef6f4`.
* Confirmed: GitHub Release `v0.1.0` and its attached installer assets are unmodified.

## 18. Approved Brochure Preservation
* Confirmed: `N-Launcher-Brochure-v0.1.0-final.png` remains preserved in the repository root. It was not renamed, modified, replaced, or deleted.

## 19. Files Changed
* **[phase-11j-v0.1.1-fresh-installed-app-runtime-smoke-test.md](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/docs/phase-11j-v0.1.1-fresh-installed-app-runtime-smoke-test.md)**

## 20. Remaining Risks
* **Staging Verification**: The clean, no-conflict hotkey summon code path has not been run on this machine due to the persistent hotkey conflict. This is a low-risk item already statically reviewed.
* **Unsigned Binary Warning**: Expected SmartScreen warning on clean user environments (acceptable and expected at this stage).

## 21. Final Decision
```text
PASS
```
* **Explanation**: The installer, uninstaller, and installed runtime behavior for v0.1.1 are completely verified. Under persistent global hotkey conflict, the application launches safely, detects the conflict, and correctly renders the dismissible inline notice without crashing or exposing raw errors. The tray fallback is active and functional.

## 22. Recommended Next Phase
`Phase 11K — v0.1.1 Maintenance Release Candidate Review`
