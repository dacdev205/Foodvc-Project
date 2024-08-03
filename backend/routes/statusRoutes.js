const statusesAPI = require("../controllers/statusesControllers");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get("/", statusesAPI.gettAllStatuses);

module.exports = router;
