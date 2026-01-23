// Nome: MaintenanceGuard.tsx
// Nro de linhas+ Caminho: 45 client/src/components/MaintenanceGuard.tsx
// Data: 2026-01-23
// Hora: 09:15
// Função: Middleware de Proteção de Rotas
// Versão: v1.0 Gatekeeper

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteConfig } from '@/context/SiteConfigContext';
import MaintenancePage from '@/pages/MaintenancePage';
import { Loader2 } from 'lucide-react';

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { config, loading } = useSiteConfig();
  const location = useLocation();

  // 1. Loading State
  if (loading) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-900">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
    );
  }

  // 2. Verificar Token Mágico (Salvo no LocalStorage)
  const isDev = localStorage.getItem('AMB_DEV_ACCESS') === 'true';

  // 3. Rotas que NUNCA bloqueiam (Admin, Login, e a rota mágica)
  const isWhitelisted = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/login') || 
    location.pathname === '/amb-dev-start'; // Rota Mágica

  // 4. Lógica de Bloqueio
  // Se manutenção ativa E não é dev E não é rota liberada => Bloqueia
  if (config?.modo_manutencao && !isDev && !isWhitelisted) {
    return <MaintenancePage />;
  }

  // 5. Libera acesso
  return <>{children}</>;
}
// linha 45 client/src/components/MaintenanceGuard.tsx