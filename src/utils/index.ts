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

// Fetch real platform/company name from domain using Clearbit autocomplete
export async function fetchPlatformName(domain: string): Promise<string | null> {
  if (!domain) return null;
  try {
    const res = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(domain)}`,
    );
    if (!res.ok) return null;
    const data: { name: string; domain: string }[] = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      // Prefer exact domain match, otherwise take first result
      const match = data.find((c) => c.domain === domain) ?? data[0];
      return match.name;
    }
    return null;
  } catch {
    return null;
  }
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
