import { useState } from "react";
import { polishWithGemini } from "../api/emailDraft";

export default function EmailEditor({ draft }) {
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [loading, setLoading] = useState(false);

  const improveEmail = async () => {
    setLoading(true);
    const res = await polishWithGemini(subject, body);
    setLoading(false);

    if (res.improved) {
      const parts = res.improved.split("Body:");
      setSubject(parts[0].replace("Subject:", "").trim());
      setBody(parts[1].trim());
    }
  };

  return (
    <div className="card">
      <h3>Email Draft</h3>

      <label>Subject</label>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Email Body</label>
      <textarea
        rows={12}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ width: "100%" }}
      />

      <div style={{ marginTop: "10px" }}>
        <button onClick={improveEmail} disabled={loading}>
          ✨ Improve with Gemini
        </button>

        {loading && <span> Improving...</span>}
      </div>
    </div>
  );
}
