import { indexTheDocument } from "../prepare.js";
import { v4 as uuidv4 } from "uuid";
import * as pdfParse from "pdf-parse";

const MAX_PAGES = 100;

export async function processPdf(buffer) {

  // Parse PDF from memory
  const pdfData = await pdfParse(buffer);

  // 🚫 Page limit check
  if (pdfData.numpages > MAX_PAGES) {
    throw new Error(
      `PDF has ${pdfData.numpages} pages. Maximum allowed is ${MAX_PAGES}.`
    );
  }

  const pdfId = uuidv4();

  // Index using namespace (IMPORTANT)
  await indexTheDocument(buffer, {
    pdfId,
  });

  return pdfId;
}
