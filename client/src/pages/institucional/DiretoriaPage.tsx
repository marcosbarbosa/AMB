// Nome: DiretoriaPage.tsx
// Caminho: client/src/pages/institucional/DiretoriaPage.tsx
// Data: 2026-01-23
// Hora: 11:00
// Função: Página Institucional - Diretoria (Wrapper para Componente Premium)

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { DiretoriaPremium } from '@/components/DiretoriaPremium'; // Importa o componente visual rico

export default function DiretoriaPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow pt-20">
        {/* Usa o componente Premium que já tem toda a lógica de fetch e exibição */}
        <DiretoriaPremium />
      </main>
      <Footer />
    </div>
  );
}
// linha 20 client/src/pages/institucional/DiretoriaPage.tsx