// Nome: SecretariaPage.tsx
// Nro de linhas+ Caminho: 160 client/src/pages/institucional/SecretariaPage.tsx
// Data: 2026-01-22
// Hora: 21:20 (America/Sao_Paulo)
// Função: Página Institucional - Secretaria Digital (Layout Prime)
// Versão: v3.0 Prime UI
// Alteração: Implementação de abas, filtros por categoria e layout de documentos em cards.

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    FileText, Download, Lock, Search, Filter, 
    Calendar, FileCheck, ArrowRight, FolderOpen 
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Tipo de Dado para Documento
interface Documento {
    id: number;
    titulo: string;
    categoria: string;
    data: string;
    publico: boolean;
    url: string;
}

export default function SecretariaPage() {
  const [activeTab, setActiveTab] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const categorias = ["Todos", "Estatutos e Normas", "Histórico", "Financeiro", "Atas e Editais"];

  // Mock Data (Simulando Banco de Dados)
  const documentos: Documento[] = [
      { id: 1, titulo: "Estatuto Social Consolidado 2025", categoria: "Estatutos e Normas", data: "10/01/2025", publico: true, url: "#" },
      { id: 2, titulo: "Regimento Interno AMB", categoria: "Estatutos e Normas", data: "15/01/2024", publico: true, url: "#" },
      { id: 3, titulo: "Calendário Oficial 2026", categoria: "Atas e Editais", data: "02/01/2026", publico: true, url: "#" },
      { id: 4, titulo: "Balancete Anual 2024", categoria: "Financeiro", data: "31/12/2024", publico: false, url: "#" }, // Exemplo privado
      { id: 5, titulo: "Ata de Fundação", categoria: "Histórico", data: "20/09/1990", publico: true, url: "#" },
      { id: 6, titulo: "Edital de Convocação Eleições 2026", categoria: "Atas e Editais", data: "20/01/2026", publico: true, url: "#" },
      { id: 7, titulo: "Prestação de Contas Q4 2025", categoria: "Financeiro", data: "15/01/2026", publico: true, url: "#" },
  ];

  // Lógica de Filtragem
  const filteredDocs = documentos.filter(doc => {
      const matchesCategory = activeTab === "Todos" || doc.categoria === activeTab;
      const matchesSearch = doc.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-20 px-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-6xl mx-auto relative z-10">
              <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tight">
                  Secretaria <span className="text-blue-400">Digital</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl">
                  Transparência e organização. Acesse estatutos, editais, balancetes e documentos históricos da Associação Master de Basquete do Amazonas.
              </p>
          </div>
      </div>

      <main className="flex-grow -mt-8 px-4 pb-16 max-w-6xl mx-auto w-full relative z-20">

        {/* Controles e Filtros */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-2 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Scrollable Tabs */}
            <div className="flex overflow-x-auto gap-2 p-2 w-full md:w-auto no-scrollbar">
                {categorias.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                            activeTab === cat 
                            ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Busca */}
            <div className="relative w-full md:w-72 p-2">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Buscar documento..." 
                    className="pl-10 rounded-full border-slate-200 bg-slate-50 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Grid de Documentos */}
        {filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col">
                        <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${doc.publico ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {doc.publico ? <FileText className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
                                </div>
                                <Badge variant="outline" className="text-xs font-bold text-slate-400 border-slate-200">
                                    {doc.categoria}
                                </Badge>
                            </div>

                            <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-700 transition-colors">
                                {doc.titulo}
                            </h3>

                            <div className="flex items-center text-xs text-slate-400 font-medium gap-2">
                                <Calendar className="h-3 w-3" />
                                Publicado em: {doc.data}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                            {doc.publico ? (
                                <Button className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 font-bold transition-all shadow-sm" asChild>
                                    <a href={doc.url} target="_blank" rel="noreferrer">
                                        <Download className="mr-2 h-4 w-4" /> Baixar PDF
                                    </a>
                                </Button>
                            ) : (
                                <Button disabled className="w-full bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                                    <Lock className="mr-2 h-4 w-4" /> Restrito
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                <FolderOpen className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Nenhum documento encontrado</h3>
                <p className="text-slate-400">Tente mudar o filtro ou a busca.</p>
            </div>
        )}

        {/* Banner Informativo */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <FileCheck className="h-6 w-6 text-emerald-400" /> Transparência Total
                </h3>
                <p className="text-blue-100 max-w-xl">
                    Documentos sensíveis ou exclusivos para associados podem ser encontrados na Área do Associado após o login.
                </p>
            </div>
            <Button variant="secondary" className="font-bold whitespace-nowrap bg-white text-blue-900 hover:bg-blue-50">
                Acessar Área do Associado <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
// linha 160 client/src/pages/institucional/SecretariaPage.tsx