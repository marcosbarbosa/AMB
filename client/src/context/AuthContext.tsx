/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:14
 * Versão: 1.1 (Refatoração de Terminologia)
 *
 * Descrição: Contexto de Autenticação (AuthContext).
 * ATUALIZADO para usar a terminologia "Associado" nos comentários e logs.
 * A estrutura interna de dados ('atleta') é mantida para compatibilidade
 * com o backend.
 *
 * ==========================================================
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

// Interface: Define o formato dos dados recebidos do backend
// Mantemos 'AtletaInfo' para clareza de onde vêm os dados
interface AtletaInfo {
  id: number;
  nome_completo: string;
  email: string;
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'atleta' | 'admin'; // 'atleta' aqui é o *tipo* de role
  categoria_atual: string;
}

// Interface: Define o formato do Contexto
interface AuthContextType {
  isAuthenticated: boolean;
  atleta: AtletaInfo | null; // A variável interna ainda se chama 'atleta'
  token: string | null;
  login: (data: AtletaInfo, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [atleta, setAtleta] = useState<AtletaInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      // Mantém 'atletaInfo' como chave do localStorage por compatibilidade
      const storedAtleta = localStorage.getItem('atletaInfo'); 

      if (storedToken && storedAtleta) {
        setToken(storedToken);
        setAtleta(JSON.parse(storedAtleta));
      }
    } catch (error) {
      console.error("Falha ao carregar dados de autenticação do associado", error); // Log atualizado
      localStorage.removeItem('authToken');
      localStorage.removeItem('atletaInfo');
    }
  }, []);

  const login = (data: AtletaInfo, token: string) => {
    setAtleta(data);
    setToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('atletaInfo', JSON.stringify(data));
  };

  const logout = () => {
    setAtleta(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('atletaInfo');
  };

  // O valor partilhado continua usando 'atleta' como nome da propriedade
  const value = {
    isAuthenticated: !!token && !!atleta, 
    atleta, 
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}