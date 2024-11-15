const express = require("express");
const UserRankAPI = require("../controllers/userRankControllers");

const router = express.Router();
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
router.post(
  "/",
  verifyToken,
  checkPermission(["admin_actions", "quan_ly_cap_bac"]),
  UserRankAPI.createUserRank
);
router.get(
  "/",
  verifyToken,
  checkPermission(["admin_actions", "quan_ly_cap_bac"]),
  UserRankAPI.getAllUserRanks
);
router.get("/:id", UserRankAPI.getUserRankById);
router.put(
  "/:id",
  verifyToken,
  checkPermission(["admin_actions", "quan_ly_cap_bac"]),
  UserRankAPI.updateUserRank
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission(["admin_actions", "quan_ly_cap_bac"]),
  UserRankAPI.deleteUserRank
);

module.exports = router;
