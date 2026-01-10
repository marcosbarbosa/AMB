/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 10 de janeiro de 2026
 * Hora: 16:45
 * Versão: 9.0
 * Tarefa: 350
 *
 * Descrição: Ficheiro mestre de rotas e estrutura global.
 * CORREÇÃO: Fechamento de tags Routes 
 * e mapeamento total de módulos administrativos.
 *
 * ==========================================================
 */

import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

// Páginas Públicas
import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import ParceirosPage from "@/pages/ParceirosPage";
import Contact from "@/pages/Contact";
import PaginaDiretoriaPublica from "@/pages/PaginaDiretoriaPublica";

// Páginas Administrativas (Certifique-se que os ficheiros existem na pasta admin)
import AdminPainelPage from "@/pages/admin/AdminPainelPage";
import GestaoAssociadosPage from "@/pages/admin/GestaoAssociadosPage";
import GestaoDiretoriaPage from "@/pages/admin/GestaoDiretoriaPage";
import GestaoParceirosPage from "@/pages/admin/GestaoParceirosPage";
import GestaoEventosPage from "@/pages/admin/GestaoEventosPage";
import GestaoPostsPage from "@/pages/admin/GestaoPostsPage";
import GestaoCategoriasPage from "@/pages/admin/GestaoCategoriasPage";
import GestaoPlacarPage from "@/pages/admin/GestaoPlacarPage";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        {/* Navigation única no topo para evitar duplicação */}
        <Navigation /> 
        <Toaster />

        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/diretoria" element={<PaginaDiretoriaPublica />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* ROTAS ADMINISTRATIVAS - RESOLVENDO 404 */}
          <Route path="/admin/painel" element={<AdminPainelPage />} />
          <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
          <Route path="/admin/diretoria-stats" element={<GestaoDiretoriaPage />} />
          <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
          <Route path="/admin/eventos" element={<GestaoEventosPage />} />
          <Route path="/admin/posts" element={<GestaoPostsPage />} />
          <Route path="/admin/categorias" element={<GestaoCategoriasPage />} />
          <Route path="/admin/jogos/placar/:eventoId/:jogoId" element={<GestaoPlacarPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Footer único na base */}
        <Footer />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;