const axios = require("axios");

async function getCoordinates(place) {
  const url = "https://nominatim.openstreetmap.org/search";

  const res = await axios.get(url, {
    params: {
      format: "json",
      q: place,
      limit: 1
    },
  });

  if (!res.data.length) {
    throw new Error("Location not found");
  }

  return {
    lat: res.data[0].lat,
    lon: res.data[0].lon
  };
}

module.exports = { getCoordinates };
