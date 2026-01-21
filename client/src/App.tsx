// Nome: App.tsx
// Caminho: client/src/App.tsx
// Data: 2026-01-20
// Hora: 23:55 (America/Sao_Paulo)
// Função: Router Central AMB Amazonas
// Versão: v35.0 Golden Sync
// Alteração: Sincronização de rotas de perfil e priorização do Dashboard Admin.

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext"; 
import Home from "@/pages/Home";

// Lazy Load
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const NoticiasPage = lazy(() => import("@/pages/NoticiasPage"));
const EventosPage = lazy(() => import("@/pages/EventosPage"));
const EleicoesPage = lazy(() => import("@/pages/eleicoes/EleicoesPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CadastroPage = lazy(() => import("@/pages/CadastroPage"));
const PainelPage = lazy(() => import("@/pages/PainelPage"));
const EditarPerfilPage = lazy(() => import("@/pages/EditarPerfilPage"));

// Admin
const AdminPainelPage = lazy(() => import("@/pages/admin/AdminPainelPage"));
const GestaoAssociadosPage = lazy(() => import("@/pages/admin/GestaoAssociadosPage"));
const EleicoesGestaoPage = lazy(() => import("@/pages/admin/EleicoesGestaoPage"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <TooltipProvider delayDuration={100}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/noticias" element={<NoticiasPage />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="/eleicoes" element={<EleicoesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />

              {/* Associado */}
              <Route path="/painel" element={<PainelPage />} />
              <Route path="/editar-perfil" element={<EditarPerfilPage />} />

              {/* Administrativas */}
              <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
              <Route path="/admin/painel" element={<AdminPainelPage />} />
              <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
              <Route path="/admin/eleicoes" element={<EleicoesGestaoPage />} />

              {/* Fallback */}
              <Route path="*" element={lazy(() => import("@/pages/not-found"))} />
            </Routes>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}
export default App;
// linha 85 App.tsx