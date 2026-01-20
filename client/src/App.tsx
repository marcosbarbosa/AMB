// Nome: App.tsx
// Caminho: client/src/App.tsx
// Data: 2026-01-21
// Hora: 17:00
// Função: Rota corrigida para /redefinir-senha
// Versão: v31.0 Route Match

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext"; 
import { Loader2, MessageCircle } from "lucide-react"; 
import Home from "@/pages/Home";

// ... (Imports lazy existentes mantidos) ...
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
const NotFound = lazy(() => import("@/pages/not-found")); 

// --- ROTAS DE SENHA ---
const EsqueciSenhaPage = lazy(() => import("@/pages/EsqueciSenhaPage"));
const RedefinirSenhaPage = lazy(() => import("@/pages/RedefinirSenhaPage"));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <div className="h-16 w-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
  </div>
);

const FloatingWhatsApp = () => { /* ... */ return null; };

function App() {
  useEffect(() => { document.title = "AMB Amazonas - Portal Oficial"; }, []);

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
              <Route path="/inteligencia" element={<InteligenciaPage />} />
              <Route path="/diretoria" element={<DiretoriaPage />} />
              <Route path="/secretaria-digital" element={<SecretariaDigitalPage />} />
              <Route path="/noticias" element={<NoticiasPage />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="/eleicoes" element={<EleicoesPage />} />

              {/* REDIRECTS */}
              <Route path="/transparencia" element={<Navigate to="/secretaria-digital" replace />} />
              <Route path="/historico" element={<Navigate to="/secretaria-digital" replace />} />
              <Route path="/prestacao-contas" element={<Navigate to="/secretaria-digital" replace />} />
              <Route path="/bi" element={<Navigate to="/inteligencia" replace />} />

              {/* AUTH & RECUPERAÇÃO */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
              {/* CORREÇÃO: URL deve ser /redefinir-senha para bater com o email */}
              <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

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
              <Route path="/admin/eleicoes" element={<EleicoesGestaoPage />} />

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
// linha 200 App.tsx