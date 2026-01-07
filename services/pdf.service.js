import { indexTheDocument } from "../prepare.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

/**
 * Handles PDF indexing
 * Returns a unique pdfId
 */
export async function processPdf(filePath) {
  // Generate unique ID for this PDF
  const pdfId = uuidv4();

  // Index PDF with metadata
  await indexTheDocument(filePath, {
    pdfId,
    type: "user-upload",
  });

  return pdfId;
}
