// Nome: DiretoriaPage.tsx
// Caminho: client/src/pages/institucional/DiretoriaPage.tsx
// Data: 2026-01-21
// Hora: 12:00
// Função: Página Institucional - Diretoria

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';

export default function DiretoriaPage() {
  const diretores = [
      { cargo: 'Presidente', nome: 'A Definir' },
      { cargo: 'Vice-Presidente', nome: 'A Definir' },
      { cargo: 'Diretor Financeiro', nome: 'A Definir' },
      { cargo: 'Diretor Técnico', nome: 'A Definir' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow pt-32 pb-16 px-4 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
        <h1 className="text-4xl font-black text-slate-900 mb-8 uppercase border-l-8 border-blue-600 pl-4">
            Diretoria Executiva
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diretores.map((d, i) => (
                <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-6 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400 border-4 border-white shadow-sm">
                            <User className="h-10 w-10" />
                        </div>
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black uppercase mb-2 flex items-center gap-1">
                            <Shield className="h-3 w-3" /> Gestão 2024-2026
                        </div>
                        <h3 className="font-black text-slate-900 text-lg uppercase leading-tight mb-1">{d.cargo}</h3>
                        <p className="text-slate-500 font-medium">{d.nome}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 50 DiretoriaPage.tsx