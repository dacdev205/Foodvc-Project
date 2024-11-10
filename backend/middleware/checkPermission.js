const User = require("../models/user");
const Role = require("../models/roles");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const email = req?.decoded?.email;

      const user = await User.findOne({ email }).populate({
        path: "roles",
        populate: {
          path: "permissions",
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const userPermissions = user.roles.reduce((permissions, role) => {
        return permissions.concat(role.permissions || []);
      }, []);

      const hasPermission = userPermissions.some((permission) => {
        return (
          permission.name === requiredPermission ||
          permission._id.toString() === requiredPermission
        );
      });

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
