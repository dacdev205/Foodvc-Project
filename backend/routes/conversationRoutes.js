const conversationsAPI = require("../controllers/conversationsControllers");
const router = require("express").Router();
const checkPermission = require("../middleware/checkPermission");

//middleware
router.post(
  "/",
  checkPermission(["create"]),
  conversationsAPI.createConversations
);
router.get(
  "/:userId",
  checkPermission(["read"]),
  conversationsAPI.getConversationsById
);
module.exports = router;
