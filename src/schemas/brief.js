import { z } from 'zod';

export const CURRENT_SCHEMA_VERSION = "2.0.0";

// --- Sub-Schemas ---

const AgencyModeSchema = z.object({
    studio_name: z.string().default(""),
    creative_director: z.string().default(""),
    process: z.array(z.string()).default([]),
    values: z.array(z.string()).default([]),
    tone_style: z.string().default(""),
    visual_cues: z.array(z.string()).default([]),
    forbid: z.array(z.string()).default([]),
    principle_override: z.string().default(""),
});

const TargetAudienceSchema = z.object({
    primary_persona: z.string().default(""),
    pain_points: z.array(z.string()).default([]),
    desired_action: z.string().default(""),
});

const BrandNarrativeSchema = z.object({
    essence: z.string().default(""),
    mission: z.string().default(""),
    experience: z.object({
        hero: z.string().default(""),
        vibe: z.string().default(""),
    }).default({ hero: "", vibe: "" }),
    target_audience: TargetAudienceSchema.default({}),
});

const ContentSchema = z.object({
    headline_style: z.string().default(""),
    cta_examples: z.array(z.string()).default([]),
    tone_examples: z.array(z.string()).default([]),
    avoid_words: z.array(z.string()).default([]),
});

const TypographySchema = z.object({
    heading_style: z.string().default(""),
    body_style: z.string().default(""),
    font_pairing_vibe: z.string().default(""),
});

const ImagerySchema = z.object({
    style: z.string().default(""),
    subjects: z.array(z.string()).default([]),
    avoid: z.array(z.string()).default([]),
});

const InteractionsSchema = z.object({
    effects: z.array(z.string()).default([]),
    hover_style: z.string().default(""),
    transitions: z.string().default(""),
    microinteractions: z.array(z.string()).default([]),
});

const DesignSchema = z.object({
    style: z.string().default(""),
    visual_references: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    typography: TypographySchema.default({}),
    imagery: ImagerySchema.default({}),
    interactions: InteractionsSchema.default({}),
    pages: z.array(z.string()).default([]),
});

const ResponsiveSchema = z.object({
    approach: z.string().default("mobile-first"),
    mobile_considerations: z.array(z.string()).default([]),
});

const OutputFormatSchema = z.object({
    structure: z.string().default("Single page application"),
    component_style: z.string().default(""),
    include: z.array(z.string()).default([]),
    exclude: z.array(z.string()).default([]),
});

const TechSchema = z.object({
    framework: z.string().default(""),
    requirements: z.array(z.string()).default([]),
    responsive: ResponsiveSchema.default({}),
    output_format: OutputFormatSchema.default({}),
});

const ConstraintsSchema = z.object({
    forbidden_patterns: z.array(z.string()).default([]),
    forbidden_components: z.array(z.string()).default([]),
    max_colors: z.number().default(4),
    max_fonts: z.number().default(2),
});

const QualityAssuranceSchema = z.object({
    visual: z.array(z.string()).default([]),
    ux: z.array(z.string()).default([]),
    performance: z.array(z.string()).default([]),
    brand: z.array(z.string()).default([]),
    include_rationale: z.boolean().default(true),
});

const MetaSchema = z.object({
    source: z.string().default("manual"),
    generated_at: z.string().default(""),
    model: z.string().default(""),
}).default({});

// --- Main Schema ---

export const BriefSchema = z.object({
    schema_version: z.literal(CURRENT_SCHEMA_VERSION).default(CURRENT_SCHEMA_VERSION),
    meta: MetaSchema,
    project_name: z.string().default(""),
    agency_mode: AgencyModeSchema.default({}),
    brand_narrative: BrandNarrativeSchema.default({}),
    content: ContentSchema.default({}),
    design: DesignSchema.default({}),
    tech: TechSchema.default({}),
    constraints: ConstraintsSchema.default({}),
    quality_assurance: QualityAssuranceSchema.default({}),
    open_questions: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
    // console.log("SuperRefine Data:", JSON.stringify(data, null, 2));
    if (!data.design || !data.constraints) return;

    // Enforce Constraints
    if (data.design.colors && data.constraints.max_colors && data.design.colors.length > data.constraints.max_colors) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["design", "colors"],
            message: `Too many colors. Max allowed: ${data.constraints.max_colors}`,
            params: { max: data.constraints.max_colors } // For repair logic
        });
    }
    if (data.design.typography && data.design.typography.heading_style && data.design.typography.body_style) {
        // ...
    }
});

// --- Initial State ---

export const DefaultBrief = BriefSchema.parse({});
