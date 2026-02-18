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
