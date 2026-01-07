import { indexTheDocument } from "../prepare.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import pdfParse from "pdf-parse";

const MAX_PAGES = 100;

export async function processPdf(filePath) {
  // Read file
  const dataBuffer = fs.readFileSync(filePath);

  // Parse PDF
  const pdfData = await pdfParse(dataBuffer);

  // 🚫 Page limit check
  if (pdfData.numpages > MAX_PAGES) {
    throw new Error(
      `PDF has ${pdfData.numpages} pages. Maximum allowed is ${MAX_PAGES}.`
    );
  }

  const pdfId = uuidv4();

  // Index using namespace (IMPORTANT)
  await indexTheDocument(filePath, {
    pdfId,
  });

  return pdfId;
}
