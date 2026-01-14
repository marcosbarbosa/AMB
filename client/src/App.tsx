/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas (Basquete Master)
 * STATUS: Versão Estável 6.5 - "Momento Sublime"
 * DATA: 12 de Janeiro de 2026
 * ARQUIVO: App.tsx
 * CAMINHO: client/src/App.tsx
 * FUNÇÃO: Roteador principal com nova rota de Transparência.
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
import SobrePage from "./pages/SobrePage";
import PrestacaoContasPage from "@/pages/PrestacaoContasPage"; //

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
import DiretoriaBIPage from "@/pages/admin/DiretoriaBIPage";
import DiretoriaGestaoPage from "@/pages/admin/DiretoriaGestaoPage";
import GestaoBannersAMB from "@/pages/admin/GestaoBannersAMB";
import GestaoTransparencia from "@/pages/admin/GestaoTransparencia"; //

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/esqueci-senha" element={<EsqueciSenhaPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/seja-parceiro" element={<SejaParceiroPage />} />
          <Route path="/transparencia" element={<PrestacaoContasPage />} /> {/* */}

          {/* --- ROTAS DO ASSOCIADO (PROTEGIDAS) --- */}
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/painel/editar" element={<EditarPerfilPage />} />

          {/* --- ROTAS ADMINISTRATIVAS --- */}
          <Route path="/admin/painel" element={<AdminPainelPage />} />
          <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
          <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
          <Route path="/admin/banners" element={<GestaoBannersAMB />} />
          <Route path="/admin/transparencia" element={<GestaoTransparencia />} /> {/* */}

          {/* Gestão de Torneios e Jogos */}
          <Route path="/admin/eventos" element={<GestaoEventosPage />} />
          <Route path="/admin/eventos/conteudo/:eventoId" element={<GestaoConteudoEventoPage />} />
          <Route path="/admin/times" element={<GestaoTimesPage />} />
          <Route path="/admin/eventos/inscricoes/:eventoId" element={<GestaoInscricaoTimesPage />} />
          <Route path="/admin/eventos/jogos/:eventoId" element={<GestaoJogosPage />} />
          <Route path="/admin/jogos/placar/:eventoId/:jogoId" element={<GestaoPlacarPage />} />

          {/* Business Intelligence e Gestão Estratégica */}
          <Route path="/admin/diretoria" element={<DiretoriaBIPage />} />
          <Route path="/admin/diretoria-gestao" element={<DiretoriaGestaoPage />} />

          {/* --- ROTA DE ERRO --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;