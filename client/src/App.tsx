/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 20:05
 * Versão: 1.4 (Adiciona Rota Redefinir Senha)
 *
 * Descrição: Componente raiz da aplicação, define as rotas.
 * ATUALIZADO para incluir a rota /redefinir-senha.
 *
 * ==========================================================
 */
import { Routes, Route } from "react-router-dom"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext"; 

// Páginas existentes
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import PainelPage from "@/pages/PainelPage";
import EditarPerfilPage from "@/pages/EditarPerfilPage"; 
import AdminPainelPage from "@/pages/admin/AdminPainelPage";
import EsqueciSenhaPage from "@/pages/EsqueciSenhaPage"; // Importação da Parte 1

// 1. IMPORTA A NOVA PÁGINA
import RedefinirSenhaPage from "@/pages/RedefinirSenhaPage";

function App() {
  return (
    <AuthProvider> 
      <TooltipProvider>
        <Toaster />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />

          {/* 2. ADICIONA A NOVA ROTA */}
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

          {/* Rotas Privadas */}
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/painel/editar" element={<EditarPerfilPage />} />
          <Route path="/admin/painel" element={<AdminPainelPage />} />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;