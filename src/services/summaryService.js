function generateSummary(audit, score) {
  if (!audit || audit.error) {
    return `Website unreachable.
This business likely needs a technical rebuild or hosting fix.`;
  }

  const issues = [];

  if (!audit.hasTitle) issues.push("Missing page title");
  if (!audit.hasMetaDescription) issues.push("Missing meta description");
  if (!audit.hasViewport) issues.push("Not mobile friendly");
  if (!audit.https) issues.push("Not using HTTPS");

  return `
Website Score: ${score}/100

Issues Found:
- ${issues.length ? issues.join("\n- ") : "No major issues"}

Opportunity:
Improving these areas can increase online visibility and customer reach.
`.trim();
}

module.exports = { generateSummary };
