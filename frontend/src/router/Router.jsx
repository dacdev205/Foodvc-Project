/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// Lazy load các components
const MainLazyLoading = lazy(() => import("../layout/Main"));
const HomeLazyLoading = lazy(() => import("../pages/home/Home"));
const RegisterLazyLoading = lazy(() =>
  import("../components/Account/Register")
);
const LoginLazyLoading = lazy(() => import("../components/Account/Login"));
const ManagementazyLoading = lazy(() =>
  import("../components/Account/Management")
);

const UpdateProfilesLazyLoading = lazy(() =>
  import("../pages/menuPage/UpdateProfiles")
);
const CardDetailsLazyLoading = lazy(() =>
  import("../components/CardProduct/CardDetails")
);
const CartPageLazyLoading = lazy(() => import("../pages/menuPage/CartPage"));
const DashBoardLayoutLazyLoading = lazy(() =>
  import("../layout/DashBoardLayout")
);
const SellerLayoutLazyLoading = lazy(() => import("../layout/SellerLayout"));
const OrderRequestDetailLazyLoading = lazy(() =>
  import("../components/Order/OrderRequestDetail")
);
const DashboardLazyLoading = lazy(() =>
  import("../pages/dashboard/admin/Dashboard")
);
const SellerDashboardLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/SellerDashboard")
);
const UsersLazyLoading = lazy(() => import("../pages/dashboard/admin/Users"));
const NotFoundPageLazyLoading = lazy(() => import("../ultis/NotFoundPage"));

const AddInventory = React.lazy(() =>
  import("../pages/dashboard/seller/AddInventory")
);

const WishListPageLazyLoading = lazy(() =>
  import("../pages/menuPage/WishListPage")
);
const CategoryLazyLoading = lazy(() =>
  import("../pages/dashboard/admin/CategoriesManagement")
);
const ManageInventoryLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/ManageInventory")
);
const UpdateItemLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/UpdateItem")
);
const VNPayReturnLazyLoading = lazy(() => import("../components/VNPayReturn"));
const AddVoucherLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/AddVoucher")
);
const ManageMenuLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNseller/ManageMenu")
);
const PaymentLazyLoading = lazy(() => import("../pages/menuPage/Payment"));
const UserOrdersLazyLoading = lazy(() => import("../pages/menuPage/UserOders"));
const OrdersTrackingLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNseller/OrdersTracking")
);
const OrderDetailLazyLoading = lazy(() =>
  import("../components/Order/OrderDetail")
);
const HelpUsersLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNseller/HelpUsers")
);
const ContactAdminLazyLoading = lazy(() =>
  import("../components/Helps/ContactAdmin")
);
const ReportTodayLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/ReportToday")
);
const VerifyPasswordLazyLoading = lazy(() =>
  import("../components/Account/VerifyPassword")
);
const ChangePasswordLazyLoading = lazy(() =>
  import("../components/Account/ChangePassword")
);
const ForgetPasswordLazyLoading = lazy(() =>
  import("../components/Account/ForgetPassword")
);
const OrderRequestLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNseller/OrderRequest")
);
const CreateShopLazyLoading = lazy(() =>
  import("../pages/menuPage/CreateShop")
);
const MenuLazyLoading = lazy(() => import("../pages/menuPage/Menu"));
const BlogLazyLoading = lazy(() => import("../pages/Blog/Blog"));
const AboutLazyLoading = lazy(() => import("../pages/About/About"));
const ReviewsManagementLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNseller/ReviewsManagement")
);

const AddressesLazyLoading = lazy(() =>
  import("../components/Address/AddressManagement")
);

