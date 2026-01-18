/*
// Nome: DiretoriaPage.tsx
// Caminho: client/src/pages/DiretoriaPage.tsx
// Data: 2026-01-17
// Hora: 22:35 (America/Sao_Paulo)
// Função: Página Pública da Diretoria (Wrapper)
// Versão: v1.0.0
*/

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { DiretoriaPremium } from '@/components/DiretoriaPremium'; 

export default function DiretoriaPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />
      <main className="flex-grow pt-24">
        <DiretoriaPremium />
      </main>
      <Footer />
    </div>
  );
}
// linha 25 DiretoriaPage.tsx