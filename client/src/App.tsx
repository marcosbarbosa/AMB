/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - App Root
 * ==========================================================
 * Versão: 5.1 (Layout Global e Correção de Rotas)
 */
import { Routes, Route, Navigate } from "react-router-dom"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext"; 

import { Navigation } from "@/components/Navigation"; 
import { Footer } from "@/components/Footer";

import Home from "@/pages/Home";
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";
import PainelPage from "@/pages/PainelPage";
import AdminPainelPage from "@/pages/admin/AdminPainelPage";
import GestaoAssociadosPage from "@/pages/admin/GestaoAssociadosPage";
import GestaoParceirosPage from "@/pages/admin/GestaoParceirosPage";
import GestaoEventosPage from "@/pages/admin/GestaoEventosPage";

function App() {
  return (
    <AuthProvider> 
      <TooltipProvider>
        <Navigation /> 
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          {/* Rotas Privadas */}
          <Route path="/painel" element={<PainelPage />} />
          <Route path="/admin" element={<Navigate to="/admin/painel" replace />} />
          <Route path="/admin/painel" element={<AdminPainelPage />} />
          <Route path="/admin/associados" element={<GestaoAssociadosPage />} />
          <Route path="/admin/parceiros" element={<GestaoParceirosPage />} />
          <Route path="/admin/eventos" element={<GestaoEventosPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;