/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: App.tsx
 * CAMINHO: client/src/App.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Roteador Principal (Blindado e Configurado)
 * VERSÃO: 12.0 Prime
 * ==========================================================
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext"; // Essencial para o Menu

// --- PÁGINAS PÚBLICAS ---
import Home from "@/pages/Home";
import AboutPage from "@/pages/AboutPage";
import Contact from "@/pages/Contact";
import ParceirosPage from "@/pages/ParceirosPage";
import SejaParceiroPage from "@/pages/SejaParceiroPage";
import PrestacaoContasPage from "@/pages/PrestacaoContasPage";

// --- AUTENTICAÇÃO ---
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import NotFound from "@/pages/not-found";

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
import GestaoTimesPage from "@/pages/admin/GestaoTimesPage";

function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider> {/* O Cérebro do Menu Dinâmico */}
        <TooltipProvider>
          <Routes>
            {/* ROTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/parceiros" element={<ParceirosPage />} />
            <Route path="/seja-parceiro" element={<SejaParceiroPage />} />
            <Route path="/transparencia" element={<PrestacaoContasPage />} />

            {/* ROTAS DE AUTENTICAÇÃO */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />

            {/* ROTAS DO ATLETA */}
            <Route path="/painel" element={<PainelPage />} />
            <Route path="/painel/editar" element={<EditarPerfilPage />} />

            {/* ROTAS ADMINISTRATIVAS */}
            <Route path="/admin" element={<AdminPainelPage />} />
            <Route path="/admin/login" element={<AdminPainelPage />} /> 
            <Route path="/admin/painel" element={<AdminPainelPage />} />

            <Route path="/admin/atletas" element={<GestaoAssociadosPage />} />
            <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
            <Route path="/admin/banners" element={<GestaoBannersAMB />} />
            <Route path="/admin/transparencia" element={<GestaoTransparencia />} />
            <Route path="/admin/eventos" element={<GestaoEventosMaster />} />
            <Route path="/admin/times" element={<GestaoTimesPage />} />

            {/* ROTA DE ERRO 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TooltipProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

export default App;