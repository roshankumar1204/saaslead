const express = require("express");
const router = express.Router();

const {
  getPendingApprovals,
  updateApprovalStatus,
  approveAndSendEmail
} = require("../controllers/approvalController");

router.get("/approvals/pending", getPendingApprovals);
router.post("/approvals/update", updateApprovalStatus);
router.post("/approvals/approve-send", approveAndSendEmail);

module.exports = router;
