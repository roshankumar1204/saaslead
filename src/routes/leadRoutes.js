const express = require("express");
const router = express.Router();

const {
  getLeadsByType,
  getAllLeads
} = require("../controllers/leadController");

router.get("/leads/:type", getLeadsByType);
router.get("/leads", getAllLeads);

module.exports = router;
