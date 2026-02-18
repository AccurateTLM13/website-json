export function normalizeBrief(raw) {
    if (!raw || typeof raw !== 'object') {
        return {};
    }

    // Clone to avoid mutating original
    const data = JSON.parse(JSON.stringify(raw));

    // --- A) Key Aliasing (Rename known drift keys) ---

    // Root
    if (data.agencyMode && !data.agency_mode) { data.agency_mode = data.agencyMode; delete data.agencyMode; }
    if (data.brandNarrative && !data.brand_narrative) { data.brand_narrative = data.brandNarrative; delete data.brandNarrative; }
    if (data.qualityAssurance && !data.quality_assurance) { data.quality_assurance = data.qualityAssurance; delete data.qualityAssurance; }
    if (data.projectName && !data.project_name) { data.project_name = data.projectName; delete data.projectName; }

    // brand_narrative nested
    if (data.brand_narrative?.targetAudience && !data.brand_narrative.target_audience) {
        data.brand_narrative.target_audience = data.brand_narrative.targetAudience;
        delete data.brand_narrative.targetAudience;
    }

    // content nested
    if (data.content) {
        if (data.content.ctaExamples && !data.content.cta_examples) { data.content.cta_examples = data.content.ctaExamples; delete data.content.ctaExamples; }
        if (data.content.toneExamples && !data.content.tone_examples) { data.content.tone_examples = data.content.toneExamples; delete data.content.toneExamples; }
        if (data.content.avoidWords && !data.content.avoid_words) { data.content.avoid_words = data.content.avoidWords; delete data.content.avoidWords; }
    }

    // design nested
    if (data.design) {
        if (data.design.visualReferences && !data.design.visual_references) { data.design.visual_references = data.design.visualReferences; delete data.design.visualReferences; }
        if (data.design.typography?.fontPairingVibe && !data.design.typography.font_pairing_vibe) { data.design.typography.font_pairing_vibe = data.design.typography.fontPairingVibe; delete data.design.typography.fontPairingVibe; }
        if (data.design.interactions?.microInteractions && !data.design.interactions.microinteractions) { data.design.interactions.microinteractions = data.design.interactions.microInteractions; delete data.design.interactions.microInteractions; }
    }

    // tech nested
    if (data.tech) {
        if (data.tech.requirements && !Array.isArray(data.tech.requirements) && typeof data.tech.requirements === 'string') {
            // Handle "requirements": "React, Vite" -> ["React", "Vite"] if it was comma separated? 
            // Policy says: "DO NOT split comma-separated strings into multiple entries. Only wrap." 
            // usage below in loop handles wrapping. 
        }

        if (data.tech.outputFormat && !data.tech.output_format) { data.tech.output_format = data.tech.outputFormat; delete data.tech.outputFormat; }
        if (data.tech.responsive?.mobileConsiderations && !data.tech.responsive.mobile_considerations) { data.tech.responsive.mobile_considerations = data.tech.responsive.mobileConsiderations; delete data.tech.responsive.mobileConsiderations; }
        if (data.tech.output_format?.componentStyle && !data.tech.output_format.component_style) { data.tech.output_format.component_style = data.tech.output_format.componentStyle; delete data.tech.output_format.componentStyle; }
    }

    // constraints nested
    if (data.constraints) {
        if (data.constraints.forbiddenPatterns && !data.constraints.forbidden_patterns) { data.constraints.forbidden_patterns = data.constraints.forbiddenPatterns; delete data.constraints.forbiddenPatterns; }
        if (data.constraints.forbiddenComponents && !data.constraints.forbidden_components) { data.constraints.forbidden_components = data.constraints.forbiddenComponents; delete data.constraints.forbiddenComponents; }
        if (data.constraints.maxColors && !data.constraints.max_colors) { data.constraints.max_colors = data.constraints.maxColors; delete data.constraints.maxColors; }
        if (data.constraints.maxFonts && !data.constraints.max_fonts) { data.constraints.max_fonts = data.constraints.maxFonts; delete data.constraints.maxFonts; }
    }

    // --- B) Coerce numeric strings to numbers ---

    if (data.constraints) {
        if (typeof data.constraints.max_colors === 'string') {
            const parsed = parseInt(data.constraints.max_colors, 10);
            if (!isNaN(parsed)) data.constraints.max_colors = parsed;
        }
        if (typeof data.constraints.max_fonts === 'string') {
            const parsed = parseInt(data.constraints.max_fonts, 10);
            if (!isNaN(parsed)) data.constraints.max_fonts = parsed;
        }
    }

    // --- C) Coerce string -> array (Wrap Only) ---

    // Helper to safely navigate and wrap
    const wrapArray = (obj, path) => {
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) return;
            current = current[path[i]];
        }
        const key = path[path.length - 1];
        const value = current[key];

        if (typeof value === 'string') {
            current[key] = [value.trim()];
        } else if (Array.isArray(value)) {
            // Ensure elements are trimmed strings
            current[key] = value.map(v => typeof v === 'string' ? v.trim() : v);
        }
    };

    const arrayPaths = [
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

    arrayPaths.forEach(path => wrapArray(data, path));

    // --- D) Trim strings (general pass? No, policy says "If you normalize or coerce a string, .trim() it")
    // We handled array strings above. 
    // Let's handle specific important string fields if they exist.

    const stringPaths = [
        ['agency_mode', 'studio_name'],
        ['agency_mode', 'creative_director'],
        ['agency_mode', 'tone_style'],
        ['brand_narrative', 'essence'],
        ['brand_narrative', 'mission']
    ];

    stringPaths.forEach(path => {
        let current = data;
        let valid = true;
        for (let i = 0; i < path.length - 1; i++) {
            if (!current[path[i]]) { valid = false; break; }
            current = current[path[i]];
        }
        if (valid) {
            const key = path[path.length - 1];
            if (typeof current[key] === 'string') {
                current[key] = current[key].trim();
            }
        }
    });

    return data;
}
