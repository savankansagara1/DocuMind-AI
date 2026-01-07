const BASE_URL = "https://documind-ai-1-0g0h.onrender.com"

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function sendMessage(message, pdfId, sessionId) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      pdfId,
      sessionId
    }),
  });

  return res.json();
}
