/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 17:30
 * Versão: 1.1 (Atualizado para Rota do Painel)
 *
 * Descrição: Componente raiz da aplicação, define as rotas.
 * ATUALIZADO para incluir a rota /painel.
 *
 * ==========================================================
 */
import { Routes, Route } from "react-router-dom"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext"; // Mantém o AuthProvider aqui (decisão da IA)

// Importa as páginas existentes
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";

// 1. IMPORTA A NOSSA NOVA PÁGINA
import PainelPage from "@/pages/PainelPage";

function App() {
  return (
    // Mantém o AuthProvider aqui (decisão da IA)
    <AuthProvider> 
      <TooltipProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* 2. ADICIONA A NOVA ROTA */}
          <Route path="/painel" element={<PainelPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;