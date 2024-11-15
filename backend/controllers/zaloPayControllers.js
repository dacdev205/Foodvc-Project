// paymentController.js
const axios = require("axios").default;
const CryptoJS = require("crypto-js");
const moment = require("moment");
const Order = require("../models/order");
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

module.exports = class ZaloPayAPI {
  static async createZaloPayOrder(req, res) {
    try {
      const { app_user, amount, description, bank_code } = req.body;

      const transID = Math.floor(Math.random() * 1000000);

      const embed_data = {};
      const items = [{}];

      const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
        app_user: app_user || "user123",
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount || 50000,
        description: description || `Payment for order #${transID}`,
        bank_code: bank_code || "zalopayapp",
        callback_url: "https://foodvc.serveo.net/zalo-pay/call-back",
      };

      const data = [
        config.app_id,
        order.app_trans_id,
        order.app_user,
        order.amount,
        order.app_time,
        order.embed_data,
        order.item,
      ].join("|");

      order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      const response = await axios.post(config.endpoint, null, {
        params: order,
      });

      return res.status(200).json(response.data);
    } catch (error) {
      console.error("ZaloPay Order Error:", error);
      return res.status(500).json({ error: "Error creating ZaloPay order" });
    }
  }

  static async handlePaymentCallback(req, res) {
    let result = {};
    console.log("Received a callback request:", req.body);

    try {
      const dataStr = req.body.data;
      const reqMac = req.body.mac;

      const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("Calculated MAC =", mac);

      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        const dataJson = JSON.parse(dataStr);
        const app_user = dataJson["app_user"];

        const order = await Order.findOne({ orderCode: app_user });

        if (order) {
          order.paymentStatus = true;
          await order.save();

          console.log(
            "Update order's status = success where app_user =",
            app_user
          );

          result.return_code = 1;
          result.return_message = "success";
        } else {
          console.log("Order not found for app_user =", app_user);
          result.return_code = -1;
          result.return_message = "Order not found";
        }
      }
    } catch (error) {
      console.error("Error in payment callback handling:", error);
      result.return_code = 0;
      result.return_message = error.message;
    }

    res.json(result);
  }
};
