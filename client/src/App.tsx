/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 * Versão: 6.1 (Correção de Tags e Rotas Administrativas)
 */
import { Routes, Route, Navigate } from "react-router-dom"; 
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
import PaginaDiretoriaPublica from "@/pages/PaginaDiretoriaPublica"; 
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

// Páginas Privadas
import PainelPage from "@/pages/PainelPage";
import AdminPainelPage from "@/pages/admin/AdminPainelPage";
import GestaoAssociadosPage from "@/pages/admin/GestaoAssociadosPage";
import GestaoDiretoriaPage from "@/pages/admin/GestaoDiretoriaPage";
import GestaoPlacarPage from "@/pages/admin/GestaoPlacarPage"; // Importante: Garanta que este arquivo existe

function App() {
  return (
    <AuthProvider> 
      <TooltipProvider>
        <Navigation /> 
        <Toaster />

        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/diretoria" element={<PaginaDiretoriaPublica />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/parceiros" element={<ParceirosPage />} />
          <Route path="/contato" element={<Contact />} />

          {/* Rotas Privadas (Associado) */}
          <Route path="/painel" element={<PainelPage />} />

          {/* Rotas Privadas (Admin) */}
          <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
          <Route path="/admin/painel" element={<AdminPainelPage />} />
          <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
          <Route path="/admin/diretoria-stats" element={<GestaoDiretoriaPage />} />
          <Route path="/admin/jogos/placar/:eventoId/:jogoId" element={<GestaoPlacarPage />} />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;