import { indexTheDocument } from "../prepare.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import * as pdfjs from "pdfjs-dist/build/pdf.mjs";

const MAX_PAGES = 100;

export async function processPdf(buffer) {
  // Load PDF from buffer
  const loadingTask = pdfjs.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;

  if (numPages > MAX_PAGES) {
    throw new Error(
      `PDF has ${numPages} pages. Maximum allowed is ${MAX_PAGES}.`
    );
  }

  const pdfId = uuidv4();

  // Write buffer to temp file for LangChain
  const tempPath = path.join("uploads", `${pdfId}.pdf`);
  fs.writeFileSync(tempPath, buffer);

  await indexTheDocument(tempPath, { pdfId });

  fs.unlinkSync(tempPath);

  return pdfId;
}
