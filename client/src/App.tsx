/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Hora: 19:15
 * Versão: 3.2 (Estrutura de Layout Global e Sincronia Admin)
 *
 * Descrição: Componente raiz da aplicação. 
 * Centraliza a Navigation e o Footer dentro do AuthProvider.
 * Isso garante que o menu reconheça o role 'admin' e exiba 
 * o cadeado em tempo real sem duplicar elementos.
 *
 * Versão: 4.1 (Layout Global Persistente)
 */
import { Routes, Route, Navigate } from "react-router-dom"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext"; 

import { Navigation } from "@/components/Navigation"; 
import Footer from "@/components/Footer";

import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import AdminPainelPage from "@/pages/admin/AdminPainelPage";

function App() {
  return (
    <AuthProvider> 
      <TooltipProvider>
        {/* O menu é renderizado aqui uma única vez para o site todo */}
        <Navigation /> 
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
          <Route path="/admin/painel" element={<AdminPainelPage />} />
          {/* Outras rotas... */}
        </Routes>
        <Footer />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;