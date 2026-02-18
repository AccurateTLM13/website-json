import { BriefSchema, DefaultBrief, CURRENT_SCHEMA_VERSION } from '../schemas/brief.js';

/**
 * Normalizes raw JSON data to match the expected structure of DesignBriefV2.
 * Handles common LLM hallucinations and structural mismatches.
 * @param {any} raw - The input object to normalize.
 * @returns {object} - The normalized object ready for validation.
 */
export function normalizeBrief(raw) {
    if (!raw || typeof raw !== 'object') {
        return DefaultBrief;
    }

    // Clone to avoid mutating original
    const data = JSON.parse(JSON.stringify(raw));

    // 1. Rename common hallucinated keys
    if (data.agencyMode) {
        data.agency_mode = data.agencyMode;
        delete data.agencyMode;
    }
    if (data.projectName) {
        data.project_name = data.projectName;
        delete data.projectName;
    }
    // Add more renames as we discover them

    // 2. Coerce fields to arrays where expected
    const arrayFields = [
        ['agency_mode', 'process'],
        ['agency_mode', 'values'],
        ['agency_mode', 'visual_cues'],
        ['agency_mode', 'forbid'],
        ['brand_narrative', 'target_audience', 'pain_points'],
        ['content', 'cta_examples'],
        ['content', 'tone_examples'],
        ['content', 'avoid_words'],
        ['design', 'visual_references'],
        ['design', 'colors'],
        ['design', 'imagery', 'subjects'],
        ['design', 'imagery', 'avoid'],
        ['design', 'interactions', 'effects'],
        ['design', 'interactions', 'microinteractions'],
        ['design', 'pages'],
        ['tech', 'requirements'],
        ['tech', 'responsive', 'mobile_considerations'],
        ['tech', 'output_format', 'include'],
        ['tech', 'output_format', 'exclude'],
        ['constraints', 'forbidden_patterns'],
        ['constraints', 'forbidden_components'],
        ['quality_assurance', 'visual'],
        ['quality_assurance', 'ux'],
        ['quality_assurance', 'performance'],
        ['quality_assurance', 'brand'],
        ['open_questions']
    ];

    for (const path of arrayFields) {
        let current = data;
        let validPath = true;

        // Navigate to parent
        for (let i = 0; i < path.length - 1; i++) {
            if (current[path[i]] === undefined) {
                // If intermediate path missing, that's fine, Zod default will handle it, 
                // or we can create it if we want to be aggressive. 
                // For normalization, let's just skip if structure is wildly different.
                validPath = false;
                break;
            }
            current = current[path[i]];
        }

        if (validPath) {
            const field = path[path.length - 1];
            const value = current[field];

            // If it's a string, wrap it
            if (typeof value === 'string') {
                current[field] = [value];
            }
            // If it's single object or number, wrap it (though less common for these fields)
            else if (value !== undefined && !Array.isArray(value)) {
                current[field] = [String(value)];
            }
        }
    }

    // 3. Ensure simple types
    if (data.constraints && typeof data.constraints.max_colors === 'string') {
        data.constraints.max_colors = parseInt(data.constraints.max_colors, 10) || 4;
    }
    if (data.constraints && typeof data.constraints.max_fonts === 'string') {
        data.constraints.max_fonts = parseInt(data.constraints.max_fonts, 10) || 2;
    }

    // 4. Proactive Constraint Enforcement
    // This prevents Zod .superRefine from failing, avoiding a repair loop.
    if (data.design && Array.isArray(data.design.colors) && data.constraints && typeof data.constraints.max_colors === 'number') {
        if (data.design.colors.length > data.constraints.max_colors) {
            console.warn(`Truncating colors from ${data.design.colors.length} to ${data.constraints.max_colors}`);
            data.design.colors = data.design.colors.slice(0, data.constraints.max_colors);
        }
    }

    return data;
}

/**
 * Validates and repairs the brief data.
 * @param {any} json - The raw JSON data.
 * @returns {{ success: boolean, data: object, errors: import('zod').ZodIssue[] | null }}
 */
