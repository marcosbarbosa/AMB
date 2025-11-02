/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 2 de novembro de 2025
 * Hora: 00:58
 * Versão: 1.3 (Corrige Bug de Atualização de UI)
 * Tarefa: 249
 *
 * Descrição: Página do Painel de Administração.
 * ATUALIZADO para corrigir o bug onde o estado local (UI)
 * não refletia a mudança de Status ou Nível após o sucesso.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Check, X, Loader2, Award, Shield, Gem, Edit } from 'lucide-react'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// --- URLs das APIs de Admin ---
const LISTAR_ASSOCIADOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_associados.php';
const ATUALIZAR_ASSOCIADO_API_URL = 'https://www.ambamazonas.com.br/api/atualizar_status_atleta.php'; 
const LISTAR_PARCEIROS_API_URL = 'https://www.ambamazonas.com.br/api/admin_listar_parceiros.php';
const ATUALIZAR_PARCEIRO_API_URL = 'https://www.ambamazonas.com.br/api/admin_atualizar_parceiro.php';

// --- Interfaces ---
interface Associado {
  id: number; nome_completo: string; email: string; 
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'atleta' | 'admin'; data_cadastro: string; categoria_atual: string | null;
}
interface Parceiro {
  id: number;
  nome_parceiro: string;
  categoria: string;
  status: 'ativo' | 'inativo';
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  data_cadastro: string;
}

