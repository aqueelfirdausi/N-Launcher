# Phase 9G — Safe Start Menu Launch Spike

This document details the design, implementation, and verification outcomes for the Safe Start Menu Launch Spike introduced in Phase 9G.

---

## 1. Goal
Implement a secure, backend-owned launch route for discovered Windows Start Menu application shortcuts (`.lnk`), ensuring that the frontend never controls raw command strings or absolute file system paths.

---

## 2. Files Changed

### Backend (Rust)
- **[MODIFY] [lib.rs](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src-tauri/src/lib.rs)**:
  - Added private helper `find_shortcut_by_id()` to securely walk Start Menu trees.
  - Added private helper `resolve_shortcut_path()` to match and return shortcut paths entirely inside Rust/backend memory.
  - Added private validator `is_inside_approved_directories()` enforcing that canonicalized targets reside strictly within approved folders.
  - Added command `launch_discovered_app(app_id)` calling `cmd /c start` only after successful path validation, and registered it in the handler.

### Frontend (TypeScript/React)
- **[MODIFY] [page.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/app/page.tsx)**:
  - Updated `triggerAppLaunch` to invoke `launch_discovered_app` for Start Menu applications.
  - Removed the preview-only click block inside `handleItemSelection`, allowing actual execution triggers.
- **[MODIFY] [AppItem.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/components/AppItem.tsx)**:
  - Updated the status badge text next to discovered apps from `"Preview"` to `"Start Menu"`.

---

## 3. Validation Model
1. **Opaque ID Check**: The frontend only sends an ID string (e.g. `lnk_google_chrome`).
2. **Backend Directory Scans**: The backend resolves this to an absolute path by scanning approved Start Menu directories.
3. **Canonical Path Check**: Resolves symbolic links and relative path tokens (`..`) using `std::fs::canonicalize()`.
4. **Starts With Check**: Rejects execution if the canonicalized path does not reside within the allowed Programs directories.
5. **Pre-flight Check**: Rejects execution if the shortcut file does not exist on disk.
6. **Execution Trigger**: Spawns `cmd /c start` safely with backend-canonicalized arguments.

---

## 4. Safety Boundaries Preserved
- **Zero Frontend Paths**: No absolute paths or command arguments are exposed to the UI or logs.
- **Dangling Link Protection**: Rejects execution and fails safely if the target shortcut is uninstalled or moved.
- **No Command Injection**: Frontend cannot pass parameters or override execution properties.
- **No Capabilities Expansion**: Runs entirely using native Rust standard library spawner APIs, requiring no extra Tauri shell plugin permissions.

---

## 5. Manual Test Matrix

| Test Case | Expected Result | Status |
|---|---|---|
| Built-in VS Code launch | Spawns VS Code editor | PASS |
| Built-in Terminal launch | Spawns Windows Terminal | PASS |
| Built-in Chrome launch | Spawns Google Chrome browser | PASS |
| Built-in Files launch | Opens Windows File Explorer | PASS |
| Built-in Notepad launch | Spawns Notepad editor | PASS |
| Discovered app launch | Resolves and launches shortcut safely | PASS |
| Discovered Priority app launch | Launches successfully from Priority section | PASS |
| Workspace app launch | Launches only when clicking specific app row | PASS |
| Workspace container click | Workspace toggles expansion, does not launch apps | PASS |
| Search filter | Finds built-in and discovered apps | PASS |
| A-Z Rail Scroll | Scroller scrolls smoothly to anchors | PASS |
| Settings Modal | Modal opens and closes properly | PASS |
| No absolute paths in UI | Frontend state, devtools, and logs are path-free | PASS |

---

## 6. Recommended Next Phase
Phase 9H — Launch Regression and Packaged App Review
