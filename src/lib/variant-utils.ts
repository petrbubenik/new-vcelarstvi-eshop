// Mapping of material codes to display names and vice versa
export const MATERIAL_MAPPING: Record<string, string> = {
  "pozink": "pozinkovaná",
  "mosaz": "mosazná",
  "pozlat": "pozlacená",
  "ocel": "ocelová",
};

// Reverse mapping for code lookup
const MATERIAL_TO_CODE: Record<string, string> = {};
for (const [code, name] of Object.entries(MATERIAL_MAPPING)) {
  MATERIAL_TO_CODE[name] = code;
}

/**
 * Convert material code from URL to display name
 * e.g., "pozink" -> "pozinkovaná"
 */
export function codeToMaterial(code: string | null): string | null {
  if (!code) return null;
  return MATERIAL_MAPPING[code] || code;
}

/**
 * Convert display material name to URL-friendly code
 * e.g., "pozinkovaná" -> "pozink"
 */
export function materialToCode(material: string | null): string | null {
  if (!material) return null;
  const normalized = material.toLowerCase();
  return MATERIAL_TO_CODE[normalized] || material.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Convert size code from URL to display size
 * e.g., "400x400" -> "400×400"
 * Also handles sizes with "cm" suffix: "400x400cm" -> "400×400 cm"
 */
export function codeToSize(code: string | null): string | null {
  if (!code) return null;
  // Convert "x" to "×" and add space before "cm" if present
  let result = code.replace(/x/gi, "×");
  // Add space before "cm" if it exists but has no space before it
  result = result.replace(/×(\d+)cm/g, "×$1 cm");
  // If just "cm" at end without space, add space
  result = result.replace(/(\d+)cm$/g, "$1 cm");
  return result;
}

/**
 * Convert display size to URL-friendly code
 * e.g., "39×39 cm" -> "39x39cm", "435×370 cm" -> "435x370cm"
 * Removes special characters and spaces for URL-friendly format
 */
export function sizeToCode(size: string | null): string | null {
  if (!size) return null;
  return size
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9x]/g, "");
}
