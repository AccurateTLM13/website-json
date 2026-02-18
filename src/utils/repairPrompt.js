export function buildRepairPrompt({ schemaVersion, schemaSkeleton, invalidJson, mode }) {
    const schemaSkeletonJson = JSON.stringify(schemaSkeleton, null, 2);
    // Ensure invalidJson is a string
    const invalidJsonString = typeof invalidJson === 'string' ? invalidJson : JSON.stringify(invalidJson, null, 2);

    return `
You are a JSON repair tool.

TASK:
Fix the provided JSON so it EXACTLY matches the schema skeleton below.
- Output MUST be valid JSON only (no markdown, no commentary).
- Preserve the meaning and wording of all existing content as much as possible.
- Remove any unknown keys not in the schema.
- Correct types:
  - If an array field is a string, wrap it in an array (do not split).
  - If max_colors/max_fonts are strings, convert to numbers.
- Ensure required nested objects exist.
- Enforce constraints:
  - If design.colors length exceeds constraints.max_colors, remove the least important colors (keep the most foundational ones).
  - If fonts exceed constraints.max_fonts, keep only the most important pair.
- Do NOT invent new unrelated content. Only add minimal placeholders "" or [] when required.

MODE: ${mode}
SCHEMA_VERSION: ${schemaVersion}

SCHEMA_SKELETON:
${schemaSkeletonJson}

INVALID_JSON:
${invalidJsonString}
`;
}
