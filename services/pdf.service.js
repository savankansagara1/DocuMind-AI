import { createRequire } from "module";
import { indexTheDocument } from "../prepare.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);

// 🔥 FULL UNWRAP (Bun-safe)
const pdfParseModule = require("pdf-parse");
const pdfParse =
  pdfParseModule?.default?.default ||
  pdfParseModule?.default ||
  pdfParseModule;

if (typeof pdfParse !== "function") {
  throw new Error("pdf-parse failed to load correctly");
}

const MAX_PAGES = 100;

export async function processPdf(buffer) {
  const pdfData = await pdfParse(buffer);

  if (pdfData.numpages > MAX_PAGES) {
    throw new Error(
      `PDF has ${pdfData.numpages} pages. Maximum allowed is ${MAX_PAGES}.`
    );
  }

  const pdfId = uuidv4();

  const tempPath = path.join("uploads", `${pdfId}.pdf`);
  fs.writeFileSync(tempPath, buffer);

  await indexTheDocument(tempPath, { pdfId });

  fs.unlinkSync(tempPath);

  return pdfId;
}
