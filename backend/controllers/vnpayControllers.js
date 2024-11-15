const moment = require("moment");
const {
  VNPay,
  RefundResponse,
  VnpTransactionType,
  dateFormat,
  getDateInGMT7,
} = require("vnpay");
const Transaction = require("../models/transactions");
const vnpay = new VNPay({
  vnpayHost: "https://sandbox.vnpayment.vn",
  tmnCode: "ESECYRQL",
  secureSecret: "LAQQ75LX1WIGIABTW3FJ41AC8CYEQN72",
  testMode: true,
  hashAlgorithm: "SHA512",
  paymentEndpoint: "paymentv2/vpcpay.html",
});
module.exports = class vnpayAPI {
  static async createPaymentUrl(req, res) {
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let config = require("config");
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let tmnCode = config.get("vnp_TmnCode");
    let secretKey = config.get("vnp_HashSecret");
    let vnpUrl = config.get("vnp_Url");
    let returnUrl = config.get("vnp_ReturnUrl");

    let orderId = moment(date).format("DDHHmmss");
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    let currCode = "VND";
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: "Thanh toan cho ma GD:" + orderId,
      vnp_OrderType: "other",
      vnp_Amount: amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    res.json({ paymentUrl: vnpUrl });
  }
  static async createRefundRequest(req, res) {
    try {
      const {
        amount,
        createdBy,
        orderInfo,
        txnRef,
        transactionDate,
        transactionId,
        reason,
      } = req.body;

      const locale = req.body.language || "vn";
      const refundRequestDate = dateFormat(getDateInGMT7(new Date()));
      const formattedTransactionDate = `${transactionDate.slice(
        0,
        4
      )}/${transactionDate.slice(4, 6)}/${transactionDate.slice(6, 8)}`;
      const orderCreatedAt = dateFormat(
        getDateInGMT7(new Date(formattedTransactionDate))
      );

      const refundData = {
        vnp_Amount: amount,
        vnp_CreateBy: createdBy,
        vnp_CreateDate: refundRequestDate,
        vnp_IpAddr: "127.0.0.1",
        vnp_OrderInfo: `Hoan tien cho ${orderInfo}, Ly do: ${reason}`,
        vnp_RequestId: transactionId,
        vnp_TransactionDate: orderCreatedAt,
        vnp_TransactionType: VnpTransactionType.FULL_REFUND,
        vnp_TxnRef: txnRef,
        vnp_Locale: locale,
        vnp_TransactionNo: transactionId,
      };

      const response = await vnpay.refund(refundData);

      if (response.vnp_ResponseCode === "00") {
        await Transaction.findOneAndUpdate(
          { txnRef, refund: false },
          { refund: true },
          { new: true }
        );
        return res.json({
          success: true,
          message: "Refund successful",
          data: response,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Refund failed",
          data: response,
        });
      }
    } catch (error) {
      console.error("Refund Error:", error);
      return res
        .status(500)
        .json({ error: "Refund failed", details: error.message });
    }
  }

  static async vnPayIPN(req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    var config = require("config");
    var secretKey = config.get("vnp_HashSecret");
    var querystring = require("qs");

    var signData = querystring.stringify(vnp_Params, { encode: false });

    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
