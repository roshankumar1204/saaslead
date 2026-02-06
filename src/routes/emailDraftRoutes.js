const express = require("express");
const router = express.Router();

const {
  generateDraftForBusiness
} = require("../controllers/emailDraftController");

router.get("/email-draft/:businessId", generateDraftForBusiness);

module.exports = router;
