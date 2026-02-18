import { normalizeBrief } from './normalizeBrief';
import { buildRepairPrompt } from './repairPrompt';
import { SCHEMA_SKELETON } from '../schemas/skeleton';
import { CURRENT_SCHEMA_VERSION } from '../schemas/brief';

/**
 * Validates and optionally repairs the brief data using a hybrid pipeline.
 * Pipeline: Parse -> Normalize -> Validate -> (If Invalid: Repair -> Normalize -> Validate)
 * 
 * @param {object} params
 * @param {string|object} params.raw - The raw input (JSON string or object)
 * @param {string} params.mode - Context: "magic" | "architect" | "import" | "storage"
 * @param {function} params.geminiRepair - Async function(prompt) => jsonString
 * @param {object} params.BriefSchema - Zod schema
 * @param {object} params.DefaultBrief - Default backup object
 * @param {function} [params.onEvent] - Optional callback for telemetry/logging
 * @returns {Promise<{ ok: boolean, data?: object, stage?: string, repaired?: boolean, normalized?: boolean, issues?: any[], rawRepairText?: string }>}
 */
export async function validateAndRepairBrief({
    raw,
    mode,
    geminiRepair,
    BriefSchema,
    DefaultBrief,
    onEvent
}) {
    const log = (event) => onEvent && onEvent(event);

    // 1. Parse Input
    let parsed;
    try {
        if (typeof raw === 'string') {
            const cleanRaw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanRaw);
        } else {
            parsed = raw;
        }
    } catch (e) {
        log({ type: "parse_failed", error: e.message });
        return { ok: false, stage: "parse", issues: [{ path: "root", message: "Invalid JSON syntax" }] };
    }

    if (!parsed || typeof parsed !== 'object') {
        return { ok: false, stage: "parse", issues: [{ path: "root", message: "Input is not an object" }] };
    }

    // 2. Normalize First Pass
    const normalized1 = normalizeBrief(parsed);
    log({ type: "normalized", pass: 1 });

    // 3. Strict Validation First Pass
    const result1 = BriefSchema.safeParse(normalized1);

    if (result1.success) {
        log({ type: "validation_success", pass: 1 });
        return {
            ok: true,
            data: result1.data,
            repaired: false,
            normalized: true,
            issues: []
        };
    }

    log({ type: "validation_failed", issues: result1.error.issues, pass: 1 });

    // 4. Repair Phase (if validation failed)
    log({ type: "repair_started", mode });

    if (!geminiRepair) {
        log({ type: "repair_unavailable", message: "Gemini repair function not provided" });
        return { ok: false, stage: "repair_unavailable", issues: result1.error.issues, backupCandidate: normalized1 };
    }

    try {
        // Build repair prompt
        const prompt = buildRepairPrompt({
            schemaVersion: CURRENT_SCHEMA_VERSION,
            schemaSkeleton: SCHEMA_SKELETON,
            invalidJson: normalized1, // Use normalized version as it's cleaner
            mode
        });

        // Call Gemini to repair
        const repairText = await geminiRepair(prompt);
        log({ type: "repair_complete_raw" });

        // Parse repair output
        // Gemini might return markdown ```json ... ``` despite instructions
        const cleanText = repairText.replace(/```json/g, '').replace(/```/g, '').trim();
        let repairedParsed;
        try {
            repairedParsed = JSON.parse(cleanText);
        } catch (e) {
            log({ type: "repair_parse_failed", error: e.message });
            return {
                ok: false,
                stage: "repair_parse",
                issues: [{ path: "repair", message: "Repair returned invalid JSON" }],
                rawRepairText: repairText,
                backupCandidate: normalized1
            };
        }

        // 5. Normalization Second Pass
        const normalized2 = normalizeBrief(repairedParsed);
        log({ type: "normalized", pass: 2 });

        // 6. Strict Validation Second Pass
        const result2 = BriefSchema.safeParse(normalized2);

        if (result2.success) {
            log({ type: "repair_success" });
            return {
                ok: true,
                data: result2.data,
                repaired: true,
                normalized: true,
                issues: []
            };
        }

        // If repair still failed
        log({ type: "repair_failed_validation", issues: result2.error.issues });
        return {
            ok: false,
            stage: "validate_after_repair",
            issues: result2.error.issues,
            backupCandidate: normalized2
        };

    } catch (err) {
        log({ type: "repair_error", error: err.message });
        return {
            ok: false,
            stage: "repair_execution",
            issues: [{ path: "repair", message: err.message }],
            backupCandidate: normalized1
        };
    }
}
