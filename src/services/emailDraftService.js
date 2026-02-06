function generateEmailDraft({
  businessName,
  category,
  address,
  issues
}) {
  const area = address && address !== "N/A"
    ? address.split(",")[0]
    : "your area";

  const issueText =
    issues.length > 0
      ? issues.map(i => `• ${i}`).join("\n")
      : "• Your website looks generally fine, but there are opportunities to improve performance and visibility";

  const subject = `Quick improvement ideas for ${businessName}`;

  const body = `
Hi ${businessName} team,

I was reviewing local ${category || "businesses"} around ${area}, and I took a look at your website.

While going through it, I noticed a few things that might be affecting how customers find and experience your business online:

${issueText}

For businesses like yours, improving these areas usually helps:
• customers find you more easily on Google
• mobile users have a smoother experience
• build more trust before someone visits or contacts you

I work on fixing exactly these kinds of issues — from basic SEO and mobile improvements to making websites more reliable and user-friendly.

If you’d like, I can share a short, no-obligation plan outlining what could be improved specifically for ${businessName}.just reply to this email and we will put something together.

Best regards,  
roshan kumar 
https://rizhu.netlify.app/
`.trim();

  return { subject, body };
}

module.exports = { generateEmailDraft };
