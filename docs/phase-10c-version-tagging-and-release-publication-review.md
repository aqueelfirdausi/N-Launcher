# Phase 10C — Version Tagging and Release Publication Review

This document outlines the proposed release publication plan for N Launcher v0.1.0, detailing metadata validation, release notes, known limitations, and future git release commands.

---

## 1. Goal
Prepare a safe release publication plan for N Launcher v0.1.0, including tag name, release title, release notes, artifact checklists, and publication blockers. This phase is documentation-only.

---

## 2. Starting Git State
* **Branch**: `master` tracking `origin/master`
* **Latest Synced Commit**: `85bcb94` (Add fresh installed app runtime smoke test)
* **Working Tree**: Clean

---

## 3. Current Version & Metadata

| Field | Value |
|---|---|
| **Product Name** | N Launcher |
| **App Version** | `0.1.0` |
| **Executable Name** | `n-launcher-app.exe` |
| **Bundle Identifier** | `com.novart.n-launcher` |
| **Publisher** | Novart Systems |
| **Active Git Commit** | `85bcb94` |

---

## 4. Release Candidate Summary
N Launcher is a compact companion launcher designed for Windows 11. It blends a translucent Niagara-style glassmorphic UI with secure Rust-powered backend app execution. Over several development phases, it was expanded to support read-only Start Menu shortcut discovery, safe canonicalized launching, visual customization options, and keyboard-driven shortcut summons. 

A fresh installation verification (Phase 10B) successfully validated that the NSIS installer compiles a working client directory, correctly bundles native DLLs, starts without system dependency errors, and registers global hotkeys.

---

## 5. Installer Artifact Checklist
* **File Name**: `N Launcher_0.1.0_x64-setup.exe`
* **Path**: `src-tauri/target/release/bundle/nsis/N Launcher_0.1.0_x64-setup.exe`
* **File Size**: `4,553,106` bytes (~4.34 MB)
* **Last Modified**: `7/9/2026 1:01:00 PM`
* **Checks**:
  - [x] Executable compiles correctly without warnings
  - [x] Installer bundles `WebView2Loader.dll` successfully
  - [x] `currentUser` installer mode handles non-admin folder structures
  - [x] Uninstaller removes all files, directories, registry data, and shortcuts cleanly

---

## 6. Proposed Tag & Release Parameters
* **Proposed Tag Name**: `v0.1.0`
* **Proposed Release Title**: `N Launcher v0.1.0`
* **Proposed Release Type**: Initial release checkpoint (Private/limited distribution candidate)

---

## 7. Release Notes Draft

### Features
* **Niagara-Style Glassmorphic Layout**: Premium, sidebar-aligned panel with custom blur options (Subtle, Standard, Strong) and theme presets (Violet, Minimal Dark, Soft Glass).
* **Opaque Security Model**: App launching is fully backend-controlled. Opaque IDs are passed from the client, preventing filepath exposure and code injection.
* **Start Menu Discovery**: Scans local user and system Programs directories, merging discovered applications alphabetically.
* **Priority Section**: Support for pinning key applications directly to the top list index.
* **Custom Workspaces**: Create, rename, delete, and manage application lists to launch member items individually.
* **summon Hotkey**:Summon and focus launcher using `Ctrl + Alt + Space`.
* **UX Polish**: Double-launch click prevention, smooth A-Z rail scrolling offsets, and user-friendly sanitization of OS errors.

---

## 8. Known Limitations
* **Unsigned Setup Binary**: The installer is currently unsigned. Users will receive Windows Defender SmartScreen "Unknown Publisher" warnings during setup.
* **Auto-Updater**: Tauri auto-updater is not integrated. Updates require manual installer downloads.
* **No Multi-Launch Workspaces**: Workspaces act as app organizational folders; multi-launching all member apps with a single click is not implemented.
* **Single Instance Binding**: Starting a second executable instance redirects and refocuses the active window rather than spawning a duplicate process.
* **Version Restriction**: Active version remains locked at `0.1.0`.

---

## 9. Deferred Items
* **Code signing setup**: Awaits purchase of developer certificates.
* **Updater configurations**: Awaits network infrastructure allocation.
* **Workspace multi-launch**: Scheduled for future settings expansion phases.

---

## 10. Publication Blockers
* **Owner review approval**: Awaits visual approval of Phase 10B manual smoke tests by the owner.
* **Signed installers requirements**: Must remain deferred until visual staging verification is complete.

---

## 11. Proposed Git Commands (For Future Execution)

The following commands will be run in a later phase to publish the tag and release, but are **not** run in this phase:

```bash
# 1. Create a local annotated git tag
git tag -a v0.1.0 -m "Release N Launcher v0.1.0"

# 2. Push the tag to GitHub origin
git push origin v0.1.0

# 3. Create a GitHub Release using the gh CLI tool (if available)
gh release create v0.1.0 "src-tauri/target/release/bundle/nsis/N Launcher_0.1.0_x64-setup.exe" --title "N Launcher v0.1.0" --notes "Release candidate checkpoint for N Launcher v0.1.0. Bundles Niagara-style layout, Start Menu discovery, priority pins, and custom workspace panels."
```

---

## 12. Safety Boundary Review
* **Verdict**: **PASS**
* **Safety Details**:
  - No codebase source files modified.
  - No installer config maps altered.
  - No actual git tags created on local or remote.
  - No GitHub Release created.
  - Opaque launcher APIs and security validations remain intact.

---

## 13. Final Decision

> [!NOTE]
> **Audit Status: PASS**
> The N Launcher v0.1.0 release publication plan is verified and ready for owner execution.

---

## 14. Recommended Next Phase
`Phase 10D — Release Publication and Tagging Execution` (Once approved, execute tagging and release commands).
