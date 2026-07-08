# Phase 9E — Workspace Management

This document details the design, implementation, and safety boundaries for Workspace Management introduced in Phase 9E.

---

## 1. Goal
Provide users with visual controls to manage workspaces (groups of applications) in N Launcher. Users can create, rename, and delete workspace groups, as well as add or remove applications (both built-in and discovered Start Menu items) from these workspaces.

---

## 2. Files Changed

### Backend (Rust)
- **[MODIFY] [settings.rs](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src-tauri/src/settings.rs)**:
  - Created `NWorkspace` struct mapping to safe workspace metadata.
  - Added `workspaces: Vec<NWorkspace>` property to `NSettings` to persist workspace groupings.
  - Initialized default workspaces matching Phase 7J expectations (Development, Web, Business) within the backend default settings fallback constructor.
  - Added list sanitization (trimming workspace names, limiting to 32 chars) and deduplicating app IDs and workspace IDs inside `validate_and_sanitize()`.

### Frontend (TypeScript/React)
- **[MODIFY] [settings.ts](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/lib/settings.ts)**:
  - Updated `NWorkspace` and `NSettings` TypeScript interfaces to include the workspaces structure and default values.
- **[MODIFY] [page.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/app/page.tsx)**:
  - Synchronized page-level `appLibraryState.workspaces` with loaded settings on startup and settings resets/updates.
  - Forwarded the full reactive `apps` list to the `SettingsModal` to populate the workspace builder dropdown.
- **[MODIFY] [SettingsModal.tsx](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/src/components/SettingsModal.tsx)**:
  - Implemented the visual **Manage Workspaces** panel inside the modal.
  - Enabled creating a workspace (input text field), renaming (via standard prompt), deleting, and adding/removing app IDs via selection dropdowns and tags.

---

## 3. Workspace Persistence Model
- Workspaces are stored inside the JSON visual settings file in the Tauri app configuration folder.
- Only safe metadata is stored:
  - `id`: unique machine-generated string
  - `name`: user-defined group name (trimmed, max 32 chars)
  - `appIds`: array of safe ID strings representing the included applications (e.g. `["vscode", "lnk_chrome"]`).
- No target executables, launch paths, or shell arguments are ever stored or exposed.

---

## 4. Safety Boundaries Preserved
- **Execution Blocked**: Workspaces remain non-launchable. Discovered apps within workspaces display their Preview badges, and clicking them prompts only the standard safety warning toast.
- **Dangling ID Safety**: If an application ID referenced in a workspace no longer exists (e.g. if the Start Menu app is uninstalled or discovery is run on a different system), the app launcher skips rendering it safely without crashing.
- **Zero Shell Integrations**: No command line configurations, shell plugins, or system folder mutations are introduced.

---

## 5. Recommended Next Phase
Phase 9F — Safe Start Menu Launch Design Review
