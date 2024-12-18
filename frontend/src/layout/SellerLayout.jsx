import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdDashboardCustomize,
  MdOutlineInventory,
  MdOutlineRateReview,
} from "react-icons/md";
import { VscLayoutMenubar } from "react-icons/vsc";
import {
  FaWarehouse,
  FaUser,
  FaQuestionCircle,
  FaShoppingBag,
  FaChessBishop,
  FaRegMoneyBillAlt,
} from "react-icons/fa";
import { RiMoneyCnyCircleLine } from "react-icons/ri";
import { IoIosAddCircle, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import Login from "../components/Account/Login";
import usePermission from "../hooks/usePermission";
import orderRequestAPI from "../api/orderRequest";
import useUserCurrent from "../hooks/useUserCurrent";

const SellerLayout = () => {
  const [rolePermission, isPermissionLoading] = usePermission(["seller_pages"]);
  const [promotionsOpen, setPromotionsOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [orderRequests, setOrderRequests] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const location = useLocation();
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];

  const togglePromotions = () => setPromotionsOpen(!promotionsOpen);
  const toggleInventory = () => setInventoryOpen(!inventoryOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSupport = () => setSupportOpen(!supportOpen);

  useEffect(() => {
    const fetchOrderReq = async () => {
      try {
        const response = await orderRequestAPI.getAllCancelReq(
          searchTerm,
          page,
          limit,
          shopId
        );
        if (response && response.requests) {
          const pendingOrders = response?.requests?.filter(
            (order) => order.status === "Pending"
          );
          setOrderRequests(pendingOrders.length);
          setTotalPages(response.totalPages);
        } else {
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setTotalPages(1);
      }
    };

    fetchOrderReq();
  }, [limit, page, searchTerm, shopId]);
  const handleOrderRequestsClick = () => {
    setOrderRequests(0);
  };
  function hasPermission(permission) {
    const permissionsList = ["seller_pages"];
    const index = permissionsList.indexOf(permission);
    return rolePermission[index] || false;
  }
  const isSeller = hasPermission("seller_pages");

  return (
    <div>
      {isSeller ? (
        <div className="drawer sm:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2 bg-white">
            <div className="flex items-center justify-between mx-4">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-primary drawer-button lg:hidden"
              >
                <MdDashboardCustomize />
              </label>
              <button className="btn btn-primary rounded-full items-center gap-2 px-6 bg-green text-white sm:hidden">
                <FaUser />
                Log out
              </button>
            </div>
            <div className="mt-5 md:mt-2 mx-4 bg-white">
              <Outlet />
            </div>
          </div>
          <div className="drawer-side border shadow-md">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full text-black bg-white">
              <li className="font-bold">
                <Link
                  to="/seller"
                  className="flex justify-start mb-3 active-link"
                >
                  Foodvc
                  <span className="badge badge-primary">Admin</span>
                </Link>
              </li>
              <hr />
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname === "/seller" ? "text-green" : ""
                  }`}
                  to="/seller"
                >
                  <MdDashboard />
                  Thống kê
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname === "/shop-management" ? "text-green" : ""
                  }`}
                  to={`/seller/shop-management/${shopId}`}
                >
                  <FaChessBishop />
                  Quản lý thông tin cửa hàng
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname === "/transaction" ? "text-green" : ""
                  }`}
                  to={`/seller/transaction`}
                >
                  <FaRegMoneyBillAlt />
                  Quản lý giao dịch
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname === "/commission-policy"
                      ? "text-green"
                      : ""
                  }`}
                  to={`/seller/commission-policy`}
                >
                  <FaRegMoneyBillAlt />
                  Quản lý phí hoa hồng cửa hàng
                </Link>
              </li>
              <li>
                <div
                  onClick={toggleInventory}
                  className="cursor-pointer flex items-center active-link"
                >
                  <FaWarehouse />
                  <span>Quản lý kho</span>
                  {inventoryOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </div>
                {inventoryOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith(
                            "/seller/manage-inventory"
                          )
                            ? "text-green"
                            : ""
                        }`}
                        to="/seller/manage-inventory"
                      >
                        <MdOutlineInventory />
                        Sản phẩm trong kho
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/seller/add-inventory")
                            ? "text-green"
                            : ""
                        }`}
                        to="/seller/add-inventory"
                      >
                        <IoIosAddCircle />
                        Nhập kho
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <div
                  onClick={toggleMenu}
                  className="cursor-pointer flex items-center active-link"
                >
                  <VscLayoutMenubar />
                  <span>Quản lý menu</span>
                  {menuOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </div>
                {menuOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/seller/manage-menu")
                            ? "text-green"
                            : ""
                        }`}
                        to="/seller/manage-menu"
                      >
                        <AiOutlineMenu />
                        Sản phẩm trên menu
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith(
                            "/seller/request-send-to-menu"
                          )
                            ? "text-green"
                            : ""
                        }`}
                        to="/seller/request-send-to-menu"
                      >
                        <AiOutlineMenu />
                        Sản phẩm yêu cầu đưa lên menu
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <div
                  onClick={togglePromotions}
                  className="cursor-pointer flex items-center active-link"
                >
                  <img
                    width="12px"
                    src="/images/price-tag.png"
                    alt="Promotion Icon"
                  />
                  <span>Quản lý khuyến mãi</span>
                  {promotionsOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </div>
                {promotionsOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/seller/create-voucher")
                            ? "text-green"
                            : ""
                        }`}
                        to="/seller/create-voucher"
                      >
                        <MdOutlineRateReview />
                        Quản lý khuyến mãi
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/seller/order-tracking")
                      ? "text-green"
                      : ""
                  }`}
                  to="/seller/order-tracking"
                >
                  <FaShoppingBag />
                  Quản lý đơn hàng
                </Link>
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/seller/reviews")
                      ? "text-green"
                      : ""
                  }`}
                  to="/seller/reviews"
                >
                  <MdOutlineRateReview />
                  Quản lý đánh giá
                </Link>
              </li>
              <li>
                <div
                  onClick={() => {
                    toggleSupport();
                  }}
                  className="cursor-pointer flex items-center active-link"
                >
                  <FaQuestionCircle />
                  <span>Hỗ trợ khách hàng</span>
                  {supportOpen ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                  {orderRequests > 0 && (
                    <span className="badge badge-error text-white ml-2">
                      {orderRequests}
                    </span>
                  )}
                </div>
                {supportOpen && (
                  <ul className="ml-4">
                    <li>
                      <Link
                        onClick={() => {
                          handleOrderRequestsClick();
                        }}
                        className={`active-link-2 ${
                          location.pathname.startsWith("/seller/order-requests")
                            ? "text-green"
                            : ""
                        }`}
                        to="/seller/order-requests"
                      >
                        <FaQuestionCircle />
                        Yêu cầu đơn hàng
                        {orderRequests > 0 && (
                          <span className="badge badge-error text-white ml-2">
                            {orderRequests}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`active-link-2 ${
                          location.pathname.startsWith("/seller/help-users")
                            ? "text-green"
                            : ""
                        }`}
                        to="/seller/help-users"
                      >
                        <FaQuestionCircle />
                        Hỗ trợ người dùng
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link
                  className={`active-link-2 ${
                    location.pathname.startsWith("/seller/settings")
                      ? "text-green"
                      : ""
                  }`}
                  to="/seller/settings"
                >
                  <RiMoneyCnyCircleLine />
                  Cài đặt
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default SellerLayout;
