import { indexTheDocument } from "../prepare.js";
import { v4 as uuidv4 } from "uuid";
import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✅ stable in Bun

const MAX_PAGES = 100;

export async function processPdf(buffer) {
  // ✅ Correct pdf-parse usage
  const pdfData = await pdfParse(buffer);

  if (pdfData.numpages > MAX_PAGES) {
    throw new Error(
      `PDF has ${pdfData.numpages} pages. Maximum allowed is ${MAX_PAGES}.`
    );
  }

  const pdfId = uuidv4();

  // ✅ Write buffer to temp file
  const tempPath = path.join("uploads", `${pdfId}.pdf`);
  fs.writeFileSync(tempPath, buffer);

  // ✅ Index using file path
  await indexTheDocument(tempPath, { pdfId });

  // ✅ Cleanup
  fs.unlinkSync(tempPath);

  return pdfId;
}
