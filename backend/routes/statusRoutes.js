const statusesAPI = require("../controllers/statusesControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get("/", verifyToken, statusesAPI.gettAllStatuses);

module.exports = router;
