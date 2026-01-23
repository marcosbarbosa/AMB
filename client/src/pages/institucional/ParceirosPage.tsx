// Nome: ParceirosPage.tsx
// Caminho: client/src/pages/institucional/ParceirosPage.tsx
// Data: 2026-01-23
// Hora: 11:00
// Função: Página Institucional - Parceiros

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Handshake } from 'lucide-react';

export default function ParceirosPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow pt-32 pb-16 px-4 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
        <h1 className="text-4xl font-black text-slate-900 mb-8 uppercase border-l-8 border-blue-600 pl-4">
            Nossos Parceiros
        </h1>

        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Handshake className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Apoie o Esporte Master</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-12">
                Nossos parceiros são fundamentais para o sucesso de nossos eventos e projetos sociais.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-video bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-300 transition-colors cursor-pointer group">
                        <span className="font-black text-slate-300 text-xl group-hover:text-blue-300 uppercase">Espaço Logo</span>
                    </div>
                ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 40 client/src/pages/institucional/ParceirosPage.tsx