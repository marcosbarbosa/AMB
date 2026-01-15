/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: App.tsx
 * CAMINHO: client/src/App.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Roteador Principal (Corrigido conforme Relatório Técnico)
 * VERSÃO: 9.0 Prime (Crash Free)
 * ==========================================================
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";

// --- PÁGINAS PÚBLICAS ---
import Home from "@/pages/Home";
import AboutPage from "@/pages/AboutPage"; 
import Contact from "@/pages/Contact"; 
import ParceirosPage from "@/pages/ParceirosPage"; 
import SejaParceiroPage from "@/pages/SejaParceiroPage";
import PrestacaoContasPage from "@/pages/PrestacaoContasPage"; 

// NOTA: Descomente as linhas abaixo APENAS quando criar os arquivos na pasta /pages/
// import EventosPublicoPage from "@/pages/EventosPublicoPage"; 
// import EventoDetalhePage from "@/pages/EventoDetalhePage"; 

// --- AUTENTICAÇÃO ---
import LoginPage from "@/pages/LoginPage"; 
import CadastroPage from "@/pages/CadastroPage"; 
import NotFound from "@/pages/not-found";

// --- ÁREA DO ATLETA ---
import PainelPage from "@/pages/PainelPage";
import EditarPerfilPage from "@/pages/EditarPerfilPage";

// --- ÁREA ADMINISTRATIVA ---
import AdminPainelPage from "@/pages/admin/AdminPainelPage";
// AdminLoginPage foi removido pois o fluxo é unificado no AdminPainel ou LoginPage
import GestaoAssociadosPage from "@/pages/admin/GestaoAssociadosPage"; 
import GestaoParceirosPage from "@/pages/admin/GestaoParceirosPage";
import GestaoBannersAMB from "@/pages/admin/GestaoBannersAMB";
import GestaoTransparencia from "@/pages/admin/GestaoTransparencia";
import GestaoEventosMaster from "@/pages/admin/GestaoEventosMaster";
import GestaoTimesPage from "@/pages/admin/GestaoTimesPage";
// GestaoNoticiasPage removido (arquivo inexistente)

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/seja-parceiro" element={<SejaParceiroPage />} />
          <Route path="/transparencia" element={<PrestacaoContasPage />} />

          {/* Rotas de Eventos (Placeholder - Descomente quando criar os arquivos)
          <Route path="/eventos" element={<EventosPublicoPage />} />
          <Route path="/eventos/:id" element={<EventoDetalhePage />} />
          */}

          {/* --- AUTENTICAÇÃO --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* --- ÁREA DO ATLETA --- */}
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/painel/editar" element={<EditarPerfilPage />} />

          {/* --- ÁREA ADMINISTRATIVA --- */}
          {/* Redirecionamentos de conveniência para o Painel Principal */}
          <Route path="/admin" element={<AdminPainelPage />} />
          <Route path="/admin/login" element={<AdminPainelPage />} /> 

          <Route path="/admin/painel" element={<AdminPainelPage />} />
          <Route path="/admin/atletas" element={<GestaoAssociadosPage />} />
          <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
          <Route path="/admin/banners" element={<GestaoBannersAMB />} />
          <Route path="/admin/transparencia" element={<GestaoTransparencia />} />

          {/* Módulos de Eventos */}
          <Route path="/admin/eventos" element={<GestaoEventosMaster />} />
          <Route path="/admin/times" element={<GestaoTimesPage />} />

          {/* Rota 404 - Página Não Encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;