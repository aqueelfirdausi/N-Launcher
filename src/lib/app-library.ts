export type AppSource = "builtIn" | "startMenu" | "userPinned";
export type AppKind = "app" | "workspace";

export interface LauncherApp {
  id: string;
  name: string;
  normalizedName: string;
  letter: string;
  source: AppSource;
  kind: "app";
  isPriority: boolean;
  isHidden: boolean;
  icon: string;
  description?: string;
}

export interface LauncherWorkspace {
  id: string;
  name: string;
  description?: string;
  appIds: string[];
  isPriority: boolean;
  kind: "workspace";
}

export interface AppLibraryState {
  schemaVersion: 1;
  priorityAppIds: string[];
  hiddenAppIds: string[];
  workspaces: LauncherWorkspace[];
}

export type SelectableItem =
  | { type: "app"; app: LauncherApp; section: "priority" | "all" | "workspace"; workspaceId?: string }
  | { type: "workspace"; workspace: LauncherWorkspace };

export function normalizeAppName(name: string): string {
  return name.trim().toLowerCase();
}

export function getAppLetter(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) return "#";
  const firstChar = trimmed[0].toUpperCase();
  if (firstChar >= "A" && firstChar <= "Z") {
    return firstChar;
  }
  return "#";
}

export function groupAppsAlphabetically(apps: LauncherApp[]): Record<string, LauncherApp[]> {
  const groups: Record<string, LauncherApp[]> = {};
  for (const app of apps) {
    if (app.isHidden) continue;
    const letter = app.letter;
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(app);
  }
  return groups;
}

export function sortAppsAlphabetically(apps: LauncherApp[]): LauncherApp[] {
  return [...apps].sort((a, b) => {
    const letterA = a.letter === "#" ? "Z" + 1 : a.letter;
    const letterB = b.letter === "#" ? "Z" + 1 : b.letter;
    if (letterA !== letterB) {
      return letterA.localeCompare(letterB);
    }
    return a.name.localeCompare(b.name);
  });
}

export function buildDefaultAppLibraryState(): AppLibraryState {
  return {
    schemaVersion: 1,
    priorityAppIds: ["vscode", "terminal", "chrome", "files", "notepad"],
    hiddenAppIds: [],
    workspaces: [
      {
        id: "development",
        name: "Development",
        description: "Dev environment and terminal apps",
        appIds: ["vscode", "terminal"],
        isPriority: false,
        kind: "workspace",
      },
      {
        id: "web",
        name: "Web",
        description: "Browser and internet tools",
        appIds: ["chrome"],
        isPriority: false,
        kind: "workspace",
      },
      {
        id: "business",
        name: "Business",
        description: "File management and note taking",
        appIds: ["files", "notepad"],
        isPriority: false,
        kind: "workspace",
      },
    ],
  };
}

export function mergePriorityState(apps: LauncherApp[], state: AppLibraryState): LauncherApp[] {
  return apps.map((app) => {
    const isPriority = state.priorityAppIds.includes(app.id);
    const isHidden = state.hiddenAppIds.includes(app.id);
    return {
      ...app,
      isPriority,
      isHidden,
    };
  });
}

export function getSelectableItems(
  apps: LauncherApp[],
  state: AppLibraryState,
  expandedWorkspaceIds: string[],
  searchQuery: string
): SelectableItem[] {
  const query = normalizeAppName(searchQuery);

  if (query) {
    const items: SelectableItem[] = [];

    // Filter workspaces
    const matchingWorkspaces = state.workspaces.filter(
      (w) =>
        normalizeAppName(w.name).includes(query) ||
        (w.description && normalizeAppName(w.description).includes(query))
    );

    // Filter apps
    const matchingApps = apps.filter(
      (app) =>
        !app.isHidden &&
        (normalizeAppName(app.name).includes(query) ||
          (app.description && normalizeAppName(app.description).includes(query)))
    );

    // Add matching workspaces
    for (const w of matchingWorkspaces) {
      items.push({ type: "workspace", workspace: w });
    }

    // Add matching apps
    for (const app of matchingApps) {
      items.push({ type: "app", app, section: "all" });
    }

    return items;
  }

  const items: SelectableItem[] = [];

  // 1. Priority section
  const priorityApps = apps.filter((app) => app.isPriority && !app.isHidden);
  for (const app of priorityApps) {
    items.push({ type: "app", app, section: "priority" });
  }

  // 2. Workspaces section
  for (const w of state.workspaces) {
    items.push({ type: "workspace", workspace: w });
    if (expandedWorkspaceIds.includes(w.id)) {
      for (const appId of w.appIds) {
        const app = apps.find((a) => a.id === appId);
        if (app && !app.isHidden) {
          items.push({ type: "app", app, section: "workspace", workspaceId: w.id });
        }
      }
    }
  }

  // 3. All Apps section
  const sortedAll = sortAppsAlphabetically(apps.filter((app) => !app.isHidden));
  for (const app of sortedAll) {
    items.push({ type: "app", app, section: "all" });
  }

  return items;
}

export const BUILT_IN_APPS: LauncherApp[] = [
  {
    id: "vscode",
    name: "VS Code",
    normalizedName: normalizeAppName("VS Code"),
    letter: getAppLetter("VS Code"),
    source: "builtIn",
    kind: "app",
    isPriority: true,
    isHidden: false,
    icon: "Code2",
    description: "Visual Studio Code",
  },
  {
    id: "terminal",
    name: "Terminal",
    normalizedName: normalizeAppName("Terminal"),
    letter: getAppLetter("Terminal"),
    source: "builtIn",
    kind: "app",
    isPriority: true,
    isHidden: false,
    icon: "Terminal",
    description: "Windows Terminal",
  },
  {
    id: "chrome",
    name: "Chrome",
    normalizedName: normalizeAppName("Chrome"),
    letter: getAppLetter("Chrome"),
    source: "builtIn",
    kind: "app",
    isPriority: true,
    isHidden: false,
    icon: "Chrome",
    description: "Google Chrome Browser",
  },
  {
    id: "files",
    name: "Files",
    normalizedName: normalizeAppName("Files"),
    letter: getAppLetter("Files"),
    source: "builtIn",
    kind: "app",
    isPriority: true,
    isHidden: false,
    icon: "Folder",
    description: "File Explorer",
  },
  {
    id: "notepad",
    name: "Notepad",
    normalizedName: normalizeAppName("Notepad"),
    letter: getAppLetter("Notepad"),
    source: "builtIn",
    kind: "app",
    isPriority: true,
    isHidden: false,
    icon: "notepad",
    description: "Text Editor",
  },
];

export function mergeDiscoveredApps(builtIn: LauncherApp[], discovered: LauncherApp[]): LauncherApp[] {
  const dedupedDiscovered = discovered.filter(
    (d) => !builtIn.some((b) => b.normalizedName === d.normalizedName)
  );
  return [...builtIn, ...dedupedDiscovered];
}
