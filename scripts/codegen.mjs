// Regenerates src/api/generated from src/api/openapi.json.
//
// .NET 10 serves OpenAPI 3.1, but openapi-typescript-codegen only understands
// 3.0, so two 3.1 constructs are rewritten before generating:
// - ["integer", "string"] plus a pattern, emitted because the backend accepts
//   numeric strings on read. It always writes numbers, so these would otherwise
//   generate as `number | string`.
// - ["null", "array"], which would otherwise generate as `any[]`, losing `items`.
import { readFile } from "node:fs/promises";
import { generate } from "openapi-typescript-codegen";

const input = new URL("../src/api/openapi.json", import.meta.url);
const output = "./src/api/generated";

function normalizeType(schema) {
  let types = schema.type;

  if (schema.pattern && types.some((t) => t === "integer" || t === "number")) {
    types = types.filter((t) => t !== "string");
    delete schema.pattern;
  }

  const nonNull = types.filter((t) => t !== "null");
  if (nonNull.length !== 1) {
    schema.type = types;
    return;
  }

  schema.type = nonNull[0];
  if (nonNull.length !== types.length) schema.nullable = true;
}

function normalize(node) {
  if (Array.isArray(node)) {
    node.forEach(normalize);
  } else if (node && typeof node === "object") {
    if (Array.isArray(node.type)) normalizeType(node);
    Object.values(node).forEach(normalize);
  }
}

const spec = JSON.parse(await readFile(input, "utf8"));
normalize(spec);
await generate({ input: spec, output, httpClient: "fetch" });
