# Phase 11G — v0.1.1 Maintenance Release Preparation Audit

## 1. Purpose
This phase performs a comprehensive metadata and build audit to prepare for the future `v0.1.1` maintenance release of N Launcher. Its scope is strictly limited to planning and documentation: identifying version variables, establishing static and runtime verification steps, drafting release notes, and protecting the immutable boundaries of the existing `v0.1.0` release. No source code modifications, version bumps, build packaging, tag creation, or release publication are performed during this phase.

## 2. Starting Repository State
* **Official Path**: `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher` (confirmed as the exact no-space path)
* **Branch**: `master` (fully synchronized tracking `origin/master`)
* **HEAD Commit**: `c819f79` ("Review hotkey feedback regression and release readiness")
* **Working Tree**: Clean (no tracked changes present)
* **Untracked Files**: Only the expected duplicate brochure asset `N-Launcher-Brochure-v0.1.0.png`

## 3. Existing Release and Tag State
* **Tag `v0.1.0`**: Points to commit `f1ef6f4` ("Add release publication review")
* **GitHub Release `v0.1.0`**: Published and immutable
* **GitHub Release Asset**: `N.Launcher_0.1.0_x64-setup.exe` (size: 4,553,106 bytes)
* **Local Build Path for v0.1.0**: `src-tauri/target/release/bundle/nsis/N Launcher_0.1.0_x64-setup.exe`

## 4. Maintenance Fix Summary
The maintenance changes implemented in commits `0d90232` and `c819f79` resolve the silent failure of the global summon hotkey when it is already occupied by another host process:
* **Backend State**: An atomic boolean flag `global_hotkey_available` is stored in Tauri's memory state `AppState`. If the `ctrl+alt+space` shortcut registration fails during the Tauri `setup` hook, the flag resolves to `false` and startup continues safely.
* **Tauri Command**: Exposes `is_global_hotkey_available` to query the status boolean.
* **Frontend Warning Notice**: On page mount, React queries `is_global_hotkey_available`. If `false`, it renders a dismissible `HotkeyConflictNotice` directly inside the Niagara glass panel.
* **Dismissal**: Fully volatile. Clicking `×` dismisses the notice in React memory state, but the dismissal is not persisted to `settings.json` and will reappear on application restart if the conflict remains.
* **Security & Fallback**: The raw registration exception string is never exposed to the frontend, protecting path/system layouts. If the command fails, the query fails silently in console logs without crashing the application, and system tray summon remains fully operational as a fallback.

## 5. Files Reviewed
The following files were inspected to verify version declarations, configuration details, and implementation logic:
* `docs/phase-11f-hotkey-conflict-feedback-regression-review-and-maintenance-release-decision.md`
* `docs/phase-11e-global-hotkey-conflict-feedback-implementation.md`
* `docs/phase-11d-global-hotkey-conflict-feedback-design-and-narrow-fix-planning.md`
* `docs/phase-11c-global-hotkey-conflict-behavior-verification.md`
* `src-tauri/src/lib.rs`
* `src/app/page.tsx`
* `src/components/HotkeyConflictNotice.tsx`
* `src-tauri/tauri.conf.json`
* `src-tauri/Cargo.toml`
* `package.json`
* `package-lock.json`
* `src-tauri/Cargo.lock`

## 6. Exact Version Files Identified
Five files were identified that contain the application's current version (`0.1.0`) and will require updates for the `v0.1.1` version bump:

1. **[package.json](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/package.json)**
   * **Current value**: `"version": "0.1.0"` (line 3)
   * **Proposed future value**: `"version": "0.1.1"`
   * **Manual editing required**: Yes
   * **Generated metadata change**: Updates `package-lock.json` upon next install
   * **Evidence source**: Source code inspection

2. **[tauri.conf.json](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src-tauri/tauri.conf.json)**
   * **Current value**: `"version": "0.1.0"` (line 4)
   * **Proposed future value**: `"version": "0.1.1"`
   * **Manual editing required**: Yes
   * **Generated metadata change**: None
   * **Evidence source**: Source code inspection

3. **[Cargo.toml](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src-tauri/Cargo.toml)**
   * **Current value**: `version = "0.1.0"` (line 3)
   * **Proposed future value**: `version = "0.1.1"`
   * **Manual editing required**: Yes
   * **Generated metadata change**: Updates `Cargo.lock` on next compile or check
   * **Evidence source**: Source code inspection

4. **[package-lock.json](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/package-lock.json)**
   * **Current value**: `"version": "0.1.0"` (lines 3 & 9)
   * **Proposed future value**: `"version": "0.1.1"`
   * **Manual editing required**: No (can be updated automatically via `npm install` or manual edit if preferred)
   * **Generated metadata change**: Yes, package-lock metadata will update
   * **Evidence source**: Source code inspection

5. **[Cargo.lock](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src-tauri/Cargo.lock)**
   * **Current value**: `version = "0.1.0"` (line 1932, under `[[package]] name = "n-launcher-app"`)
   * **Proposed future value**: `version = "0.1.1"`
   * **Manual editing required**: No (updates automatically during next Cargo compilation, e.g., `cargo check` or `cargo build`)
   * **Generated metadata change**: Yes, metadata changes automatically
   * **Evidence source**: Source code inspection

