const db = require("../config/db");
const { extractIssues } = require("../services/auditIssueService");
const { generateEmailDraft } = require("../services/emailDraftService");

function generateDraftForBusiness(req, res) {
  const { businessId } = req.params;

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

  db.get(query, [businessId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ error: "Business not found" });
    }

    const audit = row.audit_json
      ? JSON.parse(row.audit_json)
      : null;

    const issues = extractIssues(audit);

    const draft = generateEmailDraft({
      businessName: row.name,
      category: row.category,
      address: row.address,
      issues
    });

    res.json({
      businessId,
      draft
    });
  });
}

module.exports = { generateDraftForBusiness };
