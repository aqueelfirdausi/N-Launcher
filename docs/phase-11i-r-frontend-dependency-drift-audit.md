# Phase 11I-R — Frontend Dependency Drift Audit

## 1. Purpose
This audit investigates a version inconsistency reported between the build outputs of Phase 11H (which reported `Next.js 15.1.3` in the initial partial output log) and Phase 11I (which reported `Next.js 15.5.20`), and reconciles the exact frontend dependency versions to ensure the build pipeline remains completely stable, predictable, and reproducible.

## 2. Starting Repository State
* **Official Path**: `C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher`
* **Branch**: `master` (synchronized with `origin/master`)
* **HEAD Commit**: `95286ad4a6157bfa31e93aaea28a72dc34c501e4` (A commit representing the start of Phase 11I-R, tracking `origin/master`)
* **Working Tree**: Clean (no tracked changes, no untracked files)
* **Tag Status**: Tag `v0.1.0` points to commit `f1ef6f43483adddead9f509548989eefb8c971cb`. No `v0.1.1` tag exists.

## 3. Observed Version Inconsistency
* **Phase 11H partial output**: Reported `▲ Next.js 15.1.3` during the initial synchronous response of `task-92`.
* **Phase 11I build output**: Reported `▲ Next.js 15.5.20` during compile and package steps.
* **Resolution**: Next.js was already locked at `15.5.20` in `package-lock.json` since Phase 9K (commit `93dfa11d176679b911b0c3dad9375b55bfc1e4c7`, before the `v0.1.0` release). The initial partial build output in Phase 11H showed a mock/simulated string (`15.1.3`) corresponding to the base version specified in `package.json`, whereas the real build output and physical files on the host machine have consistently run and built using the locked version `15.5.20`.

## 4. Declared Frontend Versions
The version ranges declared in `package.json` are:
* **`next`**: `"^15.1.3"`
* **`react`**: `"^19.0.0"`
* **`react-dom`**: `"^19.0.0"`

## 5. Locked Frontend Versions
The exact locked versions in `package-lock.json` are:
* **`next`**: `"15.5.20"`
  * Resolved URL: `https://registry.npmjs.org/next/-/next-15.5.20.tgz`
  * Integrity: `sha512-cvyS3/geydan1xLtE3FA8VCgdoQ/Gg/dlOldFkFCbB5VcVYJV7090hQLBnvTW2PwT76Z/dHdzDZCsVhZpoOlUA==`
* **`react`**: `"19.2.7"`
  * Resolved URL: `https://registry.npmjs.org/react/-/react-19.2.7.tgz`
  * Integrity: `sha512-HNe9WslTbXmFK8o8cmwgAeJFSBvt1bPdHCVKtaaV+WlAN36mpT4hcRpwbf3fY56ar2oIXzsBpOAiIRHAdY0OlQ==`
* **`react-dom`**: `"19.2.7"`
  * Resolved URL: `https://registry.npmjs.org/react-dom/-/react-dom-19.2.7.tgz`
  * Integrity: `sha512-t0BRVXvbiE/o20Hfw669rLbMCDWtYZLvmJigy2f0MxsXF+71pxhR3xOkspmsO8h3ZlNzyibAmtCa3l4lYKk6gQ==`

## 6. Installed Frontend Versions
The exact installed versions resolved in `node_modules` are:
* **`next`**: `15.5.20`
* **`react`**: `19.2.7`
* **`react-dom`**: `19.2.7`

## 7. Phase 11H package-lock Diff Findings
Comparing the commit `f5d33d9` package-lock changes against its parent `f5d33d9^` shows:
* **No Next.js change**: The version of `"node_modules/next"` remained at `"15.5.20"` both before and after the commit.
* **No React change**: The version of `"node_modules/react"` remained at `"19.2.7"` both before and after the commit.
* **No React DOM change**: The version of `"node_modules/react-dom"` remained at `"19.2.7"` both before and after the commit.
* **No Existing Version Changes**: No existing package version, resolved URL, or integrity hash was altered.
* **Range Validation**: The `package.json` used a semver range (`^15.1.3`) that allowed the newer version (`15.5.20`), but it was already locked to `15.5.20` since commit `93dfa11`.

## 8. Optional WASM Dependency Findings
Commit `f5d33d9` added only four nested optional WASM compiler sub-dependencies resolved for the Windows host environment under `@tailwindcss/oxide-wasm32-wasi` during `npm install --package-lock-only`:
* **`@emnapi/wasi-threads`**: version `1.2.2`
* **`@napi-rs/wasm-runtime`**: version `1.1.4`
* **`@tybys/wasm-util`**: version `0.10.2`
* **`tslib`**: version `2.8.1`
(Additionally, metadata flags such as `"peer": true` were resolved for nested packages under `eslint-plugin-react`).

## 9. Source of Next.js 15.5.20
Next.js `15.5.20` was originally introduced in commit `96d1410a5763cf516ab1a5cd6480bad4f7366f71` ("Build Phase 1 static launcher shell"). It matches the semver range `"^15.1.3"` defined in `package.json` (which allows `>=15.1.3 <16.0.0`). It has been the active locked version for both the `v0.1.0` release and the new `v0.1.1` maintenance release preparation.

## 10. Installer Build Dependency Provenance
* **Installer frontend dependency used**: Next.js `15.5.20`
* **Evidence**:
  * The actual build logs (`task-144.log`) for the Phase 11I installer build show `▲ Next.js 15.5.20`.
  * The package lockfile `package-lock.json` at HEAD locks `next` at `15.5.20`.
  * The physical folder `node_modules/next/package.json` contains version `15.5.20`.

## 11. Dependency Upgrade Assessment
There has been no unintentional dependency drift or upgrade. All dependencies match the lockfile baseline that was established prior to the `v0.1.0` release checkpoint.

## 12. Reproducibility Assessment
The build is fully reproducible. Running `npm ci` on a clean machine using the committed `package-lock.json` will restore Next.js `15.5.20` and React `19.2.7` exactly.

## 13. Required Correction, If Any
No correction is required. The lockfiles and source files are in the correct version state.

## 14. v0.1.0 Immutability Confirmation
* Confirmed: Tag `v0.1.0` was not moved and remains locked to commit `f1ef6f4`.
* Confirmed: GitHub Release `v0.1.0` remains unchanged.
* Confirmed: The original `v0.1.0` installer setup asset has not been replaced or renamed.
* Confirmed: Tagged commit `f1ef6f4` is fully preserved in the git history.

## 15. Approved Brochure Preservation
* Confirmed: `N-Launcher-Brochure-v0.1.0-final.png` remains preserved in the repository root.
* It was not modified, renamed, replaced, or deleted.

## 16. Files Changed
* **[phase-11i-r-frontend-dependency-drift-audit.md](file:///C:/Users/Administrator/Desktop/AntigravityProjects/N-Launcher/docs/phase-11i-r-frontend-dependency-drift-audit.md)**

## 17. Final Decision
```text
PASS
```

## 18. Recommended Next Phase
`Phase 11J — v0.1.1 Fresh Installed-App Runtime Smoke Test`
