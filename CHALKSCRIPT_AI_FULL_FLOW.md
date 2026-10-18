# ChalkScript AI — Full Product Flow

This document describes the agreed first version of ChalkScript AI from the user's first visit through editing and exporting a sketch. It is written as a shared reference for product, frontend, backend, and demo work.

## 1. Product promise

**Upload a photo of a hand-drawn website wireframe and get an editable web-page preview.**

For this first build, ChalkScript AI supports website wireframes. It does not yet turn architecture diagrams, ER diagrams, or database diagrams into working systems.

## 2. Main user journey

```text
Landing page
    ↓
Choose or take a wireframe photo
    ↓
Review the selected image
    ↓
Ask AI to parse the sketch
    ↓
See an editable web-page preview
    ↓
Select and edit page elements
    ↓
Inspect the structure/code
    ↓
Export the preview or start another sketch
```

## 3. Detailed flow

### Step 1: Landing page

The user sees:

- The name **ChalkScript AI**
- A short explanation: “Turn a hand-drawn wireframe into an editable web preview.”
- A primary **Start with a sketch** button
- A small example showing a sketch and its digital preview

When the user selects the primary button, the app opens the workspace or scrolls to the upload area.

### Step 2: Add a sketch image

The user can select an image from their device. If time and browser support allow, they can also take a photo with the camera.

The app should:

- Accept common image types such as PNG and JPEG.
- Show a preview of the selected image.
- Let the user replace the image before parsing.
- Show a clear message if the file is missing, unsupported, or too large.

The user presses **Generate preview** to continue.

### Step 3: Parse the sketch

The frontend sends the image to the Next.js backend route, for example `POST /api/parse`.

The backend then:

1. Checks the request and image type.
2. Sends the image to the configured multimodal vision model. Use Gemma 4 if the team's available endpoint supports image input.
3. Instructs the model to identify only supported wireframe elements and return the agreed JSON structure.
4. Parses and validates the model response with a TypeScript schema.
5. Returns valid project data to the frontend, or a useful error message.

While this runs, the UI shows a loading indicator and a short message such as **Reading your sketch…**. The user should not be able to submit the same image repeatedly by accident.

### Step 4: Show the generated preview

When valid project data arrives, the app opens the workspace. The workspace has three main areas:

1. **Preview canvas:** renders the generated page.
2. **Edit panel:** shows controls for the currently selected element.
3. **Structure/code panel:** displays the JSON structure, with generated JSX as an optional enhancement.

The preview is built from React components and project JSON. The original uploaded image can remain visible in a smaller reference area or be available behind a **View original** action.

### Step 5: Select and edit an element

The user selects an element in the preview. The app highlights it and shows its supported properties in the edit panel.

For the first version, support simple edits:

- Change text on a heading, text element, or button.
- Change text or background color.
- Change width and height if there is time.
- Delete an element if there is time.

When a property changes:

1. Update the matching element in the project JSON using its `id`.
2. Re-render the preview from the updated JSON.
3. Refresh the structure/code panel so it matches the preview.

Direct manipulation such as drag-and-drop is optional. Basic selection and property editing are the MVP target.

### Step 6: Inspect the result

The user can open the structure panel to inspect the JSON that drives the preview. If time allows, the app can also show JSX generated from supported element types.

The code panel is a preview of the generated UI. Do not present it as a complete production application or backend unless the app actually generates and runs those parts.

### Step 7: Save and export

For the demo, keep the project in browser state and use local storage if a refresh-safe save is practical. The saved project should include:

- The project JSON
- The project type (`wireframe`)
- The canvas dimensions
- Optionally, the original image or a local reference to it if browser storage limits allow

The user can export the rendered preview as a PNG. PDF export is a stretch goal. A **New sketch** action starts another project after warning the user if unsaved work would be lost.

## 4. App and data flow

```text
Browser UI (Next.js + React + TypeScript)
    │
    │ image upload
    ▼
POST /api/parse (Next.js server route)
    │
    ├── validate image request
    ├── call multimodal vision model
    ├── parse and validate JSON
    ▼
Structured wireframe project JSON
    │
    ├── render React elements on the preview canvas
    ├── edit selected element properties
    ├── show JSON / optional generated JSX
    └── export preview image
```

