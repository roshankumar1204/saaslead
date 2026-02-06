function extractIssues(audit) {
  if (!audit) return [];

  const issues = [];

  if (audit.error || audit.reachable === false) {
    issues.push(
      "Your website is currently not accessible, which can prevent customers from finding you online"
    );
    return issues;
  }

  if (!audit.hasTitle) {
    issues.push(
      "Your website is missing a proper page title, which affects Google search visibility"
    );
  }

  if (!audit.hasMetaDescription) {
    issues.push(
      "Your site does not have a meta description, reducing click-throughs from search results"
    );
  }

  if (!audit.hasViewport) {
    issues.push(
      "Your website is not fully optimized for mobile users"
    );
  }

  if (!audit.https) {
    issues.push(
      "Your website is not secured with HTTPS, which can affect trust"
    );
  }

  return issues;
}

module.exports = { extractIssues };
