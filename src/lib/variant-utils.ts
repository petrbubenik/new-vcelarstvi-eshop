/**
 * Maps material types between display names and URL-friendly slugs
 */

export const MATERIAL_MAP = {
  // Display name (DB) -> URL slug
  'pozinkovaná': 'pozink',
  'mosazná': 'mosaz',
} as const;

export const REVERSE_MATERIAL_MAP = {
  'pozink': 'pozinkovaná',
  'mosaz': 'mosazná',
} as const;

export type MaterialSlug = keyof typeof REVERSE_MATERIAL_MAP;
export type MaterialName = keyof typeof MATERIAL_MAP;

/**
 * Convert display material name to URL-friendly slug
 */
export function materialToSlug(material: string): string {
  return MATERIAL_MAP[material as MaterialName] || material;
}

/**
 * Convert URL slug to display material name
 */
export function slugToMaterial(slug: string): string {
  return REVERSE_MATERIAL_MAP[slug as MaterialSlug] || slug;
}

/**
 * Parse variant URL parameters
 */
export interface VariantParams {
  material?: string;
  size?: string;
}

export function parseVariantParams(searchParams: VariantParams): {
  material?: string;
  size?: string;
} {
  const result: { material?: string; size?: string } = {};

  if (searchParams.material) {
    result.material = slugToMaterial(searchParams.material);
  }

  if (searchParams.size) {
    result.size = searchParams.size;
  }

  return result;
}

/**
 * Build URL parameters from variant selection
 */
export function buildVariantParams(
  material: string | undefined,
  size: string | undefined
): URLSearchParams {
  const params = new URLSearchParams();

  if (material) {
    params.set('material', materialToSlug(material));
  }

  if (size) {
    params.set('size', size);
  }

  return params;
}
