import React, { useState, useEffect } from "react";
import { CircularProgress, Pagination, Tooltip } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import FormattedPrice from "../../../ultis/FormatedPriece";
import moment from "moment";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManagementTransactions = () => {
  const PF = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosSecure.get(`${PF}/transactions/admin`, {
          params: {
            searchTerm,
            page,
          },
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
  }, [axiosSecure, page, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="w-full md:w-[1150px] px-4 mx-auto">
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
              <th>Thao tác</th>
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
                  <td className="underline">
                    <a
                      href={`https://sandbox.vnpayment.vn/merchantv2/Transaction/PaymentDetail/${transaction.transactionNo}.htm`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400"
                    >
                      Xem chi tiết
                    </a>
                  </td>
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
    </div>
  );
};

export default ManagementTransactions;
