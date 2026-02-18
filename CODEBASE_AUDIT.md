# 🔍 Codebase Deep Dive

## 🧩 1️⃣ Codebase Structure (Critical)

Your codebase is a **Single-Page React App** where 90% of the logic lives in one "God Component".

### **File Tree**
```text
/src
├── components/
│   ├── features/
│   │   ├── ImageAnalyzer.jsx       # 👁️ Visual Reverse Engineering Logic
│   │   ├── MobileJsonModal.jsx
│   │   └── StrengthMeter.jsx       # 📊 Progress Bar Logic
│   ├── layout/
│   │   ├── MobileHeader.jsx
│   │   └── Sidebar.jsx             # 🗂️ Navigation & Actions
│   └── ui/
│       ├── ArrayBuilder.jsx        # 🧱 Reusable List Input
│       ├── InputGroup/TextInput/TextArea.jsx
│       └── ...
├── data/
│   └── constants.js                # 📄 Templates & Dropdown Options
├── hooks/
│   └── useGemini.js                # 🧠 API Logic
└── website-json-generator.jsx      # 👑 THE GOD COMPONENT
```

### **Critical Locations**
*   **Prompt Template**: **Embedded directly** in `website-json-generator.jsx` (Lines 243-326 & 386-476).
*   **Gemini Call**: Isolated in `src/hooks/useGemini.js`.
*   **State Definition**: Hardcoded initial state in `website-json-generator.jsx` (Lines 87-160).
*   **JSON.parse**:
    *   Line 330 (Magic Generation)
    *   Line 480 (Image Analysis)
    *   Line 167 (LocalStorage Hydration)
*   **Markdown Assembly**: `copyToClipboard` function inside `website-json-generator.jsx` (Lines 493-579).

**Verdict**: The prompt logic **is tangled in the UI component**. It is **not abstracted**. To evolve the prompt, you essentially have to edit the main view controller.

---

## 🧠 2️⃣ The Exact Gemini Call Code

It uses the **REST API** via `fetch`, not the Google Node.js SDK.

**File:** `src/hooks/useGemini.js`

```javascript
const useGemini = (apiKey) => {
    const callGemini = async (prompt, imageBase64 = null, retries = 3) => {
        if (!apiKey) throw new Error("API key not configured...");

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        // 1. Payload Construction
        const parts = [{ text: prompt }];
        if (imageBase64) {
            parts.push({
                inlineData: { mimeType: "image/png", data: imageBase64 }
            });
        }

        const payload = { contents: [{ parts }] };

        // 2. Retry Logic & Fetch
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                // 3. Extraction (Note: No safety checks on 'candidates' existence)
                return result.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch (e) {
                if (i === retries - 1) throw e;
                await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
            }
        }
    };
    return { callGemini };
};
```

---

## 🧬 3️⃣ The Current State Shape (Actual Type)

There is **NO TypeScript interface**. The schema is defined solely by this initial state object. If the AI adds fields not listed here, they exist in state but the UI ignores them.

**File:** `website-json-generator.jsx`

```javascript
const [data, setData] = useState({
    agency_mode: {
        studio_name: "",
        creative_director: "",
        process: [],
        values: []
    },
    project_name: "",
    brand_narrative: {
        essence: "",
        mission: "",
        experience: { hero: "", vibe: "" },
        target_audience: {
            primary_persona: "",
            pain_points: [],
            desired_action: ""
        }
    },
    content: {
        headline_style: "",
        cta_examples: [],
        tone_examples: [],
        avoid_words: []
    },
    design: {
        style: "",
        visual_references: [],
        colors: [],
        typography: {
            heading_style: "",
            body_style: "",
            font_pairing_vibe: ""
        },
        imagery: {
            style: "",
            subjects: [],
            avoid: []
        },
        interactions: {
            effects: [],
            hover_style: "",
            transitions: "",
            microinteractions: []
        },
        pages: []
    },
    tech: {
        framework: "",
        requirements: [],
        responsive: {
            approach: "mobile-first",
            mobile_considerations: []
        },
        output_format: {
            structure: "Single page application",
            component_style: "",
            include: [],
            exclude: []
        }
    },
    constraints: {
        forbidden_patterns: [],
        forbidden_components: [],
        max_colors: 4,
        max_fonts: 2
    },
    quality_assurance: {
        visual: [],
        ux: [],
        performance: [],
        brand: [],
        include_rationale: true
    }
});
```

---

## 🧱 4️⃣ How UI Binds to JSON

The UI is **strictly coupled** to the schema. It does **not** dynamically render keys.

**Example Binding:**
```javascript
<TextInput
    value={data.brand_narrative.target_audience.primary_persona}
    onChange={(val) => setData({ 
        ...data, 
        brand_narrative: { 
            ...data.brand_narrative, 
            target_audience: { 
                ...data.brand_narrative.target_audience, 
                primary_persona: val 
            } 
        } 
    })}
/>
```

**Risk**: If we change the prompt to return `target_audience.persona` instead of `target_audience.primary_persona`, **the UI will show a blank field**, even if the data exists in the JSON object.

---

## 💾 5️⃣ localStorage Strategy

**Key Name:** `'studio-brief'`

**Logic:**
1.  **On Mount**:
    ```javascript
    const saved = localStorage.getItem('studio-brief');
    if (saved) {
        // ⚠️ DANGER: Replaces entire state with whatever is in storage.
        // No version check. No partial merge.
        setData(JSON.parse(saved));
    }
    ```
2.  **On Change**:
    ```javascript
    localStorage.setItem('studio-brief', JSON.stringify(data));
    ```

**Risk**: If we rename a field in the initial state, returning users will load their *old* state from localStorage, and the new field will be missing (undefined), potentially crashing components that expect it to exist.

---

## 🛠 6️⃣ Deployment Environment

*   **Type**: Pure Client-Side SPA (Vite).
*   **Security**: **Low**. The API key is in `import.meta.env.VITE_GEMINI_API_KEY`. It is visible to anyone who inspects the network traffic or the bundled JS.
*   **Proxy**: None. Calls Google directly.
*   **Usage**: Intended for local/personal use (or a protected internal tool).

---

## 🚨 Critical Upgrade Warnings

1.  **State Migration is Mandatory**: If we change the schema, we MUST add a `schema_version` to the state and write a migration function to run on load. Otherwise, we will break the app for you immediately.
2.  **Prompt > UI Coupling**: We cannot just "optimize" the prompt. If the prompt output drifts from the React State shape, the UI will stop working. We must update them in lockstep.
3.  **Refactoring Opportunity**: The prompt template needs to be moved out of the UI component into a separate file (`src/prompts/studioBrief.js`) so we can version it independently.

---

## 🎯 7️⃣ Your True Goal

This one matters most.

Choose which one this is:

B. Serious internal tool

---

## 🧪 8️⃣ Known Pain Points

Tell me:

* What currently annoys you most? Lack of order and flow when using the tool. There are a lot of fields and sections that make it feel overwhelming and disorganized.
* Where does it break? It breaks when the idea is too vague. The AI will make up random things to fill in the blanks.
* Where does it feel fragile? It feels fragile when trying to choose what Agency Mode to select. 
* What feels “hacky”? The two AI powered features "Magic Brief" and AI Visual Analysis feel like they were just tacked on and don't integrate well with the rest of the tool.
 
---

## 🧭 9️⃣ Boundaries

Tell me:

* Do you want multi-model support? Lets start with Gemini for now.
* Do you want backend? Yes
* Do you want version migrations? Yes
* Do you want schema enforcement? Yes
* Do you want multi-pass generation? if this necessary
* Do you want this to become infra-grade? no

---

