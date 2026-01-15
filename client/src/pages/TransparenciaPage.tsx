/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ARQUIVO: TransparenciaPage.tsx
 * CAMINHO: client/src/pages/TransparenciaPage.tsx
 * DATA: 15 de Janeiro de 2026
 * HORA: 21:10
 * FUNÇÃO: Vitrine Pública de Documentos (Substitui Prestação de Contas)
 * VERSÃO: 5.0 Prime (Categorização Automática)
 * ==========================================================
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Download, ShieldCheck, History, TrendingUp, 
  Loader2, FileType, Search
} from 'lucide-react';

const API_BASE = 'https://www.ambamazonas.com.br/api';

interface Documento {
  id: number;
  titulo: string;
  tipo: string; // 'estatuto', 'historico', 'financeiro', 'geral'
  ano_referencia: string;
  url_arquivo: string;
  criado_em: string;
}

export default function TransparenciaPage() {
  const [docs, setDocs] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca TODOS os documentos públicos sem filtro
    axios.get(`${API_BASE}/listar_documentos_publico.php`)
      .then(res => {
        if (res.data.status === 'sucesso') {
          setDocs(res.data.documentos);
        }
      })
      .catch(err => console.error("Erro ao carregar documentos:", err))
      .finally(() => setLoading(false));
  }, []);

  // Inteligência de Filtro: Separa os docs nas caixinhas certas
  const estatutos = docs.filter(d => d.tipo === 'estatuto');
  const historicos = docs.filter(d => d.tipo === 'historico');
  const financeiros = docs.filter(d => d.tipo === 'financeiro');
  const gerais = docs.filter(d => d.tipo === 'geral');

  const downloadFile = (url: string) => {
    // Garante que o link abra corretamente
    const link = url.startsWith('http') ? url : `https://www.ambamazonas.com.br${url}`;
    window.open(link, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        {/* --- CABEÇALHO --- */}
        <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 bg-blue-50">
              Acesso à Informação
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
              Portal da Transparência
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                Repositório oficial de documentos, estatutos, registros históricos e prestação de contas da Associação Master de Basquetebol do Amazonas.
            </p>
        </div>

        {/* --- BLOCO 1: ESTATUTOS (Destaque Amarelo) --- */}
        <div className="mb-16">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 md:p-10 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="h-40 w-40 transform rotate-12"/>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                          <ShieldCheck className="h-8 w-8 text-white"/>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-wide">Estatuto Social & Regulamentos</h2>
                    </div>

                    {estatutos.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {estatutos.map(doc => (
                              <div key={doc.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all cursor-pointer group" onClick={() => downloadFile(doc.url_arquivo)}>
                                  <div className="flex justify-between items-start mb-3">
                                      <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 border-none font-bold">
                                          {doc.ano_referencia}
                                      </Badge>
                                      <Download className="h-5 w-5 text-white/70 group-hover:text-white"/>
                                  </div>
                                  <h3 className="font-bold text-lg leading-tight mb-1">{doc.titulo}</h3>
                                  <p className="text-sm text-yellow-100 opacity-80">Versão Oficial</p>
                              </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-yellow-100 italic opacity-80">Nenhum estatuto publicado no momento.</div>
                    )}
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

            {/* --- BLOCO 2: MEMÓRIA & HISTÓRICO --- */}
            <Card className="border-none shadow-lg overflow-hidden flex flex-col h-full">
                <CardHeader className="border-b bg-blue-50/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-blue-800 uppercase tracking-wide">
                        <History className="h-5 w-5"/> Memória & Equipes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 flex-1 bg-white">
                    {historicos.length > 0 ? historicos.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group cursor-pointer" onClick={() => downloadFile(doc.url_arquivo)}>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                    <FileText className="h-5 w-5"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">{doc.titulo}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{doc.ano_referencia}</Badge>
                                        <span className="text-xs text-slate-400">Documento Histórico</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-400 group-hover:text-blue-600">
                                <Download className="h-5 w-5"/>
                            </Button>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed">
                            <History className="h-10 w-10 mx-auto mb-2 opacity-20"/>
                            <p>Nenhum registro histórico publicado.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* --- BLOCO 3: FINANCEIRO & GERAL --- */}
            <Card className="border-none shadow-lg overflow-hidden flex flex-col h-full">
                <CardHeader className="border-b bg-green-50/50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-green-800 uppercase tracking-wide">
                        <TrendingUp className="h-5 w-5"/> Prestação de Contas
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4 flex-1 bg-white">
                    {financeiros.length > 0 || gerais.length > 0 ? (
                        <>
                            {financeiros.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all group cursor-pointer" onClick={() => downloadFile(doc.url_arquivo)}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                                            <TrendingUp className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 group-hover:text-green-700">{doc.titulo}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] border-green-200 text-green-700 bg-green-50 h-5 px-1.5">Ref: {doc.ano_referencia}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400 group-hover:text-green-600">
                                        <Download className="h-5 w-5"/>
                                    </Button>
                                </div>
                            ))}
                            {/* Documentos Gerais */}
                            {gerais.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-all group cursor-pointer" onClick={() => downloadFile(doc.url_arquivo)}>
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                                            <FileType className="h-5 w-5"/>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{doc.titulo}</h4>
                                            <span className="text-xs text-slate-400">Outros • {doc.ano_referencia}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <Download className="h-5 w-5"/>
                                    </Button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-10 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed">
                            <Search className="h-10 w-10 mx-auto mb-2 opacity-20"/>
                            <p>Nenhum balanço publicado.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

      </main>
      <Footer />
    </div>
  );
}