The project JSON is the source of truth for the generated preview. The original photo helps the AI understand the user's sketch but is not itself the editable project.

## 5. Agreed first-version data shape

Use a small supported set of element types: `text`, `button`, `input`, `image`, and `container`.

Example project:

```json
{
  "version": 1,
  "type": "wireframe",
  "canvas": { "width": 900, "height": 700 },
  "elements": [
    {
      "id": "heading-1",
      "type": "text",
      "text": "Welcome",
      "x": 60,
      "y": 40,
      "width": 300,
      "height": 56,
      "style": { "fontSize": 32, "color": "#171717" }
    },
    {
      "id": "button-1",
      "type": "button",
      "text": "Get started",
      "x": 60,
      "y": 130,
      "width": 160,
      "height": 48,
      "style": { "backgroundColor": "#2563eb", "color": "#ffffff" }
    }
  ]
}
```

The model should return only the agreed data. If the response is malformed or includes unsupported elements, the backend should reject it or safely map supported parts and report the issue.

## 6. Error and recovery paths

### Image could not be selected or uploaded

- Explain what went wrong in plain language.
- Keep the user on the upload step.
- Let them choose another image.

### AI request fails or times out

- Show a retry action.
- Keep the selected image available.
- Do not leave the user on a blank preview.

### AI response is invalid or empty

- Show a clear parsing error and offer retry.
- If the team prepared a demo fallback, allow the presenter to load the saved sample JSON.

### Live AI is unavailable during the demo

- Use the prepared sample wireframe and saved JSON to show the renderer and editor.
- Explain that the demo is using a prepared parse result for this run.

## 7. Optional AI chat flow

AI chat is not required for the two-hour MVP. Later, it can be added as another way to edit the project:

1. The user asks for a change, for example, “Make the main button blue.”
2. The frontend sends the request and current project JSON to a server-side route.
3. The model returns a structured update to the project data.
4. The backend validates the updated data.
5. The preview and structure panel update together.

The chat should edit the structured project data, not just produce advice or draw over the uploaded photo.

## 8. Optional diagram and file support later

After the wireframe flow is reliable, the project can add other project types, each with its own schema and renderer:

- Architecture flow diagrams
- ER diagrams and database schemas
- Other interface sketches

Keep ChalkScript's JSON as its own internal project format. A later export can convert supported data to draw.io format. draw.io compatibility is not needed for the first build.

## 9. Two-hour implementation checkpoints

### Checkpoint A — agree on the contract

- Wireframe-only MVP confirmed.
- Frontend and backend agree on element types and JSON fields.
- The model endpoint and key are available to the server.

### Checkpoint B — upload to structured data

- User can choose a sample image.
- API route receives the image.
- Route returns validated project JSON or a visible error.

### Checkpoint C — structured data to editable preview

- Preview renders the supported elements.
- User can select an element and change its text or color.
- The preview reflects the edit.

### Checkpoint D — presentation-ready demo

- Structure panel works.
- PNG export works if time allows.
- Prepared sample JSON is available as a fallback.
- Team rehearses the full flow and pitch.

## 10. Demo script

1. “People sketch interfaces on paper, but that sketch is hard to edit or share.”
2. Show a hand-drawn wireframe and upload it to ChalkScript AI.
3. Explain that the vision model identifies elements and returns structured project data.
4. Show the generated page preview.
5. Change a heading or button property and show the preview update.
6. Open the JSON or code panel.
7. Export the preview if implemented.
8. Close with: “ChalkScript AI turns a rough sketch into an editable digital starting point.”

## 11. Decisions captured in this document

- Use Next.js and TypeScript for both frontend and backend.
- Focus the first demo on hand-drawn website wireframes.
- Use a server-side API route for vision-model requests.
- Use validated JSON as the editable source of truth.
- Render the result as React components.
- Prioritize upload, parse, preview, and basic editing before optional features.
- Treat AI chat, PDF, draw.io, other diagram types, accounts, and database-backed saving as future work or stretch goals.
