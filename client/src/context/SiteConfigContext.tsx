// Nome: SiteConfigContext.tsx
// Caminho: client/src/context/SiteConfigContext.tsx
// Data: 2026-01-19
// Hora: 05:00
// Função: Contexto com Normalização de Tipos (Fix 0 vs False)
// Versão: v16.0 Boolean Normalizer

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
  const DEFAULT_WHATSAPP = '559292521345';
  const DEFAULT_EMAIL = 'associacaomasterdebasquetebol@gmail.com';

  const [config, setConfig] = useState<any>(null);

  // menuConfig agora guardará APENAS true/false reais
  const [menuConfig, setMenuConfig] = useState<Record<string, boolean>>({});

  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP); 
  const [emailContact, setEmailContact] = useState(DEFAULT_EMAIL);
  const [isLoading, setIsLoading] = useState(true);

  const loadConfig = async () => {
    try {
      const response = await axios.get(`${API_BASE}/get_site_config.php?t=${Date.now()}`);

      console.log("📥 Raw Data do Banco:", response.data); 

      if (response.data) {
        setConfig(response.data);

        // --- NORMALIZAÇÃO DE DADOS DO MENU (CRUCIAL) ---
        // O Banco manda 0 ou 1 (int/string). O React precisa de true/false.
        if (response.data.menu) {
            const rawMenu = response.data.menu;
            const normalizedMenu: Record<string, boolean> = {};

            Object.keys(rawMenu).forEach(key => {
                const val = rawMenu[key];
                // Regra: É true se for 1, '1' ou true. Qualquer outra coisa (0, '0', null) vira false.
                normalizedMenu[key] = (val === 1 || val === '1' || val === true);
            });

            setMenuConfig(normalizedMenu);
            console.log("✅ Menu Normalizado:", normalizedMenu); // Debug
        }

        if (response.data.whatsapp && response.data.whatsapp.length > 8) {
            setWhatsappNumber(response.data.whatsapp);
        }

        if (response.data.email && response.data.email.includes('@')) {
            setEmailContact(response.data.email);
        }
      }
    } catch (error) {
      console.error("⚠️ Erro config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  // --- UPDATES ---
  const updateWhatsapp = async (newNumber: string): Promise<UpdateResponse> => {
    try {
      const cleanNumber = newNumber.replace(/\D/g, '');
      const response = await axios.post(`${API_BASE}/update_whatsapp.php`, { number: cleanNumber });
      if (response.data.status === 'sucesso') {
        setWhatsappNumber(cleanNumber);
        return { success: true, msg: 'Salvo' };
      }
      return { success: false, msg: response.data.mensagem };
    } catch (e: any) { return { success: false, msg: e.message }; }
  };

  const updateEmail = async (newEmail: string): Promise<UpdateResponse> => {
    try {
      const response = await axios.post(`${API_BASE}/update_email.php`, { email: newEmail });
      if (response.data.status === 'sucesso') {
        setEmailContact(newEmail);
        return { success: true, msg: 'Salvo' };
      }
      return { success: false, msg: response.data.mensagem };
    } catch (e: any) { return { success: false, msg: e.message }; }
  };

  const updateConfig = async (newConfig: Record<string, boolean>): Promise<UpdateResponse> => {
    try {
        const response = await axios.post(`${API_BASE}/update_menu_config.php`, { config: newConfig });
        if (response.data.status === 'sucesso') {
            // Atualiza o estado local imediatamente com os booleanos corretos
            setMenuConfig(newConfig);
            return { success: true, msg: 'Menu atualizado' };
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
// linha 120 SiteConfigContext.tsx