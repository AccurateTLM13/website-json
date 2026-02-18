# Agent Implementation Prompt — Hybrid Validation Policy (Normalize → Strict Validate → Repair → Validate)

You are implementing **Hybrid Validation** for the JSON Brief Engine V2 in an existing React (Vite + Tailwind) codebase that generates a JSON “Design Brief” via Gemini, parses it, stores it in React state + localStorage, and exports a Markdown brief.

## Context (what exists today)

* V2 Zod schema exists in `src/schemas/brief.js` and exports:

  * `BriefSchema`
  * `DefaultBrief`
  * `CURRENT_SCHEMA_VERSION`
* Generation prompts exist in `website-json-generator.jsx` (Magic + Architect).
* Export happens via `copyToClipboard()` in `website-json-generator.jsx`.
* Templates live in `src/data/constants.js` (`STUDIO_TEMPLATES`) and include extra persona fields that must be preserved and used.

Your job: implement a **Hybrid pipeline** that safely normalizes minor format drift, validates strictly, runs an LLM repair pass if needed, then validates again before state is mutated.

---

# ✅ Deliverables

## 1) New utility: `src/utils/normalizeBrief.js`

Implement a **safe normalization** function:

### Function signature

```js
// src/utils/normalizeBrief.js
export function normalizeBrief(raw) { ... }
```

### Rules — allowed normalization ONLY (low-risk, same meaning)

#### A) Key aliasing (rename only known drift keys)

Rename keys only if the target key is missing. Apply at root and nested objects where applicable.

**Root aliases**

* `agencyMode` → `agency_mode`
* `brandNarrative` → `brand_narrative`
* `qualityAssurance` → `quality_assurance`

**brand_narrative nested**

* `targetAudience` → `target_audience`

**content nested**

* `ctaExamples` → `cta_examples`
* `toneExamples` → `tone_examples`
* `avoidWords` → `avoid_words`

**design nested**

* `visualReferences` → `visual_references`
* `fontPairingVibe` → `font_pairing_vibe`
* `microInteractions` → `microinteractions`

**tech nested**

* `outputFormat` → `output_format`
* `mobileConsiderations` → `mobile_considerations`
* `componentStyle` → `component_style`

**constraints nested**

* `forbiddenPatterns` → `forbidden_patterns`
* `forbiddenComponents` → `forbidden_components`
* `maxColors` → `max_colors`
* `maxFonts` → `max_fonts`

#### B) Coerce numeric strings to numbers (ONLY for these fields)

* `constraints.max_colors`, `constraints.max_fonts`
  If value is `"4"` or `"2"` → convert to `4` / `2`.
  If not parseable → leave as-is (let validation fail).

#### C) Coerce string→array for array fields (wrap only; DO NOT split)

If schema expects `string[]` but raw value is a string:

* Convert `"x"` → `["x"]`

Array fields include:

* `agency_mode.process`, `agency_mode.values`, `agency_mode.visual_cues`, `agency_mode.forbid`
* `brand_narrative.target_audience.pain_points`
* `content.cta_examples`, `content.tone_examples`, `content.avoid_words`
* `design.visual_references`, `design.colors`, `design.imagery.subjects`, `design.imagery.avoid`
* `design.interactions.effects`, `design.interactions.microinteractions`
* `design.pages`
* `tech.requirements`, `tech.responsive.mobile_considerations`
* `tech.output_format.include`, `tech.output_format.exclude`
* `constraints.forbidden_patterns`, `constraints.forbidden_components`
* `quality_assurance.visual`, `quality_assurance.ux`, `quality_assurance.performance`, `quality_assurance.brand`
* `open_questions`

**Hard rule:** DO NOT split comma-separated strings into multiple entries. Only wrap.

#### D) Trim whitespace on all strings you touch

If you normalize or coerce a string, `.trim()` it.

### Forbidden normalization (DO NOT DO THESE)

* No content rewriting (no changing persona text, vibe, etc.)
* No comma splitting into arrays
* No truncating `design.colors` to satisfy max_colors
* No deleting keys outside strict validation/repair step

### Output of normalizeBrief

Return a plain JS object. It may still be invalid; validation handles that.

---

## 2) New utility: `src/utils/validateAndRepair.js`

Implements the hybrid pipeline.

### Function signature

```js
// src/utils/validateAndRepair.js
export async function validateAndRepairBrief({
  raw,                   // object OR string (JSON)
  mode,                  // "magic" | "architect" | "import" | "storage"
  geminiRepair,          // async function(jsonString) => jsonString
  BriefSchema,           // zod schema
  DefaultBrief,          // default brief
  onEvent,               // optional callback for logging
}) { ... }
```

### Pipeline logic (must follow exactly)

1. Convert input:

   * If `raw` is a string: attempt `JSON.parse` (capture parse error).
   * If parse fails: return `{ ok:false, stage:"parse", ... }`
2. Normalize: `normalized1 = normalizeBrief(parsed)`
3. Validate strictly: `BriefSchema.safeParse(normalized1)`

   * If success: return `{ ok:true, data: result.data, repaired:false, normalized:true/false, issues:[] }`
4. If invalid: run repair

   * Build a repair prompt (see section 3 below)
   * Call `geminiRepair(prompt)` (or `geminiRepair(invalidJsonString)` depending on how you implement; but prompt must include schema + invalid JSON)
   * Parse repair output JSON
   * Normalize again: `normalized2 = normalizeBrief(repairedParsed)`
   * Validate again
