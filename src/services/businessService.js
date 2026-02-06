const axios = require("axios");

async function getBusinesses(lat, lon) {
  const query = `
  [out:json];
  node
    ["shop"]
    (around:2000,${lat},${lon});
  out;
  `;

  const res = await axios.post(
    "https://overpass-api.de/api/interpreter",
    query
  );

  return res.data.elements
    .filter(b => b.tags && b.tags.name)
    .map(b => {
      const tags = b.tags;

      const website =
        tags.website ||
        tags["contact:website"] ||
        tags.contact?.website ||
        tags.url ||
        null;

      const addressParts = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:suburb"],
        tags["addr:city"]
      ].filter(Boolean);

      return {
        name: tags.name.trim(),
        category: tags.shop || "shop",
        address: addressParts.join(", ") || "N/A",
        lat: b.lat,
        lon: b.lon,
        website,
        hasWebsite: Boolean(website),
        websiteSource: website ? "OSM" : null
      };
    });
}

module.exports = { getBusinesses };
