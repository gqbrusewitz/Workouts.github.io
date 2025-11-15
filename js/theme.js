// js/theme.js
import { db, updateSettings, saveDB } from "./storage.js";

/*
  Theme system:
  - Toggles between "light" and "dark"
  - Saves user preference to db.settings.theme
  - Applies CSS theme via <html data-theme="...">
*/

export function initTheme(toggleButton) {
  // Load saved theme or default to light
  const saved = db.settings.theme || "light";
  applyTheme(saved);

  // Update toggle button text
  updateButtonLabel(toggleButton, saved);

  toggleButton.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";

    applyTheme(next);
    updateSettings({ theme: next });
    saveDB();

    updateButtonLabel(toggleButton, next);
  });
}

/* ------------------------------------
   Apply theme to the <html> element
------------------------------------- */
function applyTheme(themeName) {
  document.documentElement.setAttribute("data-theme", themeName);
}

/* ------------------------------------
   Update toggle button label text
------------------------------------- */
function updateButtonLabel(btn, theme) {
  if (!btn) return;
  btn.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
}
