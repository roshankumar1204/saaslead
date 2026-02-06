export async function fetchEmailDraft(businessId) {
  const res = await fetch(
    `http://localhost:5000/api/email-draft/${businessId}`
  );
  return res.json();
}

export async function polishWithGemini(subject, body) {
  const res = await fetch(
    "http://localhost:5000/api/email-polish",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body })
    }
  );

  return res.json();
}
