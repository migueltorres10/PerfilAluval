import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home/Home";
import ClienteFormPage from "../pages/Clientes/ClienteFormPage";
import ClientesListPage from "../pages/Clientes/ClientesListPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      // Clientes 
      { path: "clientes", element: <ClientesListPage /> },
      { path: "clientes/novo", element: <ClienteFormPage /> },
      { path: "clientes/:id", element: <ClienteFormPage /> },
      { path: "clientes/:id/eliminar", element: <ClienteFormPage /> },

    ],
  },
]);
