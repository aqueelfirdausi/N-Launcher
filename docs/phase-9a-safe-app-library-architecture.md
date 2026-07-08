# Phase 9A — Safe App Library Architecture

## Goal
The goal of Phase 9A is to lay the foundation for a safe app library system inspired by Niagara Launcher. This architecture defines structured application models, prioritizations, and workspaces, while keeping execution safe and isolated from external modifications to Windows itself.

## What Changed
- Created a safe TypeScript model (`src/lib/app-library.ts`) to manage application metadata, alphabetical grouping, sorting, and user workspaces.
- Revamped the UI rendering logic in `AppStream.tsx` and `AppItem.tsx` to group applications into three primary categories (Priority Apps, Workspaces, and All Apps) and render custom indentation for active workspaces.
- Adapted keyboard navigation (ArrowUp, ArrowDown, Enter) in `page.tsx` to operate over a unified selectable item sequence, automatically skipping non-interactive headers.
- Implemented workspace expansion toggles that reveal categorized apps within a workspace dynamically.

## Files Changed
- `src/lib/app-library.ts` [NEW]
- `src/components/AppItem.tsx` [MODIFY]
- `src/components/AppStream.tsx` [MODIFY]
- `src/app/page.tsx` [MODIFY]
- `docs/phase-9a-safe-app-library-architecture.md` [NEW]

## Safety Boundaries Preserved
- **No System Modification**: The application does not edit, rename, move, delete, or create shortcuts, files, or registry keys within Windows.
- **Strict Execution Restrictions**: We do not invoke arbitrary command lines, use powershell/cmd execution, or introduce the Tauri shell plugin.
- **Frontend Path Protection**: The frontend works purely on safe backend-mapped ID lookups (e.g. `vscode`, `chrome`, `files`, `notepad`, `terminal`), and does not provide or store absolute paths or command strings in frontend storage.
- **No Workspace Multi-Launch Execution**: Workspace launch capability is reserved for later phases. Currently, selecting a workspace toggles its UI display and alerts the user via a status toast.

## Current Limitations
- Only the 5 built-in verified apps are discovered and displayed in the launcher (Priority list and All Apps list).
- Workspaces contain subsets of these 5 apps and cannot be edited or launched in bulk yet.

## Future Phases
- **Phase 9B — Read-only Windows Start Menu Discovery**: SAFELY scan and cache local Windows Start Menu `.lnk` entries without altering system folders.
- **Phase 9C — Alphabetical App Index UI Completion**: Implement a premium scrollable vertical index scrubber (A-Z) for rapid list scanning.
- **Phase 9D — Priority Apps Management**: Implement settings options to select/reorder priority applications.
- **Phase 9E — Workspace Management**: Implement user-managed workspaces (create, rename, add/remove apps).
- **Phase 9F — Safe Workspace Multi-Launch**: Safely allow spawning all applications in a workspace via Rust target mappings.
