# ChalkScript AI — Project Plan

## 1. Project overview

**ChalkScript AI** turns a photo of a hand-drawn website wireframe into an editable web-page preview. A user uploads or captures a sketch, the vision model identifies the visible interface elements, and the app renders those elements as React components.

The product idea can eventually support architecture diagrams, ER diagrams, and other structured sketches. The first build will focus on website wireframes so the team can deliver a complete, understandable demo in two hours.

## 2. The problem we are solving

People often sketch a page on paper or a whiteboard before they build it. Turning that sketch into a digital prototype takes time, and a photo by itself is difficult to edit. ChalkScript AI uses the sketch as a starting point for a digital preview that the user can change and export.

## 3. Target users

- Engineers planning a page or feature
- Product managers communicating a layout
- Students learning or presenting interface ideas
- Designers who want a quick first digital draft

## 4. User experience

1. The user opens the landing page and chooses **Upload sketch** or **Take photo**.
2. The app accepts an image of a hand-drawn website wireframe.
3. The app sends the image to its server-side parsing endpoint.
4. The vision model identifies elements such as headings, text, buttons, images, and input fields, including their approximate positions.
5. The app validates the model response and turns the structured result into a React preview.
6. The user selects an element and makes basic edits, such as changing its text, color, or size.
7. The user can inspect the generated structure or code and export the preview as an image.

## 5. Two-hour MVP scope

### Must have

- A clean landing page with a clear upload action
- Image upload, with camera capture if the browser and available time allow
- A loading and error state for image parsing
- A server-side API route that sends the image to a multimodal vision model
- A fixed JSON response format for recognized wireframe elements
- A React preview rendered from that JSON
- Basic editing of at least element text and color
- A structure or code view
- Image export if the core flow is complete
- A prepared sample image and backup parsed result for the pitch

### Out of scope for the two-hour MVP

- Architecture, ER, and database diagram editing
- Generated backend services, working API routes, or database provisioning
- User accounts and cloud project storage
- Full project history or collaboration
- Complete draw.io compatibility
- A general-purpose AI chat editor
- Production-grade support for every handwriting style and sketch layout

## 6. Suggested technical design

### Stack

- **Framework:** Next.js with the App Router
- **Language:** TypeScript on both frontend and backend
- **UI:** React and Tailwind CSS
- **Parsing:** A multimodal vision model, using Gemma 4 if the team’s available model endpoint accepts image input
- **Validation:** A TypeScript schema validator for checking the model’s JSON response
- **Initial storage:** Browser memory or local storage; no account or database is needed for the demo

Keep the model call behind the server API route. This keeps the provider key out of browser code and makes it easier to change providers later.

### Main screens and components

- `LandingPage`: project introduction and upload action
- `ImageUploader`: image selection and optional camera capture
- `Workspace`: preview, editing controls, and structure/code panel
- `PreviewCanvas`: renders elements from the structured project data
- `ElementInspector`: edits the selected element’s properties
- `ExportButton`: downloads the preview as an image

### Backend route

Use a route such as `POST /api/parse`.

**Input:** an uploaded image, preferably sent as multipart form data.

**Server responsibilities:**

1. Check that an image was provided and that its file type is supported.
2. Send the image and a focused wireframe-parsing prompt to the configured vision model.
3. Request JSON that follows the project schema below.
4. Parse and validate the response.
5. Return valid project data or a clear error message.

Never expose the model API key in client-side TypeScript.

## 7. Project data format

The JSON is the editable source of truth. The image is only the input reference; the app renders the preview from the JSON.

Example:

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

The initial supported element types should stay small: `text`, `button`, `input`, `image`, and `container`. Each element should have a stable `id`, a position, dimensions, and only the style properties the MVP needs.

## 8. Editing and AI chat direction

For the MVP, direct editing in the inspector is the reliable path. A selected element can update its text or style, and the preview re-renders from the changed JSON.

AI chat can be added later. Its role should be to request changes to the structured project data, for example: “Make the main button blue.” The app should validate the updated data before rendering it. Chat should not directly paint over the photo or manipulate an unstructured screenshot.

## 9. Code view and export

- **Structure view:** show the project JSON. This is the simplest dependable representation for the MVP.
- **Code view:** optionally show JSX generated from the supported element types. Label it as a preview unless it has been verified as a complete standalone app.
- **Image export:** capture the rendered preview canvas and download it as PNG.
- **PDF export:** optional follow-up if image export and the full parsing flow are already working.

## 10. Persistence and future file compatibility

For the demo, keep the parsed project in browser state and optionally save it to local storage so a refresh can restore it. A later version can save the JSON and source image to a database or object storage, with user accounts if needed.

Use the project JSON as ChalkScript’s own format. draw.io export can be explored later by converting supported diagram elements to draw.io’s format. Do not make draw.io encoding a requirement for the first wireframe demo.

## 11. Team roles

### Lead — vision prompt and backend parser

- Define the wireframe JSON format with the frontend developer.
- Write the model prompt to identify supported elements and approximate positions.
- Build the TypeScript parsing route.
- Validate model output and handle errors.

### Developer 2 — interactive preview frontend

- Build the landing page, upload flow, and workspace.
- Render the JSON elements as React components.
- Add selection and basic element editing.
- Add structure/code view and image export if time permits.

### Developer 3 — sample inputs and presentation

- Prepare clear hand-drawn sample wireframes.
- Try the full demo flow and prepare a backup result.
- Write the project pitch and submission description.
- Present the problem, the conversion, and the editable result.

## 12. Two-hour build sequence

1. Agree on the wireframe-only scope, element types, and JSON shape.
2. Build the landing page and image upload.
3. Create the API route and connect the vision model.
4. Render returned JSON on the preview canvas.
5. Add basic selection and text/color editing.
6. Add the structure view and PNG export if time remains.
7. Rehearse the demo using the prepared sample and backup result.

Keep the frontend and backend moving in parallel after the JSON format is agreed. The sample wireframes and pitch can be prepared while implementation is underway.

## 13. Demo success criteria

The demo is successful if the team can show:

- A photo of a hand-drawn wireframe being submitted
- A structured result returned by the parser
- A readable web-page preview generated from that result
- At least one element being edited and reflected in the preview
- The structure or code being inspected
- The finished preview being exported, if export is implemented

If live model access or parsing fails during the presentation, use the prepared backup JSON to demonstrate the renderer and editor. Be clear that the backup is being used.

## 14. Simple pitch

“ChalkScript AI turns a hand-drawn website sketch into an editable web preview. Upload a photo, let AI identify the interface elements, then adjust and export the digital draft.”

## 15. Future roadmap

1. Improve wireframe recognition and support more layout styles.
2. Add AI chat commands that make validated changes to project data.
3. Add project saving and reopening across devices.
4. Add export for architecture and ER diagrams.
5. Add compatible exports such as draw.io where useful.
6. Explore generated application code and integrations after the editable prototype flow is reliable.
