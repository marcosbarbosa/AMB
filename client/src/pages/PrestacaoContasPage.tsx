/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 14 de Janeiro de 2026
 * Hora: 18:05
 * Versão: 4.0 (Tabela Pública Interativa)
 *
 * Descrição: Exibição pública em formato de GRID CORPORATIVO.
 * UX: Linhas inteiramente clicáveis para download imediato.
 *
 * ==========================================================
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, Search, AlertCircle, FileType, ExternalLink, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface Documento {
  id: number;
  titulo: string;
  mes: string;
  ano: number;
  url_arquivo: string;
  data_formatada: string;
}

export default function PrestacaoContasPage() {
  const [todosDocumentos, setTodosDocumentos] = useState<Documento[]>([]);
  const [documentosFiltrados, setDocumentosFiltrados] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [anoAtivo, setAnoAtivo] = useState(new Date().getFullYear());

  const anos = [2026, 2025, 2024, 2023];

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const res = await axios.get('https://www.ambamazonas.com.br/api/listar_transparencia.php');
        if (res.data.status === 'sucesso') {
          setTodosDocumentos(res.data.documentos);
        }
      } catch (error) {
        console.error("Erro ao carregar transparência:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentos();
  }, []);

  useEffect(() => {
    const filtrados = todosDocumentos.filter(doc => Number(doc.ano) === anoAtivo);
    setDocumentosFiltrados(filtrados);
  }, [anoAtivo, todosDocumentos]);

  const abrirDocumento = (url: string) => {
      window.open(`https://www.ambamazonas.com.br${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* HEADER */}
      <header className="pt-32 pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Badge className="mb-4 bg-yellow-500 text-black font-black hover:bg-yellow-400">TRANSPARÊNCIA PÚBLICA</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
            Prestação de <br/><span style={{ color: 'var(--primary-bg)' }}>Contas</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg font-medium">
            Documentação oficial financeira e administrativa da AMB Amazonas.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-3xl rounded-full -mr-20 pointer-events-none" />
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-4 gap-8">

        {/* FILTROS */}
        <aside className="space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Exercício
            </h3>
            <div className="flex flex-col gap-2">
              {anos.map(ano => (
                <Button 
                  key={ano}
                  variant={anoAtivo === ano ? "default" : "ghost"}
                  className={`justify-between font-bold h-12 rounded-xl transition-all ${anoAtivo === ano ? 'shadow-lg ring-2 ring-offset-2 ring-primary' : 'text-slate-500'}`}
                  style={anoAtivo === ano ? { backgroundColor: 'var(--primary-bg)', color: 'var(--primary-text)' } : {}}
                  onClick={() => setAnoAtivo(ano)}
                >
                  {ano}
                  {anoAtivo === ano && <Search className="h-4 w-4" />}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* LISTAGEM EM GRID CLICÁVEL */}
        <section className="lg:col-span-3">
          {loading ? (
             <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-slate-300"/></div>
          ) : documentosFiltrados.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableBody>
                        {documentosFiltrados.map((doc) => (
                            <TableRow 
                                key={doc.id} 
                                className="group cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                                onClick={() => abrirDocumento(doc.url_arquivo)}
                            >
                                {/* DATA DE REFERÊNCIA */}
                                <TableCell className="w-[140px] pl-6">
                                    <Badge variant="secondary" className="font-bold bg-slate-100 text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all uppercase">
                                        {doc.mes.substring(0, 3)} / {doc.ano}
                                    </Badge>
                                </TableCell>

                                {/* DOCUMENTO MERGEADO */}
                                <TableCell className="py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-red-50 p-2 rounded-lg border border-red-100 group-hover:scale-110 transition-transform">
                                            <FileType className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                                                {doc.titulo}
                                            </div>
                                            <div className="text-xs text-slate-400 font-medium">
                                                Publicado em {doc.data_formatada}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* SETA DE AÇÃO (Visual) */}
                                <TableCell className="text-right pr-6">
                                    <ExternalLink className="h-5 w-5 text-slate-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all ml-auto" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          ) : (
            <div className="bg-white py-24 rounded-[40px] border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <AlertCircle className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold text-lg">Sem documentos</h3>
              <p className="text-slate-400 text-sm mt-1">Nenhum registro para {anoAtivo}.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}