/*
// Nome: SecretariaDigitalPage.tsx
// Caminho: client/src/pages/SecretariaDigitalPage.tsx
// Data: 2026-01-17
// Hora: 22:30 (America/Sao_Paulo)
// Função: Central de Documentos Unificada
// Versão: v1.0.0 Prime
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Download, ShieldCheck, History, Search, 
  FileCheck, Scale, BookOpen, Loader2
} from 'lucide-react';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function SecretariaDigitalPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>('todos');

  useEffect(() => {
    // Reutiliza a API de listagem pública existente
    axios.get(`${API_BASE}/listar_documentos_publico.php`)
      .then(res => {
        if (res.data.status === 'sucesso') {
          setDocs(res.data.documentos);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categorias = [
    { id: 'todos', label: 'Todos', icon: FileText },
    { id: 'estatuto', label: 'Estatutos', icon: Scale },
    { id: 'historico', label: 'Histórico', icon: History },
    { id: 'financeiro', label: 'Financeiro', icon: ShieldCheck },
    { id: 'geral', label: 'Atas & Geral', icon: FileCheck },
  ];

  const filteredDocs = filtro === 'todos' ? docs : docs.filter(d => d.tipo === filtro);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-32 pb-16">
        <section className="max-w-7xl mx-auto px-4 mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 uppercase">Secretaria Digital</h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Portal da transparência, regulamentos, históricos e documentos oficiais da AMB Amazonas.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <Button
                key={cat.id}
                variant={filtro === cat.id ? 'default' : 'outline'}
                onClick={() => setFiltro(cat.id)}
                className={`rounded-full ${filtro === cat.id ? 'bg-blue-600' : 'bg-white border-slate-200'}`}
              >
                <cat.icon className="mr-2 h-4 w-4" /> {cat.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4">
          <Card className="border-slate-200 shadow-sm bg-white rounded-2xl min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-600"/> Arquivos</CardTitle>
              <CardDescription>Mostrando {filteredDocs.length} documentos.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
              ) : filteredDocs.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocs.map((doc) => (
                    <div key={doc.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between" onClick={() => window.open(doc.url_arquivo, '_blank')}>
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="bg-white uppercase text-[10px]">{doc.tipo}</Badge>
                          <span className="text-xs text-slate-400 font-bold">{doc.ano_referencia}</span>
                        </div>
                        <h3 className="font-bold text-slate-800 line-clamp-2">{doc.titulo}</h3>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400">PDF</span>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full text-blue-600"><Download className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">Nenhum documento encontrado.</div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
// linha 110 SecretariaDigitalPage.tsx