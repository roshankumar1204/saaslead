const db = require("../config/db");

/* =========================
   GET LEADS BY TYPE
   ========================= */
function getLeadsByType(req, res) {
  const { type } = req.params;

  const query = `
    SELECT 
      b.id,
      b.name,
      b.category,
      b.address,
      b.lead_type,
      COALESCE(wa.website, bw.website) AS website,
      wa.score,
      wa.audited_at
    FROM businesses b
    LEFT JOIN business_websites bw 
      ON b.id = bw.business_id
    LEFT JOIN website_audits wa
      ON b.id = wa.business_id
    WHERE b.lead_type = ?
    ORDER BY wa.score ASC
  `;

  db.all(query, [type], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      count: rows.length,
      leads: rows
    });
  });
}

/* =========================
   GET ALL LEADS
   ========================= */
function getAllLeads(req, res) {
  const query = `
    SELECT 
      b.id,
      b.name,
      b.category,
      b.address,
      b.lead_type,
      COALESCE(wa.website, bw.website) AS website,
      wa.score
    FROM businesses b
    LEFT JOIN business_websites bw 
      ON b.id = bw.business_id
    LEFT JOIN website_audits wa
      ON b.id = wa.business_id
    ORDER BY 
      CASE 
        WHEN b.lead_type = 'HOT' THEN 1
        WHEN b.lead_type = 'WARM' THEN 2
        WHEN b.lead_type = 'WEBSITE_LEAD' THEN 3
        ELSE 4
      END
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      count: rows.length,
      leads: rows
    });
  });
}

module.exports = {
  getLeadsByType,
  getAllLeads
};
