const Permission = require("../models/permission");

module.exports = class PermissionAPI {
  static async createPermission(req, res) {
    try {
      const { name, description } = req.body;

      const existingPermission = await Permission.findOne({ name });
      if (existingPermission) {
        return res
          .status(400)
          .send({ message: "Permission with this name already exists." });
      }

      const permission = new Permission({
        name,
        description,
      });

      await permission.save();
      res
        .status(201)
        .send({ message: "Permission created successfully", permission });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async getAllPermissions(req, res) {
    try {
      const { page = 1, limit = 10, search, sort = "-createdAt" } = req.query;

      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      const skip = (pageNumber - 1) * pageSize;

      const searchQuery = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const permissions = await Permission.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);

      const totalPermissions = await Permission.countDocuments(searchQuery);

      const totalPages = Math.ceil(totalPermissions / pageSize);

      res.status(200).send({
        permissions,
        totalPermissions,
        totalPages,
        currentPage: pageNumber,
        pageSize,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async getPermissionByName(req, res) {
    try {
      const { name } = req.params;

      const permission = await Permission.findOne({ name });
      if (!permission) {
        return res.status(404).send({ message: "Permission not found." });
      }

      res.status(200).send({ permission });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async updatePermission(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const permission = await Permission.findByIdAndUpdate(id);
      if (!permission) {
        return res.status(404).send({ message: "Permission not found." });
      }

      if (description && name) {
        permission.description = description;
        permission.name = name;
        await permission.save();
      }

      res
        .status(200)
        .send({ message: "Permission updated successfully", permission });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }

  static async deletePermission(req, res) {
    try {
      const { id } = req.params;

      const permission = await Permission.findByIdAndDelete(id);
      if (!permission) {
        return res.status(404).send({ message: "Permission not found." });
      }

      res.status(200).send({ message: "Permission deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};
