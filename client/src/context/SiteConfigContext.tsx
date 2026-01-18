/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: SiteConfigContext.tsx
 * CAMINHO: client/src/context/SiteConfigContext.tsx
 * DATA: 18 de Janeiro de 2026
 * FUNÇÃO: Contexto Global com Log de Resposta
 * VERSÃO: v12.0 Debug
 * ==========================================================
 */

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
      const response = await axios.get(`${API_BASE}/get_site_config.php?t=${Date.now()}`);
      if (response.data) {
        setConfig(response.data);
        if (response.data.menu) setMenuConfig(response.data.menu);
        if (response.data.whatsapp) setWhatsappNumber(response.data.whatsapp);
        if (response.data.email) setEmailContact(response.data.email);
      }
    } catch (error) {
      console.error("Erro config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  // --- UPDATE WHATSAPP (COM LOG DE DEBUG) ---
  const updateWhatsapp = async (newNumber: string): Promise<UpdateResponse> => {
    try {
      const cleanNumber = newNumber.replace(/\D/g, '');
      console.log("Enviando WhatsApp:", cleanNumber); // DEBUG

      const response = await axios.post(`${API_BASE}/update_whatsapp.php`, { number: cleanNumber });

      console.log("Resposta Backend WhatsApp:", response.data); // DEBUG

      if (response.data.status === 'sucesso') {
        setWhatsappNumber(cleanNumber);
        return { success: true, msg: 'WhatsApp atualizado' };
      }
      return { success: false, msg: response.data.mensagem || 'Erro desconhecido no backend' };
    } catch (error: any) {
      console.error("Erro Axios Whats:", error);
      return { success: false, msg: error.message || 'Erro de conexão' };
    }
  };

  // Funções restantes mantidas para brevidade, mas devem seguir o padrão acima...
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
// linha 110 SiteConfigContext.tsx