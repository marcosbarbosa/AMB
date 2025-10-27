/* client/src/App.tsx (MODIFICADO) */
import { Routes, Route } from "react-router-dom"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";

// Importa as páginas existentes
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

// 1. IMPORTA AS NOSSAS NOVAS PÁGINAS
import LoginPage from "@/pages/LoginPage";
import CadastroPage from "@/pages/CadastroPage";

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contato" element={<Contact />} />

          {/* 2. ADICIONA AS NOVAS ROTAS */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
