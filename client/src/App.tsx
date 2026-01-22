// Nome: App.tsx
// Nro de linhas+ Caminho: 110 client/src/App.tsx
// Data: 2026-01-22
// Hora: 20:35 (America/Sao_Paulo)
// Função: Router Central (Todas as Rotas)
// Versão: v42.0 Full Integration
// Alteração: Inclusão das rotas institucionais faltantes (Historico, Diretoria, etc).

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext"; 
import { Loader2 } from 'lucide-react';
import Home from "@/pages/Home";

// --- Lazy Load (Páginas Públicas Legadas) ---
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const NoticiasPage = lazy(() => import("@/pages/NoticiasPage"));
const EventosPage = lazy(() => import("@/pages/EventosPage"));
const EleicoesPage = lazy(() => import("@/pages/eleicoes/EleicoesPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CadastroPage = lazy(() => import("@/pages/CadastroPage"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

// --- Lazy Load (Novas Páginas Institucionais - ADICIONADO) ---
const HistoricoPage = lazy(() => import("@/pages/institucional/HistoricoPage"));
const DiretoriaPage = lazy(() => import("@/pages/institucional/DiretoriaPage"));
const SecretariaPage = lazy(() => import("@/pages/institucional/SecretariaPage"));
const ParceirosPage = lazy(() => import("@/pages/institucional/ParceirosPage"));

// --- Lazy Load (Área Associado) ---
const PainelPage = lazy(() => import("@/pages/PainelPage"));
const EditarPerfilPage = lazy(() => import("@/pages/EditarPerfilPage"));

// --- Lazy Load (Área Administrativa) ---
const AdminPainelPage = lazy(() => import("@/pages/admin/AdminPainelPage"));
const GestaoAssociadosPage = lazy(() => import("@/pages/admin/GestaoAssociadosPage"));
const EleicoesGestaoPage = lazy(() => import("@/pages/admin/EleicoesGestaoPage"));
const ConfiguracoesPage = lazy(() => import("@/pages/admin/ConfiguracoesPage"));

// Loader Simples
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-slate-50">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
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

              {/* Institucional (Novas Rotas) */}
              <Route path="/historico" element={<HistoricoPage />} />
              <Route path="/diretoria" element={<DiretoriaPage />} />
              <Route path="/secretaria" element={<SecretariaPage />} />
              <Route path="/parceiros" element={<ParceirosPage />} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />

              {/* Eleições */}
              <Route path="/eleicoes" element={<EleicoesPage />} />

              {/* Associado */}
              <Route path="/painel" element={<PainelPage />} />
              <Route path="/area-associado" element={<PainelPage />} />
              <Route path="/editar-perfil" element={<EditarPerfilPage />} />

              {/* Admin */}
              <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
              <Route path="/admin/painel" element={<AdminPainelPage />} />
              <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
              <Route path="/admin/eleicoes" element={<EleicoesGestaoPage />} />
              <Route path="/admin/configuracoes" element={<ConfiguracoesPage />} />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

export default App;
// linha 110 client/src/App.tsx