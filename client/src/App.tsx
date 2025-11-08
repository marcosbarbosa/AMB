/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 5 de novembro de 2025
 * Hora: 19:30
 * Versão: 2.1 (Corrige Typo na Rota)
 * Tarefa: 290-B
 *
 * Descrição: Componente raiz da aplicação, define as rotas.
 * CORRIGIDO: O erro de digitação em "@pagesGEsqueciSenhaPage"
 * foi corrigido para "@pages/EsqueciSenhaPage".
 *
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
// 1. CORREÇÃO DO TYPO:
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

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;