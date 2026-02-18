# System Analysis: JSON Generation Engine

## 🔎 1. System Architecture Overview

**Full System Architecture**

This application is a **Client-Side React Application** that acts as a specialized "Prompt Engineering IDE". Its primary function is to use AI (Google Gemini) to generate a highly detailed, structured "Design Brief" (JSON), which is then used as a context-rich prompt for generating website code.

*   **Core Engine**: React (Vite) + Tailwind CSS
*   **AI Model**: `gemini-2.0-flash-exp` (accessed via direct HTTP REST API)
*   **State Management**: React `useState` + `localStorage` persistence
*   **Input Sources**:
    1.  **User Magic Prompt**: Free-text description (e.g., "A luxury watch landing page").
    2.  **Visual Analysis**: User uploads a screenshot -> AI reverse-engineers the design system.
    3.  **Manual Overrides**: User edits individual fields via the UI.
    4.  **Template Presets**: Pre-defined "Studio Personas" (e.g., "Studio Ember", "Apex Labs").

**Internal Processing Stages:**

1.  **Intent Capture**: User provides a raw intent (text or image).
2.  **Persona Injection**: The system selects or generates a "Creative Director" persona to guide the output.
3.  **Schema Expansion (The "Magic" Step)**:
    *   The app sends a massive system prompt to Gemini.
    *   The prompt contains the **exact JSON schema** required.
    *   Gemini acts as a stochastic JSON generator, filling in the schema based on the persona and intent.
