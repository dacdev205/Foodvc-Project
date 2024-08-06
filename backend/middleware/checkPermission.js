const User = require("../models/user");
const Role = require("../models/roles");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const email = req.decoded.email;
      const user = await User.findOne({ email: email }).populate("roles");

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const userPermissions = await Promise.all(
        user.roles.map(async (roleId) => {
          const role = await Role.findById(roleId);
          return role ? role.permissions : [];
        })
      );

      // Flatten danh sách các quyền và kiểm tra quyền yêu cầu
      const flatPermissions = [].concat(...userPermissions);
      const hasPermission = flatPermissions.includes(requiredPermission);

      if (!hasPermission) {
        return res.status(403).send({ message: "Forbidden access" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  };
};

module.exports = checkPermission;
