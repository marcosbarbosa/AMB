// Nome: SiteConfigContext.tsx
// Caminho: client/src/context/SiteConfigContext.tsx
// Data: 2026-01-19
// Hora: 12:00
// Função: Contexto com Cliente Axios Dedicado
// Versão: v19.0 Axios Instance

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://www.ambamazonas.com.br/api';

// Configuração do Axios para evitar problemas de CORS com Wildcard (*)
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  // IMPORTANTE: Isso evita envio de cookies que quebram CORS com "*"
  withCredentials: false 
});

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
  const DEFAULT_WHATSAPP = '559292521345';

  const [config, setConfig] = useState<any>(null);
  const [menuConfig, setMenuConfig] = useState<Record<string, boolean>>({});
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP); 
  const [emailContact, setEmailContact] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadConfig = async () => {
    try {
      // Timestamp para evitar cache
      const response = await apiClient.get(`/get_site_config.php?t=${Date.now()}`);

      console.log("📥 Dados (Load):", response.data);

      if (response.data) {
        setConfig(response.data);

        if (response.data.menu) {
            const rawMenu = response.data.menu;
            const normalizedMenu: Record<string, boolean> = {};
            Object.keys(rawMenu).forEach(key => {
                const val = rawMenu[key];
                normalizedMenu[key] = (Number(val) === 1);
            });
            setMenuConfig(normalizedMenu);
        }

        if (response.data.whatsapp) setWhatsappNumber(response.data.whatsapp);
        if (response.data.email) setEmailContact(response.data.email);
      }
    } catch (error) {
      console.error("❌ Falha Load:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  const updateWhatsapp = async (newNumber: string): Promise<UpdateResponse> => {
    try {
      const cleanNumber = newNumber.replace(/\D/g, '');
      const response = await apiClient.post(`/update_whatsapp.php`, { number: cleanNumber });
      if (response.data.status === 'sucesso') {
        setWhatsappNumber(cleanNumber);
        return { success: true, msg: 'Salvo' };
      }
      return { success: false, msg: response.data.mensagem };
    } catch (e: any) { return { success: false, msg: e.message }; }
  };

  const updateEmail = async (newEmail: string): Promise<UpdateResponse> => {
    try {
      const response = await apiClient.post(`/update_email.php`, { email: newEmail });
      if (response.data.status === 'sucesso') {
        setEmailContact(newEmail);
        return { success: true, msg: 'Salvo' };
      }
      return { success: false, msg: response.data.mensagem };
    } catch (e: any) { return { success: false, msg: e.message }; }
  };

  const updateConfig = async (newConfig: Record<string, boolean>): Promise<UpdateResponse> => {
    try {
        console.log("📤 Enviando Menu:", newConfig);
        const response = await apiClient.post(`/update_menu_config.php`, { config: newConfig });

        if (response.data.status === 'sucesso') {
            setMenuConfig(newConfig);
            setTimeout(() => loadConfig(), 300); // Reload de segurança
            return { success: true, msg: 'Sucesso' };
        }
        return { success: false, msg: response.data.mensagem };
    } catch(e: any) { 
        console.error("❌ Erro Update:", e);
        return { success: false, msg: e.message || "Erro de Rede" }; 
    }
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
// linha 110 SiteConfigContext.tsx