export function validateAndRepair(json) {
    try {
        // 1. Normalize first
        const normalized = normalizeBrief(json);

        // 2. Validate with Zod (strip unknown keys is handled by schema.strict() ?? no, strict throws. 
        // We used .strict() in schema, so we should actually use .safeParse. 
        // To support "strip unknown", we might want to use .parse(data, { mode: "strip" }) equivalent if we weren't valid.
        // Actually, Zod's .strict() throws on unknown keys. 
        // If we want to strip unknown keys, we should use no .strict() in definition 
        // OR process it before.
        // BUT user asked for "strict key stripping". 
        // Zod defaults to stripping unknown keys if you DON'T use .strict(). 
        // If you use .strict(), it fails. 
        // The user said: "Use Zod with .strict() where possible... and/or run a stripUnknownKeys() step."

        // Let's try to parse strict first.
        const result = BriefSchema.safeParse(normalized);

        if (result.success) {
            return { success: true, data: result.data, errors: null };
        }

        // If strict failed, it might be due to unknown keys. 
        // Let's try to parse with a non-strict schema version (effectively stripping) 
        // to see if that's the only issue. 
        // Since we defined schemas with .strict(), we can't easily "un-strict" them without redefining.
        // Strategy: We will rely on Zod's error handling. 
        // If errors are "unrecognized_keys", we can manually strip them or just ignore strictness for repair.

        // Actually, easiest way to strip unknown keys using Zod schemas defined with .strict() 
        // is to iterate and pick only known keys, but that's tedious.
        // ALTERNATIVE: Re-parse using a non-strict schema? No.

        // Let's assume for "Repair", we want to output valid data.
        // If we simply defined the schema WITHOUT .strict(), Zod strips by default. 
        // The user asked for "strict key stripping". 
        // If we use .strict(), it ERRORS on unknown keys.
        // If we want to STRIP, we should NOT use .strict(), but the User implicitly wants the RESULT to be clean.
        // So, Zod default behavior (strip) is actually what we want for the "Repair" phase.
        // But we want to know if it WAS invalid.

        // Let's try this:
        // We really want: "If unknown keys exist, remove them and accept".
        // The Schema definition I wrote HAS .strict().
        // So safeParse will FAIL. 

        // To fix this, we can rely on `BriefSchema.parse(data)` throwing errors, 
        // identifying the extra keys, deleting them, and retrying.

        // Or better: generic recursive key stripper based on DefaultBrief structure? 
        // That's risky if structure varies.

        // Let's do this: 
        // The most robust way with strict schemas is to recursively clean the object 
        // based on the schema shape, but Zod introspection is complex.

        // allow the schema to be permissive during repair?
        // Let's iterate the Zod errors.

        const errors = result.error.issues;
        const unknownKeyErrors = errors.filter(e => e.code === 'unrecognized_keys');

        if (unknownKeyErrors.length > 0) {
            // Fix: remove unknown keys
            let repairedData = JSON.parse(JSON.stringify(normalized));

            unknownKeyErrors.forEach(err => {
                const pathStr = err.path.join('.'); // e.g., "agency_mode"
                // logic to delete `err.keys` from `repairedData` at `err.path`
                let current = repairedData;
                for (let i = 0; i < err.path.length; i++) {
                    current = current[err.path[i]];
                }
                // current is the object containing the unknown keys? 
                // No, err.path points to the object. err.keys are the keys to remove.

                // wait, if path is empty, it's root.
                let target = repairedData;
                for (let p of err.path) {
                    target = target[p];
                }

                if (target && typeof target === 'object') {
                    err.keys.forEach(key => delete target[key]);
                }
            });

            // Retry parse after stripping
            const retry = BriefSchema.safeParse(repairedData);
            if (retry.success) {
                // We successfully repaired by stripping!
                console.log("Repaired by stripping unknown keys:", unknownKeyErrors);
                return { success: true, data: retry.data, errors: null, wasRepaired: true };
            }
            return { success: false, data: repairedData, errors: retry.error.issues };
        }

        return { success: false, data: normalized, errors: result.error.issues };

    } catch (e) {
        console.error("Validation breakdown:", e);
        return { success: false, data: DefaultBrief, errors: [{ message: e.message }] };
    }
}
