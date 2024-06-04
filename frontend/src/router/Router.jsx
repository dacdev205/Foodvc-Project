/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// Lazy load các components
const MainLazyLoading = lazy(() => import("../layout/Main"));
const HomeLazyLoading = lazy(() => import("../pages/home/Home"));
const RegisterLazyLoading = lazy(() => import("../components/Register"));
const LoginLazyLoading = lazy(() => import("../components/Login"));

const UpdateProfilesLazyLoading = lazy(() =>
  import("../pages/dashboard/UpdateProfiles")
);
const CardDetailsLazyLoading = lazy(() => import("../components/CardDetails"));
const CartPageLazyLoading = lazy(() => import("../pages/menuPage/CartPage"));
const DashBoardLayoutLazyLoading = lazy(() =>
  import("../layout/DashBoardLayout")
);
const DashboardLazyLoading = lazy(() =>
  import("../pages/dashboard/admin/Dashboard")
);
const UsersLazyLoading = lazy(() => import("../pages/dashboard/admin/Users"));
const NotFoundPageLazyLoading = lazy(() => import("../ultis/NotFoundPage"));
const AddInventoryLazyLoading = lazy(() =>
  import("../pages/dashboard/admin/AddInventory")
);
const WishListPageLazyLoading = lazy(() =>
  import("../pages/menuPage/WishListPage")
);
const ManageInventoryLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNstaff/ManageInventory")
);
const UpdateItemLazyLoading = lazy(() =>
  import("../pages/dashboard/admin/UpdateItem")
);
const AddVoucherLazyLoading = lazy(() =>
  import("../pages/dashboard/admin/AddVoucher")
);
const ManageMenuLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNstaff/ManageMenu")
);
const PaymentLazyLoading = lazy(() => import("../pages/menuPage/Payment"));
const UserOrdersLazyLoading = lazy(() =>
  import("../pages/dashboard/UserOders")
);
const OrdersTrackingLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNstaff/OrdersTracking")
);
const OrderDetailLazyLoading = lazy(() => import("../components/OrderDetail"));
const HelpUsersLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNstaff/HelpUsers")
);
const ContactAdminLazyLoading = lazy(() =>
  import("../components/ContactAdmin")
);
const ReportTodayLazyLoading = lazy(() =>
  import("../pages/dashboard/staff/ReportToday")
);
const MenuLazyLoading = lazy(() => import("../pages/menuPage/Menu"));
const BlogLazyLoading = lazy(() => import("../pages/Blog/Blog"));
const AboutLazyLoading = lazy(() => import("../pages/About/About"));
import LoadingSpinner from "../ultis/LoadingSpinner";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import AccountManagement from "../layout/AccountManagement";
import UpdateProfile from "../pages/dashboard/UpdateProfiles";
const CreateVoucherLazyLoading = lazy(() =>
  import("../pages/dashboard/adminNstaff/CreateVoucher")
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
        path: "/menu",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <MenuLazyLoading />
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
            element: <UpdateProfile></UpdateProfile>,
          },
          {
            path: "orders",
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <UserOrdersLazyLoading />
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
    path: "*",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFoundPageLazyLoading />
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
    ],
  },
]);

export default router;
