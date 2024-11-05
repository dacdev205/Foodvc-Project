const express = require("express");
const router = express.Router();
const checkPermission = require("../middleware/checkPermission");
const categoryAPI = require("../controllers/categoryControllers");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/create_category",
  verifyToken,
  checkPermission("dashboard_actions"),
  categoryAPI.createCategory
);
router.get(
  "/get-all",
  verifyToken,
  checkPermission("read"),
  categoryAPI.getCategories
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("read"),
  categoryAPI.getCategoryById
);
router.put(
  "/:id",
  verifyToken,
  checkPermission("dashboard_actions"),
  categoryAPI.updateCategory
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission("dashboard_actions"),
  categoryAPI.deleteCategory
);

module.exports = router;
