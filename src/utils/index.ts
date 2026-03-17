// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Get favicon URL from domain
export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// Generate a consistent color from a string
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate HSL values for better color distribution
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 50 + (Math.abs(hash >> 8) % 15); // 50-65%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
