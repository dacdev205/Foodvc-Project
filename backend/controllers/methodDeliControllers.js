const MethodDelivery = require("../models/methodDelivery");
module.exports = class methodDeliAPI {
  static async createMethod(req, res) {
    try {
      const newMethod = new MethodDelivery(req.body);
      await newMethod.save();
      res.status(201).json(newMethod);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Xảy ra lỗi khi tạo phương thức", error });
    }
  }
  static async updateMethod(req, res) {
    try {
      const { id } = req.params;
      const { name, isActive } = req.body;

      if (name == null || isActive == null) {
        return res
          .status(400)
          .json({ message: "Name and isActive are required" });
      }

      const updatedMethod = await MethodDelivery.findByIdAndUpdate(
        id,
        { name, isActive },
        { new: true }
      );

      if (!updatedMethod) {
        return res.status(404).json({ message: "Payment method not found" });
      }

      res.json({
        message: "Payment method updated successfully",
        method: updatedMethod,
      });
    } catch (error) {
      console.error("Error updating payment method:", error);
      res.status(500).json({
        message: "Failed to update payment method",
        error: error.message || error,
      });
    }
  }

  static async getAllMethods(req, res) {
    try {
      const methods = await MethodDelivery.find({ isActive: true });
      res.json(methods);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Xảy ra lỗi khi lấy phương thức", error });
    }
  }

  static async getAllMethodsAdmin(req, res) {
    try {
      const { page = 1, limit = 5, searchTerm = "" } = req.query;

      const query = searchTerm
        ? { name: { $regex: searchTerm, $options: "i" } }
        : {};

      const totalMethods = await MethodDelivery.countDocuments(query);

      const methods = await MethodDelivery.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      res.json({
        methods,
        totalPages: Math.ceil(totalMethods / limit),
        currentPage: Number(page),
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Xảy ra lỗi khi lấy phương thức", error });
    }
  }

  static async getMethodIdByMethodId(methodId) {
    try {
      const method = await MethodDelivery.findOne({ _id: methodId });
      if (method) {
        return method;
      } else {
        throw new Error("Phương thức không tìm thấy");
      }
    } catch (err) {
      throw new Error("Lỗi truy xuất ID phương thức: " + err.message);
    }
  }
  static async updateStatus(req, res) {
    try {
      const { methodId, isActive } = req.body;
      if (methodId === undefined || isActive === undefined) {
        return res
          .status(400)
          .json({ message: "methodId and isActive are required." });
      }
      const updatedMethod = await MethodDelivery.findByIdAndUpdate(
        methodId,
        { isActive },
        { new: true }
      );

      if (!updatedMethod) {
        return res.status(404).json({ message: "Method not found." });
      }

      res.json({
        message: "Cập nhật trạng thái thành công",
        method: updatedMethod,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Xảy ra lỗi khi cập nhật trạng thái", error });
    }
  }
  static async deleteShippingPartner(req, res) {
    try {
      const deletedMethod = await MethodDelivery.findByIdAndDelete(
        req.params.id
      );
      if (!deletedMethod) {
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
