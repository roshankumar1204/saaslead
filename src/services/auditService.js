const axios = require("axios");
const cheerio = require("cheerio");

async function auditWebsite(url) {
  try {
    const res = await axios.get(url, {
      timeout: 8000,
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(res.data);

    return {
      reachable: true,
      hasTitle: Boolean($("title").text()),
      hasMetaDescription: Boolean(
        $('meta[name="description"]').attr("content")
      ),
      hasViewport: Boolean(
        $('meta[name="viewport"]').attr("content")
      ),
      https: url.startsWith("https")
    };
  } catch {
    return {
      reachable: false,
      error: "Website unreachable"
    };
  }
}

module.exports = { auditWebsite };
