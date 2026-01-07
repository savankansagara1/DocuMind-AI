import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { indexTheDocument } from "../prepare.js";

const MAX_PAGES = 100;

export async function processPdf(buffer) {
  // Parse PDF
  const pdfData = await pdfParse(buffer);

  if (pdfData.numpages > MAX_PAGES) {
    throw new Error(
      `PDF has ${pdfData.numpages} pages. Maximum allowed is ${MAX_PAGES}.`
    );
  }

  const pdfId = uuidv4();

  // Write temp file (LangChain needs path)
  const tempPath = path.join("uploads", `${pdfId}.pdf`);
  fs.writeFileSync(tempPath, buffer);

  await indexTheDocument(tempPath, { pdfId });

  fs.unlinkSync(tempPath);

  return pdfId;
}
