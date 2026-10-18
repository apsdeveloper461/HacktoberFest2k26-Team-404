# ChalkScript AI — Background and Related Product Research

**Research date:** 18 October 2026

## 1. Why this idea started

The idea comes from the experience of a software engineering student at UET. During documentation work and group discussions, the team often uses AI or works together to create low-fidelity designs and diagrams. When it is time to build the software, the same ideas and layouts have to be recreated in the development process. That repeat work can take time.

The team also tried AI tools for making diagrams. In the tools they used, they found it difficult to edit the result directly in the same workspace, and paid plans or usage limits made repeated changes harder. This describes the team's experience with the tools it tried; it is not a claim that all diagram products lack editing. Some current products do support visual or chat-based editing.

This experience led to the idea for ChalkScript AI: start from the sketch the team already made, turn it into structured digital elements, and let the team edit those elements and view the result without recreating the whole design from scratch.

## 2. Project concept and current scope

ChalkScript AI is planned to take a photo of a physical whiteboard or paper sketch and convert it into editable digital content. The longer-term concept includes interface wireframes, architecture diagrams, and ER/database diagrams, with outputs such as editable visual structures and code.

The current MVP plan is narrower: support hand-drawn website wireframes, parse a small set of elements, and render them as an editable React preview. Architecture diagrams, ER diagrams, conversational editing, code export, and integrations with other diagram tools are future directions unless implemented separately.

The planned data flow is:

```text
Photo of sketch → multimodal vision model → validated project data → editable React preview
```

The project data (JSON) is intended to be the editable source of truth. The uploaded photo is the model's reference input. This separates image recognition from rendering and lets the app update the preview when a supported element changes.

## 3. Related products reviewed

The products below address parts of the ChalkScript concept. The feature summaries are based on publicly available product pages and documentation, primarily from the product makers. This is not a hands-on comparison of accuracy, speed, or output quality.

