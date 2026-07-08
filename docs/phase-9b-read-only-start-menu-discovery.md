# Phase 9B — Read-only Start Menu Discovery

This document details the design, implementation, and security posture of the Read-only Windows Start Menu Discovery foundation introduced in Phase 9B.

---

## 1. Goal
The goal of this phase is to establish a secure backend discovery scanner that identifies applications installed in the Windows Start Menu, returning only safe metadata for frontend preview and indexing, without executing arbitrary commands or exposing absolute path strings.

---

## 2. Directory Locations Searched
The Rust backend recursively scans only the two approved, standard Windows Start Menu directories:
1. **System Start Menu**: `C:\ProgramData\Microsoft\Windows\Start Menu\Programs`
2. **User Start Menu**: `%APPDATA%\Microsoft\Windows\Start Menu\Programs` (resolved dynamically via the `%APPDATA%` environment variable)

---

## 3. Discovered Metadata Schema
To preserve strict separation of concerns and avoid exposing system credentials or executable pathways, the returned payload is limited to:

```typescript
export interface LauncherApp {
  id: string;              // Prefix "lnk_" + normalized lowercase name
  name: string;            // The file stem name of the shortcut
  normalizedName: string;  // Lowercase, trimmed name for deduplication/search
  letter: string;          // First character (A-Z or "#") for section jumping
  source: "startMenu";     // Source category discriminator
  kind: "app";             // Type discriminator
  isPriority: boolean;     // Defaults to false
  isHidden: boolean;       // Defaults to false
  icon: "Folder";          // Default visual fallback
}
```

### Intentionally Excluded Fields:
- Absolute executable/target path of the shortcut
- Shortcut target arguments or working directories
- Process command strings

---

## 4. Launch Deferral & Safety Controls
- Discovered applications from the Start Menu are treated as non-launchable **Preview** entries in this phase.
- Selecting or pressing `Enter` on a discovered app item triggers a safe warning toast:
  > *“Start Menu discovery is ready. Launch support will be added in a later safe phase.”*
- Predefined built-in launch targets (VS Code, Terminal, Chrome, Files, Notepad) continue to invoke their respective backend command targets safely and launch successfully.
- No system files are written, modified, renamed, or deleted. The registry remains untouched.
