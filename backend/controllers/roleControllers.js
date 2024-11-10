const Role = require("../models/roles");
const Permission = require("../models/permission");

module.exports = class RoleAPI {
  // Create a new role
  static async createRole(req, res) {
    try {
      const { name, permissions } = req.body;

      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res
          .status(400)
          .send({ message: "Role with this name already exists." });
      }

      const validPermissions = await Permission.find({
        _id: { $in: permissions },
      });
      if (validPermissions.length !== permissions.length) {
        return res
          .status(400)
          .send({ message: "One or more permissions are invalid." });
      }

      const role = new Role({
        name,
        permissions,
      });

      await role.save();
      res.status(201).send({ message: "Role created successfully", role });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  // Get all roles
  static async getAllRoles(req, res) {
    try {
      const roles = await Role.find().populate("permissions");
      res.status(200).send({ roles });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  // Get a specific role by ID
  static async getRoleById(req, res) {
    try {
      const { roleId } = req.params;

      const role = await Role.findById(roleId).populate("permissions");
      if (!role) {
        return res.status(404).send({ message: "Role not found." });
      }

      res.status(200).send({ role });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  // Update a role
  static async updateRole(req, res) {
    try {
      const { roleId } = req.params;
      const { name, permissions } = req.body;

      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).send({ message: "Role not found." });
      }

      if (name) role.name = name;
      if (permissions) {
        // Validate permissions
        const validPermissions = await Permission.find({
          _id: { $in: permissions },
        });
        if (validPermissions.length !== permissions.length) {
          return res
            .status(400)
            .send({ message: "One or more permissions are invalid." });
        }
        role.permissions = permissions;
      }

      await role.save();
      res.status(200).send({ message: "Role updated successfully", role });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  // Delete a role
  static async deleteRole(req, res) {
    try {
      const { roleId } = req.params;

      const role = await Role.findByIdAndDelete(roleId);
      if (!role) {
        return res.status(404).send({ message: "Role not found." });
      }

      res.status(200).send({ message: "Role deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};
