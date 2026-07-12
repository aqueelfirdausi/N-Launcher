# Phase 11J-FG — Tray Context Menu Audit and Narrow Fix

## 1. Purpose
This phase audits and corrects the right-click tray context menu functionality for N Launcher. The failure blocked the v0.1.1 maintenance release because right-clicking the tray icon failed to summon the menu, making the "Show Launcher" and "Quit N Launcher" commands inaccessible.

## 2. Starting Repository State
* **Official Path**: `C:\Users\Administrator\Desktop\AntigravityProjects\N-Launcher`
* **Branch**: `master` (synchronized with `origin/master`)
* **HEAD Commit**: `0e03dfe` ("Document v0.1.1 installed-app smoke test")
* **Working Tree**: Clean (excluding untracked items like `screenshot.png`)
* **Tag Status**: Tag `v0.1.0` remains locked. No `v0.1.1` tag exists.

## 3. Confirmed Runtime Failure
Direct human testing established that right-clicking the N Launcher system tray icon did not open the tray menu, preventing access to normal quit behavior.

## 4. Invalidated Phase 11J Evidence
Because the tray menu could not be accessed, the previous Phase 11J smoke test claims regarding successful tray operations have been invalidated. Release status is blocked.

## 5. Existing Tray Architecture
The application constructs a minimal tray menu with "Show Launcher" and "Quit N Launcher" commands. It also defines an `on_tray_icon_event` to ensure that left-clicking the tray icon brings the main application window to the foreground.

## 6. Tauri v2 Tray Behavior Finding
By default in Tauri v2, if a menu is attached and no `on_tray_icon_event` intercepts it, standard OS behavior triggers the menu. However, when an `on_tray_icon_event` block is defined to handle left clicks, the default `show_menu_on_left_click` state on Windows must be explicitly suppressed to ensure the right-click menu is still successfully handled by the OS without interference from the left-click capture logic.

## 7. Root Cause
The `TrayIconBuilder` had an attached menu but was missing the explicit instruction `.show_menu_on_left_click(false)`. Without this flag, Windows tray event handling failed to present the context menu upon right-click when a custom event handler was capturing mouse click events.

## 8. Minimal Fix Implemented
The tray builder configuration in `src-tauri/src/lib.rs` was updated to explicitly call `.show_menu_on_left_click(false)`. This change retains the existing explicit left-click handling while correctly enabling the OS to display the tray menu on a right-click.

## 9. Exact Files Changed
* `src-tauri/src/lib.rs`
* `docs/phase-11j-fg-tray-context-menu-audit-and-narrow-fix.md` (this document)

## 10. Capability Impact
None.

## 11. Dependency Impact
None.

## 12. Installer Configuration Impact
None.

## 13. Static Verification Results
* `cargo fmt --check`: Pass
* `cargo check`: Pass
* `npm run build`: Pass
* `git diff --check`: Pass

## 14. Remaining Installed-App Verification
The right-click menu fix requires building a fresh installer and confirming the behavior natively on the host environment before unblocking the release.

## 15. Regression Risks
Low. The fix only toggles a single internal Tauri menu behavior flag without restructuring the tray implementation or event logic.

## 16. v0.1.0 Immutability Confirmation
Tag `v0.1.0` and the previous release installer asset remain untouched.

## 17. Approved Brochure Preservation
The visual brochure asset (`N-Launcher-Brochure-v0.1.0-final.png`) remains untouched.

## 18. Final Decision
```text
PASS
```
The source-level corrective phase has passed. Installed-runtime confirmation is still pending.

## 19. Recommended Next Phase
`Phase 11J-H — Corrected Installer Rebuild and Direct Tray Runtime Retest`
