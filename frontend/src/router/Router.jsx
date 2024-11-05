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
const AddInventoryLazyLoading = lazy(() =>
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
const WalletLazyLoading = lazy(() => import("../pages/menuPage/Wallet"));
const ForgetPasswordLazyLoading = lazy(() =>
  import("../components/Account/ForgetPassword")
);
const OrderRequestLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/OrderRequest")
);
const CreateShopLazyLoading = lazy(() =>
  import("../pages/menuPage/CreateShop")
);
const MenuLazyLoading = lazy(() => import("../pages/menuPage/Menu"));
const BlogLazyLoading = lazy(() => import("../pages/Blog/Blog"));
const AboutLazyLoading = lazy(() => import("../pages/About/About"));
const ReviewsManagementLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/ReviewsManagement")
);

const AddressesLazyLoading = lazy(() =>
  import("../components/Address/AddressManagement")
);

import LoadingSpinner from "../ultis/LoadingSpinner";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import AccountManagement from "../layout/AccountManagement";
import ProtectedRoute from "../context/ProtectedRoute";
import OrderSuccess from "../components/Order/OrderSuccess";
import SearchResult from "../pages/menuPage/SearchResult";
import UserOrderDetail from "../components/Order/UserOrderDetail";
import EditCategory from "../pages/dashboard/admin/EditCategory";
import ShopManagement from "../pages/dashboard/seller/ShopManagement";
import ShopDetail from "../pages/menuPage/ShopDetail";
import WishStorePage from "../pages/menuPage/WishStore";
const CreateVoucherLazyLoading = lazy(() =>
  import("../pages/dashboard/seller/CreateVoucher")
);
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
        element: <AccountManagement />,
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
            path: "orders/:orderId",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <UserOrderDetail />
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
            path: "wallet",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <WalletLazyLoading />
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
        path: "add-inventory",
        element: (
          <Suspense>
            <AddInventoryLazyLoading />
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
            <AddInventoryLazyLoading />
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
