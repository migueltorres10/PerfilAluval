import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home/Home";
import ClienteFormPage from "../pages/Clientes/ClienteFormPage";
import ClientesListPage from "../pages/Clientes/ClientesListPage";
import FornecedorFormPage from "../pages/Fornecedores/FornecedorFormPage";
import FornecedoresListPage from "../pages/Fornecedores/FornecedoresListPage";

import TiposContratoPage from "../pages/TiposContrato/TiposContratoPage";
import DepartamentosFuncoesPage from "../pages/DepartamentosFuncoes/DepartamentosFuncoesPage";

import FuncionariosListPage from "../pages/Funcionarios/FuncionariosListPage";
import FuncionarioFormPage from "../pages/Funcionarios/FuncionarioFormPage";

import ParametrosObrasPage from "../pages/Obras/ParametrosObrasPage";
import ObrasListPage from "../pages/Obras/ObrasListPage";
import ObraFormPage from "../pages/Obras/ObraFormPage";
import ParametrosArtigosPage from "../pages/Artigos/ParametrosArtigosPage";

import ArtigosListPage from "../pages/Artigos/ArtigosListPage";
import ArtigoFormPage from "../pages/Artigos/ArtigoFormPage";

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
      
      // Auxiliares (Recursos Humanos)
      { path: "tipos-contrato", element: <TiposContratoPage /> },
      { path: "departamentos-funcoes", element: <DepartamentosFuncoesPage /> },
      
      // Funcionários
      { path: "funcionarios", element: <FuncionariosListPage /> },
      { path: "funcionarios/novo", element: <FuncionarioFormPage /> },
      { path: "funcionarios/:id", element: <FuncionarioFormPage /> },
      { path: "funcionarios/:id/eliminar", element: <FuncionarioFormPage /> },

      // Obras (Parâmetros e Lista principal)
      { path: "parametros-obras", element: <ParametrosObrasPage /> },
      { path: "obras", element: <ObrasListPage /> },
      { path: "obras/nova", element: <ObraFormPage /> },
      { path: "obras/:id", element: <ObraFormPage /> },
      { path: "obras/:id/eliminar", element: <ObraFormPage /> },
      
      // Artigos
      { path: "parametros-artigos", element: <ParametrosArtigosPage /> },
      { path: "artigos", element: <ArtigosListPage /> },
      { path: "artigos/novo", element: <ArtigoFormPage /> },
      { path: "artigos/:id", element: <ArtigoFormPage /> },
      { path: "artigos/:id/eliminar", element: <ArtigoFormPage /> },

    ],
  },
]);
