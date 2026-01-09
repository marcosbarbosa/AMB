/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Hora: 19:15
 * Versão: 3.2 (Estrutura de Layout Global e Sincronia Admin)
 *
 * Descrição: Componente raiz da aplicação. 
 * Centraliza a Navigation e o Footer dentro do AuthProvider.
 * Isso garante que o menu reconheça o role 'admin' e exiba 
 * o cadeado em tempo real sem duplicar elementos.
 *
 * ==========================================================
 */

import { Routes, Route, Navigate } from "react-router-dom"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext"; 

// Componentes Globais (Persistentes em todas as telas)
import { Navigation } from "@/components/Navigation"; 
import Footer from "@/components/Footer";

// Páginas Públicas
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import EsqueciSenhaPage from "@/pages/EsqueciSenhaPage";
import RedefinirSenhaPage from "@/pages/RedefinirSenhaPage";
import ParceirosPage from "@/pages/ParceirosPage"; 

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

function App() {
  return (
    <AuthProvider> 
      <TooltipProvider>

        {/* MENU GLOBAL: Única instância para o site todo */}
        <Navigation /> 

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

          {/* Rotas Privadas (Associado) */}
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/painel/editar" element={<EditarPerfilPage />} />

          {/* Rotas Privadas (Admin) */}
          {/* Redirecionamento amigável: /admin vai para o painel administrativo */}
          <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
          <Route path="/admin/painel" element={<AdminPainelPage />} />
          <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
          <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
          <Route path="/admin/eventos" element={<GestaoEventosPage />} />
          <Route path="/admin/eventos/conteudo/:eventoId" element={<GestaoConteudoEventoPage />} />
          <Route path="/admin/times" element={<GestaoTimesPage />} />
          <Route path="/admin/eventos/inscricoes/:eventoId" element={<GestaoInscricaoTimesPage />} />
          <Route path="/admin/eventos/jogos/:eventoId" element={<GestaoJogosPage />} />
          <Route path="/admin/jogos/placar/:eventoId/:jogoId" element={<GestaoPlacarPage />} />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* RODAPÉ GLOBAL: Sempre no final da página */}
        <Footer />

      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;