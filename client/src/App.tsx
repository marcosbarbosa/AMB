/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 28 de outubro de 2025
 * Hora: 11:14
 * Versão: 1.2 (Adiciona Rota Editar Perfil)
 *
 * Descrição: Componente raiz da aplicação, define as rotas.
 * ATUALIZADO para incluir a rota /painel/editar.
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

// 1. IMPORTA A NOSSA NOVA PÁGINA
import EditarPerfilPage from "@/pages/EditarPerfilPage"; 

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

          {/* Rotas Privadas (Protegidas dentro das próprias páginas) */}
          <Route path="/painel" element={<PainelPage />} />
          {/* 2. ADICIONA A NOVA ROTA */}
          <Route path="/painel/editar" element={<EditarPerfilPage />} />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;