const AccountManagementLazyLoading = lazy(() =>
  import("../layout/AccountManagement")
);
const OrderSuccess = lazy(() => import("../components/Order/OrderSuccess"));
const SearchResult = lazy(() => import("../pages/menuPage/SearchResult"));
const UserOrderDetail = lazy(() =>
  import("../components/Order/UserOrderDetail")
);
const EditCategory = lazy(() =>
  import("../pages/dashboard/admin/EditCategory")
);
const ShopManagement = lazy(() =>
  import("../pages/dashboard/seller/ShopManagement")
);
const ShopDetail = lazy(() => import("../pages/menuPage/ShopDetail"));
const WishStorePage = lazy(() => import("../pages/menuPage/WishStore"));
const Transactions = lazy(() =>
  import("../pages/dashboard/seller/Transactions")
);
const ManagementReqSend2Menu = lazy(() =>
  import("../pages/dashboard/admin/ManagementReqSend2Menu")
);
const ManagementRole = lazy(() =>
  import("../pages/dashboard/admin/ManagementRole")
);
const ManagementPermission = lazy(() =>
  import("../pages/dashboard/admin/ManagementPermission")
);
const RequestSend2Menu = lazy(() =>
  import("../pages/dashboard/seller/RequestSend2Menu")
);
const ManageMenuAdmin = lazy(() =>
  import("../pages/dashboard/admin/ManageMenuAdmin")
);
const ManagementShops = lazy(() =>
  import("../pages/dashboard/admin/ManagementShops")
);
const ManagementTransactions = lazy(() =>
  import("../pages/dashboard/admin/ManagementTransactions")
);
const ManagementMethodPay = lazy(() =>
  import("../pages/dashboard/admin/ManagementMethodPay")
);
const ManagementShippingParners = lazy(() =>
  import("../pages/dashboard/admin/ManagementShippingParners")
);
const CreateVoucherLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/CreateVoucher")
);
const ManagementComissionPolicyAdmin = lazy(() =>
  import("../pages/dashboard/admin/ManagementComissionPolicy")
);
const ManagementCommissionPolicy = lazy(() =>
  import("../pages/dashboard/seller/ManagementCommissionPolicy")
);
import LoadingSpinner from "../ultis/LoadingSpinner";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import ProtectedRoute from "../context/ProtectedRoute";
import ManagementUserRank from "../pages/dashboard/seller/ManagementUserRank";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <MainLazyLoading />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomeLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "/results/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SearchResult />
          </Suspense>
        ),
      },

      {
        path: "/menu",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <MenuLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "/shop-detail/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ShopDetail />
          </Suspense>
        ),
      },

      {
        path: "/order-success",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <OrderSuccess />
          </Suspense>
        ),
      },
      {
        path: "/blog",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BlogLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AboutLazyLoading />
          </Suspense>
        ),
      },

      {
        path: "/product/:id",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CardDetailsLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "/cart-page",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CartPageLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "/check-out",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <PaymentLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "/forget-password",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ForgetPasswordLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "/wish-list",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <WishListPageLazyLoading />
          </Suspense>
        ),
      },

      {
        path: "/user",
        element: <AccountManagementLazyLoading />,
        children: [
          {
            path: "update-profile",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <UpdateProfilesLazyLoading />
              </Suspense>
            ),
          },
          {
            path: "create-shop",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <CreateShopLazyLoading />
              </Suspense>
            ),
          },
          {
            path: "orders/:orderId",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <UserOrderDetail />
              </Suspense>
            ),
          },
          {
            path: "orders",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <UserOrdersLazyLoading />
              </Suspense>
            ),
          },
          {
            path: "wish-store",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <WishStorePage />
              </Suspense>
            ),
          },

          {
            path: "addresses",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AddressesLazyLoading />
              </Suspense>
            ),
          },

          {
            path: "change-password",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute>
                  <ChangePasswordLazyLoading />
                </ProtectedRoute>
              </Suspense>
            ),
          },
        ],
      },

      {
        path: "/admin-chat",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContactAdminLazyLoading />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "verify/password",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <VerifyPasswordLazyLoading />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFoundPageLazyLoading />
      </Suspense>
    ),
  },
  {
    path: "/order/vnpay_return",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <VNPayReturnLazyLoading />
      </Suspense>
    ),
  },

  {
    path: "/register",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RegisterLazyLoading />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginLazyLoading />
      </Suspense>
    ),
  },
  {
    path: "/management",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ManagementazyLoading />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PrivateRouter>
          <DashBoardLayoutLazyLoading />
        </PrivateRouter>
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense>
            <DashboardLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "management-roles",
        element: (
          <Suspense>
            <ManagementRole />
          </Suspense>
        ),
      },
      {
        path: "management-shops",
        element: (
          <Suspense>
            <ManagementShops />
          </Suspense>
        ),
      },

      {
        path: "user-rank",
        element: (
          <Suspense>
            <ManagementUserRank />
          </Suspense>
        ),
      },

      {
        path: "shipping-partners",
        element: (
          <Suspense>
            <ManagementShippingParners />
          </Suspense>
        ),
      },
      {
        path: "comission-policy",
        element: (
          <Suspense>
            <ManagementComissionPolicyAdmin />
          </Suspense>
        ),
      },

      {
        path: "management-transactions",
        element: (
          <Suspense>
            <ManagementTransactions />
          </Suspense>
        ),
      },
      {
        path: "payment-methods",
        element: (
          <Suspense>
            <ManagementMethodPay />
          </Suspense>
        ),
      },

      {
        path: "request-send-to-menu",
        element: (
          <Suspense>
            <ManagementReqSend2Menu />
          </Suspense>
        ),
      },
      {
        path: "management-permissions",
        element: (
          <Suspense>
            <ManagementPermission />
          </Suspense>
        ),
      },

      {
        path: "users",
        element: (
          <Suspense>
            <UsersLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "admin-edit-order/:id",
        element: (
          <Suspense>
            <OrderRequestDetailLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "category",
        element: (
          <Suspense>
            <CategoryLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "category/edit/:id",
        element: (
          <Suspense>
            <EditCategory />
          </Suspense>
        ),
      },

      {
        path: "manage-menu",
        element: (
          <Suspense>
            <ManageMenuAdmin />
          </Suspense>
        ),
      },

      {
        path: "update-item/:id",
        element: (
          <Suspense>
            <UpdateItemLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "add-voucher",
        element: (
          <Suspense>
            <AddVoucherLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "order-tracking",
        element: (
          <Suspense>
            <OrdersTrackingLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "order-tracking/:id",
        element: (
          <Suspense>
            <OrderDetailLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "help-users",
        element: (
          <Suspense>
            <HelpUsersLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "report",
        element: (
          <Suspense>
            <ReportTodayLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "create-voucher",
        element: (
          <Suspense>
            <CreateVoucherLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "reviews",
        element: (
          <Suspense>
            <ReviewsManagementLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "order-requests",
        element: (
          <Suspense>
            <OrderRequestLazyLoading />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/seller",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PrivateRouter>
          <SellerLayoutLazyLoading />
        </PrivateRouter>
      </Suspense>
    ),
    children: [
      {
        path: "/seller",
        element: (
          <Suspense>
            <SellerDashboardLazyLoading />
          </Suspense>
        ),
      },

      {
        path: "edit-order/:id",
        element: (
          <Suspense>
            <OrderRequestDetailLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "category",
        element: (
          <Suspense>
            <CategoryLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "add-inventory",
        element: (
          <Suspense>
            <AddInventory />
          </Suspense>
        ),
      },
      {
        path: "shop-management/:id",
        element: (
          <Suspense>
            <ShopManagement />
          </Suspense>
        ),
      },
      {
        path: "transaction",
        element: (
          <Suspense>
            <Transactions />
          </Suspense>
        ),
      },
      {
        path: "commission-policy",
        element: (
          <Suspense>
            <ManagementCommissionPolicy />
          </Suspense>
        ),
      },
      {
        path: "manage-inventory",
        element: (
          <Suspense>
            <ManageInventoryLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "manage-menu",
        element: (
          <Suspense>
            <ManageMenuLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "request-send-to-menu",
        element: (
          <Suspense>
            <RequestSend2Menu />
          </Suspense>
        ),
      },
      {
        path: "update-item/:id",
        element: (
          <Suspense>
            <UpdateItemLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "add-voucher",
        element: (
          <Suspense>
            <AddVoucherLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "order-tracking",
        element: (
          <Suspense>
            <OrdersTrackingLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "order-tracking/:id",
        element: (
          <Suspense>
            <OrderDetailLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "help-users",
        element: (
          <Suspense>
            <HelpUsersLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "report",
        element: (
          <Suspense>
            <ReportTodayLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "create-voucher",
        element: (
          <Suspense>
            <CreateVoucherLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "reviews",
        element: (
          <Suspense>
            <ReviewsManagementLazyLoading />
          </Suspense>
        ),
      },
      {
        path: "order-requests",
        element: (
          <Suspense>
            <OrderRequestLazyLoading />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
