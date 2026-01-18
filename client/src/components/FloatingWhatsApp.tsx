// Nome: FloatingWhatsApp.tsx
// Caminho: client/src/components/FloatingWhatsApp.tsx
// Data: 2026-01-18
// Função: Botão Flutuante que lê o número do Contexto
// Versão: v1.0 Prime

import { useSiteConfig } from '@/context/SiteConfigContext';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const { whatsappNumber } = useSiteConfig();

  if (!whatsappNumber) return null;

  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const link = `https://wa.me/${cleanNumber}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group animate-in slide-in-from-bottom-4 duration-700"
      title="Fale Conosco no WhatsApp"
    >
      <MessageCircle className="h-8 w-8" />
      <span className="absolute right-full mr-3 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Fale Conosco
      </span>
    </a>
  );
}
// linha 35 FloatingWhatsApp.tsx