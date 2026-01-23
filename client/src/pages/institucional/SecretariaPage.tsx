// Nome: SecretariaPage.tsx
// Caminho: client/src/pages/institucional/SecretariaPage.tsx
// Data: 2026-01-23
// Hora: 11:00
// Função: Página Institucional - Secretaria (Mock Inicial)

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FileText, Download, Lock } from 'lucide-react';

export default function SecretariaPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow pt-32 pb-16 px-4 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
        <h1 className="text-4xl font-black text-slate-900 mb-8 uppercase border-l-8 border-blue-600 pl-4">
            Secretaria Digital
        </h1>

        <div className="grid gap-4">
            {['Estatuto Social da AMB', 'Regimento Interno', 'Calendário Oficial 2026', 'Ata da Última Assembleia'].map((doc, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-700">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-800 text-lg block">{doc}</span>
                            <span className="text-xs text-slate-400 uppercase font-bold">Documento Público</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto font-bold text-slate-600">
                        <Download className="mr-2 h-4 w-4"/> Baixar PDF
                    </Button>
                </div>
            ))}

            <div className="mt-8 bg-slate-100 p-6 rounded-xl border border-slate-200 text-center">
                <Lock className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                <p className="text-slate-500 font-medium">Outros documentos estão disponíveis apenas na Área do Associado.</p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 45 client/src/pages/institucional/SecretariaPage.tsx