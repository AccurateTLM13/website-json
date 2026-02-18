# 📦 Codebase Extraction Report

Here are the critical code blocks you requested.

---

## 🧩 1️⃣ The Prompt Blocks from `website-json-generator.jsx`

### **Magic Brief Prompt (Lines 243-326)**
This is the prompt used when you click "Generate Studio Brief".

```javascript
const systemPrompt = `
You are a Creative Director at a top-tier digital design agency.
Generate a comprehensive JSON blueprint for: "${magicPrompt}".

Create a tailored "Studio Identity" - for enterprise apps use a "Scaler" identity, for art/creative use "Auteur", for local business use "Humanist".

Use this EXACT schema (fill ALL fields with specific, creative values):
{
  "agency_mode": { 
    "studio_name": "string", 
    "creative_director": "string (detailed persona with taste and philosophy)", 
    "process": ["4 creative process steps"],
    "values": ["4 core values"]
  },
  "project_name": "string",
  "brand_narrative": {
    "essence": "string (brand soul in one sentence)",
    "mission": "string (why this exists)",
    "experience": { "hero": "string (vivid hero section description)", "vibe": "string (3 atmospheric adjectives)" },
    "target_audience": {
      "primary_persona": "string (detailed user description with age, context)",
      "pain_points": ["3 specific pain points"],
      "desired_action": "string (main conversion goal)"
    }
  },
  "content": {
    "headline_style": "string (writing style for headlines)",
    "cta_examples": ["3 specific CTA button texts"],
    "tone_examples": ["2 example sentences in brand voice"],
    "avoid_words": ["5 words/phrases to never use"]
  },
  "design": {
    "style": "string (overall visual aesthetic)",
    "visual_references": ["3 vivid mood board descriptions"],
    "colors": ["4-5 specific colors with hex or descriptive names"],
    "typography": {
      "heading_style": "string",
      "body_style": "string", 
      "font_pairing_vibe": "string (reference like 'X meets Y')"
    },
    "imagery": {
      "style": "string",
      "subjects": ["3 image subject types"],
      "avoid": ["3 imagery types to avoid"]
    },
    "interactions": {
      "effects": ["3 animation/effect types"],
      "hover_style": "string",
      "transitions": "string (timing and easing)",
      "microinteractions": ["2 specific microinteractions"]
    },
    "pages": ["pages with key sections, e.g. 'Home: Hero, Features, Testimonials'"]
  },
  "tech": { 
    "framework": "string", 
    "requirements": ["3 technical requirements"],
    "responsive": {
      "approach": "mobile-first",
      "mobile_considerations": ["3 mobile-specific considerations"]
    },
    "output_format": {
      "structure": "string",
      "component_style": "string",
      "include": ["3 things to include"],
      "exclude": ["3 things to exclude"]
    }
  },
  "constraints": {
    "forbidden_patterns": ["4 design anti-patterns"],
    "forbidden_components": ["3 UI elements to avoid"],
    "max_colors": 4,
    "max_fonts": 2
  },
  "quality_assurance": {
    "visual": ["2 visual quality criteria"],
    "ux": ["2 UX quality criteria"],
    "performance": ["2 performance criteria"],
    "brand": ["2 brand alignment criteria"],
    "include_rationale": true
  }
}

Return ONLY valid JSON. No markdown, no explanation.`;
```

### **Architectural Analysis Prompt (Results of visual analysis) (Lines 386-476)**
This is the prompt that takes the visual analysis data and turns it into a full brief.

```javascript
const architectPrompt = `
You are a Senior Information Architect and Creative Director.

We have just analyzed a website screenshot with the following visual summary:
"${analysisData.magic_prompt_summary}"

And extracted this preliminary data:
${JSON.stringify(analysisData, null, 2)}

TASK:
Create a comprehensive, cohesively designed Project Blueprint based on this visual analysis.
The goal is to recreate the *soul* and *system* of the analyzed site, but fully fleshed out.

Use this EXACT schema (fill ALL fields with specific, creative values matching the visual vibe):
{
  "agency_mode": { 
    "studio_name": "string (create a fictional studio name that matches the vibe)", 
    "creative_director": "string (detailed persona)", 
    "process": ["4 creative process steps"],
    "values": ["4 core values"]
  },
  "project_name": "string (invent a fitting project name)",
  "brand_narrative": {
    "essence": "string",
    "mission": "string",
    "experience": { "hero": "string", "vibe": "string" },
    "target_audience": {
      "primary_persona": "string",
      "pain_points": ["3 specific pain points"],
      "desired_action": "string"
    }
  },
  "content": {
    "headline_style": "string",
    "cta_examples": ["3 specific CTA button texts"],
    "tone_examples": ["2 example sentences"],
    "avoid_words": ["5 words to avoid"]
  },
  "design": {
    "style": "string",
    "visual_references": ["3 vivid descriptions"],
    "colors": ["4-5 specific colors from the analysis"],
    "typography": {
      "heading_style": "string",
      "body_style": "string", 
      "font_pairing_vibe": "string"
    },
    "imagery": {
      "style": "string",
      "subjects": ["3 image subject types"],
      "avoid": ["3 things to avoid"]
    },
    "interactions": {
      "effects": ["3 animation types"],
      "hover_style": "string",
      "transitions": "string",
      "microinteractions": ["2 specific interactions"]
    },
    "pages": ["Home", "About", "Services", "Contact"]
  },
  "tech": { 
    "framework": "React / Tailwind", 
    "requirements": ["3 technical requirements"],
    "responsive": {
      "approach": "mobile-first",
      "mobile_considerations": ["3 mobile considerations"]
    },
    "output_format": {
      "structure": "Single page application",
      "component_style": "Functional",
      "include": ["SEO", "Accessibility"],
      "exclude": ["Backend"]
    }
  },
  "constraints": {
    "forbidden_patterns": ["4 anti-patterns"],
    "forbidden_components": ["3 to avoid"],
    "max_colors": 4,
    "max_fonts": 2
  },
  "quality_assurance": {
    "visual": ["2 QA checks"],
    "ux": ["2 QA checks"],
    "performance": ["2 QA checks"],
    "brand": ["2 QA checks"],
    "include_rationale": true
  }
}

