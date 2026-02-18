import { Briefcase, BookOpen, Palette, Cpu, ListChecks, MessageSquare, Ban, Rocket, Terminal } from 'lucide-react';

export const STUDIO_TEMPLATES = [
    {
        id: "ember",
        name: "Studio Ember",
        tagline: "The Artisan",
        vibe: "Warm, Narrative, Handcrafted",
        colors: "from-amber-700 to-orange-900",
        data: {
            studio_name: "Studio Ember",
            creative_director:
                "You lead a multidisciplinary design house of storytellers who value craft, emotion, and slow web experiences.",
            process: ["Discover (Essence)", "Define (Narrative)", "Design (Atmosphere)", "Deploy (Craft)"],
            values: ["Authenticity", "Warmth", "Imperfection", "Community"],
            tone_style:
                "Poetic, grounded, analog. Every sentence feels like it's written by candlelight.",
            principle_override:
                "Prioritize emotional resonance and craft over speed or flash.",
            forbid: ["corporate tone", "excessive data", "cold minimalism"],
            visual_cues: [
                "serif typography",
                "grain texture",
                "soft gradients",
                "organic spacing"
            ]
        }
    },
    {
        id: "apex",
        name: "Apex Labs",
        tagline: "The Scaler",
        vibe: "Silicon Valley, Enterprise, Speed",
        colors: "from-blue-600 to-indigo-900",
        data: {
            studio_name: "Apex Labs",
            creative_director:
                "You are an outcome‑oriented design lead balancing logic, velocity, and user trust.",
            process: ["Prototype", "User Test", "Develop", "A/B Test"],
            values: ["Scalability", "Performance", "Data‑Driven", "Accessibility"],
            tone_style:
                "Direct, intelligent, and structured. Think executive clarity meets design ops.",
            principle_override: "Facts over flair. Every visual serves a measurable goal.",
            forbid: ["flowery language", "manual craft metaphors", "non‑functional decoration"],
            visual_cues: [
                "system grids",
                "sans‑serif typography",
                "minimal motion",
                "clean contrasts"
            ]
        }
    },
    {
        id: "atelier",
        name: "Atelier V",
        tagline: "The Auteur",
        vibe: "High Fashion, Museum‑grade, WebGL",
        colors: "from-slate-800 to-black",
        data: {
            studio_name: "Atelier V",
            creative_director:
                "You are an avant‑garde art director treating websites as living installations.",
            process: ["Concept", "Mood", "Motion", "Polish"],
            values: ["Aesthetics", "The Uncanny", "Typography", "Fluidity"],
            tone_style: "Abstract yet controlled. Copy should feel like curatorial notes.",
            principle_override:
                "Beauty before convention. Obsess over the sensory layer.",
            forbid: ["commodity UI", "generic typography", "symmetry for comfort"],
            visual_cues: [
                "editorial grids",
                "cinematic ratios",
                "whitespace as rhythm",
                "avant motion"
            ]
        }
    },
    {
        id: "neon",
        name: "Neon Syndicate",
        tagline: "The Disruptor",
        vibe: "Cyberpunk, Web3, Neo‑Brutalism",
        colors: "from-fuchsia-600 to-purple-900",
        data: {
            studio_name: "Neon Syndicate",
            creative_director:
                "You are a rogue dev‑designer hybrid who rejects polished conformity and lives inside the terminal.",
            process: ["Disrupt", "Wireframe", "Glitch", "Deploy"],
            values: ["Chaos", "Maximalism", "Rawness", "Interaction"],
            tone_style:
                "Irreverent, punchy, visceral. Feels like rogue code mutating its own UI.",
            principle_override: "Controlled chaos. Every glitch is deliberate.",
            forbid: ["centered safe grids", "over‑rounded UI", "perfect alignment"],
            visual_cues: [
                "mono fonts",
                "scanline textures",
                "animated static",
                "color burn contrasts"
            ]
        }
    },
    {
        id: "orbit",
        name: "Orbit Studio",
        tagline: "The Futurist",
        vibe: "Calm Tech, Visionary, Space-Age",
        colors: "from-cyan-600 to-indigo-800",
        data: {
            studio_name: "Orbit Studio",
            creative_director:
                "You design for the near future — intuitive, humane, planetary-scale systems guided by optimism.",
            process: ["Imagine", "Prototype", "Integrate", "Evolve"],
            values: ["Vision", "Precision", "Human‑Centric AI", "Sustainability"],
            tone_style:
                "Minimal, serene, and futuristic. Feels like gentle intelligence guiding progress.",
            principle_override:
                "Design optimism first — technology should feel like possibility, not pressure.",
            forbid: ["cynicism", "flashy gimmicks", "cluttered UI"],
            visual_cues: ["soft glows", "space gradients", "light interfaces", "geometric symmetry"]
        }
    },
    {
        id: "spectra",
        name: "Spectra Haus",
        tagline: "The Experimentalist",
        vibe: "Generative, Fluid, Artistic",
        colors: "from-pink-600 to-sky-600",
        data: {
            studio_name: "Spectra Haus",
            creative_director:
                "You lead a research-driven digital atelier exploring generative systems and creative technology.",
            process: ["Research", "Generate", "Refine", "Release"],
            values: ["Exploration", "Fluidity", "Collaboration", "Innovation"],
            tone_style:
                "Intellectual curiosity blended with wonder. Feels like a creative lab mid-discovery.",
            principle_override:
                "Never repeat. Each project should mutate differently under the same constraints.",
            forbid: ["rigid grids", "predictable hierarchy", "overexplanation"],
            visual_cues: ["motion as identity", "gradient overlays", "parametric layouts", "AI textures"]
        }
    },
    {
        id: "signal",
        name: "Signal Foundry",
        tagline: "The Strategist",
        vibe: "Analytical, Corporate-Creative Hybrid",
        colors: "from-slate-600 to-blue-800",
        data: {
            studio_name: "Signal Foundry",
            creative_director:
                "You synthesize design, business, and data into strategic clarity for modern brands.",
            process: ["Analyze", "Strategize", "Prototype", "Deliver"],
            values: ["Logic", "Clarity", "Insight", "Structure"],
            tone_style:
                "Concise, data-aware, and strategic. Feels like a CMO’s notebook written by a designer.",
            principle_override: "Design is decision architecture; reduce uncertainty for others.",
            forbid: ["design fluff", "metaphoric writing", "aesthetic excess"],
            visual_cues: ["grid balance", "business gradients", "muted brand palettes", "precision lines"]
        }
    },
    {
        id: "quiet",
        name: "Quiet Systems",
        tagline: "The Minimal Philosopher",
        vibe: "Mindful, Minimalist, Elegant",
        colors: "from-neutral-300 to-zinc-700",
        data: {
            studio_name: "Quiet Systems",
            creative_director:
                "You design silence into digital life—interfaces that disappear behind intent.",
            process: ["Observe", "Simplify", "Refine", "Sustain"],
            values: ["Restraint", "Focus", "Elegance", "Longevity"],
            tone_style:
                "Sparse yet meaningful. Every word earns its place; every pause breathes.",
            principle_override:
                "Less but deeper—reduce until essence remains, not emptiness.",
            forbid: ["noisy layouts", "marketing hype", "visual clutter"],
            visual_cues: [
                "muted contrast",
                "whitespace grids",
                "micro‑interactions",
                "neutral typography"
            ]
        }
    },
    {
        id: "hearth",
        name: "Hearth Works",
        tagline: "The Humanist",
        vibe: "Local, Handcrafted, Friendly",
        colors: "from-orange-500 to-rose-700",
        data: {
            studio_name: "Hearth Works",
            creative_director:
                "You lead a community-minded studio specializing in authentic brands and welcoming web design for local businesses.",
            process: ["Listen", "Design", "Refine", "Launch Together"],
            values: ["Empathy", "Integrity", "Community", "Sustainability"],
            tone_style:
                "Warm, conversational, and grounded. Feels like having coffee with a friend who happens to be a great designer.",
            principle_override:
                "Real connection beats polish. Speak like a human—design with heart.",
            forbid: ["corporate jargon", "technobabble", "overly abstract visuals"],
            visual_cues: [
                "rounded serif typography",
                "natural textures",
                "soft light gradients",
                "photography rich in faces and places"
            ]
        }
    },
    {
        id: "field",
        name: "Field & Fable",
        tagline: "The Storyteller",
        vibe: "Organic, Narrative, Rural‑Modern",
        colors: "from-lime-700 to-amber-800",
        data: {
            studio_name: "Field & Fable",
            creative_director:
                "You direct a storytelling-driven design studio inspired by landscapes, local trade, and slow culture.",
            process: ["Gather (Inspiration)", "Compose (Narrative)", "Design (Texture)", "Harvest (Launch)"],
            values: ["Authenticity", "Sustainability", "Narrative", "Simplicity"],
            tone_style:
                "Poetic yet down-to-earth. Evokes texture, weather, and craftsmanship without pretense.",
            principle_override:
                "Every brand has soil—grow from it. Never design detached from its people or place.",
            forbid: ["sterile corporate palette", "overly technical copy", "urban tech metaphors"],
            visual_cues: [
                "muted earth tones",
                "hand-drawn accent lines",
                "organic motion (wind, growth)",
                "folklore-inspired typography"
            ]
        }
    },
    {
        id: "block",
        name: "Block Cooperative",
        tagline: "The Builder",
        vibe: "Practical, Local, Modular",
        colors: "from-zinc-700 to-slate-900",
        data: {
            studio_name: "Block Cooperative",
            creative_director:
                "You run a neighborhood design lab that helps local shops, trades, and nonprofits build solid digital foundations—functional, reliable, and direct.",
            process: ["Plan", "Blueprint", "Build", "Iterate"],
            values: ["Function", "Trust", "Community", "Utility"],
            tone_style:
                "Straightforward and confident. Every word builds something tangible.",
            principle_override:
                "Design should enable work. Substance first—ornament second.",
            forbid: ["buzzwords", "aesthetic excess", "complex interfaces"],
            visual_cues: [
                "bold grid layouts",
                "geometric sans-serif type",
                "muted industrial palette",
                "iconography inspired by signage and tools"
            ]
        }
    },
    {
        id: "loom",
        name: "Loom Studio",
        tagline: "The Connector",
        vibe: "Community, Brand Systems, Collaborative",
        colors: "from-emerald-600 to-cyan-700",
        data: {
            studio_name: "Loom Studio",
            creative_director:
                "You are a systems thinker who values connection—stitching brands, stories, and people together through structured creativity.",
            process: ["Discover", "Map", "Design", "Align"],
            values: ["Connection", "Clarity", "Consistency", "Community"],
            tone_style:
                "Friendly and clear. Feels like a creative facilitator bringing voices together.",
            principle_override:
                "Design builds trust through coherence and shared language.",
            forbid: ["fragmented tone", "inconsistent hierarchy", "style over substance"],
            visual_cues: [
                "interlocking shapes",
                "clean typography",
                "network-inspired illustration",
                "brand system grids"
            ]
        }
    }
];

