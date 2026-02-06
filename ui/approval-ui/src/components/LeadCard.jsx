import { useState } from "react";
import { updateLeadStatus } from "../api/approvals";
import { fetchEmailDraft, polishWithGemini } from "../api/emailDraft";

export default function LeadCard({ lead, onAction }) {
    const [showEditor, setShowEditor] = useState(false);
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [loadingDraft, setLoadingDraft] = useState(false);
    const [polishing, setPolishing] = useState(false);

    const handleAction = async (status) => {
        await updateLeadStatus(lead.id, status);
        onAction();
    };

    /* =====================
       WEBSITE
       ===================== */
    const websiteUrl = lead.website
        ? lead.website.startsWith("http")
            ? lead.website
            : `https://${lead.website}`
        : null;

    /* =====================
       MAPS
       ===================== */
    const lat =
        lead.lat !== null && lead.lat !== undefined
            ? Number(lead.lat)
            : null;

    const lon =
        lead.lon !== null && lead.lon !== undefined
            ? Number(lead.lon)
            : null;

    let mapsUrl = null;

    if (lead.address && lead.address !== "N/A") {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${lead.name}, ${lead.address}`
        )}`;
    } else if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
        mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    }

    /* =====================
       EMAIL DRAFT
       ===================== */
    const generateDraft = async () => {
        setLoadingDraft(true);
        const res = await fetchEmailDraft(lead.id);
        setLoadingDraft(false);

        if (res?.draft) {
            setSubject(res.draft.subject);
            setBody(res.draft.body);
            setShowEditor(true);
        }
    };

    const improveWithGemini = async () => {
        setPolishing(true);
        const res = await polishWithGemini(subject, body);
        setPolishing(false);

        if (res?.improved) {
            const parts = res.improved.split("Body:");
            setSubject(parts[0].replace("Subject:", "").trim());
            setBody(parts[1].trim());
        }
    };

    return (
        <div className="card">
            <h3>{lead.name}</h3>

            <p><b>Lead Type:</b> {lead.lead_type}</p>
            <p><b>Score:</b> {lead.score ?? "N/A"}</p>

            {/* 🌐 WEBSITE */}
            {websiteUrl ? (
                <p>
                    🌐{" "}
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                        Visit Website
                    </a>
                </p>
            ) : (
                <p>🌐 Website not available</p>
            )}

            {/* 📍 MAP */}
            {mapsUrl && (
                <p>
                    📍{" "}
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                        Open in Maps
                    </a>
                </p>
            )}

            {/* 🔍 AUDIT */}
            <details>
                <summary>Audit Details</summary>
                <pre>
                    {lead.audit_json
                        ? JSON.stringify(JSON.parse(lead.audit_json), null, 2)
                        : "No audit data"}
                </pre>
            </details>

            {/* ⚙️ ACTIONS */}
            <div className="actions">
                <button
                    className="approve"
                    onClick={async () => {
                        const email = prompt("Enter recipient email:");
                        if (!email) return;

                        await approveAndSendEmail(lead.id, email, true);
                        onAction();
                    }}
                >
                    Approve & Send Email
                </button>

                <button className="reject" onClick={() => handleAction("REJECTED")}>
                    Reject
                </button>

                <button onClick={generateDraft}>
                    ✉️ Generate Email
                </button>
            </div>

            {/* ✉️ EMAIL EDITOR */}
            {showEditor && (
                <div className="card" style={{ marginTop: "12px" }}>
                    <h4>Email Draft</h4>

                    {loadingDraft ? (
                        <p>Generating draft...</p>
                    ) : (
                        <>
                            <label>Subject</label>
                            <input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                style={{ width: "100%", marginBottom: "8px" }}
                            />

                            <label>Email Body</label>
                            <textarea
                                rows={10}
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                style={{ width: "100%" }}
                            />

                            <div style={{ marginTop: "8px" }}>
                                <button onClick={improveWithGemini} disabled={polishing}>
                                    ✨ Improve with Gemini
                                </button>

                                {polishing && <span> Improving...</span>}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
