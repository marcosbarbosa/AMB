/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: App.tsx
 * CAMINHO: client/src/App.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Roteador Principal (Blindado contra Erros de Import)
 * VERSÃO: 8.0 Prime (Stable Rescue)
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
import ContactPage from "@/pages/Contact";
import PartnersPage from "@/pages/ParceirosPage";
import SejaParceiroPage from "@/pages/SejaParceiroPage";
import TransparenciaPage from "@/pages/TransparenciaPage";
import PrestacaoContasPage from "@/pages/PrestacaoContasPage";
import NotFound from "@/pages/not-found";

// --- AUTENTICAÇÃO ---
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";

// --- ÁREA DO ATLETA ---
import PainelPage from "@/pages/PainelPage";
import EditarPerfilPage from "@/pages/EditarPerfilPage";

// --- ÁREA ADMINISTRATIVA ---
import AdminPainelPage from "@/pages/admin/AdminPainelPage";
import GestaoAssociadosPage from "@/pages/admin/GestaoAssociadosPage";
import GestaoParceirosPage from "@/pages/admin/GestaoParceirosPage";
import GestaoBannersAMB from "@/pages/admin/GestaoBannersAMB";
import GestaoTransparencia from "@/pages/admin/GestaoTransparencia";
import GestaoEventosMaster from "@/pages/admin/GestaoEventosMaster";

// NOTA: As páginas abaixo foram comentadas pois os arquivos ainda não foram criados.
// Descomente apenas quando criar os arquivos físicos para evitar crash.
// import GestaoTimesPage from "@/pages/admin/GestaoTimesPage";
// import GestaoJogosPage from "@/pages/admin/GestaoJogosPage";
// import GestaoPlacarPage from "@/pages/admin/GestaoPlacarPage";
// import DiretoriaBIPage from "@/pages/admin/DiretoriaBIPage";
// import DiretoriaGestaoPage from "@/pages/admin/DiretoriaGestaoPage";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/parceiros" element={<PartnersPage />} />
          <Route path="/seja-parceiro" element={<SejaParceiroPage />} />
          <Route path="/transparencia" element={<PrestacaoContasPage />} />

          {/* Autenticação */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* Área do Atleta */}
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/painel/editar" element={<EditarPerfilPage />} />

          {/* Área Administrativa */}
          <Route path="/admin" element={<AdminPainelPage />} />
          <Route path="/admin/painel" element={<AdminPainelPage />} />
          <Route path="/admin/atletas" element={<GestaoAssociadosPage />} />
          <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
          <Route path="/admin/banners" element={<GestaoBannersAMB />} />
          <Route path="/admin/transparencia" element={<GestaoTransparencia />} />
          <Route path="/admin/eventos" element={<GestaoEventosMaster />} />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;