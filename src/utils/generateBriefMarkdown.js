export const generateBriefMarkdown = (data) => {
    const promptText = `# Website Generation Brief

You are ${data.agency_mode.studio_name || 'a Creative Director'}.

${data.agency_mode.creative_director ? `## Your Persona\n${data.agency_mode.creative_director}\n` : ''}
${data.agency_mode.tone_style ? `**Tone Style:** ${data.agency_mode.tone_style}\n` : ''}
${data.agency_mode.principle_override ? `**Guiding Principle:** ${data.agency_mode.principle_override}\n` : ''}
${data.agency_mode.visual_cues?.length > 0 ? `**Visual Cues:** ${data.agency_mode.visual_cues.join(', ')}\n` : ''}
${data.agency_mode.forbid?.length > 0 ? `**Strictly Forbid:** ${data.agency_mode.forbid.join(', ')}\n` : ''}

## Project: ${data.project_name || 'Untitled Project'}

### Target Audience
${data.brand_narrative.target_audience?.primary_persona ? `- **Who:** ${data.brand_narrative.target_audience.primary_persona}` : ''}
${data.brand_narrative.target_audience?.pain_points?.length > 0 ? `- **Pain Points:** ${data.brand_narrative.target_audience.pain_points.join(', ')}` : ''}
${data.brand_narrative.target_audience?.desired_action ? `- **Goal:** ${data.brand_narrative.target_audience.desired_action}` : ''}

${data.open_questions?.length > 0 ? `### ❓ Open Questions\n${data.open_questions.map(q => `- [ ] ${q}`).join('\n')}\n` : ''}

### Brand Narrative
${data.brand_narrative.essence ? `- **Essence:** ${data.brand_narrative.essence}` : ''}
${data.brand_narrative.mission ? `- **Mission:** ${data.brand_narrative.mission}` : ''}
${data.brand_narrative.experience?.vibe ? `- **Vibe:** ${data.brand_narrative.experience.vibe}` : ''}
${data.brand_narrative.experience?.hero ? `- **Hero Section:** ${data.brand_narrative.experience.hero}` : ''}

### Content Guidelines
${data.content?.headline_style ? `- **Headlines:** ${data.content.headline_style}` : ''}
${data.content?.cta_examples?.length > 0 ? `- **CTA Examples:** "${data.content.cta_examples.join('", "')}"` : ''}
${data.content?.tone_examples?.length > 0 ? `- **Tone Examples:** "${data.content.tone_examples.join('", "')}"` : ''}
${data.content?.avoid_words?.length > 0 ? `- **Avoid Words:** ${data.content.avoid_words.join(', ')}` : ''}

### Design System
${data.design?.style ? `- **Style:** ${data.design.style}` : ''}
${data.design?.colors?.length > 0 ? `- **Colors:** ${data.design.colors.join(', ')}` : ''}
${data.design?.typography?.heading_style ? `- **Headings:** ${data.design.typography.heading_style}` : ''}
${data.design?.typography?.body_style ? `- **Body Text:** ${data.design.typography.body_style}` : ''}
${data.design?.typography?.font_pairing_vibe ? `- **Font Vibe:** ${data.design.typography.font_pairing_vibe}` : ''}

### Imagery
${data.design?.imagery?.style ? `- **Style:** ${data.design.imagery.style}` : ''}
${data.design?.imagery?.subjects?.length > 0 ? `- **Subjects:** ${data.design.imagery.subjects.join(', ')}` : ''}
${data.design?.imagery?.avoid?.length > 0 ? `- **Avoid:** ${data.design.imagery.avoid.join(', ')}` : ''}

### Interactions
${data.design?.interactions?.hover_style ? `- **Hover:** ${data.design.interactions.hover_style}` : ''}
${data.design?.interactions?.transitions ? `- **Transitions:** ${data.design.interactions.transitions}` : ''}
${data.design?.interactions?.effects?.length > 0 ? `- **Effects:** ${data.design.interactions.effects.join(', ')}` : ''}
${data.design?.interactions?.microinteractions?.length > 0 ? `- **Microinteractions:** ${data.design.interactions.microinteractions.join(', ')}` : ''}

### Pages
${data.design?.pages?.length > 0 ? data.design.pages.map(p => `- ${p}`).join('\n') : '- Home page'}

### Technical Requirements
- **Framework:** ${data.tech?.framework || 'React with Tailwind CSS'}
- **Approach:** ${data.tech?.responsive?.approach || 'mobile-first'}
- **Structure:** ${data.tech?.output_format?.structure || 'Single page application'}
${data.tech?.output_format?.component_style ? `- **Component Style:** ${data.tech.output_format.component_style}` : ''}
${data.tech?.requirements?.length > 0 ? `- **Requirements:** ${data.tech.requirements.join(', ')}` : ''}
${data.tech?.responsive?.mobile_considerations?.length > 0 ? `- **Mobile:** ${data.tech.responsive.mobile_considerations.join(', ')}` : ''}
${data.tech?.output_format?.include?.length > 0 ? `- **Include:** ${data.tech.output_format.include.join(', ')}` : ''}
${data.tech?.output_format?.exclude?.length > 0 ? `- **Exclude:** ${data.tech.output_format.exclude.join(', ')}` : ''}

### Constraints (DO NOT)
- Maximum ${data.constraints?.max_colors || 4} colors
- Maximum ${data.constraints?.max_fonts || 2} fonts
${data.constraints?.forbidden_patterns?.length > 0 ? `- **Forbidden Patterns:** ${data.constraints.forbidden_patterns.join(', ')}` : ''}
${data.constraints?.forbidden_components?.length > 0 ? `- **Forbidden Components:** ${data.constraints.forbidden_components.join(', ')}` : ''}

### Quality Checklist
${data.quality_assurance?.visual?.length > 0 ? `**Visual:** ${data.quality_assurance.visual.join(' ✓ ')}` : ''}
${data.quality_assurance?.ux?.length > 0 ? `**UX:** ${data.quality_assurance.ux.join(' ✓ ')}` : ''}
${data.quality_assurance?.performance?.length > 0 ? `**Performance:** ${data.quality_assurance.performance.join(' ✓ ')}` : ''}
${data.quality_assurance?.brand?.length > 0 ? `**Brand:** ${data.quality_assurance.brand.join(' ✓ ')}` : ''}

---

${data.quality_assurance?.include_rationale ? '**IMPORTANT:** Before generating code, explain your design decisions and how they align with this brief.\n\n' : ''}Follow the creative process: ${data.agency_mode?.process?.join(' → ') || 'Design → Build → Polish'}

Generate the complete website code now.`;

    // Clean up empty lines
    return promptText.split('\n').filter((line, i, arr) => {
        // Remove lines that are just empty or only contain formatting
        if (line.trim() === '') return i > 0 && arr[i - 1].trim() !== '';
        if (line.trim().startsWith('-') && line.split(':')[1]?.trim() === '') return false;
        return true;
    }).join('\n');
};
