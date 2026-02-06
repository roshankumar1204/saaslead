const db = require("../config/db");
const { extractIssues } = require("../services/auditIssueService");
const { generateEmailDraft } = require("../services/emailDraftService");
const { polishEmailWithGemini } = require("../services/geminiService");
const { sendEmail } = require("../services/emailSenderService");

/* =========================
   GET PENDING LEADS FOR REVIEW
   ========================= */
function getPendingApprovals(req, res) {
  const query = `
    SELECT 
      b.id,
      b.name,
      b.lead_type,
      b.address,
      b.lat,
      b.lon,
      COALESCE(wa.website, bw.website) AS website,
      wa.score,
      wa.audit_json
    FROM businesses b
    JOIN website_audits wa ON b.id = wa.business_id
    LEFT JOIN business_websites bw ON b.id = bw.business_id
    LEFT JOIN lead_actions la ON b.id = la.business_id
    WHERE la.status IS NULL OR la.status = 'PENDING'
    ORDER BY wa.score ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Approval query error:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ count: rows.length, leads: rows });
  });
}

/* =========================
   APPROVE / REJECT (NO EMAIL)
   ========================= */
function updateApprovalStatus(req, res) {
  const { businessId, status } = req.body;

  db.run(
    `UPDATE lead_actions SET status = ? WHERE business_id = ?`,
    [status, businessId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: `Lead ${status}` });
    }
  );
}

/* =========================
   APPROVE + SEND EMAIL
   ========================= */
async function approveAndSendEmail(req, res) {
  const { businessId, email, useGemini } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Recipient email required" });
  }

  const query = `
    SELECT 
      b.name,
      b.category,
      b.address,
      wa.audit_json
    FROM businesses b
    JOIN website_audits wa ON b.id = wa.business_id
    WHERE b.id = ?
  `;

  db.get(query, [businessId], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Business not found" });

    const audit = JSON.parse(row.audit_json);
    const issues = extractIssues(audit);

    let { subject, body } = generateEmailDraft({
      businessName: row.name,
      category: row.category,
      address: row.address,
      issues
    });

    if (useGemini) {
      try {
        const improved = await polishEmailWithGemini(subject, body);
        const parts = improved.split("Body:");
        subject = parts[0].replace("Subject:", "").trim();
        body = parts[1].trim();
      } catch (e) {
        console.warn("Gemini failed, using base draft");
      }
    }

    await sendEmail({ to: email, subject, body });

    db.run(
      `UPDATE lead_actions SET status = 'APPROVED' WHERE business_id = ?`,
      [businessId]
    );

    res.json({ message: "Email sent and lead approved" });
  });
}

module.exports = {
  getPendingApprovals,
  updateApprovalStatus,
  approveAndSendEmail
};
