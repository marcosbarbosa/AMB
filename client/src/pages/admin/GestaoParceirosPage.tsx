/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 2 de novembro de 2025
 * Hora: 19:00
 * Versão: 1.2 (Corrige Erro 'edit is not defined')
 * Tarefa: 269
 *
 * Descrição: Nova página dedicada à Gestão de Parceiros.
 * CORRIGIDO: O erro de sintaxe ao renderizar o ícone de edição foi removido.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Check, X, Loader2, ArrowLeft, Edit } from 'lucide-react'; // 1. Ícones CORRIGIDOS (incluindo Edit)
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// APIs de Parceiros
const LISTAR_PARCEIROS_API_URL = 'https://www.ambamazonas.com.br/api/admin_listar_parceiros.php';
const ATUALIZAR_PARCEIRO_API_URL = 'https://www.ambamazonas.com.br/api/admin_atualizar_parceiro.php';

// Interface (Parceiro)
interface Parceiro {
  id: number; nome_parceiro: string; categoria: string;
  status: 'ativo' | 'inativo';
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  data_cadastro: string;
}

export default function GestaoParceirosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoadingParceiros, setIsLoadingParceiros] = useState(true);
  const [erroParceiros, setErroParceiros] = useState<string | null>(null);

  // Efeito de Segurança (Mantido)
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

  // Handler de Fetch (busca apenas Parceiros)
  const fetchParceiros = useCallback(async () => {
    if (!isAuthLoading && isAuthenticated && atleta?.role === 'admin' && token) {
      setIsLoadingParceiros(true);
      setErroParceiros(null);
      try {
        const response = await axios.post(LISTAR_PARCEIROS_API_URL, { token: token });
        if (response.data.status === 'sucesso') {
          setParceiros(response.data.parceiros);
        } else {
          throw new Error(response.data.mensagem);
        }
      } catch (error: any) {
        console.error("Erro ao buscar parceiros:", error);
        let msg = error.response?.data?.mensagem || 'Não foi possível carregar a lista.';
        setErroParceiros(msg);
      } finally {
        setIsLoadingParceiros(false);
      }
    }
  }, [isAuthenticated, atleta, token, isAuthLoading]);

  // Efeito de Dados (Chama o fetch)
  useEffect(() => {
    fetchParceiros();
  }, [fetchParceiros]);

  // Handler para Atualizar Parceiro (Status ou Nível)
  const handleAtualizarParceiro = async (idParceiro: number, acao: { novo_tier?: string, novo_status?: string }) => {
    if (!token) return;
    try {
      const payload = { token: token, data: { id_parceiro: idParceiro, ...acao }};
      const response = await axios.post(ATUALIZAR_PARCEIRO_API_URL, payload);

      if (response.data.status === 'sucesso' || response.data.status === 'info') {
        toast({ title: 'Sucesso!', description: response.data.mensagem });

        // Atualiza a lista local (sem recarregar)
        setParceiros(prev => prev.map(p => {
          if (p.id === idParceiro) {
            const parceiroAtualizado = { ...p };
            if (acao.novo_tier) parceiroAtualizado.partner_tier = acao.novo_tier as any;
            if (acao.novo_status) parceiroAtualizado.status = acao.novo_status as any;
            return parceiroAtualizado;
          }
          return p;
        }));
      } else { throw new Error(response.data.mensagem); }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível atualizar o parceiro.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };

  // Estado de Carregamento
  if (isAuthLoading || isLoadingParceiros) {
     return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar gestão de parceiros...</p>
      </div>
    );
  }

  // Renderização
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Link para Voltar */}
            <div className="mb-8">
              <Link 
                to="/admin/painel" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Painel de Administração
              </Link>
            </div>

            <h1 className="text-3xl font-semibold font-accent text-foreground mb-6">
              Gestão de Parceiros ({parceiros.length})
            </h1>

            {/* Tabela de Parceiros (movida para cá) */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
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
                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {parceiros.map((parc) => (
                        <tr key={parc.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{parc.nome_parceiro}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{parc.categoria}</td>
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
                          <td className="px-4 py-3 text-center">
                            {parc.partner_tier === 'pendente' && (
                              <div className="flex justify-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8 text-green-600"
                                  onClick={() => handleAtualizarParceiro(parc.id, { novo_status: 'ativo', novo_tier: 'bronze' })}
                                  title="Aprovar como Bronze">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600"
                                  onClick={() => handleAtualizarParceiro(parc.id, { novo_status: 'inativo' })}
                                  title="Rejeitar">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            {parc.partner_tier !== 'pendente' && (
                                <Button variant="outline" size="icon" className="h-8 w-8" title="Visualizar/Editar Parceiro (em breve)">
                                   <Edit className="h-4 w-4" /> 
                                </Button>
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