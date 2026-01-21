// Nome: HistoricoPage.tsx
// Caminho: client/src/pages/institucional/HistoricoPage.tsx
// Data: 2026-01-21
// Hora: 12:00
// Função: Página Institucional - Histórico

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function HistoricoPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow pt-32 pb-16 px-4 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
        <h1 className="text-4xl font-black text-slate-900 mb-6 uppercase border-l-8 border-blue-600 pl-4">
            Nossa História
        </h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-600 leading-relaxed text-lg">
            <p className="mb-4">
                A <strong>Associação Master de Basquete do Amazonas (AMB)</strong> nasceu da paixão pelo esporte e da necessidade de manter viva a chama do basquete entre os atletas veteranos do nosso estado.
            </p>
            <p>
                Desde a sua fundação, temos trabalhado incansavelmente para promover campeonatos, integrar gerações e fomentar um estilo de vida saudável através do esporte. Nossa história é construída por cada arremesso, cada vitória e, principalmente, pela amizade que une nossos associados.
            </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 35 HistoricoPage.tsx