import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

/*Initialize the Embedding Model*/
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
});

/* Initialize the Pinecone Client*/
const pinecone = new PineconeClient();

// Connect to a specific index within Pinecone.
const pineconeIndex = pinecone.Index(process.env.PINECOIN_INDEX_NAME);

//Initialize the Vector Store , This creates a LangChain wrapper around the specific Pinecone index
export const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexTheDocument(filePath, extraMetadata = {}) {
  //Load the PDF
  const loader = new PDFLoader(filePath, {
    splitPages: false,
  });
  const doc = await loader.load();

  //Split the text into chunks
  const textsplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const texts = await textsplitter.splitText(doc[0].pageContent);
console.log("INDEXING WITH METADATA:", extraMetadata);
  // langchain only support Document objects so we need to convert the text chunks into Document objects
  const documents = texts.map((chunk) => {
  return {
    pageContent: chunk,
    metadata: {
      ...doc[0].metadata,
      ...extraMetadata,
    },
  };
});

  /* console.log(texts);  */

  /*  Upload to Pinecone
   This generates embeddings for each chunk and pushes them to the vector database. */
  await vectorStore.addDocuments(documents, {
  namespace: extraMetadata.pdfId,
});
}
