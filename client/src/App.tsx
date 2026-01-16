/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: App.tsx
 * CAMINHO: client/src/App.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Roteador Principal (Correção Diretoria + BI + Associados)
 * VERSÃO: 19.0 Prime
 * ==========================================================
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { Loader2 } from "lucide-react";

// --- IMPORT ESTÁTICO (Home para SEO e LCP) ---
import Home from "@/pages/Home";

// --- IMPORTS DINÂMICOS (Lazy Loading para Performance) ---
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const ParceirosPage = lazy(() => import("@/pages/ParceirosPage"));
const SejaParceiroPage = lazy(() => import("@/pages/SejaParceiroPage"));
const PrestacaoContasPage = lazy(() => import("@/pages/PrestacaoContasPage"));
const InteligenciaPage = lazy(() => import("@/pages/InteligenciaPage")); // <--- NOVO

// Auth
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CadastroPage = lazy(() => import("@/pages/CadastroPage"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Área do Atleta
const PainelPage = lazy(() => import("@/pages/PainelPage"));
const EditarPerfilPage = lazy(() => import("@/pages/EditarPerfilPage"));

// Área Administrativa
const AdminPainelPage = lazy(() => import("@/pages/admin/AdminPainelPage"));
const GestaoAssociadosPage = lazy(() => import("@/pages/admin/GestaoAssociadosPage"));
const GestaoParceirosPage = lazy(() => import("@/pages/admin/GestaoParceirosPage"));
const GestaoBannersAMB = lazy(() => import("@/pages/admin/GestaoBannersAMB"));
const GestaoTransparencia = lazy(() => import("@/pages/admin/GestaoTransparencia"));
const GestaoEventosMaster = lazy(() => import("@/pages/admin/GestaoEventosMaster"));
const GestaoTimesPage = lazy(() => import("@/pages/admin/GestaoTimesPage"));

// CORREÇÃO CRÍTICA: O nome do arquivo físico é 'DiretoriaGestaoPage.tsx'
// Antes estava: import("@/pages/admin/GestaoDiretoriaPage") -> CAUSAVA ERRO 404
const DiretoriaGestaoPage = lazy(() => import("@/pages/admin/DiretoriaGestaoPage"));

// --- COMPONENTE DE LOADING ---
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <div className="relative">
      <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full bg-slate-100"></div>
      </div>
    </div>
    <p className="mt-4 text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">
      Carregando Sistema...
    </p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SiteConfigProvider>
        <TooltipProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* --- ROTAS PÚBLICAS --- */}
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/parceiros" element={<ParceirosPage />} />
              <Route path="/seja-parceiro" element={<SejaParceiroPage />} />
              <Route path="/transparencia" element={<PrestacaoContasPage />} />

              {/* Rota BI - Inteligência */}
              <Route path="/bi" element={<InteligenciaPage />} />

              {/* --- AUTENTICAÇÃO --- */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />

              {/* --- ÁREA DO ATLETA --- */}
              <Route path="/painel" element={<PainelPage />} />
              <Route path="/painel/editar" element={<EditarPerfilPage />} />

              {/* --- ÁREA ADMINISTRATIVA --- */}
              <Route path="/admin" element={<AdminPainelPage />} />
              <Route path="/admin/login" element={<AdminPainelPage />} /> 
              <Route path="/admin/painel" element={<AdminPainelPage />} />

              {/* Rota Associados (Atletas) */}
              <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
              <Route path="/admin/atletas" element={<GestaoAssociadosPage />} /> {/* Legacy support */}

              <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
              <Route path="/admin/banners" element={<GestaoBannersAMB />} />
              <Route path="/admin/transparencia" element={<GestaoTransparencia />} />
              <Route path="/admin/eventos" element={<GestaoEventosMaster />} />
              <Route path="/admin/times" element={<GestaoTimesPage />} />

              {/* Rota Diretoria - Apontando para o componente correto */}
              <Route path="/admin/diretoria" element={<DiretoriaGestaoPage />} />
              <Route path="/admin/diretoria-gestao" element={<DiretoriaGestaoPage />} />

              {/* --- ROTA 404 --- */}
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