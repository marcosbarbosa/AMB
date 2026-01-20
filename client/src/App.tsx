// Nome: App.tsx
// Caminho: client/src/App.tsx
// Data: 2026-01-20
// Hora: 23:45
// Função: Configuração de Rotas e Dashboard Admin
// Versão: v34.0 Routing Master
// Alteração: Correção da hierarquia de rotas admin e links de perfil.

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext"; 
import Home from "@/pages/Home";

const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const ParceirosPage = lazy(() => import("@/pages/ParceirosPage"));
const SejaParceiroPage = lazy(() => import("@/pages/SejaParceiroPage"));
const InteligenciaPage = lazy(() => import("@/pages/InteligenciaPage")); 
const DiretoriaPage = lazy(() => import("@/pages/DiretoriaPage")); 
const SecretariaDigitalPage = lazy(() => import("@/pages/SecretariaDigitalPage"));
const NoticiasPage = lazy(() => import("@/pages/NoticiasPage"));
const EventosPage = lazy(() => import("@/pages/EventosPage"));
const EleicoesPage = lazy(() => import("@/pages/eleicoes/EleicoesPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CadastroPage = lazy(() => import("@/pages/CadastroPage"));
const PainelPage = lazy(() => import("@/pages/PainelPage"));
const EditarPerfilPage = lazy(() => import("@/pages/EditarPerfilPage"));

const AdminPainelPage = lazy(() => import("@/pages/admin/AdminPainelPage"));
const GestaoAssociadosPage = lazy(() => import("@/pages/admin/GestaoAssociadosPage"));
const GestaoParceirosPage = lazy(() => import("@/pages/admin/GestaoParceirosPage"));
const GestaoBannersAMB = lazy(() => import("@/pages/admin/GestaoBannersAMB"));
const GestaoTransparencia = lazy(() => import("@/pages/admin/GestaoTransparencia"));
const GestaoEventosMaster = lazy(() => import("@/pages/admin/GestaoEventosMaster"));
const GestaoTimesPage = lazy(() => import("@/pages/admin/GestaoTimesPage"));
const DiretoriaGestaoPage = lazy(() => import("@/pages/admin/DiretoriaGestaoPage"));
const GestaoNoticiasPage = lazy(() => import("@/pages/admin/GestaoNoticiasPage")); 
const EleicoesGestaoPage = lazy(() => import("@/pages/admin/EleicoesGestaoPage"));

const EsqueciSenhaPage = lazy(() => import("@/pages/EsqueciSenhaPage"));
const RedefinirSenhaPage = lazy(() => import("@/pages/RedefinirSenhaPage"));
const NotFound = lazy(() => import("@/pages/not-found")); 

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
  </div>
);

function App() {
  useEffect(() => { document.title = "AMB Amazonas - Portal Oficial"; }, []);

  return (
    <AuthProvider>
      <SiteConfigProvider>
        <TooltipProvider delayDuration={100}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* --- ÁREA PÚBLICA --- */}
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/parceiros" element={<ParceirosPage />} />
              <Route path="/seja-parceiro" element={<SejaParceiroPage />} />
              <Route path="/inteligencia" element={<InteligenciaPage />} />
              <Route path="/diretoria" element={<DiretoriaPage />} />
              <Route path="/secretaria-digital" element={<SecretariaDigitalPage />} />
              <Route path="/noticias" element={<NoticiasPage />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="/eleicoes" element={<EleicoesPage />} />

              {/* --- AUTENTICAÇÃO --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
              <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

              {/* --- ÁREA DO ASSOCIADO --- */}
              <Route path="/painel" element={<PainelPage />} />
              <Route path="/editar-perfil" element={<EditarPerfilPage />} />

              {/* --- ÁREA ADMINISTRATIVA (ORDEM CORRIGIDA) --- */}
              <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
              <Route path="/admin/painel" element={<AdminPainelPage />} />
              <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
              <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
              <Route path="/admin/banners" element={<GestaoBannersAMB />} />
              <Route path="/admin/transparencia" element={<GestaoTransparencia />} />
              <Route path="/admin/eventos" element={<GestaoEventosMaster />} />
              <Route path="/admin/times" element={<GestaoTimesPage />} />
              <Route path="/admin/diretoria" element={<DiretoriaGestaoPage />} />
              <Route path="/admin/noticias" element={<GestaoNoticiasPage />} />
              <Route path="/admin/eleicoes" element={<EleicoesGestaoPage />} />

              {/* Fallback Geral */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

export default App;
// linha 102 App.tsx