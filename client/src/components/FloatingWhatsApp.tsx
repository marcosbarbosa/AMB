// Nome: FloatingWhatsApp.tsx
// Caminho: client/src/components/FloatingWhatsApp.tsx
// Data: 2026-01-18
// Função: Botão Flutuante Estrito ao Banco
// Versão: v2.0 Strict

import { useSiteConfig } from '@/context/SiteConfigContext';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const { whatsappNumber } = useSiteConfig();

  // Se não carregou do banco, NÃO mostra (evita mostrar número errado)
  if (!whatsappNumber || whatsappNumber.length < 8) return null;

  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const link = `https://wa.me/${cleanNumber}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-in slide-in-from-bottom-4"
      style={{ boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)' }}
    >
      <MessageCircle className="h-8 w-8" />
      <span className="absolute right-full mr-4 bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-100">
        Fale Conosco
      </span>
    </a>
  );
}
// linha 30 FloatingWhatsApp.tsx