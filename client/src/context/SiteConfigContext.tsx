// Nome: SiteConfigContext.tsx
// Caminho: client/src/context/SiteConfigContext.tsx
// Data: 2026-01-19
// Hora: 00:15
// Função: Contexto Híbrido (Carregamento Imediato + Atualização Dinâmica)
// Versão: v15.0 Hybrid Stable

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
  // 1. DADOS PADRÃO OFICIAIS (FALLBACK DE SEGURANÇA)
  // Isso garante que o site nunca fique em branco, mesmo sem internet/banco
  const DEFAULT_WHATSAPP = '559292521345';
  const DEFAULT_EMAIL = 'associacaomasterdebasquetebol@gmail.com';

  const [config, setConfig] = useState<any>(null);
  const [menuConfig, setMenuConfig] = useState<Record<string, boolean>>({});

  // 2. INICIALIZAÇÃO OTIMISTA (Começa com o valor certo)
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP); 
  const [emailContact, setEmailContact] = useState(DEFAULT_EMAIL);

  const [isLoading, setIsLoading] = useState(true);

  const loadConfig = async () => {
    try {
      // Busca dados do banco para ver se algo mudou
      const response = await axios.get(`${API_BASE}/get_site_config.php?t=${Date.now()}`);

      console.log("📥 Config Atualizada:", response.data); 

      if (response.data) {
        setConfig(response.data);

        if (response.data.menu) setMenuConfig(response.data.menu);

        // 3. ATUALIZAÇÃO INTELIGENTE
        // Só sobrescreve o padrão se o banco trouxer um valor válido e não vazio
        if (response.data.whatsapp && response.data.whatsapp.length > 8) {
            setWhatsappNumber(response.data.whatsapp);
        }

        if (response.data.email && response.data.email.includes('@')) {
            setEmailContact(response.data.email);
        }
      }
    } catch (error) {
      console.error("⚠️ Usando configuração padrão (Erro API):", error);
      // Não faz nada, mantém os defaults que já estão no estado
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadConfig(); }, []);

  // --- UPDATES (Mantém a lógica de escrita no banco) ---
  const updateWhatsapp = async (newNumber: string): Promise<UpdateResponse> => {
    try {
      const cleanNumber = newNumber.replace(/\D/g, '');
      const response = await axios.post(`${API_BASE}/update_whatsapp.php`, { number: cleanNumber });
      if (response.data.status === 'sucesso') {
        setWhatsappNumber(cleanNumber);
        return { success: true, msg: 'WhatsApp atualizado' };
      }
      return { success: false, msg: response.data.mensagem };
    } catch (e: any) { return { success: false, msg: e.message }; }
  };

  const updateEmail = async (newEmail: string): Promise<UpdateResponse> => {
    try {
      const response = await axios.post(`${API_BASE}/update_email.php`, { email: newEmail });
      if (response.data.status === 'sucesso') {
        setEmailContact(newEmail);
        return { success: true, msg: 'Email salvo' };
      }
      return { success: false, msg: response.data.mensagem };
    } catch (e: any) { return { success: false, msg: e.message }; }
  };

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
// linha 118 SiteConfigContext.tsx