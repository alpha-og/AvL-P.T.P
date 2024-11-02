import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Room from "./pages/Room";
import Landing from "./pages/Landing";
import Navbar from "./components/common/Navbar";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/room",
    element: <Room />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="w-screen h-screen flex flex-col bg-slate-700">
      <Navbar />
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
);
