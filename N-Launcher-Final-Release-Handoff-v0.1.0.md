# N Launcher — Final Release Handoff v0.1.0

This document serves as the final release handoff and checkpoint guide for **N Launcher v0.1.0**, establishing the precise state of the project, including metadata, verified artifacts, security boundaries, and next steps.

---

## 1. Project Identity and Purpose
* **Project Name**: N Launcher
* **Identity Meaning**: The "N" stands for **Novart**, representing the **Novart Systems** brand identity.
* **Purpose**: A sleek, Windows 11 companion launcher featuring a Niagara-style glassmorphic UI, designed to organize, search, and safely execute applications.

---

## 2. Official Project Path
* **Active Path**: `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher`
* > [!IMPORTANT]
  > **Safety Note**: Do not use the legacy path `C:\Users\Administrator\Desktop\Antigravity Projects\N-Launcher` (with a space), as it triggers build-tool, node, and path resolution failures.

---

## 3. GitHub Repo and Release URL
* **Repository**: https://github.com/aqueelfirdausi/N-Launcher.git
* **GitHub Release URL**: https://github.com/aqueelfirdausi/N-Launcher/releases/tag/v0.1.0

---

## 4. Current Final Status
* **Release Status**: **RELEASED / STABLE CHECKPOINT**
* **Active Version**: `0.1.0`
* **Bundle Identifier**: `com.novart.n-launcher`
* **Publisher**: Novart Systems
* **Compilation Status**: Web app builds static export cleanly; Rust backend compiles cleanly in both dev and release profiles.

---

## 5. Release Summary
N Launcher v0.1.0 marks the completion of the core layout and secure Start Menu integration cycles. It features a fully-realized glassmorphic Left-Side floating panel, priority app configuration, customizable workspaces, alphabetical A-Z index lists, global sumon keyboard triggers, and a robust backend-owned Start Menu application launching path that guarantees absolute host isolation.

---

## 6. Git State
* **Branch**: `master` (fully synchronized with `origin/master`)
* **Working Tree**: Clean (`nothing to commit, working tree clean`)
* **Latest master Commit**: `4c13d69` (Add GitHub release publication record)

---

## 7. Tag State
* **Release Tag**: `v0.1.0`
* **Tag Type**: Annotated (`"Release N Launcher v0.1.0"`)
* **Tagged Commit**: `f1ef6f4` (Add release publication review)
* **Tag Remote Status**: Pushed successfully to origin remote.

---

## 8. GitHub Release State
* **Status**: Published successfully
* **Release URL**: https://github.com/aqueelfirdausi/N-Launcher/releases/tag/v0.1.0
* **Uploaded Setup Asset**: `N.Launcher_0.1.0_x64-setup.exe`

---