4.  **Sanitization & Validation**:
    *   Raw text response is scrubbed of Markdown (` ```json `).
    *   `JSON.parse()` attempts to hydrate the state.
    *   *Note: There is no strict schema validation (Zod/Yup). The app trusts the AI to match the requested structure.*
5.  **Refinement**: The user manually tweaks the generated JSON via form fields.
6.  **Prompt Assembly (Output)**: The JSON state is compiled into a structured Markdown format designed to be pasted into *another* coding agent (like Cursor or Windsurf) to write the actual code.

---

## 🧠 2. Prompt Construction Logic

The engine uses **Role-Framed Schema-First Prompting**. It relies heavily on giving the model a specific job title and a rigid template to fill.

### Exact Prompt Template (Magic Generation)

```javascript
/* SYSTEM LAYER */
You are a Creative Director at a top-tier digital design agency.
Generate a comprehensive JSON blueprint for: "${user_prompt}".

/* INSTRUCTION LAYER */
Create a tailored "Studio Identity" - for enterprise apps use a "Scaler" identity, for art/creative use "Auteur", for local business use "Humanist".

/* SCHEMA ENFORCEMENT LAYER */
Use this EXACT schema (fill ALL fields with specific, creative values):
{
  "agency_mode": {
    "studio_name": "string",
    "creative_director": "string (detailed persona with taste and philosophy)",
    "process": ["4 creative process steps"],
    "values": ["4 core values"]
  },
  "project_name": "string",
  "brand_narrative": { ... }, // (Nested objects for design, content, tech)
  ...
}

/* FORMATTING CONTROL */
Return ONLY valid JSON. No markdown, no explanation.
```

### Observations:
*   **Persona-Driven**: It doesn't just ask for a website; it asks for a *Studio Identity* first. This forces the AI to adopt a consistent "voice" (e.g., "Industrial design studio") which downstream influences the color palette and typography choices.
*   **Single-Shot**: It is a single massive prompt. There is no chain-of-thought loop for the generation itself.
*   **Deterministic Structure, Creative Content**: The keys are hardcoded, but the values are "temperature-dependent" creative writing.

---

## 📥 3. Input Schema

The system accepts the following inputs from the user:

1.  **Project Description** (`string`): "A coffee shop site for hipsters."
2.  **Image Asset** (`base64`): A screenshot to analyze.
3.  **Manual JSON**: A full import of the internal state.
4.  **Field-Level Overrides**:
    *   `agency_mode` (Studio Name, Director Persona)
    *   `brand_narrative` (Target Audience, Essence, Mission)
    *   `design` (Colors, Typography, Interactions)
    *   `tech` (Framework, Requirements)

**Validation**:
*   The system performs **zero validation** on user inputs.
*   It trusts the LLM to interpret vague human inputs into structured data.

---

## 📤 4. Output Schema Definition

The "Output" of this engine is the **State Object**, effectively a "Design Brief JSON".

**Schema Structure:**

```json
{
  "agency_mode": { "studio_name": "String", "creative_director": "String", ... },
  "brand_narrative": {
    "essence": "String",
    "target_audience": { "primary_persona": "String", "pain_points": ["Array"] }
  },
  "design": {
    "style": "String",
    "colors": ["Array of Hex/Names"],
    "typography": { "heading_style": "String", "body_style": "String" },
    "interactions": { "effects": ["Array"] }
  },
  "tech": {
    "framework": "String",
    "responsive": { "approach": "String" }
  },
  "constraints": { "forbidden_patterns": ["Array"] }
}
```

**Constraints**:
*   **Soft Validation**: The prompt requests `max_colors: 4` and `max_fonts: 2`, but this is a suggestion to the LLM, not a hard code constraint.
*   **Best Effort**: If the LLM returns a new field `foobar: true`, the React state will store it, but the UI will ignore it (as UI fields are hardcoded).

---

## 🛠 5. Decision-Making Logic

**How it resolves ambiguity:**
The engine is **Proactive/generative** rather than defensive.

1.  **Conflict Resolution**: It delegates this to the "Creative Director" persona. If the user asks for "Luxury Punk", the persona "Auteur" is selected to force a coherent, if eccentric, blend of styles.
2.  **Missing Info**: The prompt command `fill ALL fields with specific, creative values` forces the model to **hallucinate details**. If the user doesn't specify a font, the AI *must* invent one that matches the vibe. It refuses to leave fields blank.
3.  **Improvisation**: The system is designed to improvise. It invents "Pain Points" and "User Personas" based solely on the project name.

---

## 🎛 6. Generation Controls

**Model Configuration:**
*   **Provider**: Google Gemini API (`generativelanguage.googleapis.com`)
*   **Model**: `gemini-2.0-flash-exp`
*   **Temperature**: **Default (Unspecified)**. Likely `1.0` or `0.9` (standard for Gemini). High creativity is desired here.
*   **Top-P / Top-K**: Default.
*   **System Instructions**: Injected as the preamble of the user message (Gemini API `v1beta` style).
*   **Tools**: None used (pure text generation).
*   **JSON Mode**: **Simulated**. Use of "Return ONLY valid JSON" string instruction rather than the API's native `response_mime_type: application/json`.

---

## 🧪 7. Failure Cases

**Known Risks:**
1.  **Markdown Pollution**: Gemini often wraps JSON in ` ```json ... ``` `. The app has a regex stripper `replace(/```json/g, '')` to handle this.
2.  **Truncated JSON**: If `max_tokens` (default) is hit, JSON will be invalid. `JSON.parse()` will throw, and the app will show a generic "Failed to generate" toast.
3.  **Schema Drift**: The AI might rename `agency_mode` to `agencyMode`. Since the React app reads `data.agency_mode`, this would result in a blank UI for that section.
4.  **Rate Limiting**: Uses a simple exponential backoff (retry 3 times) for 429 errors.

---

## 📊 8. Example I/O Pair

**User Input:**
`"A brutalist portfolio for a techno DJ"`

**Assembled Prompt (Exerpt):**
```text
You are a Creative Director...
Generate a comprehensive JSON blueprint for: "A brutalist portfolio for a techno DJ".
Create a tailored "Studio Identity"...
Use this EXACT schema...
{ "agency_mode": ... "design": ... }
```

**Model Output (JSON):**
```json
{
  "agency_mode": { "studio_name": "Warehouse 9", "creative_director": "Dev rogue..." },
  "design": {
    "style": "Neo-Brutalism",
    "colors": ["#000000", "#FF00FF", "#333333"],
    "typography": { "heading_style": "Space Mono Bold", "body_style": "Inter" }
  },
  ...
}
```

**Post-Processing:**
Parsed JSON is loaded into React State.
User clicks "Copy Brief" -> Generates Markdown:
```markdown
# Website Generation Brief
You are Warehouse 9.
## Design System
- Style: Neo-Brutalism
- Colors: #000000, #FF00FF
...
Generate the complete website code now.
```

---

## 🧩 9. Versioning + Evolution Strategy

*   **Versioning**: None. The schema is hardcoded in the prompt string.
*   **Backward Compatibility**: If the schema in the prompt is changed, `localStorage` data from previous versions might break the UI (e.g., trying to access `undefined` properties).
*   **Updates**: Changing the prompt requires a code deploy.

---

## Meta-Intent Analysis

**Class**: **Hybrid Agentic Workflow (Prompt-Chaining)**

This tool is a **Meta-Prompter**. It acknowledges that LLMs are bad at generating complex code from "one-liners".
*   **Strategy**: It breaks the problem into **Context Generation** (this tool) -> **Code Generation** (external tool).
*   **Philosophy**: "Architecture First". It forces the user to agree on the *Design Dictum* (Values, Persona, Constraints) before writing a single line of code.
*   **Why it works**: By generating a "Creative Director" persona first, it grounds the subsequent code generation in a cohesive style, preventing the "generic bootstrap" look of standard AI code.
