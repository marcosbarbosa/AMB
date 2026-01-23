// Nome: App.tsx
// Nro de linhas+ Caminho: 140 client/src/App.tsx
// Data: 2026-01-23
// Hora: 09:20
// Função: Router Central (Com Maintenance Guard)
// Versão: v44.0 Shielded
// Alteração: Inclusão do MaintenanceGuard e Rota Mágica.

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // useNavigate adicionado
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/context/SiteConfigContext"; 
import MaintenanceGuard from "@/components/MaintenanceGuard"; // NOVO IMPORT
import { Loader2 } from 'lucide-react';
import Home from "@/pages/Home";

// ... (MANTENHA TODOS OS SEUS IMPORTS LAZY AQUI COMO ESTAVAM) ...
// Estou abreviando os imports para não estourar o limite, mas COPIE OS SEUS ANTERIORES
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const Contact = lazy(() => import("@/pages/Contact"));
const NoticiasPage = lazy(() => import("@/pages/NoticiasPage"));
const EventosPage = lazy(() => import("@/pages/EventosPage"));
const EleicoesPage = lazy(() => import("@/pages/eleicoes/EleicoesPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const CadastroPage = lazy(() => import("@/pages/CadastroPage"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));
const HistoricoPage = lazy(() => import("@/pages/institucional/HistoricoPage"));
const DiretoriaPage = lazy(() => import("@/pages/institucional/DiretoriaPage"));
const SecretariaPage = lazy(() => import("@/pages/institucional/SecretariaPage"));
const ParceirosPage = lazy(() => import("@/pages/institucional/ParceirosPage"));
const PainelPage = lazy(() => import("@/pages/PainelPage"));
const EditarPerfilPage = lazy(() => import("@/pages/EditarPerfilPage"));
const AdminPainelPage = lazy(() => import("@/pages/admin/AdminPainelPage"));
const GestaoAssociadosPage = lazy(() => import("@/pages/admin/GestaoAssociadosPage"));
const EleicoesGestaoPage = lazy(() => import("@/pages/admin/EleicoesGestaoPage"));
const ConfiguracoesPage = lazy(() => import("@/pages/admin/ConfiguracoesPage"));
const DiretoriaGestaoPage = lazy(() => import("@/pages/admin/DiretoriaGestaoPage")); 
const GestaoTransparencia = lazy(() => import("@/pages/admin/GestaoTransparencia"));
const DiretoriaBIPage = lazy(() => import("@/pages/admin/DiretoriaBIPage"));

// COMPONENTE DA ROTA MÁGICA
const DevAccessHandler = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // Grava o token
        localStorage.setItem('AMB_DEV_ACCESS', 'true');
        alert("Modo Desenvolvedor Ativado! Você tem acesso irrestrito.");
        navigate('/');
    }, [navigate]);
    return <div className="h-screen bg-black text-green-500 flex items-center justify-center font-mono">HACKING THE MAINFRAME... ACESSO LIBERADO.</div>;
};

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
          {/* O GUARDIAO ENVOLVE TUDO DENTRO DO SUSPENSE */}
          <Suspense fallback={<PageLoader />}>
            <MaintenanceGuard>
                <Routes>
                  {/* ROTA MÁGICA PARA VOCÊ (Use este link para liberar seu navegador) */}
                  <Route path="/amb-dev-start" element={<DevAccessHandler />} />

                  {/* ROTAS NORMAIS (Serão bloqueadas se maintenance=true e sem token) */}
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

                  {/* Admin (Sempre acessível por causa da Whitelist no Guard) */}
                  <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
                  <Route path="/admin/painel" element={<AdminPainelPage />} />
                  <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
                  <Route path="/admin/eleicoes" element={<EleicoesGestaoPage />} />
                  <Route path="/admin/configuracoes" element={<ConfiguracoesPage />} />
                  <Route path="/admin/diretoria" element={<DiretoriaGestaoPage />} />
                  <Route path="/admin/secretaria" element={<GestaoTransparencia />} />
                  <Route path="/admin/bi" element={<DiretoriaBIPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </MaintenanceGuard>
          </Suspense>
          <Toaster />
        </TooltipProvider>
      </SiteConfigProvider>
    </AuthProvider>
  );
}

export default App;
// linha 140 client/src/App.tsx