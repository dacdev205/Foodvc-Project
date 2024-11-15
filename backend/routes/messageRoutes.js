const express = require("express");
const router = express.Router();
const messageAPI = require("../controllers/messageControllers");
const verifyToken = require("../middleware/verifyToken");
const checkPermission = require("../middleware/checkPermission");
router.post(
  "/send-message",
  verifyToken,
  checkPermission(["create"]),
  messageAPI.sendMessage
);
router.get(
  "/:conversationsId",
  verifyToken,
  checkPermission(["read"]),
  messageAPI.fetchMessageById
);
module.exports = router;
