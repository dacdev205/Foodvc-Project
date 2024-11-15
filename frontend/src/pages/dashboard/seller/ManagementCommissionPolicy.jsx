import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Pagination } from "@mui/material";
import { Bounce, toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import FormattedPrice from "../../../ultis/FormatedPriece";
import useUserCurrent from "../../../hooks/useUserCurrent";

const ManagementCommissionPolicy = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];

  const { data: commissionData = {}, isLoading } = useQuery({
    queryKey: ["shopCommission", shopId, page, searchTerm],
    queryFn: async () => {
      if (!shopId) {
        return { requests: [], totalPages: 0 };
      }
      const res = await axiosSecure.get(`/shop/${shopId}/commission`, {
        params: { page, limit: 5, searchTerm },
      });
      setTotalPages(res.data.totalPages);
      return res.data;
    },
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleCommssionWithZaloPay = async (order) => {
    const payload = {
      app_user: order.orderCode,
      amount: Math.round(order.commissionAmount),
      description: `Thanh toán chiết khấu hoa hồng cho đơn #${order.orderCode}`,
      bank_code: "zalopayapp",
    };

    try {
      const response = await axiosSecure.post(
        "/zalo-pay/create-zalopay-order",
        payload
      );

      if (response.data && response.data.order_url) {
        window.open(response.data.order_url, "_blank");
      } else {
        toast.error("Failed to create ZaloPay order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating ZaloPay order:", error);
      toast.error("Error processing payment with ZaloPay.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">phí hoa hồng cửa hàng</span>
      </h2>
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <CircularProgress color="success" />
          </div>
        ) : commissionData.commissionTier ? (
          <div>
            <h1>
              - Cấp bậc hoa hồng hiện tại của bạn là:{" "}
              <strong>{commissionData.commissionTier.name}</strong>
            </h1>

            <p> - Mô tả: {commissionData.commissionTier.description}</p>
            <span>
              - Doanh thu yêu cầu:{" "}
              <FormattedPrice
                price={commissionData.commissionTier.revenueRequired}
              ></FormattedPrice>
            </span>
            <p>
              - Tỷ lệ hoa hồng (%):{" "}
              <strong>{commissionData.commissionTier.commissionRate}%</strong>
            </p>
            <h3 className="text-md mt-4">
              Tổng giá trị của các đơn hàng đã hoàn thành:{" "}
              <FormattedPrice
                price={commissionData.shopRevenue}
              ></FormattedPrice>
            </h3>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            Không có chính sách nào
          </div>
        )}

        <h3 className="text-xl mt-4">
          Danh sách hoa hồng phải trả cho các đơn hàng:
        </h3>
        <table className="table md:w-[870px] shadow-lg mt-4">
          <thead className="bg-green text-white rounded-lg">
            <tr>
              <th>#</th>
              <th>Mã đơn hàng</th>
              <th>Tổng giá trị đơn hàng</th>
              <th className="text-center">Số tiền hoa hồng phải trả</th>
              <td>Thanh toán</td>
            </tr>
          </thead>
          <tbody>
            {commissionData.orderCommissions &&
            commissionData.orderCommissions.length > 0 ? (
              commissionData.orderCommissions.map((order, index) => (
                <tr key={order.orderId}>
                  <td>{index + 1}</td>
                  <td>{order.orderCode}</td>
                  <td>
                    <FormattedPrice price={order.orderAmount}></FormattedPrice>
                  </td>
                  <td className="text-center">
                    <FormattedPrice
                      price={order.commissionAmount}
                    ></FormattedPrice>
                  </td>
                  <td>
                    <button onClick={() => handleCommssionWithZaloPay(order)}>
                      <img src="/images/logo-zalopay.svg" alt="" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="success"
          />
        </div>
      </div>
    </div>
  );
};

export default ManagementCommissionPolicy;
