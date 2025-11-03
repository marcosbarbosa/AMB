/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 3 de novembro de 2025
 * Hora: 09:30
 * Versão: 1.2 (Adiciona Exclusão de Associado)
 * Tarefa: 274 (Módulo 33)
 *
 * Descrição: Página dedicada à Gestão de Associados.
 * ATUALIZADO para separar a ação de "Rejeitar" (Status) da
 * ação de "Apagar" (Exclusão permanente).
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Check, X, Loader2, ArrowLeft, Trash2 } from 'lucide-react'; // Importa Trash2
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// APIs de Associados
const LISTAR_ASSOCIADOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_associados.php';
const ATUALIZAR_ASSOCIADO_API_URL = 'https://www.ambamazonas.com.br/api/atualizar_status_atleta.php'; 
// 1. NOVA API para DELETE
const APAGAR_ASSOCIADO_API_URL = 'https://www.ambamazonas.com.br/api/admin_apagar_associado.php'; 

// Interface (Apenas Associado)
interface Associado {
  id: number; nome_completo: string; email: string; 
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'atleta' | 'admin'; data_cadastro: string; categoria_atual: string | null;
}

export default function GestaoAssociadosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [associados, setAssociados] = useState<Associado[]>([]);
  const [isLoadingAssociados, setIsLoadingAssociados] = useState(true);
  const [erroAssociados, setErroAssociados] = useState<string | null>(null);

  // Efeito de Segurança (Mantido)
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

  // Handler de Fetch (Mantido)
  const fetchAssociados = useCallback(async () => {
    if (!isAuthLoading && isAuthenticated && atleta?.role === 'admin' && token) {
      setIsLoadingAssociados(true);
      setErroAssociados(null);
      try {
        const response = await axios.post(LISTAR_ASSOCIADOS_API_URL, { token: token });
        if (response.data.status === 'sucesso') {
          setAssociados(response.data.associados);
        } else {
          throw new Error(response.data.mensagem);
        }
      } catch (error: any) {
        console.error("Erro ao buscar associados:", error);
        let msg = error.response?.data?.mensagem || 'Não foi possível carregar a lista.';
        setErroAssociados(msg);
      } finally {
        setIsLoadingAssociados(false);
      }
    }
  }, [isAuthenticated, atleta, token, isAuthLoading]);

  // Efeito de Dados (Chama o fetch)
  useEffect(() => {
    fetchAssociados();
  }, [fetchAssociados]);

  // 2. Handler para Aprovar/Rejeitar (Apenas muda o Status)
  const handleAtualizarAssociado = async (idAssociado: number, novoStatus: 'aprovado' | 'rejeitado') => {
    if (!token) return;
    try {
      const payload = { token: token, data: { id_atleta: idAssociado, novo_status: novoStatus }};
      const response = await axios.post(ATUALIZAR_ASSOCIADO_API_URL, payload);
      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: `Associado ${novoStatus}.` });
        // Atualiza a lista local
        setAssociados(prev => prev.map(a => a.id === idAssociado ? { ...a, status_cadastro: novoStatus } : a));
      } else { throw new Error(response.data.mensagem); }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível atualizar o status.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };

  // 3. NOVO Handler para APAGAR PERMANENTEMENTE
  const handleApagarAssociado = async (idAssociado: number, nomeAssociado: string) => {
    if (!token) return;

    try {
      const payload = { token: token, data: { id_atleta: idAssociado }};
      const response = await axios.post(APAGAR_ASSOCIADO_API_URL, payload);

      if (response.data.status === 'sucesso') {
        toast({ title: 'Exclusão Sucesso!', description: `Associado ${nomeAssociado} foi excluído.` });
        // Remove da lista local
        setAssociados(prev => prev.filter(a => a.id !== idAssociado));
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível excluir o associado.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };


  // Estado de Carregamento (Mantido)
  if (isAuthLoading || isLoadingAssociados) {
     return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar gestão de associados...</p>
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
              Gestão de Associados ({associados.length})
            </h1>

            {/* Tabela de Associados */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              {erroAssociados && <p className="text-red-600">{erroAssociados}</p>}
              {!isLoadingAssociados && !erroAssociados && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Categoria</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data Cadastro</th>
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
                            <td className="px-4 py-3 text-sm text-muted-foreground">{assoc.categoria_atual || 'N/D'}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(assoc.data_cadastro).toLocaleDateString('pt-BR')}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                {/* Botão APROVAR (Sempre visível para pendentes) */}
                                {assoc.status_cadastro === 'pendente' && (
                                  <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 border-green-600/50 hover:bg-green-600/10"
                                    onClick={() => handleAtualizarAssociado(assoc.id, 'aprovado')} title="Aprovar Associado">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                {/* Botão REJEITAR (Sempre visível para pendentes) */}
                                {assoc.status_cadastro === 'pendente' && (
                                  <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 border-red-600/50 hover:bg-red-600/10"
                                    onClick={() => handleAtualizarAssociado(assoc.id, 'rejeitado')} title="Rejeitar (Mudar Status)">
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                                {/* 4. NOVO BOTÃO: APAGAR (Com pop-up de confirmação) */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Excluir Permanentemente">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir {assoc.nome_completo}?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação é permanente. Isto irá APAGAR completamente o cadastro 
                                        e todas as inscrições relacionadas deste associado.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={() => handleApagarAssociado(assoc.id, assoc.nome_completo)}
                                      >
                                        Sim, Apagar Associado
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
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