import { indexTheDocument } from "../prepare.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

/**
 * Handles PDF indexing
 * Returns a unique pdfId
 */
export async function processPdf(filePath) {
  // Generate unique ID for this PDF
  const pdfId = uuidv4();
  console.log("INDEXING PDF:", filePath);


  // Index PDF with metadata
  await indexTheDocument(filePath, {
    pdfId,
    type: "user-upload",
  });

   // optional cleanup
  fs.unlinkSync(filePath);


  return pdfId;
}
