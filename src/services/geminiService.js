const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🔍 DEBUG: check API key presence (SAFE)
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is NOT set");
} else {
  console.log(
    "✅ GEMINI_API_KEY loaded:",
    apiKey.substring(0, 5) + "*****",
    "(length:", apiKey.length + ")"
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

async function polishEmailWithGemini(subject, body) {
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
  });

  const prompt = `
You are a professional business communication assistant.

Rules:
- Rewrite the email to sound professional, friendly, and business-appropriate.
- Keep it easy to understand and simple if not accessible tell them it as issue simply.
- Do NOT invent facts or add assumptions.
- Always list the issue first and then the solution.
-dont use any other fact than provided in the email.
- Do NOT claim deep research.
- Only improve clarity, tone, and structure.

Return the result in this format:
Subject: <subject>
Body:
<email body>

Email to improve:

Subject: ${subject}

${body}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { polishEmailWithGemini };
