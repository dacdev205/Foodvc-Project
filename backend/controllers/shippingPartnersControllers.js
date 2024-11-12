const ShippingPartner = require("../models/shippingPartner");
const User = require("../models/user");
const Role = require("../models/roles");

module.exports = class shippingPartnerAPI {
  static async createShippingPartner(req, res) {
    try {
      const email = req.decoded.email;
      const user = await User.findOne({ email }).populate("roles");

      if (!user) {
        return res.status(401).json({ message: "Không có quyền truy cập" });
      }

      const adminRole = await Role.findOne({ name: "admin" });

      if (
        !user.roles.some(
          (role) => role._id.toString() === adminRole._id.toString()
        )
      ) {
        return res.status(403).json({ message: "Bạn không phải là admin" });
      }
      const existingPartner = await ShippingPartner.findOne({
        name: req.body.name,
      });
      if (existingPartner) {
        return res
          .status(400)
          .json({ message: "Tên đối tác vận chuyển đã tồn tại" });
      }

      const newShippingPartner = new ShippingPartner({
        name: req.body.name,
        description: req.body.description,
        requiredFields: req.body.requiredFields || ["apiToken", "shopId"],
      });

      await newShippingPartner.save();

      res.status(201).json(newShippingPartner);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllShippingPartners(req, res) {
    try {
      const { page = 1, limit = 5, search = "" } = req.query;

      const pageNumber = parseInt(page);
      const pageSize = parseInt(limit);

      const filter = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const totalCount = await ShippingPartner.countDocuments(filter);

      const partners = await ShippingPartner.find(filter)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

      const totalPages = Math.ceil(totalCount / pageSize);

      res.status(200).json({
        partners,
        totalPages,
        currentPage: pageNumber,
        totalCount,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getShippingPartnerById(req, res) {
    try {
      const partner = await ShippingPartner.findById(req.params.id);
      if (!partner) {
        return res
          .status(404)
          .json({ message: "Đối tác vận chuyển không tồn tại" });
      }
      res.status(200).json(partner);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateShippingPartner(req, res) {
    try {
      const updatedPartner = await ShippingPartner.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedPartner) {
        return res
          .status(404)
          .json({ message: "Đối tác vận chuyển không tồn tại" });
      }
      res.status(200).json(updatedPartner);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteShippingPartner(req, res) {
    try {
      const deletedPartner = await ShippingPartner.findByIdAndDelete(
        req.params.id
      );
      if (!deletedPartner) {
        return res
          .status(404)
          .json({ message: "Đối tác vận chuyển không tồn tại" });
      }
      res
        .status(200)
        .json({ message: "Đối tác vận chuyển đã bị xóa thành công" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
