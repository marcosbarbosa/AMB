/*
// Nome: App.tsx
// Caminho: client/src/App.tsx
// Data: 2026-01-17
// Hora: 23:55 (America/Sao_Paulo)
// Função: Roteador Principal + Fix Import Case Sensitive + WhatsApp Oficial
// Versão: v26.0 Prime Stable
// Alteração: Correção do import not-found, WhatsApp oficial no fallback e novas rotas.
*/

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider, useSiteConfig } from "@/context/SiteConfigContext"; 
import { Loader2, MessageCircle } from "lucide-react"; 

// --- IMPORT ESTÁTICO ---
import Home from "@/pages/Home";

// --- PÁGINAS PÚBLICAS (Lazy) ---
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const ParceirosPage = lazy(() => import("@/pages/ParceirosPage"));
const SejaParceiroPage = lazy(() => import("@/pages/SejaParceiroPage"));

// NOVAS PÁGINAS INSTITUCIONAIS
const InteligenciaPage = lazy(() => import("@/pages/InteligenciaPage")); 
const DiretoriaPage = lazy(() => import("@/pages/DiretoriaPage")); 
const SecretariaDigitalPage = lazy(() => import("@/pages/SecretariaDigitalPage"));
const NoticiasPage = lazy(() => import("@/pages/NoticiasPage"));
const EventosPage = lazy(() => import("@/pages/EventosPage"));

// AUTH
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CadastroPage = lazy(() => import("@/pages/CadastroPage"));

// CORREÇÃO CRÍTICA: O arquivo no disco é 'not-found.tsx' (minúsculo)
const NotFound = lazy(() => import("@/pages/not-found")); 

// ÁREA DO ATLETA
const PainelPage = lazy(() => import("@/pages/PainelPage"));
const EditarPerfilPage = lazy(() => import("@/pages/EditarPerfilPage"));

// ÁREA ADMINISTRATIVA
const AdminPainelPage = lazy(() => import("@/pages/admin/AdminPainelPage"));
const GestaoAssociadosPage = lazy(() => import("@/pages/admin/GestaoAssociadosPage"));
const GestaoParceirosPage = lazy(() => import("@/pages/admin/GestaoParceirosPage"));
const GestaoBannersAMB = lazy(() => import("@/pages/admin/GestaoBannersAMB"));
const GestaoTransparencia = lazy(() => import("@/pages/admin/GestaoTransparencia"));
const GestaoEventosMaster = lazy(() => import("@/pages/admin/GestaoEventosMaster"));
const GestaoTimesPage = lazy(() => import("@/pages/admin/GestaoTimesPage"));
const DiretoriaGestaoPage = lazy(() => import("@/pages/admin/DiretoriaGestaoPage"));
const GestaoNoticiasPage = lazy(() => import("@/pages/admin/GestaoNoticiasPage")); 

// --- LOADING ---
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

// --- WHATSAPP FLUTUANTE (DADOS OFICIAIS) ---
const FloatingWhatsApp = () => {
  const { whatsappNumber } = useSiteConfig(); 
  const message = "Olá! Gostaria de mais informações sobre a AMB Amazonas.";

  // Prioridade: Banco de Dados > Oficial Hardcoded
  // Número Oficial: +55 92 9252-1345
  const rawNumber = whatsappNumber || '559292521345';

  const cleanNumber = rawNumber.replace(/\D/g, '');
  const link = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

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
              {/* PÚBLICAS */}
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/parceiros" element={<ParceirosPage />} />
              <Route path="/seja-parceiro" element={<SejaParceiroPage />} />

              {/* INSTITUCIONAIS & CORREÇÃO 404 */}
              <Route path="/inteligencia" element={<InteligenciaPage />} />
              <Route path="/diretoria" element={<DiretoriaPage />} />
              <Route path="/secretaria-digital" element={<SecretariaDigitalPage />} />
              <Route path="/noticias" element={<NoticiasPage />} />
              <Route path="/eventos" element={<EventosPage />} />

              {/* REDIRECTS INTELIGENTES */}
              <Route path="/transparencia" element={<Navigate to="/secretaria-digital" replace />} />
              <Route path="/historico" element={<Navigate to="/secretaria-digital" replace />} />
              <Route path="/prestacao-contas" element={<Navigate to="/secretaria-digital" replace />} />
              <Route path="/bi" element={<Navigate to="/inteligencia" replace />} />

              {/* AUTH */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />

              {/* ATLETA */}
              <Route path="/painel" element={<PainelPage />} />
              <Route path="/painel/editar" element={<EditarPerfilPage />} />

              {/* ADMIN */}
              <Route path="/admin" element={<AdminPainelPage />} />
              <Route path="/admin/login" element={<AdminPainelPage />} /> 
              <Route path="/admin/painel" element={<AdminPainelPage />} />
              <Route path="/admin/configuracoes" element={<AdminPainelPage />} />

              <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
              <Route path="/admin/atletas" element={<GestaoAssociadosPage />} />
              <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
              <Route path="/admin/banners" element={<GestaoBannersAMB />} />
              <Route path="/admin/transparencia" element={<GestaoTransparencia />} />
              <Route path="/admin/eventos" element={<GestaoEventosMaster />} />
              <Route path="/admin/times" element={<GestaoTimesPage />} />
              <Route path="/admin/diretoria" element={<DiretoriaGestaoPage />} />
              <Route path="/admin/noticias" element={<GestaoNoticiasPage />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingWhatsApp />
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

export default App;
// linha 175 App.tsx