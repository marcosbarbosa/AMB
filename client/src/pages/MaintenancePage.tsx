// Nome: MaintenancePage.tsx
// Caminho: client/src/pages/MaintenancePage.tsx
// Data: 2026-01-23
// Hora: 12:00
// Função: Tela de Bloqueio (Build Fix)
// Versão: v2.0 Hammer
// Alteração: Uso do ícone Hammer.

import { Hammer, Instagram, Facebook, Mail } from 'lucide-react';
import ambLogo from '@/assets/logo-amb.png'; 

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden font-sans">
      <div className="relative z-10 max-w-lg bg-white/5 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl">
        <img src={ambLogo} alt="AMB Logo" className="h-16 mx-auto mb-8 drop-shadow-lg" />
        <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Hammer className="h-8 w-8 text-blue-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">Em Manutenção</h1>
        <p className="text-slate-300 text-lg mb-8 leading-relaxed">Retornaremos em breve com uma experiência Prime.</p>
        <div className="flex justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-pink-500 transition-colors"><Instagram className="h-6 w-6"/></a>
            <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors"><Facebook className="h-6 w-6"/></a>
        </div>
      </div>
    </div>
  );
}
// linha 45 client/src/pages/MaintenancePage.tsx