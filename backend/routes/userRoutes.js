const express = require("express");
const router = express.Router();
const usersAPI = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");
const checkPermission = require("../middleware/checkPermission");
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("image");
router.get(
  "/search",
  verifyToken,
  checkPermission("manage_users"),
  usersAPI.getUsers
);
router.get(
  "/",
  verifyToken,
  checkPermission("manage_users"),
  usersAPI.getAllUsers
);
router.get("/ranking/:id", verifyToken, usersAPI.getUserRank);
router.post(
  "/admin/create-user",
  verifyToken,
  checkPermission("create_user"),
  usersAPI.createUserAdmin
);

router.get(
  "/roles/role-detail/:id",
  verifyToken,
  checkPermission("manage_users"),
  usersAPI.getRoleById
);

router.post("/", usersAPI.createUser);
router.get("/search-detail", usersAPI.searchUserNShopByName);
router.get("/:id", usersAPI.getSigleUser);
router.patch(
  "/:id",
  upload,
  verifyToken,
  checkPermission("update_profile"),
  usersAPI.updateUser
);
router.get("/getUserByEmail/:email", usersAPI.getUserByEmail);
router.delete(
  "/:id",
  verifyToken,
  checkPermission("delete_user"),
  usersAPI.deleteUser
);
router.get("/getPermissions/:email", usersAPI.getPermissions);
router.patch(
  "/:id/role",
  verifyToken,
  checkPermission("update_role"),
  usersAPI.updateUserRole
);
router.get("/roles/getAll", usersAPI.getAllRoles);
module.exports = router;