## 7. Installer Rebuild Requirements
* **Required commands**:
  1. Clean previous build artifacts (recommended to prevent cache collision):
     ```powershell
     Remove-Item -Recurse -Force src-tauri/target/release/bundle
     ```
  2. Build the production application and bundle:
     ```powershell
     npm run tauri:build
     ```
* **Expected local output path**: `src-tauri/target/release/bundle/nsis/N Launcher_0.1.1_x64-setup.exe`
* **Expected installer naming**: `N Launcher_0.1.1_x64-setup.exe` (local output) / `N.Launcher_0.1.1_x64-setup.exe` (renamed for GitHub Release upload, following the dot-notation convention established in `v0.1.0`)
* **Cleaning existing build artifacts**: Highly recommended before starting the rebuild to guarantee a clean workspace state.
* **Items needing verification**: None (Tauri CLI automatically resolves build paths based on the `productName` and version properties in `tauri.conf.json`).

## 8. Static Verification Plan
The following static checks must be executed and verified before compiling the production installer:
```powershell
npm run lint
npm run build
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo check --manifest-path src-tauri/Cargo.toml --target-dir C:\Users\Administrator\.gemini\antigravity\antigravity-target
git diff --check
```
*No release-build commands will be run during this phase (Phase 11G).*

## 9. Conflict Runtime Verification Plan
Verify the warning notice behavior on a host system with an active global shortcut conflict for `Ctrl + Alt + Space` (e.g. registered by a background PowerShell test script or other running process):
1. **Startup under conflict**: Run `npm run tauri dev` or start the compiled application. Check that the application starts successfully without crashing.
2. **Warning visibility**: Confirm that a high-contrast red notice card `HotkeyConflictNotice` appears directly below the `SearchInput` inside the main glass panel.
3. **Wording check**: Verify the notice matches:
   * Header: "Keyboard shortcut unavailable"
   * Body: "Ctrl + Alt + Space could not be enabled because another application may already be using it. You can still open N Launcher from the system tray. Close the conflicting application and restart N Launcher to try again."
4. **Accessibility validation**: Verify the notice has `role="status"` and `aria-live="polite"`, and the dismiss button has `aria-label="Dismiss shortcut warning"`.
5. **Dismissal behavior**: Click the `×` button. Verify that the warning notice fades out and disappears, and that the app list moves up to fill the space.
6. **Persistence checks**:
   * Hide the launcher and summon it via the tray menu. Confirm the warning does not reappear.
   * Verify that no hotkey notice dismissal keys or state were written to `settings.json`.
7. **Restart behavior**: Close the application completely via the tray menu ("Quit N Launcher") and start it again. Confirm the warning notice reappears on startup.
8. **Tray Fallback**: Press `Ctrl + Alt + Space` (it should not summon the window). Double-click the tray icon or right-click and choose "Show Launcher". Confirm the window is summoned and focused.
9. **No raw leakage**: Inspect console logs and terminal outputs. Confirm that no system paths, raw shortcut registration exception stack traces, or registry strings are printed or surfaced in the UI.

## 10. Clean No-Conflict Runtime Verification Plan
Verify that N Launcher behaves correctly when the global shortcut `Ctrl + Alt + Space` is free before startup:
1. **Establish clean environment**: Use a staging machine or virtual machine where the hotkey `Ctrl + Alt + Space` is unassigned.
2. **Start application**: Execute the application.
3. **Warning check**: Confirm that no warning notice card appears below the `SearchInput` (and `globalHotkeyAvailable` resolves to `true`).
4. **Summon hotkey**: Press the `Ctrl + Alt + Space` global shortcut. Confirm it successfully summons and focuses the N Launcher window.
5. **Hide & re-summon**: Press `Escape` (or click away) to hide the launcher. Press `Ctrl + Alt + Space` again. Confirm it appears and focuses immediately.
6. **Tray integration**: Right-click the system tray icon, select "Show Launcher" or double-click the tray icon. Confirm it works correctly without conflict warnings.