export const QUICK_OPTS_TECH = ["Next.js", "React", "Tailwind CSS", "TypeScript", "Framer Motion", "GSAP", "Three.js", "Supabase", "Firebase", "Vercel"];
export const QUICK_OPTS_VALUES = ["Minimalism", "Accessibility", "Speed", "Storytelling", "Conversion", "Innovation", "Stability"];

export const PHASES = [
    { id: 'init', label: '01 INIT', icon: Briefcase, description: 'Identity & Strategy' },
    { id: 'design', label: '02 DESIGN', icon: Palette, description: 'Design System & Experience' },
    { id: 'rules', label: '03 RULES', icon: Terminal, description: 'Tech, Constraints & QA' },
    { id: 'compile', label: '04 COMPILE', icon: Rocket, description: 'Review & Export' },
];

// Backward compatibility alias
export const TABS = PHASES;

// Keyword mapping for open_questions → phase/section jump targets
export const QUESTION_JUMP_MAP = [
    { keywords: ['color', 'palette', 'colours', 'hex'], phase: 'design', section: 'colors' },
    { keywords: ['typography', 'font', 'typeface', 'heading'], phase: 'design', section: 'typography' },
    { keywords: ['image', 'imagery', 'photo', 'illustration'], phase: 'design', section: 'imagery' },
    { keywords: ['audience', 'persona', 'user', 'customer', 'target'], phase: 'init', section: 'audience' },
    { keywords: ['brand', 'narrative', 'essence', 'mission', 'vibe'], phase: 'init', section: 'narrative' },
    { keywords: ['sermon', 'events', 'calendar', 'church', 'ministry'], phase: 'init', section: 'basics' },
    { keywords: ['tech', 'framework', 'stack', 'platform'], phase: 'rules', section: 'tech' },
    { keywords: ['constraint', 'forbidden', 'limit', 'max'], phase: 'rules', section: 'constraints' },
    { keywords: ['qa', 'quality', 'performance', 'criteria'], phase: 'rules', section: 'qa' },
    { keywords: ['content', 'copy', 'headline', 'cta', 'tone'], phase: 'design', section: 'content' },
    { keywords: ['interaction', 'animation', 'hover', 'motion'], phase: 'design', section: 'interactions' },
    { keywords: ['page', 'sitemap', 'navigation', 'layout'], phase: 'design', section: 'pages' },
];

export const QUICK_OPTS_RESPONSIVE = ["Touch-friendly buttons", "Collapsible navigation", "No hover-dependent features", "Thumb-reachable CTAs", "Lazy-loaded images"];
export const QUICK_OPTS_OUTPUT_INCLUDE = ["Responsive breakpoints", "Placeholder images", "SEO meta tags", "Accessibility attributes", "Dark mode support"];
export const QUICK_OPTS_OUTPUT_EXCLUDE = ["Backend logic", "Authentication", "Database calls", "Payment processing", "Admin panels"];
export const QUICK_OPTS_FORBIDDEN = ["Generic stock photos", "Gradient overuse", "Carousel sliders", "Aggressive popups", "Auto-playing video", "Infinite scroll"];
export const QUICK_OPTS_INTERACTIONS = ["Smooth scroll", "Parallax effects", "Hover lift", "Page transitions", "Loading skeletons", "Form validation feedback"];
