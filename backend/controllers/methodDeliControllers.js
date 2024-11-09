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
  static async getAllMethods(req, res) {
    try {
      const methods = await MethodDelivery.find({});
      res.json(methods);
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
};
