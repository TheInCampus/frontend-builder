import type { BuilderPage } from "@/features/builder/types";

function storageKey(appId: string) {
  return `canvas-builder:${encodeURIComponent(appId)}`;
}

export function loadPage(appId: string): BuilderPage | null {
  try {
    const value = window.localStorage.getItem(storageKey(appId));
    if (!value) return null;
    const page: unknown = JSON.parse(value);
    if (
      typeof page === "object" &&
      page !== null &&
      "components" in page &&
      Array.isArray(page.components)
    ) {
      return page as BuilderPage;
    }
  } catch {
    return null;
  }
  return null;
}

export function savePage(appId: string, page: BuilderPage) {
  try {
    window.localStorage.setItem(storageKey(appId), JSON.stringify(page));
  } catch {
    // Keep editing available when browser storage is disabled or full.
  }
}
