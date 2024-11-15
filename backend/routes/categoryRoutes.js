const express = require("express");
const router = express.Router();
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const categoryAPI = require("../controllers/categoryControllers");

router.post(
  "/create_category",
  verifyToken,
  checkPermission(["quan_ly_danh_muc", "admin_actions"]),
  categoryAPI.createCategory
);
router.get(
  "/get-all",
  verifyToken,
  checkPermission(["read"]),
  categoryAPI.getCategories
);
router.get(
  "/:id",
  verifyToken,
  checkPermission(["read"]),
  categoryAPI.getCategoryById
);
router.put(
  "/:id",
  verifyToken,
  checkPermission(["quan_ly_danh_muc", "admin_actions"]),

  categoryAPI.updateCategory
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission(["quan_ly_danh_muc", "admin_actions"]),

  categoryAPI.deleteCategory
);

module.exports = router;