## 11. Fresh Installed-App Smoke-Test Plan
Verify the production installation flow and packaged runtime stability for `v0.1.1`:
1. **Fresh installer build**: Compile `N Launcher_0.1.1_x64-setup.exe` using `npm run tauri:build`.
2. **Clean up old install**: Uninstall any existing N Launcher versions.
3. **Execution**: Run the `v0.1.1` installer in `currentUser` mode (installing to `%LOCALAPPDATA%\N Launcher\`). Verify that the installation finishes without requiring administrator elevation.
4. **Installed files check**: Verify that `%LOCALAPPDATA%\N Launcher\` contains:
   * `n-launcher-app.exe`
   * `uninstall.exe`
   * `WebView2Loader.dll`
5. **Startup behavior**: Open N Launcher. Confirm the tray icon appears and the launcher window loads.
6. **Core workflows smoke test**:
   * **Search**: Type queries, check search responses, navigate list items with up/down arrows.
   * **Escape behavior**: Confirm `Escape` clears search text -> blurs focus -> hides the launcher.
   * **Tray menu**: Confirm right-clicking the tray icon and choosing "Quit N Launcher" closes the application cleanly.
   * **Settings presets**: Open the settings modal. Click theme presets (Violet, Dark, Glass) and verify transparency and blur adjustments apply.
   * **Priority Apps**: Pin/unpin Priority apps, restart the application, and check that the priority items persist.
   * **Workspaces**: Expand and collapse workspaces.
   * **Application execution**: Launch built-in targets (VS Code, Chrome, Terminal, Files, Notepad) and discovered Start Menu apps. Verify that launch operations succeed cleanly.
7. **Warning behavior**: Verify warning notice conditionally renders correctly depending on hotkey availability (test both conflict and no-conflict scenarios).
8. **Uninstall behavior**: Run `uninstall.exe` from the installation folder. Confirm that all binaries and folders are removed cleanly from `%LOCALAPPDATA%\N Launcher\`.
9. **Evidence requirements**: Human visual checks and log/settings file inspections.

## 12. Draft v0.1.1 Release Notes
```text
N Launcher v0.1.1 is a maintenance update that improves feedback when the Ctrl + Alt + Space global shortcut is already being used by another application.

The launcher now displays a clear in-app warning and explains that it can still be opened from the system tray. No settings, launch behavior, or application-discovery features were changed.
```
*Note: This draft is fully supported by repository commit history (`0d90232`, `c819f79`) and Phase 11F regression audit.*

## 13. Tag and GitHub Release Plan
* **Proposed Tag**: `v0.1.1`
* **Proposed Release Title**: `N Launcher v0.1.1`
* **Commit Gate**: Commit the version bump and lockfile updates under a clean master state.
* **Verification Gate**: Run all static checks and execute conflict/clean environment runtime checks.
* **Tagging Order**:
  1. Once checks pass, create the annotated tag locally:
     ```powershell
     git tag -a v0.1.1 -m "Release N Launcher v0.1.1"
     ```
  2. Push the tagged commit to the remote repository:
     ```powershell
     git push origin master
     git push origin v0.1.1
     ```
* **GitHub Release Creation Order**:
  1. Create a draft release on GitHub matching tag `v0.1.1` and title `N Launcher v0.1.1`.
  2. Rename the local installer from `N Launcher_0.1.1_x64-setup.exe` to `N.Launcher_0.1.1_x64-setup.exe`.
  3. Upload `N.Launcher_0.1.1_x64-setup.exe` to the draft release.
  4. Fill in the release notes using the approved draft.
  5. Publish the GitHub Release.
* **Final asset verification**: Check the published GitHub Release page to verify that the tag, title, notes, and installer asset name are correct.
* **Rollback boundary**: If any step fails before publishing the release, delete the local tag (`git tag -d v0.1.1`), delete the remote tag (`git push --delete origin v0.1.1`), and revert version-bump commits.

## 14. v0.1.0 Immutability Review
To protect the integrity of the published `v0.1.0` release checkpoint, future maintenance operations must not:
* Move or recreate the `v0.1.0` tag (which must remain permanently locked to commit `f1ef6f4`).
* Replace, delete, or modify any existing release assets on the GitHub `v0.1.0` release page.
* Reuse the filename `N.Launcher_0.1.0_x64-setup.exe` for any new build.
* Rewrite the tagged commit history of commit `f1ef6f4`.

## 15. Duplicate Brochure Recommendation
* **Recommended handling**: Handle it later in a dedicated repository-hygiene phase.
* **Rationale**: The duplicate file `N-Launcher-Brochure-v0.1.0.png` is untracked and does not affect application builds or runtime behavior. Postponing cleanup ensures that the `v0.1.1` maintenance release remains strictly focused on hotkey conflict reporting without unrelated noise.

## 16. Risks and Items Needing Verification
* `Available-hotkey runtime path: Needs verification.` (Verification of the shortcut registration success path requires a clean host environment free of active `Ctrl + Alt + Space` binds).
* `Clean staging environment setup: Needs verification.` (Setting up a clean testing machine or virtual machine to run the no-conflict verification flow).

## 17. Proposed Next Phase
* **Recommended Phase**: `Phase 11H — v0.1.1 Version Bump and Maintenance Build Preparation`
* **Scope**: Perform the version bump in `package.json`, `tauri.conf.json`, and `Cargo.toml`. Run the package manager and compilation tools to update `package-lock.json` and `Cargo.lock`. Run all static verification checks. *Phase 11H is a separate phase and must not start automatically.*

## 18. Final Decision
```text
PASS
```
* **Explanation**: The release preparation audit is complete. Every version location, installer requirement, static and runtime check, release notes draft, and release publication parameter for `v0.1.1` has been successfully identified, verified against repository assets, and documented. The boundaries of the immutable `v0.1.0` release remain protected.
