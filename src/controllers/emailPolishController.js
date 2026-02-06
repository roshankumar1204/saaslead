const { polishEmailWithGemini } = require("../services/geminiService");

async function polishEmail(req, res) {
  const { subject, body } = req.body;

  if (!subject || !body) {
    return res.status(400).json({ error: "Missing subject or body" });
  }

  try {
    const improved = await polishEmailWithGemini(subject, body);
    res.json({ improved });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini processing failed" });
  }
}

module.exports = { polishEmail };
