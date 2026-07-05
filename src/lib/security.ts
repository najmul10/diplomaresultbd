/**
 * Client-side security measures.
 *
 * These are deterrents (not absolute protection — nothing client-side is
 * unbreakable), but they stop casual users from:
 *  - Right-clicking (context menu)
 *  - Using F12 / Ctrl+Shift+I / Cmd+Opt+I to open DevTools
 *  - Selecting and copying text
 *  - Dragging images
 *  - Viewing source via Ctrl+U
 *  - Using common keyboard shortcuts for dev tools
 *
 * Combined with server-side rate limiting and the fact that result data comes
 * from our API (not embedded in the page), this provides reasonable protection
 * for a results site.
 */

export function enableSecurity() {
  if (typeof window === "undefined") return;

  // 1. Disable right-click context menu
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Disable text selection (visual deterrent)
  const style = document.createElement("style");
  style.textContent = `
    body {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    input, textarea, [contenteditable] {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
  `;
  document.head.appendChild(style);

  // 3. Disable common DevTools keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // F12
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I / Cmd+Opt+I (DevTools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i")) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J / Cmd+Opt+J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j")) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C / Cmd+Opt+C (Element inspector)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c")) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (View source)
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      return false;
    }
    // Ctrl+S (Save page)
    if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      return false;
    }
  });

  // 4. Disable drag-and-drop for images
  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
    return false;
  });

  // 5. Detect DevTools open via window size change (basic deterrent)
  // This is a lightweight check — if devtools opens docked, the window
  // dimensions change significantly.
  let threshold = 160;
  const checkDevTools = () => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > threshold || heightDiff > threshold) {
      // DevTools likely open — blank the page content as a deterrent
      document.body.style.filter = "blur(3px)";
    } else {
      document.body.style.filter = "";
    }
  };
  setInterval(checkDevTools, 1000);

  // 6. Clear console periodically (makes it harder to inspect network calls)
  setInterval(() => {
    try {
      // @ts-expect-error - clear console
      console.clear();
    } catch {
      /* ignore */
    }
  }, 5000);

  // 7. Warn before leaving if DevTools detected
  const devtoolsOpen = () => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    return widthDiff > 160 || heightDiff > 160;
  };

  window.addEventListener("beforeunload", (e) => {
    if (devtoolsOpen()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}
