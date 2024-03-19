import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/menuPage/Menu";
import Blog from "../pages/Blog";
import About from "../pages/About";
import Register from "../components/Register";
import Login from "../components/Login";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import UpdateProfiles from "../pages/dashboard/UpdateProfiles";
import CardDetails from "../components/CardDetails";
import CartPage from "../pages/menuPage/CartPage";
import DashBoardLayout from "../layout/DashBoardLayout";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Users from "../pages/dashboard/admin/Users";
import NotFoundPage from "../components/NotFoundPage";
import AddInventory from "../pages/dashboard/admin/AddInventory";
import WishListPage from "../pages/menuPage/WishListPage";
import ManageInventory from "../pages/dashboard/admin/ManageInventory";
import UpdateItem from "../pages/dashboard/admin/UpdateItem";
import AddVoucher from "../pages/dashboard/admin/AddVoucher";
import ManageMenu from "../pages/dashboard/admin/ManageMenu";
import Payment from "../pages/menuPage/Payment";
import UserOrders from "../pages/dashboard/UserOders";
import OrdersTracking from "../pages/dashboard/admin/OrdersTracking";
import OrderDetail from "../components/OrderDetail";
import HelpUsers from "../pages/dashboard/admin/HelpUsers";
import ContactAdmin from "../components/ContactAdmin";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/update-profile",
        element: <UpdateProfiles />,
      },
      {
        path: "/product/:id",
        element: <CardDetails />,
      },
      {
        path: "/cart-page",
        element: <CartPage />,
      },
      {
        path: "/check-out",
        element: <Payment />,
      },
      {
        path: "/wish-list",
        element: <WishListPage />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/orders",
        element: <UserOrders />,
      },
      {
        path: "/admin-chat",
        element: <ContactAdmin />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <PrivateRouter>
        <DashBoardLayout />
      </PrivateRouter>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "add-inventory",
        element: <AddInventory />,
      },
      {
        path: "manage-inventory",
        element: <ManageInventory />,
      },
      {
        path: "manage-menu",
        element: <ManageMenu />,
      },
      {
        path: "update-item/:id",
        element: <UpdateItem />,
      },
      {
        path: "add-voucher",
        element: <AddVoucher />,
      },
      {
        path: "order-tracking",
        element: <OrdersTracking />,
      },
      {
        path: "order-tracking/:id",
        element: <OrderDetail />,
      },
      {
        path: "help-users",
        element: <HelpUsers />,
      },
    ],
  },
]);

export default router;
