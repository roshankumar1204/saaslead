const express = require("express");
const router = express.Router();

const { scanLocation } = require("../controllers/scanController");

router.post("/scan", scanLocation);

module.exports = router;
