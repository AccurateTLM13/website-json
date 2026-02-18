import React from 'react';
import {
    Bot, BookOpen, Users, MessageSquare, Palette, Type, Image,
    MousePointer, Cpu, Smartphone, FileCode, Ban, ListChecks,
    Lightbulb, HelpCircle, ArrowRight, Check, Sparkles, Rocket,
    Copy, Download, RefreshCw, Terminal
} from 'lucide-react';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import InputGroup from '../components/ui/InputGroup';
import TextInput from '../components/ui/TextInput';
import TextArea from '../components/ui/TextArea';
import ArrayBuilder from '../components/ui/ArrayBuilder';
import QuickChips from '../components/ui/QuickChips';
import AccordionSection from '../components/ui/AccordionSection';
import StrengthMeter from '../components/features/StrengthMeter';
import ImageAnalyzer from '../components/features/ImageAnalyzer';
import {
    STUDIO_TEMPLATES,
    QUICK_OPTS_TECH,
    QUICK_OPTS_VALUES,
    QUICK_OPTS_RESPONSIVE,
    QUICK_OPTS_OUTPUT_INCLUDE,
    QUICK_OPTS_OUTPUT_EXCLUDE,
    QUICK_OPTS_FORBIDDEN,
    QUICK_OPTS_INTERACTIONS
} from '../data/constants';

