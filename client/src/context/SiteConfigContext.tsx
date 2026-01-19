// Nome: SiteConfigContext.tsx
// Caminho: client/src/context/SiteConfigContext.tsx
// Data: 2026-01-18
// Hora: 21:05 (America/Sao_Paulo)
// Função: Contexto Global com Fetch Dedicado de Menu
// Versão: v12.1 Menu Fix
// Alteração: Adicionado fetch paralelo para get_menu_config.php para garantir integridade do menu.

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://www.ambamazonas.com.br/api';

interface UpdateResponse {
  success: boolean;
  msg: string;
}

interface SiteConfigContextData {
  config: any;
  menuConfig: Record<string, boolean>;
  whatsappNumber: string;
  emailContact: string;
  isLoading: boolean;
  updateConfig: (newConfig: Record<string, boolean>) => Promise<UpdateResponse>;
  updateWhatsapp: (newNumber: string) => Promise<UpdateResponse>;
  updateEmail: (newEmail: string) => Promise<UpdateResponse>;
}

const SiteConfigContext = createContext<SiteConfigContextData>({} as SiteConfigContextData);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<any>(null);
  const [menuConfig, setMenuConfig] = useState<Record<string, boolean>>({});
  const [whatsappNumber, setWhatsappNumber] = useState(''); 
  const [emailContact, setEmailContact] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadConfig = async () => {
    try {
      // Executa requisições em paralelo para performance
      const [siteRes, menuRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/get_site_config.php?t=${Date.now()}`),
        axios.get(`${API_BASE}/get_menu_config.php?t=${Date.now()}`)
      ]);

      // Processa Configurações Gerais
      if (siteRes.status === 'fulfilled' && siteRes.value.data) {
        const data = siteRes.value.data;
        setConfig(data);
        if (data.whatsapp) setWhatsappNumber(data.whatsapp);
        if (data.email) setEmailContact(data.email);

        // Fallback se o endpoint dedicado falhar
        if (data.menu && (!menuRes || menuRes.status === 'rejected')) {
           setMenuConfig(data.menu);
        }
      }

      // Processa Configuração Específica de Menu (Prioridade Alta)
      if (menuRes.status === 'fulfilled' && menuRes.value.data && menuRes.value.data.config) {
        setMenuConfig(prev => ({ ...prev, ...menuRes.value.data.config }));
      }

    } catch (error) {
      console.error("Erro crítico carregando configs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  // --- UPDATE WHATSAPP ---
  const updateWhatsapp = async (newNumber: string): Promise<UpdateResponse> => {
    try {
      const cleanNumber = newNumber.replace(/\D/g, '');
      const response = await axios.post(`${API_BASE}/update_whatsapp.php`, { number: cleanNumber });
      if (response.data.status === 'sucesso') {
        setWhatsappNumber(cleanNumber);
        return { success: true, msg: 'WhatsApp atualizado' };
      }
      return { success: false, msg: response.data.mensagem || 'Erro backend' };
    } catch (error: any) {
      return { success: false, msg: error.message || 'Erro conexão' };
    }
  };

  // --- UPDATE MENU CONFIG ---
  const updateConfig = async (newConfig: Record<string, boolean>): Promise<UpdateResponse> => {
    try {
        const response = await axios.post(`${API_BASE}/update_menu_config.php`, { config: newConfig });
        if (response.data.status === 'sucesso') {
            setMenuConfig(newConfig);
            return { success: true, msg: 'Menu salvo' };
        }
        return { success: false, msg: response.data.mensagem };
    } catch(e: any) { return { success: false, msg: e.message }; }
  };

  // --- UPDATE EMAIL ---
  const updateEmail = async (newEmail: string): Promise<UpdateResponse> => {
    try {
        const response = await axios.post(`${API_BASE}/update_email.php`, { email: newEmail });
        if (response.data.status === 'sucesso') {
            setEmailContact(newEmail);
            return { success: true, msg: 'Email salvo' };
        }
        return { success: false, msg: response.data.mensagem };
    } catch(e: any) { return { success: false, msg: e.message }; }
  };

  return (
    <SiteConfigContext.Provider value={{ 
        config, menuConfig, whatsappNumber, emailContact, isLoading, 
        updateConfig, updateWhatsapp, updateEmail 
    }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => useContext(SiteConfigContext);
// linha 116 SiteConfigContext.tsx