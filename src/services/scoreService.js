function calculateScore(audit) {
  let score = 0;

  if (!audit || audit.error) return 0;

  if (audit.reachable) score += 30;
  if (audit.hasTitle) score += 15;
  if (audit.hasMetaDescription) score += 15;
  if (audit.hasViewport) score += 20;
  if (audit.https) score += 20;

  return score;
}

module.exports = { calculateScore };
