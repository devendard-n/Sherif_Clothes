import { createBrowserRouter } from "react-router-dom";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { ShirtsPage } from "./components/ShirtsPage";
import { PantsPage } from "./components/PantsPage";
import { CombosPage } from "./components/CombosPage";
import { ContactPage } from "./components/ContactPage";
import { ProductDetail } from "./components/ProductDetail";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { NotFound } from "./components/NotFound";
import { TShirtPage } from "./components/TShirtPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "shirts", Component: ShirtsPage },
      { path: "shirts/:subcategory", Component: ShirtsPage },
      { path: "pants", Component: PantsPage },
      { path: "pants/:subcategory", Component: PantsPage },
      { path: "combos", Component: CombosPage },
      { path: "tshirts", Component: TShirtPage },
      { path: "contact", Component: ContactPage },
      { path: "product/:id", Component: ProductDetail },
      { path: "admin/login", Component: AdminLogin },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
