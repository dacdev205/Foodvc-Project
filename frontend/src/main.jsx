import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import router from "./router/Router.jsx";
import "./App.css";
import { ActiveLinkProvider } from "./context/ActiveLinkProvider.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ActiveLinkProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ActiveLinkProvider>
  </AuthProvider>
);
