/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 15:55
 * Versão: 1.1 (Atualizado para AuthContext)
 *
 * Descrição: Ficheiro de entrada (entry point) da aplicação React.
 * ATUALIZADO para incluir o AuthProvider.
 *
 * ==========================================================
 */

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; 

// 1. Importa o nosso novo "Provedor" de Autenticação
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  // 2. "Embrulha" o BrowserRouter com o AuthProvider
  // A ordem importa: AuthProvider > BrowserRouter > App
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);