const db = require("../config/db");
const { getCoordinates } = require("../services/locationService");
const { getBusinesses } = require("../services/businessService");
const { auditWebsite } = require("../services/auditService");
const { calculateScore } = require("../services/scoreService");
const { classifyLead } = require("../services/leadService");



async function scanLocation(req, res) {
    try {
        const { location } = req.body;

        const { lat, lon } = await getCoordinates(location);
        const businesses = await getBusinesses(lat, lon);

        let inserted = 0;

        for (const b of businesses) {
            // 1️⃣ Insert business (ignore duplicates)
            await new Promise((resolve) => {
                db.run(
                    `
          INSERT OR IGNORE INTO businesses
          (name, category, address, lat, lon)
          VALUES (?, ?, ?, ?, ?)
          `,
                    [b.name, b.category, b.address, b.lat, b.lon],
                    resolve
                );
            });

            // 2️⃣ Get business ID
            const businessRow = await new Promise((resolve, reject) => {
                db.get(
                    `
          SELECT id FROM businesses
          WHERE name = ? AND lat = ? AND lon = ?
          `,
                    [b.name, b.lat, b.lon],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    }
                );
            });

            if (!businessRow) continue;

            // 3️⃣ Insert website info (if exists)
            if (b.website) {
                 const audit = await auditWebsite(b.website);
                const score = calculateScore(audit);

                const leadType = classifyLead(score, true);

                db.run(
                    `
    INSERT INTO website_audits
    (business_id, website, score, audit_json)
    VALUES (?, ?, ?, ?)
    `,
                    [
                        businessRow.id,
                        b.website,
                        score,
                        JSON.stringify(audit)
                    ]
                );// Update lead type
  db.run(
    `
    UPDATE businesses
    SET lead_type = ?
    WHERE id = ?
    `,
    [leadType, businessRow.id]
  );
} else {
  // No website → website creation lead
  db.run(
    `
    UPDATE businesses
    SET lead_type = ?
    WHERE id = ?
    `,
    ["WEBSITE_LEAD", businessRow.id]
  );
}
            


            inserted++;
        }

        res.json({
            message: "Scan completed with normalized storage",
            total_found: businesses.length,
            stored: inserted
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { scanLocation };