## 9. Installer Artifact Details
* **Original Local Installer Path**: `src-tauri/target/release/bundle/nsis/N Launcher_0.1.0_x64-setup.exe`
* **Installer Size**: `4,553,106` bytes (~4.34 MB)
* **Install Mode**: `currentUser` (installs to `%LOCALAPPDATA%\N Launcher\` without requiring UAC/administrative elevation)
* **WebView2 Packaging**: `WebView2Loader.dll` is bundled correctly via `bundle.resources` inside `tauri.conf.json`.

---

## 10. Installed-App Runtime Smoke Test Result
* **Status**: **PASS** (Verified by human visual smoke test).
* **Installed Folder verified**: `C:\Users\Administrator\AppData\Local\N Launcher`
* **Folder Files Checklist**:
  - `n-launcher-app.exe` — `20,128,833` bytes (Core app binary)
  - `uninstall.exe` — `79,093` bytes (Clean uninstaller)
  - `WebView2Loader.dll` — `160,320` bytes (Embedded WebView DLL loader)
* **Visual Verification Checklist**:
  - [x] N Launcher window opens visibly on startup/summon
  - [x] Glassmorphic Niagara panel renders premium visuals, glows, and custom blur intensities
  - [x] Priority apps list displays pinned targets
  - [x] Workspaces show custom collapsible containers
  - [x] All Apps displays alphabetical sections accurately
  - [x] Search matches and filters apps responsively
  - [x] Escape sequence correctly clears query -> blurs input -> hides window
  - [x] `Ctrl + Alt + Space` summons and focuses window
  - [x] System tray icon right-click menu and double-click actions function cleanly
  - [x] Built-in target launching executes VS Code, Terminal, Chrome, Files, and Notepad
  - [x] Start Menu apps resolve and launch safely
  - [x] Pin/unpin Priority apps persists on restart
  - [x] Workspaces expand/collapse lists cleanly
  - [x] **Zero absolute paths, shortcut paths, or command strings appear in the UI or console logs**
  - [x] **Zero unhandled exceptions or raw OS error strings shown**

---

## 11. Completed Phases (Phase 9A through Phase 10E)
* **Phase 9A**: Safe App Library Architecture (Secure, opaque model design).
* **Phase 9B**: Read-Only Start Menu Discovery (Directory scanner crawling).
* **Phase 9C**: Alphabetical Index Polish (Dividers, rail scrolling offsets).
* **Phase 9D**: Priority Apps Management (Pinning/unpinning, settings persistence).
* **Phase 9E**: Workspace Management (Containers, member assignment).
* **Phase 9F**: Safe Start Menu Launch Design Review (Security and injection analysis).
* **Phase 9G**: Safe Start Menu Launch Spike (Implementing `cmd /c start` backend resolves).
* **Phase 9H**: Launch Regression and Packaged App Review (Checking installer status).
* **Phase 9I**: Post-Launch UX Polish and Error Handling (Debounce, sanitizing path exceptions).
* **Phase 9J**: App Library Visual Refinement (Theme glows, badge integration).
* **Phase 9K**: App Library Release Candidate Review (Passes lint, Cargo check, and builds).
* **Phase 10A**: Release Preparation Audit (Validating metadata, bundling DLLs).
* **Phase 10B**: Fresh Installed-App Runtime Smoke Test (Executing setup and verifying runtime stability).
* **Phase 10C**: Version Tagging and Release Publication Review (Documentation planning).
* **Phase 10D**: Release Tagging Execution (Creating and pushing git tag `v0.1.0`).
* **Phase 10E**: GitHub Release Publication Execution (Publishing releases on GitHub).

---

## 12. Features Included in v0.1.0
* **Niagara Glassmorphic Window**: Borderless transparent overlay with HSL tailored theme presets (Default Violet, Minimal Dark, Soft Glass) and opacity slide adjustments.
* **Summon Hotkey**: Summons window using `Ctrl + Alt + Space`.
* **System Tray integration**: Right-click context controls ("Show Launcher", "Quit N Launcher") and Left-click summon.
* **Escape Cycle Navigation**: Clear Search -> Blur Focus -> Hide Window.
* **App Library Grid**:
  - Pinned Priority apps list.
  - Custom Workspaces list.
  - All Apps index (Built-in + Discovered Start Menu apps sorted alphabetically).
* **Search & Rail Scrubber**: Auto-focused search input and alphabetical sidebar rail with smart scrolling jumps.
* **Secure Launch Core**: Real Rust-owned launch processes for VS Code, Chrome, Notepad, Files, Terminal, and Start Menu applications.

---

## 13. Safety Boundaries Locked in v0.1.0
1. **Opaque Communication**: Frontend only passes string IDs. Command strings and parameters are barred from client access.
2. **Directory Restriction Check**: Canonicalized shortcuts are checked using starts-with validation, blocking path traversal and directory escapes.
3. **No Shell Plugin**: Executions rely on Rust spawner calls. The Tauri shell plugin is disabled.
4. **Read-Only Start Menu Access**: Application reads shortcuts but never alters Windows directory structures or installer logs.
5. **currentUser Mode**: Preserves non-administrative install pathing (`%LOCALAPPDATA%`), avoiding UAC elevation alerts.

---

## 14. Components & Features Discussed
* **WebView2 Loader GNU Integration**: Patched by manually importing the DLL into `/resources` and adding it to `tauri.conf.json`'s resources array to support packaging under the GNU toolchain.
* **Double-Launch Block**: Intercepts duplicate triggers within 3 seconds, showing a toast and locking inputs during the launch sequence.
* **Linter setup**: Downgraded to ESLint 8 / next-eslint 15 to resolve circular JSON structure crashes present in Next.js 15.

---

## 15. Accepted Decisions
* **Relative Path Hashes**: App IDs remain opaque, protecting file system layouts.
* **Opaque Error Toasting**: OS errors are translated to safe UI messages, hiding path configurations.
* **Manual Auto-start**: Automatic boot launch keys are omitted from the default installer.

---

## 16. Rejected / Deferred Directions
* **Workspace Multi-Launch**: Clicking workspace header row only toggles visibility. Batch launching remains deferred.
* **Installer Code Signing**: Kept unsigned (SmartScreen warnings expected).
* **Custom App Editor**: Adding non-Start Menu targets is deferred.

---

## 17. Known Limitations
* Installer unsigned (triggers Windows SmartScreen warning on first setup).
* No auto-updater mechanism.
* No workspace multi-launch.
* Limited initial testing (owner/developer review recommended).

---

## 18. What Must Not Be Touched Without Approval
* **Rust-owned launch resolution logic** (`launch_app` and `launch_discovered_app`).
* **Canonical starts_with directory checks** inside `is_inside_approved_directories`.
* **Installer installMode configuration** (`currentUser`).
* **Tauri capability JSON files** (`default.json`).

---

## 19. Pending Work after v0.1.0
* Setting up automated GitHub Action release pipelines.
* Introducing signed installers using EV certificates.
* Adding a visual setting toggle for autostart-on-boot behavior.
* Workspace multi-launch settings.

---

## 20. Recommended Next Phase
`Phase 11A — Post-Release Stability Watch and Backlog Planning`

---

## 21. Handoff Continuation Prompt

Use the following prompt to resume N Launcher development:

```
We are resuming N Launcher development after the v0.1.0 release checkpoint (Phase 10F).

Project path:
C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher

Do not use this path:
C:\Users\Administrator\Desktop\Antigravity Projects\N-Launcher

Key Release Facts:
- Stack: Tauri v2, Rust (GNU toolchain), Next.js 15 App Router, static export, Tailwind CSS v4.
- Version: 0.1.0.
- Latest Master Commit: 4c13d69 (or latest master log).
- Tag: v0.1.0 (pointing to commit f1ef6f4).
- GitHub Release URL: https://github.com/aqueelfirdausi/N-Launcher/releases/tag/v0.1.0
- Installer: currentUser mode (installs to %LOCALAPPDATA%\N Launcher\), WebView2Loader.dll bundled.
- Installed Folder: C:\Users\Administrator\AppData\Local\N Launcher (contains n-launcher-app.exe, uninstall.exe, WebView2Loader.dll).
- Security boundaries: Safe backend-owned launching by ID, path canonicalization, approved directory check, no shell plugin, no registry writes, and read-only Start Menu discovery.

Current Phase:
Phase 11A — Post-Release Stability Watch and Backlog Planning

Goals:
1. Verify the repository and installer remain fully clean.
2. Outline the product roadmap and backlog priorities (signed installer, autostart toggle, workspace multi-launch, custom shortcut editor, updater plugin).
```
