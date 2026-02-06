const express = require("express");
const router = express.Router();

const { polishEmail } = require("../controllers/emailPolishController");

router.post("/email-polish", polishEmail);

module.exports = router;
