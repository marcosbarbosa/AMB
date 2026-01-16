/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: SiteConfigContext.tsx
 * CAMINHO: client/src/context/SiteConfigContext.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Contexto Global (Correção de Payloads e Conexão)
 * VERSÃO: 9.0 Prime
 * ==========================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'https://www.ambamazonas.com.br/api';

interface SiteConfigContextData {
  menuConfig: Record<string, boolean>;
  whatsappNumber: string;
  emailContact: string;
  isLoading: boolean;
  updateConfig: (newConfig: Record<string, boolean>) => Promise<boolean>;
  updateWhatsapp: (newNumber: string) => Promise<boolean>;
  updateEmail: (newEmail: string) => Promise<boolean>;
}

const SiteConfigContext = createContext<SiteConfigContextData>({} as SiteConfigContextData);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [menuConfig, setMenuConfig] = useState<Record<string, boolean>>({});
  const [whatsappNumber, setWhatsappNumber] = useState('5592999999999'); 
  const [emailContact, setEmailContact] = useState('associacaomasterdebasquetebol@gmail.com');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega configurações ao iniciar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Adiciona timestamp para evitar cache
        const response = await axios.get(`${API_BASE}/get_site_config.php?t=${Date.now()}`);
        if (response.data) {
          if (response.data.menu) setMenuConfig(response.data.menu);
          if (response.data.whatsapp) setWhatsappNumber(response.data.whatsapp);
          if (response.data.email) setEmailContact(response.data.email);
        }
      } catch (error) {
        console.error("Erro ao carregar configs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadConfig();
  }, []);

  // --- ATUALIZA MENU ---
  const updateConfig = async (newConfig: Record<string, boolean>) => {
    try {
      const payload = { config: newConfig }; // Envelopa em 'config' para o PHP
      const response = await axios.post(`${API_BASE}/update_menu_config.php`, payload);

      if (response.data.status === 'sucesso') {
          setMenuConfig(newConfig);
          return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao salvar config menu:", error);
      return false;
    }
  };

  // --- ATUALIZA WHATSAPP ---
  const updateWhatsapp = async (newNumber: string) => {
    try {
      const cleanNumber = newNumber.replace(/\D/g, '');
      const response = await axios.post(`${API_BASE}/update_whatsapp.php`, { number: cleanNumber });
      if (response.data.status === 'sucesso') {
        setWhatsappNumber(cleanNumber);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao salvar WhatsApp:", error);
      return false;
    }
  };

  // --- ATUALIZA EMAIL ---
  const updateEmail = async (newEmail: string) => {
    try {
      const response = await axios.post(`${API_BASE}/update_email.php`, { email: newEmail });
      if (response.data.status === 'sucesso') {
        setEmailContact(newEmail);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao salvar Email:", error);
      return false;
    }
  };

  return (
    <SiteConfigContext.Provider value={{ menuConfig, whatsappNumber, emailContact, isLoading, updateConfig, updateWhatsapp, updateEmail }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export const useSiteConfig = () => useContext(SiteConfigContext);
// linha 105