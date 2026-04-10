import { defaultContent } from "@/lib/cms/default-content";
import { API_BASE_URL } from "@/lib/site";

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeWithDefaults(baseValue, overrideValue) {
  if (Array.isArray(baseValue)) {
    return Array.isArray(overrideValue) ? overrideValue : baseValue;
  }

  if (!isPlainObject(baseValue)) {
    return overrideValue === undefined ? baseValue : overrideValue;
  }

  const output = { ...baseValue };

  for (const key of Object.keys(overrideValue || {})) {
    output[key] = mergeWithDefaults(baseValue[key], overrideValue[key]);
  }

  return output;
}

export async function getSiteContent() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/site-content`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const storedContent = await response.json();
    return mergeWithDefaults(defaultContent, storedContent);
  } catch {
    return defaultContent;
  }
}
