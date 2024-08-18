import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập API gọi để lấy dữ liệu ví điện tử ban đầu
    fetchWalletData();
  }, []);

  const fetchWalletData = () => {
    setLoading(true);
    setTimeout(() => {
      // Ví dụ số dư ban đầu và lịch sử giao dịch
      setBalance(200000);
      setTransactions([
        {
          id: 1,
          description: "Thanh toán đơn hàng #67890",
          amount: -200000,
          date: "2024-08-10",
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleRefund = () => {
    // Giả lập API gọi để nhận tiền hoàn
    setTimeout(() => {
      const refundAmount = 300000;
      setBalance((prevBalance) => prevBalance + refundAmount); // Cập nhật số dư
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        {
          id: 2,
          description: "Hoàn tiền đơn hàng #12345",
          amount: refundAmount,
          date: "2024-08-12",
        },
      ]);
    }, 1000);
  };

  return (
    <Box className="wallet-container p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <Box className="flex justify-center items-center h-[400px]">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card className="balance-card shadow-lg">
              <CardContent className="flex justify-between items-center p-6">
                <Typography variant="h5" className="text-gray-700">
                  Số dư hiện tại
                </Typography>
                <Typography variant="h4" className="text-green-600 font-bold">
                  {balance.toLocaleString()} VND
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" className="text-gray-700 mb-3">
              Lịch sử giao dịch
            </Typography>
            {transactions.length ? (
              transactions.map((transaction) => (
                <Card
                  key={transaction.id}
                  className="transaction-card shadow-md mb-4"
                >
                  <CardContent className="flex justify-between items-center p-4">
                    <div>
                      <Typography variant="body1" className="text-gray-800">
                        {transaction.description}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        {transaction.date}
                      </Typography>
                    </div>
                    <Typography
                      variant="h6"
                      className={`font-bold ${
                        transaction.amount < 0 ? "text-red" : "text-green"
                      }`}
                    >
                      {transaction.amount.toLocaleString()} VND
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography className="text-center text-gray-500">
                Chưa có giao dịch nào.
              </Typography>
            )}
          </Grid>

          {/* Nút giả lập việc nhận tiền hoàn */}
          <Grid item xs={12} className="flex justify-center">
            <button
              className="bg-green text-white py-2 px-4 rounded shadow hover:bg-green-600"
              onClick={handleRefund}
            >
              Nhận tiền hoàn từ đơn hàng đã hủy
            </button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Wallet;
