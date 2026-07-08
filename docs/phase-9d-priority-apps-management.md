# Phase 9D — Priority Apps Management

This document details the design, implementation, and safety mechanisms for Priority Apps Management introduced in Phase 9D.

---

## 1. Goal
Provide users with visual controls to add ("Pin") or remove ("Unpin") both built-in applications and discovered Start Menu preview items from the **Priority Apps** section of the launcher, and persist their selections across sessions.

---

## 2. Files Changed

### Backend (Rust)
- **[MODIFY] [settings.rs](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src-tauri/src/settings.rs)**:
  - Added `priority_apps: Vec<String>` to `NSettings` struct.
  - Implemented automatic fallback initialization using `#[serde(default = "default_priority_apps")]` to keep older files compatible.
  - Added list sanitization (removing empty IDs) and deduplication (using a `HashSet`) inside `validate_and_sanitize()`.

### Frontend (TypeScript/React)
- **[MODIFY] [settings.ts](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/lib/settings.ts)**:
  - Updated `NSettings` TypeScript interface and `DEFAULT_SETTINGS` to include `priorityApps` string array.
- **[MODIFY] [AppItem.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/components/AppItem.tsx)**:
  - Added a pin toggle icon (`Pin` from `lucide-react`) next to non-workspace list items.
  - The icon is interactive, visible on hover/focus, and highlights/rotates if the app is already pinned.
  - Clicking the icon calls `onPinToggle` and calls `e.stopPropagation()` to prevent app launching.
- **[MODIFY] [AppStream.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/components/AppStream.tsx)**:
  - Forwarded the `onPinToggle` handler from parent to items.
- **[MODIFY] [page.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/app/page.tsx)**:
  - Converted the `apps` state into a reactive `useMemo` list, cleanly combining built-in apps, discovered apps, and priority flags.
  - Refactored settings initialization to load saved priority lists on startup and keep modal resets synced.
  - Implemented `handlePinToggle` to handle atomic updating of the in-memory lists and saving to the Tauri storage settings file.

---

## 3. Persistence Model
- **Pure ID storage**: We store only an array of safe, unique application IDs (e.g. `["vscode", "terminal", "lnk_chrome"]`).
- **No Unsafe Metadata**: The path, target executables, arguments, command lines, or environment variables are **never** stored or modified.

---

## 4. Safety Boundaries Preserved
- **Execution Blocked**: Discovered preview apps pinned to the Priority section remain non-launchable and show the standard status warning toast.
- **Zero Shell Permissions**: No shell execution permissions or Tauri commands were added.
- **No Windows Modifications**: The Windows Registry, local shortcut folders, and Windows Start Menu structures are untouched.

---

## 5. Intentionally Deferred Features
- Re-ordering pinned apps via drag-and-drop (deferred to a subsequent UI polish phase).
- Multi-launching priority apps at once (deferred to preserve safety boundaries).

---

## 6. Recommended Next Phase
Phase 9E — Workspace Management
