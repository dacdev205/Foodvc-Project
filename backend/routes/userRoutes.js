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
router.get("/search", verifyToken, usersAPI.getUsers);
router.get(
  "/",
  verifyToken,
  checkPermission(["admin_actions"]),
  usersAPI.getAllUsers
);
router.get("/ranking/:id", verifyToken, usersAPI.getUserRank);
router.post(
  "/admin/create-user",
  verifyToken,
  checkPermission(["admin_actions"]),
  usersAPI.createUserAdmin
);

router.get("/roles/role-detail/:id", verifyToken, usersAPI.getRoleById);

router.post("/", usersAPI.createUser);
router.post(
  "/create-user-with-custom-role",
  verifyToken,
  checkPermission(["admin_actions"]),
  usersAPI.createUserWithCustomRoles
);
router.get("/search-detail", usersAPI.searchUserNShopByName);
router.get("/:id", verifyToken, usersAPI.getSigleUser);
router.patch(
  "/:id",
  upload,
  verifyToken,
  checkPermission(["update"]),
  usersAPI.updateUser
);
router.get("/getUserByEmail/:email", usersAPI.getUserByEmail);
router.delete(
  "/:id",
  verifyToken,
  checkPermission(["admin_actions"]),
  usersAPI.deleteUser
);
router.get("/getPermissions/:email", usersAPI.getPermissions);
router.patch(
  "/:id/role",
  verifyToken,
  checkPermission(["admin_actions"]),
  usersAPI.updateUserRole
);
router.get("/roles/getAll", usersAPI.getAllRoles);
module.exports = router;
