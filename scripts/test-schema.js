import { BriefSchema, DefaultBrief } from '../src/schemas/brief.js';
import { STUDIO_TEMPLATES } from '../src/data/constants.js';
import { normalizeBrief } from '../src/utils/normalizeBrief.js';

console.log("\n🔹 Validating DefaultBrief...");
const defaultResult = BriefSchema.safeParse(DefaultBrief);
if (!defaultResult.success) {
    console.error("❌ DefaultBrief failed validation:", JSON.stringify(defaultResult.error.format(), null, 2));
    process.exit(1);
}
console.log("✅ DefaultBrief is valid.");

console.log("\n----------------------------------\n");

console.log("🔹 Testing Normalization Logic...");
const trickyInput = {
    agencyMode: { studio_name: "  Space  " }, // Alias + trim
    constraints: { max_colors: "5", maxFonts: "3" }, // Alias + coerce + coerce
    design: { colors: "red, blue" } // Wrap string to array
};

const normalized = normalizeBrief(trickyInput);

if (normalized.agency_mode?.studio_name === "Space" &&
    normalized.constraints?.max_colors === 5 &&
    normalized.constraints?.max_fonts === 3 &&
    Array.isArray(normalized.design?.colors) &&
    normalized.design.colors[0] === "red, blue") { // verification: we DO NOT split comma strings, just wrap per policy
    console.log("✅ Normalization logic passed (Aliasing, Trimming, Coercion, Wrapping).");
} else {
    console.error("❌ Normalization logic failed:", JSON.stringify(normalized, null, 2));
    process.exit(1);
}

console.log("\n----------------------------------\n");

console.log("🔹 Validating Studio Templates (Strict Validation)...");

let allPassed = true;

STUDIO_TEMPLATES.forEach((template, index) => {
    // Merge template data with DefaultBrief
    const merged = {
        ...DefaultBrief,
        agency_mode: {
            ...DefaultBrief.agency_mode,
            ...template.data
        }
    };

    // We expect templates to match the strict schema directly even without repair
    const result = BriefSchema.safeParse(merged);

    if (result.success) {
        // console.log(`✅ Template '${template.name}' is valid.`);
    } else {
        console.error(`❌ Template '${template.name}' (ID: ${template.id}) FAILED validation.`);
        // just show first error for brevity
        console.error(JSON.stringify(result.error.issues[0], null, 2));
        allPassed = false;
    }
});

console.log("\n----------------------------------\n");

if (allPassed) {
    console.log("🎉 All Tests Passed! Schema & Templates are solid.");
    process.exit(0);
} else {
    console.error("🔥 Some templates failed validation.");
    process.exit(1);
}