Return ONLY valid JSON.
`;
```

---

## 📤 2️⃣ The `copyToClipboard` Markdown Assembly

All of your product output logic lives here.

```javascript
    const copyToClipboard = () => {
        const promptText = `# Website Generation Brief

You are ${data.agency_mode.studio_name || 'a Creative Director'}.

${data.agency_mode.creative_director ? `## Your Persona\n${data.agency_mode.creative_director}\n` : ''}

## Project: ${data.project_name || 'Untitled Project'}

### Target Audience
${data.brand_narrative.target_audience?.primary_persona ? `- **Who:** ${data.brand_narrative.target_audience.primary_persona}` : ''}
${data.brand_narrative.target_audience?.pain_points?.length > 0 ? `- **Pain Points:** ${data.brand_narrative.target_audience.pain_points.join(', ')}` : ''}
${data.brand_narrative.target_audience?.desired_action ? `- **Goal:** ${data.brand_narrative.target_audience.desired_action}` : ''}

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
        const cleanedPrompt = promptText.split('\n').filter((line, i, arr) => {
            // Remove lines that are just empty or only contain formatting
            if (line.trim() === '') return i > 0 && arr[i - 1].trim() !== '';
            if (line.trim().startsWith('-') && line.split(':')[1]?.trim() === '') return false;
            return true;
        }).join('\n');

        navigator.clipboard.writeText(cleanedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
```

---

## 🎨 3️⃣ The "Agency Mode" Selection Logic

### **UI Logic (website-json-generator.jsx)**
It simply overwrites the `agency_mode` key in the state.

```javascript
    const applyTemplate = (template) => {
        setData(prev => ({
            ...prev,
            agency_mode: template.data
        }));
    };
```

### **Data Source (data/constants.js)**
Here are the hardcoded templates.

```javascript
export const STUDIO_TEMPLATES = [
    {
        id: "ember",
        name: "Studio Ember",
        tagline: "The Artisan",
        vibe: "Warm, Narrative, Handcrafted",
        colors: "from-amber-700 to-orange-900",
        data: {
            studio_name: "Studio Ember",
            creative_director: "You lead a multidisciplinary design house...",
            mission: "Create digital warmth through story...",
            process: ["Discover (Essence)", "Define (Narrative)", "Design (Atmosphere)", "Deploy (Craft)"],
            values: ["Authenticity", "Warmth", "Imperfection", "Community"],
            // Note: These fields exist in the constant but NOT in the schema passed to Gemini or React State!
            tone_style: "Poetic, grounded, analog...", 
            principle_override: "Prioritize emotional resonance...",
            forbid: ["corporate tone",...], 
            visual_cues: ["serif typography",...]
        }
    },
    // ... other templates
]
```

**🚨 Critical Discovery**: The `STUDIO_TEMPLATES` in `constants.js` contain rich fields (`tone_style`, `visual_cues`, `forbid`) that are **NOT accepted by the React State `agency_mode` object**.
*   State expects: `{ studio_name, creative_director, process, values }`
*   Template provides: `{ ...state_fields, tone_style, visual_cues, forbid, etc. }`
*   **Result**: When you select a template, the extra rich data is saved to state (because Javascript objects receive it), **BUT** it is completely ignored by the prompt generator because `copyToClipboard` doesn't reference `data.agency_mode.visual_cues`. **This explains why the agency selection feels "fragile" or disconnected—half the data is being thrown away.**

---

## 🧭 4️⃣ UI Navigation Code

### **Tabs Configuration (data/constants.js)**
```javascript
export const TABS = [
    { id: 'studio', label: 'Studio', icon: Briefcase },
    { id: 'narrative', label: 'Audience', icon: BookOpen },
    { id: 'content', label: 'Content', icon: MessageSquare },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'tech', label: 'Tech', icon: Cpu },
    { id: 'constraints', label: 'Constraints', icon: Ban },
    { id: 'qa', label: 'Quality', icon: ListChecks },
];
```

### **Sidebar Component (Sidebar.jsx)**
Maps through TABS and calls `setActiveTab`.

```javascript
{TABS.map((tab) => {
    const Icon = tab.icon;
    return (
        <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            // ... styling
        >
            <Icon className="w-4 h-4" />
            {tab.label}
        </button>
    );
})}
```

### **Main Render Loop (website-json-generator.jsx)**
It checks `activeTab` string literals manually.

```javascript
{activeTab === 'studio' && (
    // ... render studio components
)}

{activeTab === 'narrative' && (
    // ... render narrative components
)}
```
