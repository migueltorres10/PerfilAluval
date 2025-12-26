import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Obras from "./pages/Obras";
import Clientes from "./pages/Clientes";
import Fornecedores from "./pages/Fornecedores";
import Funcionarios from "./pages/Funcionarios";
import ArtigosCompra from "./pages/ArtigosCompra";
import ArtigosVenda from "./pages/ArtigosVenda";
import Producao from "./pages/Producao";
import MontagensEntregas from "./pages/MontagensEntregas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />

        <Route path="/obras" element={<Obras />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/funcionarios" element={<Funcionarios />} />

        <Route path="/artigos-compra" element={<ArtigosCompra />} />
        <Route path="/artigos-venda" element={<ArtigosVenda />} />

        <Route path="/producao" element={<Producao />} />
        <Route path="/montagens-entregas" element={<MontagensEntregas />} />

        <Route path="*" element={<div style={{ padding: 16 }}>Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}
