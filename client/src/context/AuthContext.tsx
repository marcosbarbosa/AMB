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
 * Versão: 1.0
 *
 * Descrição: Este ficheiro cria o "Contexto de Autenticação" (AuthContext).
 * Ele age como um "cérebro" global para armazenar os dados do 
 * utilizador logado (atleta) e o seu token JWT em toda a aplicação.
 *
 * ==========================================================
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Define o "formato" dos dados do nosso atleta
// (Baseado no que o nosso PHP `api/login.php` devolve)
interface AtletaInfo {
  id: number;
  nome_completo: string;
  email: string;
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'atleta' | 'admin';
  categoria_atual: string;
}

// 2. Define o "formato" do nosso cérebro (Context)
interface AuthContextType {
  isAuthenticated: boolean;
  atleta: AtletaInfo | null;
  token: string | null;
  login: (data: AtletaInfo, token: string) => void;
  logout: () => void;
}

// 3. Cria o Contexto (inicialmente vazio)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Cria o "Provedor" (O componente que vai "embrulhar" a nossa App)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [atleta, setAtleta] = useState<AtletaInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 5. Efeito: Tenta carregar os dados do localStorage ao iniciar a App
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedAtleta = localStorage.getItem('atletaInfo');

      if (storedToken && storedAtleta) {
        setToken(storedToken);
        setAtleta(JSON.parse(storedAtleta));
      }
    } catch (error) {
      console.error("Falha ao carregar dados de autenticação do localStorage", error);
      // Limpa em caso de dados corrompidos
      localStorage.removeItem('authToken');
      localStorage.removeItem('atletaInfo');
    }
  }, []);

  // 6. Função de Login (a ser chamada pelo LoginForm)
  const login = (data: AtletaInfo, token: string) => {
    setAtleta(data);
    setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('atletaInfo', JSON.stringify(data));
  };

  // 7. Função de Logout (a ser chamada pelo Header)
  const logout = () => {
    setAtleta(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('atletaInfo');
    // Futuramente, redireciona para o Início
    // window.location.href = '/'; 
  };

  // 8. O valor que será partilhado com toda a App
  const value = {
    isAuthenticated: !!token && !!atleta, // Verdadeiro se houver token E atleta
    atleta,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 9. Cria um "Hook" personalizado (um atalho para usar o cérebro)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}