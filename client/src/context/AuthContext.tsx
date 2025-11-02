/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 19:45
 * Versão: 1.2 (Adiciona Estado de 'isLoading')
 *
 * Descrição: Contexto de Autenticação (AuthContext).
 * ATUALIZADO para incluir um estado 'isLoading', que nos diz
 * quando o contexto terminou de ler o localStorage.
 *
 * ==========================================================
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

// Interface AtletaInfo (sem mudança)
interface AtletaInfo {
  id: number;
  nome_completo: string;
  email: string;
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'atleta' | 'admin';
  categoria_atual: string | null;
  // Adiciona campos que sabemos que vêm do backend (para evitar erros)
  cpf?: string;
  data_nascimento?: string;
  endereco?: string;
  rg?: string;
  nacionalidade?: string;
  naturalidade?: string;
  filiacao?: string;
  autoriza_imagem?: boolean;
  preferencia_newsletter?: string;
}

// Interface do Contexto (Adiciona isLoading)
interface AuthContextType {
  isAuthenticated: boolean;
  atleta: AtletaInfo | null;
  token: string | null;
  isLoading: boolean; // <-- NOVO: Estado de carregamento
  login: (data: AtletaInfo, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [atleta, setAtleta] = useState<AtletaInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <-- NOVO: Começa como 'a carregar'

  // Efeito: Tenta carregar os dados do localStorage ao iniciar a App
  useEffect(() => {
    setIsLoading(true); // Define a carregar
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedAtleta = localStorage.getItem('atletaInfo');

      if (storedToken && storedAtleta) {
        setToken(storedToken);
        setAtleta(JSON.parse(storedAtleta));
      }
    } catch (error) {
      console.error("Falha ao carregar dados de autenticação do associado", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('atletaInfo');
    } finally {
      setIsLoading(false); // <-- NOVO: Terminou de carregar (com ou sem dados)
    }
  }, []); // Executa apenas uma vez

  // Função de Login (sem mudança)
  const login = (data: AtletaInfo, token: string) => {
    setAtleta(data);
    setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('atletaInfo', JSON.stringify(data));
  };

  // Função de Logout (sem mudança)
  const logout = () => {
    setAtleta(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('atletaInfo');
  };

  const value = {
    isAuthenticated: !!token && !!atleta, 
    atleta, 
    token,
    isLoading, // <-- NOVO: Partilha o estado de carregamento
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook 'useAuth' (sem mudança)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}