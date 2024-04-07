const conversationsAPI = require("../controllers/conversationsControllers")
const router = require("express").Router();
//middleware
router.post("/",conversationsAPI.createConversations);
router.get("/:userId", conversationsAPI.getConversationsById)
module.exports = router;