export default function AdminPainelPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [associados, setAssociados] = useState<Associado[]>([]);
  const [isLoadingAssociados, setIsLoadingAssociados] = useState(true);
  const [erroAssociados, setErroAssociados] = useState<string | null>(null);

  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoadingParceiros, setIsLoadingParceiros] = useState(true);
  const [erroParceiros, setErroParceiros] = useState<string | null>(null);

  // Função Genérica de Busca (Mantida)
  const fetchAdminData = useCallback(async (
    url: string, 
    setter: React.Dispatch<React.SetStateAction<any[]>>, 
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, { token: token });
      if (response.data.status === 'sucesso') {
        setter(response.data.associados || response.data.parceiros || []);
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
      let msg = error.response?.data?.mensagem || 'Não foi possível carregar os dados.';
      setError(msg);
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  // Efeito de Segurança (Mantido)
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

  // Efeito de Dados (Mantido)
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && atleta?.role === 'admin' && token) {
      fetchAdminData(LISTAR_ASSOCIADOS_API_URL, setAssociados, setErroAssociados, setIsLoadingAssociados);
      fetchAdminData(LISTAR_PARCEIROS_API_URL, setParceiros, setErroParceiros, setIsLoadingParceiros);
    }
  }, [isAuthenticated, atleta, token, isAuthLoading, fetchAdminData]); 

  // Função de Atualizar Associado (Mantida)
  const handleAtualizarAssociado = async (idAssociado: number, novoStatus: 'aprovado' | 'rejeitado') => {
    if (!token) return;
    try {
      const payload = { token: token, data: { id_atleta: idAssociado, novo_status: novoStatus }};
      const response = await axios.post(ATUALIZAR_ASSOCIADO_API_URL, payload);
      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: `Associado ${novoStatus}.` });
        setAssociados(prev => prev.map(a => a.id === idAssociado ? { ...a, status_cadastro: novoStatus } : a));
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível atualizar o status.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };

  // ==========================================================
  // 6. CORREÇÃO DO BUG DE ATUALIZAÇÃO DA UI
  // ==========================================================
  const handleAtualizarParceiro = async (idParceiro: number, acao: { novo_tier?: string, novo_status?: string }) => {
    if (!token) return;
    try {
      const payload = { token: token, data: { id_parceiro: idParceiro, ...acao }};
      const response = await axios.post(ATUALIZAR_PARCEIRO_API_URL, payload);

      if (response.data.status === 'sucesso' || response.data.status === 'info') {
        toast({ title: 'Sucesso!', description: response.data.mensagem });

        // CORREÇÃO: Mapeia 'novo_tier' para 'partner_tier' e 'novo_status' para 'status'
        // ao atualizar o estado local (UI)
        setParceiros(prev => prev.map(p => {
          if (p.id === idParceiro) {
            const parceiroAtualizado = { ...p };
            if (acao.novo_tier) {
              parceiroAtualizado.partner_tier = acao.novo_tier as 'ouro' | 'prata' | 'bronze' | 'pendente';
            }
            if (acao.novo_status) {
              parceiroAtualizado.status = acao.novo_status as 'ativo' | 'inativo';
            }
            return parceiroAtualizado;
          }
          return p;
        }));

      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível atualizar o parceiro.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };
  // ==========================================================
  // FIM DA CORREÇÃO
  // ==========================================================


  // Estado de Carregamento Principal (Mantido)
  if (isAuthLoading || (atleta?.role === 'admin' && (isLoadingAssociados || isLoadingParceiros))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar painel de administração...</p>
      </div>
    );
  }

  // Renderização principal da página (JSX Mantido)
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        {/* Secção Título (Mantida) */}
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Painel de Administração
             </h1>
             <p className="text-xl text-muted-foreground mb-8">
               Gestão de Associados e Parceiros
             </p>
           </div>
        </section>

        {/* Secção Gestão de Associados (Mantida) */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Associados Cadastrados ({associados.length})
            </h2>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              {/* Tabela de Associados (Mantida) */}
              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {associados.map((assoc) => (
                        <tr key={assoc.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{assoc.nome_completo}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{assoc.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assoc.status_cadastro === 'aprovado' ? 'bg-green-600/10 text-green-700' :
                              assoc.status_cadastro === 'rejeitado' ? 'bg-red-600/10 text-red-700' :
                              'bg-yellow-600/10 text-yellow-700'
                            }`}>
                              {assoc.status_cadastro.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {assoc.status_cadastro === 'pendente' && (
                              <div className="flex justify-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 border-green-600/50 hover:bg-green-600/10"
                                  onClick={() => handleAtualizarAssociado(assoc.id, 'aprovado')} title="Aprovar Associado">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 border-red-600/50 hover:bg-red-600/10"
                                  onClick={() => handleAtualizarAssociado(assoc.id, 'rejeitado')} title="Rejeitar Associado">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </section>

        {/* Secção Gestão de Parceiros (Mantida) */}
        <section className="py-16 lg:py-20 bg-muted/30"> 
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Parceiros Cadastrados ({parceiros.length})
            </h2>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              {isLoadingParceiros && (
                <div className="flex items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A carregar lista de parceiros...
                </div>
              )}
              {erroParceiros && <p className="text-red-600">{erroParceiros}</p>}
              {!isLoadingParceiros && !erroParceiros && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Parceiro</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status (Aprovação)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nível (Tier)</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Aprovar/Rejeitar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {parceiros.map((parc) => (
                        <tr key={parc.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{parc.nome_parceiro}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{parc.categoria}</td>
                          {/* Campo de Status (Ativo/Inativo) */}
                          <td className="px-4 py-3 text-sm">
                            <Select 
                              value={parc.status}
                              onValueChange={(novoStatus) => handleAtualizarParceiro(parc.id, { novo_status: novoStatus })}
                            >
                              <SelectTrigger className={`w-[120px] h-8 text-xs ${parc.status === 'ativo' ? 'text-green-700 border-green-600/50' : 'text-red-700 border-red-600/50'}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="inativo">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          {/* Campo de Nível (Tier) */}
                          <td className="px-4 py-3 text-sm">
                            <Select 
                              value={parc.partner_tier}
                              onValueChange={(novoTier) => handleAtualizarParceiro(parc.id, { novo_tier: novoTier })}
                            >
                              <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="ouro">Ouro</SelectItem>
                                <SelectItem value="prata">Prata</SelectItem>
                                <SelectItem value="bronze">Bronze</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          {/* Botões rápidos (se for pendente) */}
                          <td className="px-4 py-3 text-center">
                            {parc.partner_tier === 'pendente' && (
                              <div className="flex justify-center gap-2">
                                <Button 
                                  variant="outline" size="icon" className="h-8 w-8 text-green-600"
                                  onClick={() => handleAtualizarParceiro(parc.id, { novo_status: 'ativo', novo_tier: 'bronze' })}
                                  title="Aprovar como Bronze"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" size="icon" className="h-8 w-8 text-red-600"
                                  onClick={() => handleAtualizarParceiro(parc.id, { novo_status: 'inativo' })}
                                  title="Rejeitar"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}