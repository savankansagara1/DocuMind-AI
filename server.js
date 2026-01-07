import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.route.js";
import uploadRoutes from "./routes/upload.route.js";


dotenv.config();

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));

app.use(express.json());

// Routes
app.use("/chat", chatRoutes);
app.use("/upload", uploadRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("🚀 RAG Chatbot API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
