// Nome: App.tsx
// Caminho: client/src/App.tsx
// Data: 2026-01-21
// Hora: 11:45 (America/Sao_Paulo)
// Função: Router Central (Legacy Preservation + Institutional Fix)
// Versão: v37.0 Full Integrity
// Alteração: Restauração de todas as rotas legadas e injeção das novas rotas institucionais e de configuração.

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext"; 
import { Loader2 } from 'lucide-react';
import Home from "@/pages/Home";

// --- Lazy Load (Páginas Originais - PRESERVADAS) ---
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const NoticiasPage = lazy(() => import("@/pages/NoticiasPage"));
const EventosPage = lazy(() => import("@/pages/EventosPage"));
const EleicoesPage = lazy(() => import("@/pages/eleicoes/EleicoesPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CadastroPage = lazy(() => import("@/pages/CadastroPage"));
const PainelPage = lazy(() => import("@/pages/PainelPage"));
const EditarPerfilPage = lazy(() => import("@/pages/EditarPerfilPage"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

// --- Lazy Load (Páginas Institucionais) ---
const HistoricoPage = lazy(() => import("@/pages/institucional/HistoricoPage"));
const DiretoriaPage = lazy(() => import("@/pages/DiretoriaPage"));
const SecretariaPage = lazy(() => import("@/pages/SecretariaDigitalPage"));
const ParceirosPage = lazy(() => import("@/pages/ParceirosPage"));

// --- Lazy Load (Admin - PRESERVADAS + NOVO) ---
const AdminPainelPage = lazy(() => import("@/pages/admin/AdminPainelPage"));
const GestaoAssociadosPage = lazy(() => import("@/pages/admin/GestaoAssociadosPage"));
const EleicoesGestaoPage = lazy(() => import("@/pages/admin/EleicoesGestaoPage"));
const ConfiguracoesPage = lazy(() => import("@/pages/admin/ConfiguracoesPage")); // Novo

// Componente de Loading para Suspense
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
              {/* --- Rotas Públicas (Legado) --- */}
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/noticias" element={<NoticiasPage />} />
              <Route path="/eventos" element={<EventosPage />} />

              {/* --- Novas Rotas Institucionais (Correção Tela Branca) --- */}
              <Route path="/historico" element={<HistoricoPage />} />
              <Route path="/diretoria" element={<DiretoriaPage />} />
              <Route path="/secretaria" element={<SecretariaPage />} />
              <Route path="/parceiros" element={<ParceirosPage />} />

              {/* --- Auth & Cadastro --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />

              {/* --- Módulo Eleições --- */}
              <Route path="/eleicoes" element={<EleicoesPage />} />

              {/* --- Área do Associado --- */}
              <Route path="/painel" element={<PainelPage />} />
              <Route path="/area-associado" element={<PainelPage />} /> {/* Alias de compatibilidade */}
              <Route path="/editar-perfil" element={<EditarPerfilPage />} />

              {/* --- Área Administrativa --- */}
              <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
              <Route path="/admin/painel" element={<AdminPainelPage />} />
              <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
              <Route path="/admin/eleicoes" element={<EleicoesGestaoPage />} />
              <Route path="/admin/configuracoes" element={<ConfiguracoesPage />} />

              {/* --- Fallback 404 --- */}
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
// linha 108 App.tsx