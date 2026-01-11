/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Data: 10 de Janeiro de 2026
 * Versão: 3.1 (Correção Final de Rotas)
 * Descrição: Roteador principal. Agora inclui TODAS as páginas de admin.
 * ==========================================================
 */
import { Routes, Route } from "react-router-dom"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext"; 

// Páginas Públicas
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import EsqueciSenhaPage from "@/pages/EsqueciSenhaPage";
import RedefinirSenhaPage from "@/pages/RedefinirSenhaPage";
import ParceirosPage from "@/pages/ParceirosPage"; 
import SejaParceiroPage from "@/pages/SejaParceiroPage";

// Páginas Privadas (Associado)
import PainelPage from "@/pages/PainelPage";
import EditarPerfilPage from "@/pages/EditarPerfilPage"; 

// Páginas Privadas (Admin)
import AdminPainelPage from "@/pages/admin/AdminPainelPage"; 
import GestaoAssociadosPage from "@/pages/admin/GestaoAssociadosPage"; 
import GestaoParceirosPage from "@/pages/admin/GestaoParceirosPage";
import GestaoEventosPage from "@/pages/admin/GestaoEventosPage"; 
import GestaoConteudoEventoPage from "@/pages/admin/GestaoConteudoEventoPage"; 
import GestaoTimesPage from "@/pages/admin/GestaoTimesPage";
import GestaoInscricaoTimesPage from "@/pages/admin/GestaoInscricaoTimesPage";
import GestaoJogosPage from "@/pages/admin/GestaoJogosPage";
import GestaoPlacarPage from "@/pages/admin/GestaoPlacarPage";

// --- NOVAS IMPORTAÇÕES (BI & GESTÃO) ---
import DiretoriaBIPage from "@/pages/admin/DiretoriaBIPage"; 
import DiretoriaGestaoPage from "@/pages/admin/DiretoriaGestaoPage"; 

function App() {
  return (
    <AuthProvider> 
      <TooltipProvider>
        <Toaster />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Home />} /> 
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/seja-parceiro" element={<SejaParceiroPage />} />

          {/* Rotas Privadas (Associado) */}
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/painel/editar" element={<EditarPerfilPage />} />

          {/* Rotas Privadas (Admin) */}
          <Route path="/admin/painel" element={<AdminPainelPage />} />
          <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
          <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
          <Route path="/admin/eventos" element={<GestaoEventosPage />} />
          <Route path="/admin/eventos/conteudo/:eventoId" element={<GestaoConteudoEventoPage />} />
          <Route path="/admin/times" element={<GestaoTimesPage />} />
          <Route path="/admin/eventos/inscricoes/:eventoId" element={<GestaoInscricaoTimesPage />} />
          <Route path="/admin/eventos/jogos/:eventoId" element={<GestaoJogosPage />} />
          <Route path="/admin/jogos/placar/:eventoId/:jogoId" element={<GestaoPlacarPage />} />

          {/* --- ROTAS CORRIGIDAS --- */}
          {/* 1. Módulo BI (Estratégico) */}
          <Route path="/admin/diretoria" element={<DiretoriaBIPage />} />

          {/* 2. Módulo Gestão (Operacional - O que estava dando 404) */}
          <Route path="/admin/diretoria-gestao" element={<DiretoriaGestaoPage />} />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;