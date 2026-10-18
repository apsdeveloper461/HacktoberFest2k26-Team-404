#!/usr/bin/env node
// Validates a ChalkScript project JSON file against contract version 1
// (mirrors lib/project/schema.ts). Zero dependencies — Node 18+.
//
// Usage:
//   node validate.mjs project.json        validate a file
//   node validate.mjs -                   read the JSON from stdin
//
// Exit codes: 0 = valid (warnings may still be printed), 1 = invalid, 2 = usage / unreadable input.

import { readFileSync } from "node:fs";

const ELEMENT_TYPES = ["text", "button", "input", "image", "container"];
const STYLE_KEYS = ["fontSize", "color", "backgroundColor"];
const ELEMENT_KEYS = ["id", "type", "text", "x", "y", "width", "height", "style"];
const ID_PATTERN = /^[a-z0-9_-]+$/;

const errors = [];
const warnings = [];
const error = (path, message) => errors.push(`${path}: ${message}`);
const warn = (path, message) => warnings.push(`${path}: ${message}`);

const isObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
const isNumber = (v) => typeof v === "number" && Number.isFinite(v);

function readInput(arg) {
  if (!arg) {
    console.error("Usage: node validate.mjs <project.json | ->");
    process.exit(2);
  }
  try {
    return readFileSync(arg === "-" ? 0 : arg, "utf8");
  } catch (e) {
    console.error(`Cannot read ${arg}: ${e.message}`);
    process.exit(2);
  }
}

function validateStyle(style, path) {
  if (!isObject(style)) {
    error(path, "must be an object (use {} for no style)");
    return;
  }
  for (const key of Object.keys(style)) {
    if (!STYLE_KEYS.includes(key)) warn(`${path}.${key}`, `not part of the contract (allowed: ${STYLE_KEYS.join(", ")}); the app strips it`);
  }
  if (style.fontSize !== undefined && !(isNumber(style.fontSize) && style.fontSize > 0)) {
    error(`${path}.fontSize`, "must be a positive number");
  }
  for (const key of ["color", "backgroundColor"]) {
    if (style[key] !== undefined && typeof style[key] !== "string") error(`${path}.${key}`, "must be a string");
  }
}

function validateElement(el, i, canvas, ids) {
  const path = `elements[${i}]`;
  if (!isObject(el)) {
    error(path, "must be an object");
    return;
  }
  const label = typeof el.id === "string" && el.id ? `${path} (${el.id})` : path;

  if (typeof el.id !== "string" || el.id.length === 0) {
    error(`${label}.id`, "must be a non-empty string");
  } else {
    if (ids.has(el.id)) error(`${label}.id`, `duplicate id "${el.id}"`);
    ids.add(el.id);
    if (!ID_PATTERN.test(el.id)) warn(`${label}.id`, "use lowercase a–z, 0–9, _ and - only");
  }

  if (!ELEMENT_TYPES.includes(el.type)) {
    error(`${label}.type`, `must be one of ${ELEMENT_TYPES.join(", ")} (got ${JSON.stringify(el.type)})`);
  }

  if (el.text !== undefined && typeof el.text !== "string") error(`${label}.text`, "must be a string when present");
  if (typeof el.text === "string" && el.text.length > 200) warn(`${label}.text`, "longer than 200 characters");
  if (el.type === "image" && el.text) warn(`${label}.text`, "images do not render text");

  for (const key of ["x", "y"]) {
    if (!isNumber(el[key])) error(`${label}.${key}`, "must be a number");
    else if (el[key] < 0) error(`${label}.${key}`, "must be ≥ 0");
  }
  for (const key of ["width", "height"]) {
    if (!isNumber(el[key])) error(`${label}.${key}`, "must be a number");
    else if (el[key] <= 0) error(`${label}.${key}`, "must be > 0");
  }

  if (el.style === undefined) warn(`${label}.style`, "missing — the app fills in {}, but write it out");
  else validateStyle(el.style, `${label}.style`);

  for (const key of Object.keys(el)) {
    if (!ELEMENT_KEYS.includes(key)) warn(`${label}.${key}`, "not part of the contract; the app strips it");
  }

  if (canvas && [el.x, el.y, el.width, el.height].every(isNumber)) {
    if (el.x + el.width > canvas.width || el.y + el.height > canvas.height) {
      warn(label, `box (${el.x}, ${el.y}, ${el.width}×${el.height}) extends past the ${canvas.width}×${canvas.height} canvas`);
    }
  }
}

function validateProject(project) {
  if (!isObject(project)) {
    error("$", "the project must be a JSON object");
    return null;
  }
  if (project.version !== 1) error("version", "must be 1");
  if (project.type !== "wireframe") error("type", 'must be "wireframe"');

  let canvas = null;
  if (!isObject(project.canvas)) {
    error("canvas", "must be an object with width and height");
  } else {
    const { width, height } = project.canvas;
    if (!(isNumber(width) && width > 0)) error("canvas.width", "must be a positive number");
    if (!(isNumber(height) && height > 0)) error("canvas.height", "must be a positive number");
    if (isNumber(width) && isNumber(height)) {
      canvas = { width, height };
      if (width !== 900 || height !== 700) warn("canvas", "the app always uses 900 × 700");
    }
  }

  if (!Array.isArray(project.elements)) {
    error("elements", "must be an array");
    return null;
  }
  if (project.elements.length === 0) warn("elements", "is empty — nothing will render");

  const ids = new Set();
  project.elements.forEach((el, i) => validateElement(el, i, canvas, ids));
  return project.elements;
}

const raw = readInput(process.argv[2]);
let project;
try {
  project = JSON.parse(raw);
} catch (e) {
  console.error(`✗ Not valid JSON: ${e.message}`);
  process.exit(1);
}

const elements = validateProject(project);

for (const w of warnings) console.warn(`  warning  ${w}`);
for (const e of errors) console.error(`  error    ${e}`);

if (errors.length > 0) {
  console.error(`\n✗ Invalid ChalkScript project: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}

const counts = {};
for (const el of elements) counts[el.type] = (counts[el.type] ?? 0) + 1;
const summary = Object.entries(counts)
  .map(([type, n]) => `${n} ${type}`)
  .join(", ");
console.log(`✓ Valid ChalkScript project: ${elements.length} element(s) (${summary || "none"}), ${warnings.length} warning(s).`);
