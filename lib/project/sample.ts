// Backup parse result for the demo (Dev 3 owns sample-project.json).
// Validated at import time so a broken sample fails loudly, not on stage.
import sampleJson from "./sample-project.json";
import { wireframeProjectSchema } from "./schema";

export const sampleProject = wireframeProjectSchema.parse(sampleJson);
