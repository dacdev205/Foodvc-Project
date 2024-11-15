import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import FormattedPrice from "../../../ultis/FormatedPriece";
import useUserCurrent from "../../../hooks/useUserCurrent";
import moment from "moment";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Transactions = () => {
  const PF = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];
  const [isRefundButtonVisible, setIsRefundButtonVisible] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!shopId) return;
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosSecure.get(`${PF}/transactions`, {
          params: { shopId, searchTerm, page },
        });
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error(err);
        setError("Không tìm thấy giao dịch nào cả.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [axiosSecure, page, searchTerm, shopId]);

  useEffect(() => {
    const checkOrderStatus = async () => {
      if (!shopId || transactions.length === 0) return;
      setIsLoading(true);
      setError(null);
      try {
        const statusChecks = transactions.map((transaction) =>
          axiosSecure.get(
            `/transactions/${transaction.orderCode}/check-order-status`
          )
        );

        const responses = await Promise.all(statusChecks);

        responses.forEach((response, index) => {
          const orderData = response.data.order;
          if (
            orderData.orderCode === transactions[index].orderCode &&
            orderData.statusId.name === "Completed"
          ) {
            setIsRefundButtonVisible(false);
          }
        });
      } catch (err) {
        console.error(err);
        setError("Không tìm thấy giao dịch nào cả.");
      } finally {
        setIsLoading(false);
      }
    };

    if (transactions.length > 0) {
      checkOrderStatus();
    }
  }, [axiosSecure, shopId, transactions]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const openRefundModal = (transaction) => {
    setSelectedTransaction(transaction);
    setRefundModalOpen(true);
  };

  const closeRefundModal = () => {
    setRefundModalOpen(false);
    setRefundReason("");
    setSelectedTransaction(null);
  };

  const confirmRefund = async () => {
    if (selectedTransaction) {
      await handleRefund(
        selectedTransaction.amount,
        userData?.name,
        selectedTransaction.orderInfo,
        selectedTransaction.txnRef,
        selectedTransaction.payDate,
        selectedTransaction.transactionNo,
        refundReason
      );
      closeRefundModal();
    }
  };

  async function handleRefund(
    amount,
    createdBy,
    orderInfo,
    txnRef,
    transactionDate,
    transactionId,
    reason
  ) {
    try {
      const response = await axios.post(
        "http://localhost:3000/method-deli/create_refund",
        {
          transactionId,
          amount,
          createdBy,
          orderInfo,
          txnRef,
          transactionDate,
          reason,
        }
      );

      if (response.data.success) {
        toast.success("Hoàn tiền thành công!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        // Optionally refresh the transactions list
      } else {
        toast.error(
          "Hoàn tiền thất bại: ",
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          } + response.data.message
        );
      }
    } catch (error) {
      console.error("Hoàn tiền thất bại:", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      toast.error("Đã xảy ra lỗi khi xử lý hoàn tiền.");
    }
  }

  return (
    <div className="w-full md:w-[1100px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý tất cả <span className="text-green">giao dịch</span>
      </h2>
      <div className="flex items-center my-2">
        <label htmlFor="search" className="mr-2 text-black">
          Tìm kiếm theo mã giao dịch / Mã đơn hàng:
        </label>
        <input
          type="text"
          id="search"
          placeholder="Nhập mã giao dịch hoặc mã đơn hàng"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded-md text-black input-sm"
        />
      </div>

      <div>
        <table className="table shadow-lg">
          <thead className="bg-green text-white">
            <tr>
              <th>#</th>
              <th>Mã giao dịch</th>
              <th>Mã đơn hàng</th>
              <th>Ngày thanh toán</th>
              <th>Giá trị</th>
              <th>Trạng thái</th>
              <th>Ngân hàng</th>
              <th>Loại thẻ</th>
              <th>Thông tin đơn hàng</th>
              <th>Hoàn tiền</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="10" className="text-center">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="10" className="text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  Không có giao dịch nào
                </td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
                <tr
                  key={transaction._id}
                  className="text-black border-gray-300"
                >
                  <th>{index + 1}</th>
                  <td>{transaction.transactionNo}</td>
                  <td>
                    <Tooltip arrow title={transaction.orderCode}>
                      <span>{transaction.orderCode.slice(0, 10)}...</span>
                    </Tooltip>
                  </td>

                  <td>
                    <Tooltip
                      arrow
                      title={
                        transaction.payDate
                          ? moment(
                              transaction.payDate,
                              "YYYYMMDDHHmmss"
                            ).format("DD/MM/YYYY HH:mm:ss")
                          : ""
                      }
                    >
                      <span>
                        {transaction.payDate
                          ? moment(transaction.payDate, "YYYYMMDDHHmmss")
                              .format("DD/MM/YYYY HH:mm:ss")
                              .slice(0, 10)
                          : ""}
                        ...
                      </span>
                    </Tooltip>
                  </td>

                  <td>
                    <FormattedPrice price={transaction.amount} />
                  </td>
                  <td>
                    {transaction.transactionStatus === "00"
                      ? "Thành công"
                      : transaction.transactionStatus === "REFUNDED"
                      ? "Đã hoàn tiền"
                      : "Thất bại"}
                  </td>
                  <td>{transaction.bankCode}</td>
                  <td>{transaction.cardType}</td>
                  <td>{transaction.orderInfo}</td>
                  {isRefundButtonVisible && (
                    <td>
                      {transaction.refund ? (
                        <span>Đã yêu cầu hoàn tiền</span>
                      ) : (
                        <button
                          onClick={() => openRefundModal(transaction)}
                          disabled={transaction.refund === true}
                          className="btn btn-ghost bg-purple-600 text-white hover:bg-purple-600 hover:opacity-80"
                        >
                          Hoàn tiền
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {transactions.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="success"
          />
        </div>
      )}

      <Dialog open={refundModalOpen} onClose={closeRefundModal}>
        <DialogTitle>Lý do hoàn tiền</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nhập lý do hoàn tiền"
            fullWidth
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRefundModal} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmRefund} color="secondary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Transactions;
