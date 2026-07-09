# Phase 10E — GitHub Release Publication Execution

This document details the publication of the GitHub Release and the upload of the tested NSIS setup installer for N Launcher v0.1.0.

---

## 1. Goal
Create the GitHub Release for tag `v0.1.0` and upload the tested NSIS installer setup artifact to make the release checkpoint available for developer testing.

---

## 2. Starting Git State
* **Branch**: `master` tracking `origin/master`
* **Latest Synced Commit**: `a6251f2` (Add release tagging execution record)
* **Working Tree**: Clean

---

## 3. Release Publication Details
* **Tag Reference**: `v0.1.0` (pointing to commit `f1ef6f4`)
* **GitHub Release Title**: `N Launcher v0.1.0`
* **GitHub Release URL**: https://github.com/aqueelfirdausi/N-Launcher/releases/tag/v0.1.0
* **Uploaded Setup Binary**: `N.Launcher_0.1.0_x64-setup.exe` (automatically sanitized from `N Launcher_0.1.0_x64-setup.exe`)
* **Uploaded Setup Size**: `4,553,106` bytes (~4.34 MB)
* **Tagger & Publisher**: `aqueelfirdausi`

---

## 4. Release Highlights
* **Niagara-Style Glassmorphic Layout**: Sidebar-aligned glass panel with custom opacity/blur selectors and Violet, Dark, and Soft theme presets.
* **Opaque IPC Launch API**: Launches are fully backend-controlled via Rust command spawners. No raw filepaths are sent by the client.
* **Lock Directory Validation**: Restricts execution of canonicalized shortcuts to system and user Start Menu directories.
* **Start Menu & Library Lists**: Reads Start Menu applications, sorting and presenting them alphabetically, and supports pinning to the Priority apps list.
* **Custom Workspaces**: Manage dedicated app lists to launch workspace member items.
* **summon Hotkey**: Summon launcher using `Ctrl + Alt + Space` globally.
* **Installed-App Test Passed**: Tested and verified under a clean installation on the target Windows system.

---

## 5. Known Limitations
* Installer is unsigned (Windows SmartScreen warning expected).
* Autoupdater is not implemented.
* Workspace multi-launch not supported.
* Limited testing environment (dev/test machine distribution recommended).

---

## 6. Safety Notes
* No codebase source files or configurations modified.
* Security layers, opaque identifiers, and validation gates remain locked.

---

## 7. Excluded Scope (What Was Not Done)
* No application version numbers modified.
* No installer configs or bundler schemas altered.
* No executable rebuild performed.
* No installer signing operations run.
* No new tags created or existing tag references moved.

---

## 8. Final Decision

> [!NOTE]
> **Execution Status: PASS**
> N Launcher v0.1.0 has been successfully published on GitHub with the tested installer setup attached.

---

## 9. Recommended Next Phase
`Phase 10F — Final Release Handoff` (Finalizing documentation, handoff archives, and checkpoint status).
