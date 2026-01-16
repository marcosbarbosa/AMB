/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: App.tsx
 * CAMINHO: client/src/App.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Roteador Principal + Floating WhatsApp
 * VERSÃO: 20.0 Prime
 * ==========================================================
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { Loader2, MessageCircle } from "lucide-react"; // MessageCircle para o WhatsApp

// --- IMPORT ESTÁTICO (Home para SEO e LCP) ---
import Home from "@/pages/Home";

// --- IMPORTS DINÂMICOS (Lazy Loading para Performance) ---
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const ParceirosPage = lazy(() => import("@/pages/ParceirosPage"));
const SejaParceiroPage = lazy(() => import("@/pages/SejaParceiroPage"));
const PrestacaoContasPage = lazy(() => import("@/pages/PrestacaoContasPage"));
const InteligenciaPage = lazy(() => import("@/pages/InteligenciaPage")); 

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
const DiretoriaGestaoPage = lazy(() => import("@/pages/admin/DiretoriaGestaoPage"));
const GestaoNoticiasPage = lazy(() => import("@/pages/admin/GestaoNoticiasPage")); 

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

// --- COMPONENTE BOTÃO FLUTUANTE WHATSAPP ---
const FloatingWhatsApp = () => {
  const whatsappNumber = "5592999999999"; // Substitua pelo número real da AMB
  const message = "Olá! Gostaria de mais informações sobre a AMB Amazonas.";
  const link = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-green-500/30 flex items-center justify-center group"
      title="Fale Conosco no WhatsApp"
    >
      <MessageCircle className="h-8 w-8 fill-white stroke-white" />
      <span className="absolute right-full mr-3 bg-white text-slate-800 text-xs font-bold py-1 px-3 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale Conosco
      </span>
    </a>
  );
};

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

              <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
              <Route path="/admin/atletas" element={<GestaoAssociadosPage />} />

              <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
              <Route path="/admin/banners" element={<GestaoBannersAMB />} />
              <Route path="/admin/transparencia" element={<GestaoTransparencia />} />
              <Route path="/admin/eventos" element={<GestaoEventosMaster />} />
              <Route path="/admin/times" element={<GestaoTimesPage />} />

              <Route path="/admin/diretoria" element={<DiretoriaGestaoPage />} />
              <Route path="/admin/diretoria-gestao" element={<DiretoriaGestaoPage />} />

              <Route path="/admin/noticias" element={<GestaoNoticiasPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* BOTÃO FLUTUANTE GLOBAL */}
            <FloatingWhatsApp />

          </Suspense>
          <Toaster />
        </TooltipProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

export default App;