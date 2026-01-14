/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 14 de Janeiro de 2026
 * Hora: 14:15
 * Versão: 3.0 (Adição da Exclusão)
 *
 * Descrição: Gestão de Parceiros (Listagem, Edição e EXCLUSÃO).
 * CORREÇÃO: Adicionado botão de lixeira conectado ao excluir_parceiro.php.
 *
 * ==========================================================
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Search, 
  Plus, 
  Pencil, 
  Eye, 
  Trash2, // <--- O ícone que faltava
  TrendingUp, 
  Users 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interface para tipagem segura
interface Parceiro {
  id: number;
  nome_parceiro: string;
  categoria: string;
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  status: 'ativo' | 'inativo' | 'pendente';
  url_logo: string;
  clicks_whatsapp?: number;
  clicks_banner?: number;
  banner_status?: string;
}

export default function GestaoParceiros() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. CARREGAR DADOS
  const fetchParceiros = async () => {
    try {
      const response = await axios.get('https://www.ambamazonas.com.br/api/listar_parceiros.php');
      if (response.data.status === 'sucesso') {
        setParceiros(response.data.parceiros);
      }
    } catch (error) {
      console.error("Erro ao carregar parceiros", error);
      toast({ title: "Erro", description: "Falha ao listar parceiros.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParceiros();
  }, []);

  // 2. FUNÇÃO DE EXCLUSÃO (O QUE FALTAVA)
  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja EXCLUIR o parceiro "${nome}"?\nEssa ação não pode ser desfeita.`)) {
      return;
    }

    try {
      // Chama o arquivo backend que já analisamos
      const response = await axios.post('https://www.ambamazonas.com.br/api/excluir_parceiro.php', { id });

      if (response.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Parceiro removido com sucesso." });
        // Atualiza a lista localmente sem recarregar a página
        setParceiros(prev => prev.filter(p => p.id !== id));
      } else {
        toast({ title: "Erro", description: response.data.mensagem, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha de conexão ao excluir.", variant: "destructive" });
    }
  };

  // Filtro de busca
  const filteredParceiros = parceiros.filter(p => 
    p.nome_parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'ouro': return 'bg-yellow-500 text-black hover:bg-yellow-600';
      case 'prata': return 'bg-slate-300 text-slate-800 hover:bg-slate-400';
      case 'bronze': return 'bg-orange-700 text-white hover:bg-orange-800';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        {/* Cabeçalho e Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Parceiros</h1>
            <p className="text-slate-500">Controle de contratos, banners e métricas.</p>
          </div>
          <Button onClick={() => navigate('/admin/parceiros/novo')} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Novo Parceiro
          </Button>
        </div>

        {/* Barra de Ferramentas */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Buscar parceiro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-white"
            />
          </div>
        </div>

        {/* Tabela de Listagem */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[300px]">EMPRESA</TableHead>
                  <TableHead>NÍVEL</TableHead>
                  <TableHead>CLIQUES ZAP</TableHead>
                  <TableHead>STATUS BANNER</TableHead>
                  <TableHead className="text-right">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredParceiros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhum parceiro encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParceiros.map((parceiro) => (
                    <TableRow key={parceiro.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                            {parceiro.url_logo ? (
                              <img src={`https://www.ambamazonas.com.br${parceiro.url_logo}`} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <Users className="h-5 w-5 m-2.5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{parceiro.nome_parceiro}</p>
                            <p className="text-xs text-slate-500 uppercase">{parceiro.categoria || 'Geral'}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={`${getTierColor(parceiro.partner_tier)} uppercase border-none`}>
                          {parceiro.partner_tier}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-green-600 bg-green-50 w-fit px-2 py-1 rounded-md font-mono text-xs font-bold">
                          <TrendingUp className="h-3 w-3" />
                          {parceiro.clicks_whatsapp || 0}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col items-center w-fit">
                          <div className={`h-2.5 w-2.5 rounded-full mb-1 ${
                            parceiro.banner_status === 'aprovado' ? 'bg-green-500' : 
                            parceiro.banner_status === 'pendente' ? 'bg-yellow-500' : 'bg-slate-300'
                          }`} />
                          <span className="text-[10px] text-slate-500 lowercase">
                            {parceiro.banner_status || 'sem banner'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-primary"
                            onClick={() => navigate(`/admin/parceiros/editar/${parceiro.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* BOTÃO DE EXCLUSÃO NOVO */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(parceiro.id, parceiro.nome_parceiro)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}