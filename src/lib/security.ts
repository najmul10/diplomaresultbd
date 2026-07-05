/**
 * Client-side security measures for production.
 * Only active when NOT in an iframe (preview panel) and NOT on localhost.
 */

export function enableSecurity() {
  if (typeof window === "undefined") return;

  // Skip in development/preview (iframe or localhost)
  const isIframe = window.self !== window.top;
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (isIframe || isLocalhost) return;

  // 1. Disable right-click context menu
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Disable text selection (except inputs)
  const style = document.createElement("style");
  style.textContent = `
    body { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
    input, textarea, [contenteditable] { -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text; }
  `;
  document.head.appendChild(style);

  // 3. Disable DevTools keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") { e.preventDefault(); return false; }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i")) { e.preventDefault(); return false; }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j")) { e.preventDefault(); return false; }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c")) { e.preventDefault(); return false; }
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) { e.preventDefault(); return false; }
    if (e.ctrlKey && (e.key === "s" || e.key === "S")) { e.preventDefault(); return false; }
  });

  // 4. Disable drag-and-drop for images
  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
    return false;
  });
}