| Product | Main use | Publicly documented capabilities | Relationship to ChalkScript AI |
|---|---|---|---|
| [Uizard Wireframe Scanner](https://uizard.io/wireframe-scanner/) | Digitizing hand-drawn app and website wireframes | Accepts photos of paper or whiteboard sketches and creates editable mockups. Uizard also describes visual editing, clickable prototypes, and low/high-fidelity switching. | Directly overlaps with photo-to-editable-wireframe conversion and visual editing. |
| [Visily](https://www.visily.ai/website-wireframe-builder) | Creating and collaborating on web and app wireframes | Describes sketch and screenshot conversion, AI-assisted design, editable wireframes, fidelity changes, prototypes, and real-time collaboration. | Overlaps with sketch-to-wireframe conversion and editing. |
| [Google Stitch](https://developers.googleblog.com/en/stitch-a-new-way-to-design-uis/) | Generating and iterating on user interfaces | Accepts text and image inputs, including sketches and wireframes. Google describes interactive refinement, frontend code export, and Figma handoff. Its [May 2026 update](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/) describes live canvas iteration and additional handoff options. | Overlaps with image-to-UI generation, iterative editing, and frontend code output. |
| [Eraser](https://docs.eraser.io/what-is-eraser) | Creating technical diagrams | Generates editable architecture, sequence, flow, ERD, and BPMN diagrams from prompts, images, or files. Its [image-to-diagram guide](https://docs.eraser.io/image-import) includes photos of hand-drawn diagrams. Diagrams can be edited visually or with AI. | Overlaps with physical diagram parsing, editable structured diagrams, and AI-assisted changes. |
| [Mermaid Chart](https://mermaid.ai/docs/getting-started/generate-diagram-with-ai) | Creating diagrams from Mermaid syntax or prompts | Mermaid AI turns natural-language descriptions into diagram syntax and supports conversational refinements. Its [whiteboard](https://mermaid.ai/docs/guides/whiteboard) supports visual editing and adding images. The reviewed documentation did not establish photo-to-structured-diagram parsing as its main workflow. | Overlaps with structured diagram generation and AI-assisted editing. |
| [draw.io](https://www.drawio.com/docs/manual/generate/ai-models/) | Editing and sharing diagrams | Its AI generation is prompt-led and returns editable mxGraph XML. Users can include an existing diagram, page, or selection as context. draw.io also supports [many import formats](https://www.drawio.com/docs/manual/import/import-formats/). | Overlaps with AI diagram creation and editable structured output. Its reviewed AI documentation focuses on text prompts and existing draw.io content. |
| [Lucidchart / Lucid AI](https://help.lucid.co/hc/en-us/articles/30324063850516-Generate-a-diagram-with-AI-in-Lucidchart) | Creating and collaborating on diagrams | Generates diagrams from prompts and allows images, PDFs, and text files to be attached as references. Lucid also describes AI-assisted iteration. | Overlaps with AI diagram generation, reference-image input, and visual editing. |
| [Screenshot-to-code](https://github.com/abi/screenshot-to-code) | Turning screenshots into frontend code | The project describes converting screenshots into HTML, Tailwind, React, or Vue output. | Overlaps with visual-reference-to-code generation. Its documented focus is screenshots; this review does not establish how well it handles hand-drawn wireframes. |
| [tldraw Make Real](https://makereal.tldraw.com/) | Experimenting with turning canvas drawings into generated results | The public page invites users to draw and select shapes, then use “Make Real” with a selected model provider. Public product detail is limited. | An adjacent drawing-to-generated-result workflow; more investigation is needed for a detailed comparison. |

## 4. Findings from the comparison

- Sketch-to-editable-design is already available in products such as Uizard and Visily.
- Physical image input is not limited to UI tools: Eraser documents conversion of hand-drawn diagram photos into editable diagrams.
- AI diagram products can support visual editing, chat-based changes, structured formats, or exports. Capabilities vary by product.
- Some products generate frontend code from images or design references. Their input types, output formats, and workflows differ.
- The market is not cleanly separated into “text-only diagram tools” and “photo-based code tools.” Several products overlap with parts of the ChalkScript idea.
- The team's reported difficulty editing and affordability concerns are useful product motivation, but should be described as the experience that inspired ChalkScript rather than as universal facts about competitors.

## 5. How ChalkScript is intended to fit

The intended workflow combines several steps in one app:

1. Start with a photo of a physical sketch.
2. Use a multimodal model to identify supported elements and approximate layout.
3. Convert the interpretation into validated, structured project data.
4. Render the data as a browser-based React preview.
5. Let the user change supported elements and see the preview update.

For the current wireframe MVP, supported elements are planned to include text, buttons, inputs, image placeholders, and containers. Direct editing is the initial priority. AI chat edits, Mermaid/draw.io exports, architecture and ER diagram modes, and generated application backends are future directions.

The potential distinction is the combined workflow and the project's focus on a developer-usable editable preview. This is a product hypothesis, not a verified exclusive capability. Hands-on testing with target users and existing products would be needed to determine whether the workflow is meaningfully more useful for the intended audience.

## 6. Gemma 4 and affordability

The [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4) lists image understanding, handwriting recognition, and screen/UI understanding among its capabilities. These capabilities are relevant to reading sketches, but they do not guarantee accurate interpretation of ChalkScript users' photos. The parser should validate model output and allow users to correct mistakes.

Gemma 4's open weights give project builders the option to run or host a model themselves, subject to the model's license and the hardware/runtime requirements. Open weights do not make every hosted AI request free: a hosted provider or server still has inference and compute costs. ChalkScript's affordability goal is therefore to support an open-source, self-hostable or low-cost setup where practical, rather than to promise that all use will always be free.

The team should state which model and endpoint a release or demo actually uses. Gemma 4 should only be named as the running model when it is connected and used in that version.

## 7. Limits of this research

- Product features were reviewed from published official product pages and documentation checked on **18 October 2026**.
- This is a selected product review, not an exhaustive market map.
- It does not test recognition accuracy, quality of generated code, usability, performance, pricing, licensing, or privacy practices.
- Vendor descriptions state what a product supports, but do not independently verify how well it works on difficult sketches.
- Features and model availability can change; re-check sources before relying on a capability for product or deployment decisions.

## 8. Sources

- [Uizard Wireframe Scanner](https://uizard.io/wireframe-scanner/)
- [Uizard Wireframe Scanner help article](https://support.uizard.io/en/articles/6435370-using-wireframe-scanner)
- [Visily Website Wireframe Builder](https://www.visily.ai/website-wireframe-builder)
- [Google Developers: Introducing Stitch](https://developers.googleblog.com/en/stitch-a-new-way-to-design-uis/)
- [Google Blog: Stitch updates, May 2026](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/)
- [Eraser: What is Eraser?](https://docs.eraser.io/what-is-eraser)
- [Eraser Image-to-diagram docs](https://docs.eraser.io/image-import)
- [Mermaid Chart: Generate a diagram with AI](https://mermaid.ai/docs/getting-started/generate-diagram-with-ai)
- [Mermaid Chart: Whiteboard](https://mermaid.ai/docs/guides/whiteboard)
- [draw.io: AI models and diagram generation](https://www.drawio.com/docs/manual/generate/ai-models/)
- [draw.io: Import formats](https://www.drawio.com/docs/manual/import/import-formats/)
- [Lucid AI: Generate a diagram](https://help.lucid.co/hc/en-us/articles/30324063850516-Generate-a-diagram-with-AI-in-Lucidchart)
- [Screenshot-to-code project](https://github.com/abi/screenshot-to-code)
- [tldraw Make Real](https://makereal.tldraw.com/)
- [Google Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4)
