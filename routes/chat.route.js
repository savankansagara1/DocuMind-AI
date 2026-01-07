import express from "express";
import { askQuestion } from "../services/chat.service.js";

const router = express.Router();

/**
 * POST /chat
 * body: { "message": "your question" }
 */
router.post("/", async (req, res) => {
  try {
    const { message,pdfId,sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const answer = await askQuestion({
      question: message,
      pdfId,
      sessionId,
    });

    res.json(answer);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
