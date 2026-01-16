// Nome: PrestacaoContasPage.tsx
// Caminho: client/src/pages/PrestacaoContasPage.tsx
// Data: 2026-01-16
// Hora: 09:35 (America/Sao_Paulo)
// Função: Secretaria Digital (Layout Invertido + Lista Expandida)
// Versão: v7.0 Prime
// Alteração: Inversão de destaque (Competições no topo), melhoria na quebra de linha dos títulos e tooltips nativos.

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Download, ShieldCheck, History, TrendingUp, 
  Loader2, FileType, Search, Trophy, Scale, FileBadge
} from 'lucide-react';

const API_BASE = 'https://www.ambamazonas.com.br/api';

interface Documento {
  id: number;
  titulo: string;
  tipo: string; // 'estatuto', 'regulamento', 'historico', 'financeiro', 'geral'
  ano_referencia: string;
  url_arquivo: string;
  criado_em: string;
}

export default function PrestacaoContasPage() {
  const [docs, setDocs] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/listar_documentos_publico.php?t=${Date.now()}`)
      .then(res => {
        if (res.data.status === 'sucesso') {
          setDocs(res.data.documentos);
        }
      })
      .catch(err => console.error("Erro ao carregar documentos:", err))
      .finally(() => setLoading(false));
  }, []);

  const sortDocs = (lista: Documento[]) => {
    return lista.sort((a, b) => {
      const diffAno = Number(b.ano_referencia) - Number(a.ano_referencia);
      if (diffAno !== 0) return diffAno;
      return a.titulo.localeCompare(b.titulo);
    });
  };

  const estatutos = sortDocs(docs.filter(d => d.tipo === 'estatuto'));
  const competicoes = sortDocs(docs.filter(d => d.tipo === 'historico' || d.tipo === 'regulamento'));
  const contas = sortDocs(docs.filter(d => d.tipo === 'financeiro' || d.tipo === 'geral'));

  const downloadFile = (url: string) => {
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

  // Componente de Item de Lista (Otimizado para leitura)
  const DocListItem = ({ doc, icon: Icon, colorClass }: { doc: Documento, icon: any, colorClass: string }) => (
    <div 
        className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group w-full"
        onClick={() => downloadFile(doc.url_arquivo)}
        title={doc.titulo} // Tooltip nativo do navegador para o card inteiro
    >
        {/* Ícone */}
        <div className={`h-10 w-10 ${colorClass} rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm`}>
            <Icon className="h-5 w-5"/>
        </div>

        {/* Conteúdo Texto */}
        <div className="flex-1 min-w-0">
            {/* Título com quebra de linha permitida e tooltip nativo */}
            <h4 className="font-bold text-sm md:text-base text-slate-800 group-hover:text-blue-700 transition-colors leading-snug break-words">
                {doc.titulo}
            </h4>

            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-mono bg-slate-100 text-slate-600 border border-slate-200">
                    REF: {doc.ano_referencia}
                </Badge>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {doc.tipo === 'regulamento' ? 'Regulamento Oficial' : doc.tipo}
                </span>
            </div>
        </div>

        {/* Botão Ação */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-blue-600 shrink-0 self-center">
            <Download className="h-5 w-5"/>
        </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />

      <main className="pt-28 pb-16 px-4 max-w-7xl mx-auto">

        {/* --- CABEÇALHO --- */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 bg-blue-50 px-4 py-1 tracking-widest font-bold">
              TRANSPARÊNCIA & GOVERNANÇA
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-3">
              Secretaria Digital
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Central oficial de documentos. Acesse regulamentos, estatutos e balancetes da AMB.
            </p>
        </div>

        {/* --- BLOCO 1 (DESTAQUE): COMPETIÇÕES & REGULAMENTOS --- */}
        <div className="mb-10">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 shadow-xl shadow-blue-900/10 text-white relative overflow-hidden">
                {/* Background Decorativo */}
                <div className="absolute -top-10 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
                    <Trophy className="h-64 w-64"/>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner">
                          <Trophy className="h-6 w-6 text-white"/>
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-white">Competições & Regulamentos</h2>
                            <p className="text-blue-100 text-xs font-medium opacity-80">Histórico de torneios e normas técnicas</p>
                        </div>
                    </div>

                    {/* Container de Scroll para Lista Grande */}
                    <div className="h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {competicoes.length > 0 ? (
                          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2">
                              {competicoes.map(doc => (
                                  <div 
                                    key={doc.id} 
                                    className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer group flex items-start gap-3" 
                                    onClick={() => downloadFile(doc.url_arquivo)}
                                    title={doc.titulo} // Tooltip Nativo
                                  >
                                      <div className="mt-1 p-2 bg-white/10 rounded-lg">
                                        {doc.tipo === 'regulamento' ? <Scale className="h-4 w-4 text-orange-300"/> : <History className="h-4 w-4 text-blue-300"/>}
                                      </div>
                                      <div className="flex-1">
                                          <h3 className="font-bold text-sm md:text-base leading-snug text-white break-words">
                                            {doc.titulo}
                                          </h3>
                                          <div className="flex items-center gap-2 mt-2">
                                              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none font-mono text-[10px] h-5">
                                                  {doc.ano_referencia}
                                              </Badge>
                                              <span className="text-[10px] text-blue-200 uppercase tracking-wider font-bold">
                                                {doc.tipo}
                                              </span>
                                          </div>
                                      </div>
                                      <Download className="h-5 w-5 text-white/50 group-hover:text-white shrink-0 self-center"/>
                                  </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-blue-100 italic opacity-80 bg-white/5 p-6 rounded-xl text-center border border-white/10">
                              Nenhum regulamento ou histórico publicado.
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- GRID SECUNDÁRIO: ESTATUTOS & CONTAS --- */}
        <div className="grid lg:grid-cols-2 gap-8">

            {/* --- BLOCO 2: ESTATUTO SOCIAL (Card Branco) --- */}
            <Card className="border-slate-200 shadow-lg overflow-hidden flex flex-col h-full bg-white">
                <CardHeader className="border-b border-slate-100 bg-amber-50/50 py-5 px-6">
                    <CardTitle className="flex items-center gap-3 text-amber-900 uppercase tracking-wide text-lg">
                        <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                            <ShieldCheck className="h-5 w-5"/>
                        </div>
                        Estatuto Social & Normas
                    </CardTitle>
                </CardHeader>

                <div className="flex-1 p-6 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    {estatutos.length > 0 ? (
                        <div className="space-y-3">
                            {estatutos.map(doc => (
                                <DocListItem 
                                    key={doc.id} 
                                    doc={doc} 
                                    icon={FileBadge}
                                    colorClass="bg-amber-100 text-amber-700"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                            <ShieldCheck className="h-12 w-12 mb-3 opacity-20"/>
                            <p className="text-sm font-medium">Nenhum estatuto publicado.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* --- BLOCO 3: PRESTAÇÃO DE CONTAS (Card Branco) --- */}
            <Card className="border-slate-200 shadow-lg overflow-hidden flex flex-col h-full bg-white">
                <CardHeader className="border-b border-slate-100 bg-green-50/50 py-5 px-6">
                    <CardTitle className="flex items-center gap-3 text-green-900 uppercase tracking-wide text-lg">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <TrendingUp className="h-5 w-5"/>
                        </div>
                        Prestação de Contas
                    </CardTitle>
                </CardHeader>

                <div className="flex-1 p-6 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                    {contas.length > 0 ? (
                        <div className="space-y-3">
                            {contas.map(doc => (
                                <DocListItem 
                                    key={doc.id} 
                                    doc={doc} 
                                    icon={doc.tipo === 'financeiro' ? TrendingUp : FileType}
                                    colorClass="bg-green-100 text-green-700"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                            <Search className="h-12 w-12 mb-3 opacity-20"/>
                            <p className="text-sm font-medium">Nenhum balanço publicado.</p>
                        </div>
                    )}
                </div>
            </Card>

        </div>

      </main>
      <Footer />
    </div>
  );
}
// linha 230