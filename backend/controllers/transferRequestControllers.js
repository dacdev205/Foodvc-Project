const TransferRequest = require("../models/transferRequest");
const Product = require("../models/product");
module.exports = class TransferReqestAPI {
  static async requestTransferToMenu(req, res) {
    try {
      const { productId, quantity, shopId } = req.body;

      const existingRequest = await TransferRequest.findOne({
        productId,
        status: "pending",
      });

      if (existingRequest) {
        return res.status(400).json({
          message:
            "Sản phẩm đã được gửi yêu cầu đưa lên menu, vui lòng đợi admin xử lý.",
        });
      }

      const newRequest = new TransferRequest({
        productId,
        quantity,
        shopId,
        status: "pending",
      });

      await newRequest.save();
      res.status(200).json({ message: "Yêu cầu đã được gửi để xét duyệt" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Có lỗi xảy ra khi gửi yêu cầu" });
    }
  }

  static async getShopRequestTransferToMenu(req, res) {
    try {
      const {
        searchTerm = "",
        page = 1,
        limit = 5,
        status = "all",
        shopId,
      } = req.query;

      if (!shopId) {
        return res.status(400).json({ message: "shopId is required" });
      }

      let query = { shopId };

      if (status && status !== "all") {
        query.status = status;
      }

      if (searchTerm) {
        const productIdsByName = await Product.find({
          name: { $regex: searchTerm, $options: "i" },
        }).select("_id");

        query.productId = { $in: productIdsByName.map((p) => p._id) };
      }

      const totalRequests = await TransferRequest.countDocuments(query);
      const totalPages = Math.ceil(totalRequests / limit);

      const requests = await TransferRequest.find(query)
        .populate({
          path: "productId",
          select: "name price image",
          match: { name: { $regex: searchTerm, $options: "i" } },
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

      res.json({ requests, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getRequestTransferToMenuAdmin(req, res) {
    try {
      const {
        searchTerm = "",
        page = 1,
        limit = 5,
        status = "all",
      } = req.query;

      let query = {};

      if (status && status !== "all") {
        query.status = status;
      }

      if (searchTerm) {
        const productIdsByName = await Product.find({
          name: { $regex: searchTerm, $options: "i" },
        }).select("_id");

        if (query["productId"]) {
          query["productId"]["$in"] = query["productId"]["$in"].filter((id) =>
            productIdsByName.some((p) => p._id.equals(id))
          );
        } else {
          query["productId"] = { $in: productIdsByName.map((p) => p._id) };
        }
      }

      const validPage = Math.max(1, parseInt(page));
      const skip = (validPage - 1) * limit;

      const totalRequests = await TransferRequest.countDocuments(query);
      const totalPages = Math.ceil(totalRequests / limit);
      const requests = await TransferRequest.find(query)
        .populate({
          path: "productId",
          select: "name price image",
          match: { name: { $regex: searchTerm, $options: "i" } },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec();

      res.json({ requests, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
