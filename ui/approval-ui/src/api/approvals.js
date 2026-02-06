const BASE_URL = "http://localhost:5000/api";

/* =========================
   FETCH PENDING LEADS
   ========================= */
export async function fetchPendingLeads() {
  const res = await fetch(`${BASE_URL}/approvals/pending`);
  return res.json();
}

/* =========================
   UPDATE LEAD STATUS ONLY
   (Approve / Reject without email)
   ========================= */
export async function updateLeadStatus(businessId, status) {
  const res = await fetch(`${BASE_URL}/approvals/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ businessId, status })
  });

  return res.json();
}

/* =========================
   APPROVE + SEND EMAIL
   ========================= */
export async function approveAndSendEmail(
  businessId,
  email,
  useGemini = true
) {
  const res = await fetch(`${BASE_URL}/approvals/approve-send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      businessId,
      email,
      useGemini
    })
  });

  return res.json();
}
