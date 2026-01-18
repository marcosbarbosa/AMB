/*
// Nome: NoticiasPage.tsx
// Caminho: client/src/pages/NoticiasPage.tsx
// Data: 2026-01-17
// Hora: 23:55
// Função: Listagem Pública de Notícias
// Versão: v1.0.0
*/
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Newspaper } from 'lucide-react';

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Newspaper className="h-12 w-12 mx-auto text-blue-600 mb-4 opacity-50" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Notícias & Comunicados</h1>
          <div className="mt-12 p-10 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-400 font-medium">Nenhuma notícia publicada recentemente.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 25