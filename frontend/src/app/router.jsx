import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home/Home";
import ClienteFormPage from "../pages/Clientes/ClienteFormPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      // Clientes 
      { path: "clientes/novo", element: <ClienteFormPage /> },
      { path: "clientes/:id", element: <ClienteFormPage /> },
      { path: "clientes/:id/eliminar", element: <ClienteFormPage /> },
    ],
  },
]);
