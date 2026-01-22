// Nome: AuthContext.tsx
// Nro de linhas+ Caminho: 105 client/src/context/AuthContext.tsx
// Data: 2026-01-22
// Hora: 20:30 (America/Sao_Paulo)
// Função: Contexto Global de Autenticação e Sessão
// Versão: v1.7 Superuser Fix
// Alteração: Adição oficial do campo is_superuser na interface e tratamento de sessão.

import React, { createContext, useState, useContext, useEffect } from 'react';

// Interface do Atleta (Refletindo o Banco de Dados SQL)
interface AtletaInfo {
  id: number;
  nome_completo: string;
  email: string;
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'atleta' | 'admin';
  categoria_atual: string | null;
  // Correção Crítica: Aceita múltiplos formatos retornados pelo PHP
  is_superuser?: string | number | boolean | null; 
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

interface AuthContextType {
  isAuthenticated: boolean;
  atleta: AtletaInfo | null;
  token: string | null;
  isLoading: boolean;
  login: (data: AtletaInfo, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [atleta, setAtleta] = useState<AtletaInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carga Inicial Segura
  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedAtleta = localStorage.getItem('atletaInfo');

        if (storedToken && storedAtleta) {
          const parsedAtleta = JSON.parse(storedAtleta);
          if (parsedAtleta && parsedAtleta.id) {
            setToken(storedToken);
            setAtleta(parsedAtleta);
          }
        }
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('atletaInfo');
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
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

  const value = {
    isAuthenticated: !!token && !!atleta, 
    atleta, 
    token,
    isLoading,
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
// linha 105 client/src/context/AuthContext.tsx