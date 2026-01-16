/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: SiteConfigContext.tsx
 * CAMINHO: client/src/context/SiteConfigContext.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Contexto Global de Configuração (Gestão de Estado)
 * VERSÃO: 3.0 Prime (Debug Enabled)
 * ==========================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// URL Base da API
const API_BASE = 'https://www.ambamazonas.com.br/api';

interface SiteConfig {
  [key: string]: boolean;
}

interface SiteConfigContextType {
  menuConfig: SiteConfig;
  refreshConfig: () => Promise<void>;
  updateConfig: (newConfig: SiteConfig) => Promise<boolean>;
  isLoading: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  // Estado inicial padrão (tudo visível por segurança)
  const [menuConfig, setMenuConfig] = useState<SiteConfig>({
      inicio: true, institucional: true, campeonatos: true, blog: true, contato: true
  });
  const [isLoading, setIsLoading] = useState(true);

  // Busca configurações do servidor
  const fetchConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_menu_config.php?t=${Date.now()}`);
      if (res.data.status === 'sucesso') {
        console.log("Config carregada:", res.data.config); // Debug
        setMenuConfig(res.data.config);
      }
    } catch (error) {
      console.error("Erro ao carregar menu config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza configurações
  const updateConfig = async (newConfig: SiteConfig): Promise<boolean> => {
    // 1. Atualização Otimista (Muda na tela na hora)
    setMenuConfig(newConfig);

    try {
      // 2. Envia para o servidor
      const res = await axios.post(`${API_BASE}/update_menu_config.php`, {
        config: newConfig
      });

      if (res.data.status === 'sucesso') {
        console.log("Config salva com sucesso!");
        return true;
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (error) {
      console.error("Erro crítico ao salvar:", error);
      fetchConfig(); // Reverte para o estado anterior em caso de erro
      return false;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ menuConfig, refreshConfig: fetchConfig, updateConfig, isLoading }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig deve ser usado dentro de um SiteConfigProvider');
  }
  return context;
};