5. If second validation fails:

   * return `{ ok:false, stage:"validate_after_repair", issues: zodIssues, backupCandidate: normalized2 }`

### Required return shape

Return an object:

```js
{
  ok: boolean,
  data?: object,                 // validated brief
  stage?: string,                // parse | validate | repair | validate_after_repair
  repaired?: boolean,
  normalized?: boolean,
  issues?: Array<{ path: string, message: string }>,
  rawRepairText?: string,        // for debugging
}
```

### onEvent telemetry (optional but recommended)

Call:

* `onEvent({ type:"normalized", changesCount })`
* `onEvent({ type:"validation_failed", issues })`
* `onEvent({ type:"repair_started" })`
* `onEvent({ type:"repair_succeeded" })`
* `onEvent({ type:"repair_failed", error })`

Keep it lightweight. No analytics platform required.

---

## 3) Repair Prompt Template (Gemini)

Implement a single repair prompt generator in:
`src/utils/repairPrompt.js`

### Function signature

```js
// src/utils/repairPrompt.js
export function buildRepairPrompt({ schemaVersion, schemaSkeleton, invalidJson, mode }) { ... }
```

### Prompt content requirements

* Must command **JSON only** output (no markdown, no explanation).
* Must preserve meaning.
* Must remove unknown keys (strict schema).
* Must fix types (string vs array, numbers as strings).
* Must respect constraints `max_colors` and `max_fonts` by **removing least important entries** rather than inventing new ones.
* Must include the schema skeleton.

### Provide a schema skeleton

Create a constant `SCHEMA_SKELETON` (not Zod-generated; a plain object is fine) in:
`src/schemas/skeleton.js`

It should match the V2 shape, example (shortened but accurate):

```js
export const SCHEMA_SKELETON = {
  schema_version: "2.0.0",
  project_name: "",
  agency_mode: {
    studio_name: "",
    creative_director: "",
    process: [],
    values: [],
    tone_style: "",
    visual_cues: [],
    forbid: [],
    principle_override: ""
  },
  brand_narrative: {
    essence: "",
    mission: "",
    experience: { hero: "", vibe: "" },
    target_audience: { primary_persona: "", pain_points: [], desired_action: "" }
  },
  content: { headline_style: "", cta_examples: [], tone_examples: [], avoid_words: [] },
  design: {
    style: "",
    visual_references: [],
    colors: [],
    typography: { heading_style: "", body_style: "", font_pairing_vibe: "" },
    imagery: { style: "", subjects: [], avoid: [] },
    interactions: { effects: [], hover_style: "", transitions: "", microinteractions: [] },
    pages: []
  },
  tech: {
    framework: "",
    requirements: [],
    responsive: { approach: "mobile-first", mobile_considerations: [] },
    output_format: { structure: "Single page application", component_style: "", include: [], exclude: [] }
  },
  constraints: { forbidden_patterns: [], forbidden_components: [], max_colors: 4, max_fonts: 2 },
  quality_assurance: { visual: [], ux: [], performance: [], brand: [], include_rationale: true },
  open_questions: []
};
```

### Repair prompt template (use this verbatim, fill variables)

```
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

MODE: {{mode}}
SCHEMA_VERSION: {{schemaVersion}}

SCHEMA_SKELETON:
{{schemaSkeletonJson}}

INVALID_JSON:
{{invalidJson}}
```

---

## 4) Integrate into `website-json-generator.jsx`

Replace any direct `setData(parsedJson)` with the hybrid pipeline.

### Where to apply

* After Gemini “Magic Brief” generation
* After Gemini “Architect” generation
* On manual JSON import
* On localStorage hydration (load)

### Absolute rule

`setData()` must only receive:

* `DefaultBrief` OR
* a `BriefSchema` validated object returned by `validateAndRepairBrief`

No other writes.

---

## 5) localStorage backup + migration behavior

When hydration/import fails after repair:

1. Write backup:

* key: `brief_backup_${Date.now()}`
* value: the best available raw object/string plus error info

2. Reset:

* `setData(DefaultBrief)`

3. Notify user:

* Show a toast: “Brief data was backed up and reset due to schema mismatch.”

---

## 6) Tests / Verification

Create `scripts/test-schema.js`:

* Validate `DefaultBrief` passes `BriefSchema`
* Validate every template in `STUDIO_TEMPLATES` can be embedded without schema errors (at minimum validate `template.data` is compatible with `agency_mode` schema)
* Print a clear PASS/FAIL summary and exit non-zero on fail.

Manual verification checklist:

* Selecting a studio template preserves and exports `tone_style`, `visual_cues`, `forbid`, `principle_override`.
* Magic generation: if arrays come back as strings, they normalize and still validate.
* If Gemini returns extra keys, strict validation triggers repair (and repaired output drops unknown keys).
* Export includes personality fields + open_questions (if present).

---

# Definition of Done

* Hybrid pipeline is active for generation/import/storage.
* Unknown keys are rejected/removed (via strict validation + repair).
* Minor drift is normalized safely without changing meaning.
* Failures produce backup + reset + actionable error message.
* Templates’ rich persona fields flow through into prompt context + export.
