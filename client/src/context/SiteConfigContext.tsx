// Nome: SiteConfigContext.tsx
// Nro de linhas+ Caminho: 150 client/src/context/SiteConfigContext.tsx
// Data: 2026-01-23
// Hora: 15:00
// Função: Contexto Híbrido (Suporte a Legado + Nova Estrutura)

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Interface espelhando o banco de dados
interface DBSettings {
  email_official: string;
  endereco_sede: string;
  facebook_url: string;
  instagram_url: string;
  whatsapp_official: string;
  youtube_url: string;
  [key: string]: string; // Permite chaves extras
}

interface SiteConfig {
  settings: DBSettings;   // Dados crus de site_settings
  menu: Record<string, boolean>;
  flags: {
    eleicoes_ativas: boolean;
    modo_manutencao: boolean;
  };
  sistema: {
    dia_vencimento: string;
  };
}

interface SiteConfigContextType {
  config: SiteConfig | null;
  loading: boolean;
  refreshConfig: () => Promise<void>;

  // Helpers para compatibilidade com componentes antigos (Footer, etc)
  whatsappNumber: string;
  emailContact: string;
  menuConfig: Record<string, boolean>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await axios.get('https://www.ambamazonas.com.br/api/get_full_config.php');
      if (res.data && res.data.status === 'sucesso') {
        const d = res.data.data;

        setConfig({
            settings: d.settings || {},
            menu: d.menu || {},
            flags: {
                eleicoes_ativas: d.flags?.eleicoes_ativas == 1 || d.flags?.eleicoes_ativas === 'true',
                modo_manutencao: d.flags?.modo_manutencao == 1 || d.flags?.modo_manutencao === 'true'
            },
            sistema: d.sistema || { dia_vencimento: '10' }
        });
      }
    } catch (error) {
      console.error('Config fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConfig(); }, []);

  // Valores Computados para compatibilidade
  const whatsappNumber = config?.settings?.whatsapp_official || '';
  const emailContact = config?.settings?.email_official || '';
  const menuConfig = config?.menu || {};

  return (
    <SiteConfigContext.Provider value={{ 
        config, 
        loading, 
        refreshConfig: fetchConfig,
        whatsappNumber,
        emailContact,
        menuConfig
    }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (context === undefined) throw new Error('useSiteConfig error');
  return context;
}
// linha 150 client/src/context/SiteConfigContext.tsx