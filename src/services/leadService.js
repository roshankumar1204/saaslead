function classifyLead(score, hasWebsite) {
  if (!hasWebsite) return "WEBSITE_LEAD";

  if (score <= 40) return "HOT";
  if (score <= 70) return "WARM";
  return "COLD";
}

module.exports = { classifyLead };