// =====================================================
// PHASE 01: INIT — Identity & Strategy
// =====================================================
export function InitPhase({ data, setData, loadingField, handleFieldMagic, applyTemplate, handleArchitecturalAnalysis }) {
    const bn = data.brand_narrative || {};
    const exp = bn.experience || {};
    const ta = bn.target_audience || {};
    const am = data.agency_mode || {};

    return (
        <>
            <ImageAnalyzer onAnalyze={handleArchitecturalAnalysis} />

            <AccordionSection title="Studio Template" icon={Bot} defaultOpen={true} badge="Agency Mode">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {STUDIO_TEMPLATES.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => applyTemplate(template)}
                            className={`text-left p-4 rounded-lg border transition-all hover:scale-[1.02] phase-card-interactive ${am.studio_name === template.name
                                ? 'bg-acid-500/10 border-acid-500 ring-1 ring-acid-500'
                                : 'bg-white/5 border-glass-border hover:border-slate-500'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-white font-display">{template.name}</span>
                                {am.studio_name === template.name && <Check className="w-4 h-4 text-acid-500" />}
                            </div>
                            <div className="text-xs font-mono uppercase tracking-widest text-white/60 mb-2">{template.tagline}</div>
                            <p className="text-xs text-slate-300 line-clamp-2">{template.vibe}</p>
                        </button>
                    ))}
                </div>

                <InputGroup label="Creative Director Persona">
                    <TextArea
                        value={am.creative_director || ''}
                        onChange={(val) => setData({ ...data, agency_mode: { ...am, creative_director: val } })}
                        placeholder="Who is leading this project? Define their taste and philosophy."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('agency_mode.creative_director', "Create a persona for a creative director suitable for this project.")}
                        magicLoading={loadingField === 'agency_mode.creative_director'}
                    />
                </InputGroup>
                <InputGroup label="Creative Process Steps">
                    <ArrayBuilder
                        items={am.process || []}
                        onChange={(val) => setData({ ...data, agency_mode: { ...am, process: val } })}
                        placeholder="e.g. Discover, Define, Design, Deploy..."
                    />
                </InputGroup>
                <InputGroup label="Core Values">
                    <ArrayBuilder
                        items={am.values || []}
                        onChange={(val) => setData({ ...data, agency_mode: { ...am, values: val } })}
                        placeholder="e.g. Craft, Originality, Narrative..."
                        quickOptions={QUICK_OPTS_VALUES}
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Project Basics" icon={Bot} defaultOpen={true} id="section-basics">
                <InputGroup label="Project Name">
                    <TextInput
                        value={data.project_name || ''}
                        onChange={(val) => setData({ ...data, project_name: val })}
                        placeholder="e.g. Hearth & Bean"
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Brand Narrative" icon={BookOpen} defaultOpen={false} id="section-narrative">
                <InputGroup label="Brand Essence">
                    <TextInput
                        value={bn.essence || ''}
                        onChange={(val) => setData({ ...data, brand_narrative: { ...bn, essence: val } })}
                        placeholder="e.g. Family-owned café with warm community spirit..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('brand_narrative.essence', "A concise, evocative brand essence statement.")}
                        magicLoading={loadingField === 'brand_narrative.essence'}
                    />
                </InputGroup>
                <InputGroup label="Mission Statement">
                    <TextArea
                        value={bn.mission || ''}
                        onChange={(val) => setData({ ...data, brand_narrative: { ...bn, mission: val } })}
                        placeholder="Why does this exist?"
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('brand_narrative.mission', "A powerful mission statement.")}
                        magicLoading={loadingField === 'brand_narrative.mission'}
                    />
                </InputGroup>
                <div className="h-px bg-glass-border my-6"></div>
                <h3 className="text-slate-200 font-bold mb-4 font-display">The Experience</h3>
                <InputGroup label="Hero / First Impression">
                    <TextInput
                        value={exp.hero || ''}
                        onChange={(val) => setData({ ...data, brand_narrative: { ...bn, experience: { ...exp, hero: val } } })}
                        placeholder="Visual description of the landing area..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('brand_narrative.experience.hero', "A vivid visual description of the website hero section.")}
                        magicLoading={loadingField === 'brand_narrative.experience.hero'}
                    />
                </InputGroup>
                <InputGroup label="Vibe / Atmosphere">
                    <TextInput
                        value={exp.vibe || ''}
                        onChange={(val) => setData({ ...data, brand_narrative: { ...bn, experience: { ...exp, vibe: val } } })}
                        placeholder="e.g. Authentic, cinematic, slow-living..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('brand_narrative.experience.vibe', "3 adjectives describing the atmospheric vibe.")}
                        magicLoading={loadingField === 'brand_narrative.experience.vibe'}
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Target Audience" icon={Users} defaultOpen={false} id="section-audience">
                <InputGroup label="Primary Persona">
                    <TextInput
                        value={ta.primary_persona || ''}
                        onChange={(val) => setData({ ...data, brand_narrative: { ...bn, target_audience: { ...ta, primary_persona: val } } })}
                        placeholder="e.g. Small business owners, 35-55, time-strapped professionals..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('brand_narrative.target_audience.primary_persona', "A detailed target audience persona description.")}
                        magicLoading={loadingField === 'brand_narrative.target_audience.primary_persona'}
                    />
                </InputGroup>
                <InputGroup label="Pain Points">
                    <ArrayBuilder
                        items={ta.pain_points || []}
                        onChange={(val) => setData({ ...data, brand_narrative: { ...bn, target_audience: { ...ta, pain_points: val } } })}
                        placeholder="e.g. Need quick solutions, Budget conscious..."
                    />
                </InputGroup>
                <InputGroup label="Desired Action">
                    <TextInput
                        value={ta.desired_action || ''}
                        onChange={(val) => setData({ ...data, brand_narrative: { ...bn, target_audience: { ...ta, desired_action: val } } })}
                        placeholder="e.g. Book a consultation, Sign up for newsletter..."
                    />
                </InputGroup>
            </AccordionSection>
        </>
    );
}

// =====================================================
// PHASE 02: DESIGN — Content, Visual, Typography, etc.
// =====================================================
export function DesignPhase({ data, setData, loadingField, handleFieldMagic }) {
    const cnt = data.content || {};
    const dsg = data.design || {};
    const typo = dsg.typography || {};
    const img = dsg.imagery || {};
    const ix = dsg.interactions || {};

    return (
        <>
            <AccordionSection title="Content & Copy" icon={MessageSquare} defaultOpen={true} id="section-content">
                <InputGroup label="Headline Style">
                    <TextInput
                        value={cnt.headline_style || ''}
                        onChange={(val) => setData({ ...data, content: { ...cnt, headline_style: val } })}
                        placeholder="e.g. Question-based, empathetic, bold statements..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('content.headline_style', "A description of the headline writing style for this brand.")}
                        magicLoading={loadingField === 'content.headline_style'}
                    />
                </InputGroup>
                <InputGroup label="CTA Examples">
                    <p className="text-xs text-slate-400 mb-2">Example button text and calls-to-action.</p>
                    <ArrayBuilder
                        items={cnt.cta_examples || []}
                        onChange={(val) => setData({ ...data, content: { ...cnt, cta_examples: val } })}
                        placeholder="e.g. Start Your Journey, See How It Works..."
                    />
                </InputGroup>
                <InputGroup label="Tone Examples">
                    <p className="text-xs text-slate-400 mb-2">Sample sentences that capture the brand voice.</p>
                    <ArrayBuilder
                        items={cnt.tone_examples || []}
                        onChange={(val) => setData({ ...data, content: { ...cnt, tone_examples: val } })}
                        placeholder="e.g. We've been in your shoes. No jargon, just results."
                    />
                </InputGroup>
                <InputGroup label="Words to Avoid">
                    <ArrayBuilder
                        items={cnt.avoid_words || []}
                        onChange={(val) => setData({ ...data, content: { ...cnt, avoid_words: val } })}
                        placeholder="e.g. synergy, leverage, cutting-edge..."
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Visual Style & Colors" icon={Palette} defaultOpen={false} id="section-colors">
                <InputGroup label="Overall Style">
                    <TextInput
                        value={dsg.style || ''}
                        onChange={(val) => setData({ ...data, design: { ...dsg, style: val } })}
                        placeholder="e.g. Small-town soul, slow-living aesthetic..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('design.style', "A concise description of the UI design style.")}
                        magicLoading={loadingField === 'design.style'}
                    />
                </InputGroup>
                <div className="bg-acid-500/5 p-4 rounded-lg border border-acid-500/20 mb-4">
                    <label className="block text-sm font-bold text-acid-500 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Visual Mood Board
                    </label>
                    <p className="text-xs text-slate-400 mb-3">Describe visual inspirations as if explaining a mood board to a designer.</p>
                    <ArrayBuilder
                        items={dsg.visual_references || []}
                        onChange={(val) => setData({ ...data, design: { ...dsg, visual_references: val } })}
                        placeholder="e.g. Awwwards trend: 'Authentic Layering'..."
                    />
                </div>
                <InputGroup label="Color Palette">
                    <ArrayBuilder
                        items={dsg.colors || []}
                        onChange={(val) => setData({ ...data, design: { ...dsg, colors: val } })}
                        placeholder="e.g. #4A2C2A, Warm cream, Forest green..."
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Typography" icon={Type} defaultOpen={false} id="section-typography">
                <InputGroup label="Heading Style">
                    <TextInput
                        value={typo.heading_style || ''}
                        onChange={(val) => setData({ ...data, design: { ...dsg, typography: { ...typo, heading_style: val } } })}
                        placeholder="e.g. Bold serif, high contrast, editorial feel..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('design.typography.heading_style', "A description of the heading typography style.")}
                        magicLoading={loadingField === 'design.typography.heading_style'}
                    />
                </InputGroup>
                <InputGroup label="Body Text Style">
                    <TextInput
                        value={typo.body_style || ''}
                        onChange={(val) => setData({ ...data, design: { ...dsg, typography: { ...typo, body_style: val } } })}
                        placeholder="e.g. Clean sans-serif, generous line-height..."
                    />
                </InputGroup>
                <InputGroup label="Font Pairing Vibe">
                    <TextInput
                        value={typo.font_pairing_vibe || ''}
                        onChange={(val) => setData({ ...data, design: { ...dsg, typography: { ...typo, font_pairing_vibe: val } } })}
                        placeholder="e.g. Modern editorial (think: NY Times + Helvetica)..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('design.typography.font_pairing_vibe', "A font pairing suggestion with real-world reference.")}
                        magicLoading={loadingField === 'design.typography.font_pairing_vibe'}
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Imagery Direction" icon={Image} defaultOpen={false} id="section-imagery">
                <InputGroup label="Image Style">
                    <TextInput
                        value={img.style || ''}
                        onChange={(val) => setData({ ...data, design: { ...dsg, imagery: { ...img, style: val } } })}
                        placeholder="e.g. Documentary photography, candid moments..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('design.imagery.style', "A description of the photography/imagery style.")}
                        magicLoading={loadingField === 'design.imagery.style'}
                    />
                </InputGroup>
                <InputGroup label="Image Subjects">
                    <ArrayBuilder
                        items={img.subjects || []}
                        onChange={(val) => setData({ ...data, design: { ...dsg, imagery: { ...img, subjects: val } } })}
                        placeholder="e.g. Real people working, Hands-on craftsmanship..."
                    />
                </InputGroup>
                <InputGroup label="Imagery to Avoid">
                    <ArrayBuilder
                        items={img.avoid || []}
                        onChange={(val) => setData({ ...data, design: { ...dsg, imagery: { ...img, avoid: val } } })}
                        placeholder="e.g. Stock photo smiles, Blue corporate tones..."
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Interactions & Motion" icon={MousePointer} defaultOpen={false} id="section-interactions">
                <InputGroup label="Hover Style">
                    <TextInput
                        value={ix.hover_style || ''}
                        onChange={(val) => setData({ ...data, design: { ...dsg, interactions: { ...ix, hover_style: val } } })}
                        placeholder="e.g. Subtle lift with soft shadow..."
                    />
                </InputGroup>
                <InputGroup label="Transition Timing">
                    <TextInput
                        value={ix.transitions || ''}
                        onChange={(val) => setData({ ...data, design: { ...dsg, interactions: { ...ix, transitions: val } } })}
                        placeholder="e.g. 200ms ease-out, smooth not bouncy..."
                    />
                </InputGroup>
                <InputGroup label="Effects & Animations">
                    <ArrayBuilder
                        items={ix.effects || []}
                        onChange={(val) => setData({ ...data, design: { ...dsg, interactions: { ...ix, effects: val } } })}
                        placeholder="e.g. Gentle parallax, Fade-in on scroll..."
                        quickOptions={QUICK_OPTS_INTERACTIONS}
                    />
                </InputGroup>
                <InputGroup label="Microinteractions">
                    <ArrayBuilder
                        items={ix.microinteractions || []}
                        onChange={(val) => setData({ ...data, design: { ...dsg, interactions: { ...ix, microinteractions: val } } })}
                        placeholder="e.g. Button press feedback, Form validation..."
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Pages (Sitemap)" icon={Palette} defaultOpen={false} id="section-pages">
                <InputGroup label="Pages">
                    <p className="text-xs text-slate-400 mb-2">List pages with key sections, e.g., "Home: Hero, Features, Testimonials, CTA"</p>
                    <ArrayBuilder
                        items={dsg.pages || []}
                        onChange={(val) => setData({ ...data, design: { ...dsg, pages: val } })}
                        placeholder="e.g. Home: Hero, Features grid, Testimonials..."
                    />
                </InputGroup>
            </AccordionSection>
        </>
    );
}

// =====================================================
// PHASE 03: RULES — Tech, Constraints, QA, Open Questions
// =====================================================
export function RulesPhase({ data, setData, loadingField, handleFieldMagic, handleQuestionJump }) {
    const tech = data.tech || {};
    const resp = tech.responsive || {};
    const outf = tech.output_format || {};
    const con = data.constraints || {};
    const qa = data.quality_assurance || {};

    return (
        <>
            <AccordionSection title="Technology Stack" icon={Cpu} defaultOpen={true} id="section-tech">
                <InputGroup label="Platform / Framework">
                    <TextInput
                        value={tech.framework || ''}
                        onChange={(val) => setData({ ...data, tech: { ...tech, framework: val } })}
                        placeholder="e.g. Next.js, Wordpress, Webflow..."
                        hasMagic={true}
                        onMagic={() => handleFieldMagic('tech.framework', "Recommended tech stack framework.")}
                        magicLoading={loadingField === 'tech.framework'}
                    />
                    <QuickChips options={["Next.js", "React", "Vue", "Svelte", "HTML/CSS/JS"]} onSelect={(val) => setData({ ...data, tech: { ...tech, framework: val } })} />
                </InputGroup>
                <InputGroup label="Technical Requirements">
                    <ArrayBuilder
                        items={tech.requirements || []}
                        onChange={(val) => setData({ ...data, tech: { ...tech, requirements: val } })}
                        placeholder="e.g. SSG, PWA support, Core Web Vitals..."
                        quickOptions={QUICK_OPTS_TECH}
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Responsive Design" icon={Smartphone} defaultOpen={false}>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-glass-border mb-4">
                    <div>
                        <div className="font-bold text-slate-200">Mobile-First Approach</div>
                        <div className="text-xs text-slate-500">Design for mobile first, then scale up.</div>
                    </div>
                    <button
                        onClick={() => setData({ ...data, tech: { ...tech, responsive: { ...resp, approach: resp.approach === 'mobile-first' ? 'desktop-first' : 'mobile-first' } } })}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${resp.approach === 'mobile-first' ? 'bg-acid-500 text-obsidian-900' : 'bg-slate-700 text-slate-300'}`}
                    >
                        {resp.approach === 'mobile-first' ? 'MOBILE-FIRST' : 'DESKTOP-FIRST'}
                    </button>
                </div>
                <InputGroup label="Mobile Considerations">
                    <ArrayBuilder
                        items={resp.mobile_considerations || []}
                        onChange={(val) => setData({ ...data, tech: { ...tech, responsive: { ...resp, mobile_considerations: val } } })}
                        placeholder="e.g. Touch-friendly buttons, Collapsible nav..."
                        quickOptions={QUICK_OPTS_RESPONSIVE}
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Output Format" icon={FileCode} defaultOpen={false}>
                <InputGroup label="Structure">
                    <TextInput
                        value={outf.structure || ''}
                        onChange={(val) => setData({ ...data, tech: { ...tech, output_format: { ...outf, structure: val } } })}
                        placeholder="e.g. Single page application, Multi-page site..."
                    />
                    <QuickChips
                        options={["Single page", "Multi-page", "Component library", "Landing page"]}
                        onSelect={(val) => setData({ ...data, tech: { ...tech, output_format: { ...outf, structure: val } } })}
                    />
                </InputGroup>
                <InputGroup label="Component Style">
                    <TextInput
                        value={outf.component_style || ''}
                        onChange={(val) => setData({ ...data, tech: { ...tech, output_format: { ...outf, component_style: val } } })}
                        placeholder="e.g. Functional React with Tailwind classes..."
                    />
                </InputGroup>
                <InputGroup label="Output Should Include">
                    <ArrayBuilder
                        items={outf.include || []}
                        onChange={(val) => setData({ ...data, tech: { ...tech, output_format: { ...outf, include: val } } })}
                        placeholder="e.g. Responsive breakpoints..."
                        quickOptions={QUICK_OPTS_OUTPUT_INCLUDE}
                    />
                </InputGroup>
                <InputGroup label="Output Should Exclude">
                    <ArrayBuilder
                        items={outf.exclude || []}
                        onChange={(val) => setData({ ...data, tech: { ...tech, output_format: { ...outf, exclude: val } } })}
                        placeholder="e.g. Backend logic..."
                        quickOptions={QUICK_OPTS_OUTPUT_EXCLUDE}
                    />
                </InputGroup>
            </AccordionSection>

            <AccordionSection title="Constraints & Limits" icon={Ban} defaultOpen={false} id="section-constraints">
                <p className="text-sm text-slate-400 mb-6 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                    🚫 Explicit constraints help prevent common AI patterns and generic outputs.
                </p>
                <InputGroup label="Forbidden Patterns">
                    <ArrayBuilder
                        items={con.forbidden_patterns || []}
                        onChange={(val) => setData({ ...data, constraints: { ...con, forbidden_patterns: val } })}
                        placeholder="e.g. Gradient backgrounds on every section..."
                        quickOptions={QUICK_OPTS_FORBIDDEN}
                    />
                </InputGroup>
                <InputGroup label="Forbidden Components">
                    <ArrayBuilder
                        items={con.forbidden_components || []}
                        onChange={(val) => setData({ ...data, constraints: { ...con, forbidden_components: val } })}
                        placeholder="e.g. Cookie banners, Newsletter popups..."
                    />
                </InputGroup>
                <div className="h-px bg-glass-border my-6"></div>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Max Colors">
                        <div className="flex items-center gap-3">
                            <input
                                type="range" min="2" max="8"
                                value={con.max_colors ?? 4}
                                onChange={(e) => setData({ ...data, constraints: { ...con, max_colors: parseInt(e.target.value) } })}
                                className="flex-1 accent-acid-500"
                            />
                            <span className="w-8 text-center font-mono text-acid-500 font-bold">{con.max_colors ?? 4}</span>
                        </div>
                    </InputGroup>
                    <InputGroup label="Max Fonts">
                        <div className="flex items-center gap-3">
                            <input
                                type="range" min="1" max="4"
                                value={con.max_fonts ?? 2}
                                onChange={(e) => setData({ ...data, constraints: { ...con, max_fonts: parseInt(e.target.value) } })}
                                className="flex-1 accent-acid-500"
                            />
                            <span className="w-8 text-center font-mono text-acid-500 font-bold">{con.max_fonts ?? 2}</span>
                        </div>
                    </InputGroup>
                </div>
            </AccordionSection>

            <AccordionSection title="Quality Assurance" icon={ListChecks} defaultOpen={false} id="section-qa">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-glass-border mb-6">
                    <div>
                        <div className="font-bold text-slate-200 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-acid-500" />
                            Include Design Rationale
                        </div>
                        <div className="text-xs text-slate-500">Force the AI to explain 'why' before coding.</div>
                    </div>
                    <button
                        onClick={() => setData({ ...data, quality_assurance: { ...qa, include_rationale: !qa.include_rationale } })}
                        role="switch"
                        aria-checked={qa.include_rationale}
                        className={`w-12 h-6 rounded-full transition-colors relative ${qa.include_rationale ? 'bg-acid-500' : 'bg-slate-700'}`}
                    >
                        <div className={`w-4 h-4 bg-obsidian-900 rounded-full absolute top-1 transition-all ${qa.include_rationale ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
                <InputGroup label="Visual Criteria">
                    <ArrayBuilder
                        items={qa.visual || []}
                        onChange={(val) => setData({ ...data, quality_assurance: { ...qa, visual: val } })}
                        placeholder="e.g. Typography hierarchy is clear..."
                    />
                </InputGroup>
                <InputGroup label="UX Criteria">
                    <ArrayBuilder
                        items={qa.ux || []}
                        onChange={(val) => setData({ ...data, quality_assurance: { ...qa, ux: val } })}
                        placeholder="e.g. Primary CTA visible without scroll..."
                    />
                </InputGroup>
                <InputGroup label="Performance Criteria">
                    <ArrayBuilder
                        items={qa.performance || []}
                        onChange={(val) => setData({ ...data, quality_assurance: { ...qa, performance: val } })}
                        placeholder="e.g. No layout shift on load..."
                    />
                </InputGroup>
                <InputGroup label="Brand Criteria">
                    <ArrayBuilder
                        items={qa.brand || []}
                        onChange={(val) => setData({ ...data, quality_assurance: { ...qa, brand: val } })}
                        placeholder="e.g. Matches the vibe described..."
                    />
                </InputGroup>
            </AccordionSection>

            {/* Open Questions — Enhanced UX */}
            {data.open_questions?.length > 0 && (
                <AccordionSection title={`Open Questions (${data.open_questions.length})`} icon={HelpCircle} defaultOpen={true} className="border-yellow-500/20">
                    <p className="text-xs text-slate-400 mb-4">Clarifications needed. Click "Jump" to navigate to the relevant section.</p>
                    <div className="space-y-3">
                        {data.open_questions.map((q, i) => (
                            <div key={i} className="flex gap-3 items-center p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                                <span className="text-yellow-500 font-bold shrink-0">?</span>
                                <p className="text-sm text-slate-300 flex-1">{q}</p>
                                <button
                                    onClick={() => handleQuestionJump(q)}
                                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 rounded hover:bg-yellow-500/20 transition-colors"
                                >
                                    Jump <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </AccordionSection>
            )}
        </>
    );
}

// =====================================================
// PHASE 04: COMPILE — Review & Export
// =====================================================
export function CompilePhase({ data, validationStatus, isCompiling, compileSuccess, handleCompileBrief, handleCopyJSON, downloadJSON, handleMagicGenerate, setActiveTab }) {

    const summaryCards = [
        {
            label: 'INIT',
            phase: 'init',
            items: [
                { k: 'Project', v: data.project_name },
                { k: 'Studio', v: data.agency_mode?.studio_name },
                { k: 'Essence', v: data.brand_narrative?.essence },
                { k: 'Persona', v: data.brand_narrative?.target_audience?.primary_persona },
            ]
        },
        {
            label: 'DESIGN',
            phase: 'design',
            items: [
                { k: 'Style', v: data.design?.style },
                { k: 'Colors', v: data.design?.colors?.length ? `${data.design.colors.length} defined` : '' },
                { k: 'Headings', v: data.design?.typography?.heading_style },
                { k: 'Pages', v: data.design?.pages?.length ? `${data.design.pages.length} pages` : '' },
            ]
        },
        {
            label: 'RULES',
            phase: 'rules',
            items: [
                { k: 'Framework', v: data.tech?.framework },
                { k: 'Max Colors', v: data.constraints?.max_colors?.toString() },
                { k: 'Max Fonts', v: data.constraints?.max_fonts?.toString() },
                {
                    k: 'QA Checks', v: [
                        ...(data.quality_assurance?.visual || []),
                        ...(data.quality_assurance?.ux || []),
                    ].length ? `${[...(data.quality_assurance?.visual || []), ...(data.quality_assurance?.ux || [])].length} criteria` : ''
                },
            ]
        },
    ];

    const statusConfig = {
        passing: { label: 'VALID', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
        needs_repair: { label: 'NEEDS REPAIR', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
        failed: { label: 'FAILED', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    };
    const status = statusConfig[validationStatus] || statusConfig.passing;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center py-6">
                <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">Compile & Export</h2>
                <p className="text-sm text-slate-400">Review your brief summary, validate, and export.</p>
            </div>

            {/* Validation Status */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${status.bg} ${status.border}`}>
                <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-slate-400" />
                    <div>
                        <div className="text-sm font-bold text-white">Schema Validation</div>
                        <div className="text-xs text-slate-400">v{data.schema_version || '2.0.0'}</div>
                    </div>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                </span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {summaryCards.map((card) => (
                    <button
                        key={card.label}
                        onClick={() => setActiveTab(card.phase)}
                        className="text-left p-4 rounded-xl border border-glass-border bg-white/[0.02] hover:bg-white/[0.05] transition-all group phase-card-interactive"
                    >
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-acid-500 mb-3">{card.label}</div>
                        <div className="space-y-2">
                            {card.items.map((item) => (
                                <div key={item.k} className="flex justify-between text-xs">
                                    <span className="text-slate-500">{item.k}</span>
                                    <span className={`text-right truncate max-w-[60%] ${item.v ? 'text-slate-200' : 'text-slate-600 italic'}`}>
                                        {item.v || 'Not set'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </button>
                ))}
            </div>

            {/* Open Questions Warning */}
            {data.open_questions?.length > 0 && (
                <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                    <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold text-yellow-400">{data.open_questions.length} Open Questions</span>
                    </div>
                    <p className="text-xs text-slate-400">Resolve open questions in the RULES phase for a more complete brief.</p>
                </div>
            )}

            {/* Compile Button */}
            <div className="space-y-3">
                {isCompiling && (
                    <div className="relative h-2 rounded-full bg-obsidian-800 overflow-hidden">
                        <div className="absolute inset-0 h-full bg-acid-500 rounded-full compile-progress-bar"></div>
                    </div>
                )}

                <button
                    onClick={handleCompileBrief}
                    disabled={isCompiling}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${compileSuccess
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : isCompiling
                            ? 'bg-acid-500/20 text-acid-500 border border-acid-500/30 cursor-wait'
                            : 'bg-acid-500 hover:bg-acid-400 text-obsidian-900 shadow-glow'
                        }`}
                >
                    {compileSuccess ? (
                        <><Check className="w-5 h-5" /> Brief Compiled!</>
                    ) : isCompiling ? (
                        <><Rocket className="w-5 h-5 animate-bounce" /> Compiling...</>
                    ) : (
                        <><Rocket className="w-5 h-5" /> Compile Brief</>
                    )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleCopyJSON}
                        className="flex items-center justify-center gap-2 p-3 rounded-lg border border-glass-border bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 text-sm font-medium transition-colors"
                    >
                        <Copy className="w-4 h-4" /> Copy JSON
                    </button>
                    <button
                        onClick={downloadJSON}
                        className="flex items-center justify-center gap-2 p-3 rounded-lg border border-glass-border bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 text-sm font-medium transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download .json
                    </button>
                </div>
            </div>
        </div>
    );
}
