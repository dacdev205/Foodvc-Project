const MethodDelivery = require("../models/methodDelivery");
module.exports = class methodDeliAPI {
  static async createMethod(req, res) {
    try {
      const newMethod = new MethodDelivery(req.body);
      await newMethod.save();
      res.status(201).json(newMethod);
    } catch (error) {
      res.status(400).json({ message: "Error creating method", error });
    }
  }
  static async getAllMethods(req, res) {
    try {
      const methods = await MethodDelivery.find({});
      res.json(methods);
    } catch (error) {
      res.status(500).json({ message: "Error fetching methods", error });
    }
  }
  static async getMethodIdByMethodId(methodId) {
    try {
      const method = await MethodDelivery.findOne({ _id: methodId });
      if (method) {
        return method;
      } else {
        throw new Error("Method not found");
      }
    } catch (err) {
      throw new Error("Error retrieving method ID: " + err.message);
    }
  }
};
