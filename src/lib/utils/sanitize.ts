/**
 * Sanitizes input strings to prevent HTML and script injection attacks.
 */
export function sanitizeInput(input: string): string {
  if (!input) return "";
  
  return input
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // Remove <script> tags and contents
    .replace(/on\w+="[^"]*"/gi, "") // Remove inline event handlers like onclick="..."
    .replace(/on\w+='[^']*'/gi, "") // Remove inline event handlers like onclick='...'
    .replace(/javascript:[^"']*/gi, "") // Remove javascript: pseudo-protocol
    .replace(/<[^>]*>/g, "") // Strip general HTML tags
    .trim();
}

/**
 * Escapes special HTML characters to prevent XSS.
 */
export function escapeHTML(str: string): string {
  if (!str) return "";
  
  const entityMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&grave;"
  };
  
  return str.replace(/[&<>"'`\/]/g, (s) => entityMap[s]);
}
