// Nome: App.tsx
// Caminho: client/src/App.tsx
// Data: 2026-01-21
// Hora: 12:20 (America/Sao_Paulo)
// Função: Router Central (Padronizado e Completo)
// Versão: v38.0 Final Sync
// Alteração: Padronização do 404 e garantia de todos os links institucionais.

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext"; 
import { Loader2 } from 'lucide-react';
import Home from "@/pages/Home";

// --- Lazy Load (Público) ---
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const NoticiasPage = lazy(() => import("@/pages/NoticiasPage"));
const EventosPage = lazy(() => import("@/pages/EventosPage"));
const EleicoesPage = lazy(() => import("@/pages/eleicoes/EleicoesPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CadastroPage = lazy(() => import("@/pages/CadastroPage"));
const NotFoundPage = lazy(() => import("@/pages/not-found")); // Import Padronizado

// --- Lazy Load (Institucional) ---
const HistoricoPage = lazy(() => import("@/pages/institucional/HistoricoPage"));
const DiretoriaPage = lazy(() => import("@/pages/institucional/DiretoriaPage"));
const SecretariaPage = lazy(() => import("@/pages/institucional/SecretariaPage"));
const ParceirosPage = lazy(() => import("@/pages/institucional/ParceirosPage"));

// --- Lazy Load (Associado/Admin) ---
const PainelPage = lazy(() => import("@/pages/PainelPage"));
const EditarPerfilPage = lazy(() => import("@/pages/EditarPerfilPage"));
const AdminPainelPage = lazy(() => import("@/pages/admin/AdminPainelPage"));
const GestaoAssociadosPage = lazy(() => import("@/pages/admin/GestaoAssociadosPage"));
const EleicoesGestaoPage = lazy(() => import("@/pages/admin/EleicoesGestaoPage"));
const ConfiguracoesPage = lazy(() => import("@/pages/admin/ConfiguracoesPage"));

// Fallback Loader
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

              {/* Institucional */}
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

              {/* Erro 404 */}
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
// linha 105 App.tsx