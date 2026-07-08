# Phase 9C — Alphabetical Index Polish

This document details the visual and interactive refinements made to the N Launcher app stream, section headers, and right-hand navigation rail during Phase 9C.

---

## 1. Goal
Refine the All Apps layout and alphabetical indexing to align with modern, premium glassmorphic UI languages. Introduce a dynamic A-Z scrubber rail that filters navigation targets based on actual app presence, allowing one-click smooth scrolling to targeted letters.

---

## 2. UI & Styling Refinements

### All Apps Summary Subtitle
- Added a subtitle directly under the "All Apps" divider header inside `AppStream.tsx`:
  > *“Built-in + discovered Start Menu apps”*
- Rendered in a muted, highly legible micro-font layout (`text-[9px] text-white/20 mt-0.5`).

### Letter Header Divider Spacing
- Refined the visual hierarchy of alphabetical letter sections:
  - Enabled slightly larger, bold labels (`text-[10px] font-extrabold text-cyan-400/40 tracking-wider`).
  - Added vertical separation (`pt-3 pb-0.5`) to establish distinct visual breathing room between letter groups.

### Preview Badge Polish
- Redesigned the "Preview" indicator for discovered Start Menu apps inside `AppItem.tsx`:
  - Replaced the bright solid block background with a subtle, dark-mode friendly capsule style (`rounded-full bg-white/5 border border-white/10 text-cyan-300/60`).
  - Scales cleanly in both standard and compact visual densities.

---

## 3. Dynamic Scrubber Navigation

### Active vs. Dimmed Letters
- The A-Z sidebar rail (`ScrubberRail.tsx`) dynamically reads unique active letters from the loaded app state.
- **Active Letters**: Rendered with standard visibility (`text-white/70`), support smooth scaling/glow effects on hover, and are fully clickable.
- **Dimmed Letters**: Letters with zero matches are rendered in a dimmed style (`text-white/20`) and have interactions disabled.

### Smooth Scroll-to-Anchor Jumps
- Anchor elements for letters (`id={"letter-" + char}`) and sections are registered within `AppStream.tsx`.
- Clicking an active letter in the scrubber sidebar invokes a smooth DOM `scrollIntoView()` jump directly to the target header.
- If a user clicks the special `#` shortcut, it jumps smoothly to the top of the All Apps list.

---

## 4. Security Sandboxing Preserved
- No Rust backend changes were made.
- Discovered apps remain preview-only and non-launchable.
- Click actions and keypresses on discovered items continue to trigger only the secure, non-launch status toast.
