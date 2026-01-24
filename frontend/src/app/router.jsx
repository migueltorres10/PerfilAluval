import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home/Home";
import ClienteFormPage from "../pages/Clientes/ClienteFormPage";
import ClientesListPage from "../pages/Clientes/ClientesListPage";
import FornecedorFormPage from "../pages/Fornecedores/FornecedorFormPage";
import FornecedoresListPage from "../pages/Fornecedores/FornecedoresListPage";


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
      // Fornecedores
      { path: "fornecedores", element: <FornecedoresListPage /> },
      { path: "fornecedores/novo", element: <FornecedorFormPage /> },
      { path: "fornecedores/:id", element: <FornecedorFormPage /> },
      { path: "fornecedores/:id/eliminar", element: <FornecedorFormPage /> },

    ],
  },
]);
