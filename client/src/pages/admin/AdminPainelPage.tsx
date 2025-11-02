/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 19:45
 * Versão: 1.1 (Corrige Verificação de Auth)
 *
 * Descrição: Página do Painel de Administração (/admin/painel).
 * ATUALIZADO para esperar o AuthContext (isLoading) carregar
 * antes de verificar a permissão de admin.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Check, X, Loader2 } from 'lucide-react'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';

const LISTAR_API_URL = 'https://www.ambamazonas.com.br/api/listar_associados.php';
const ATUALIZAR_STATUS_API_URL = 'https://www.ambamazonas.com.br/api/atualizar_status_atleta.php';

interface Associado { /* ... (Interface mantida) ... */ 
  id: number; nome_completo: string; email: string; 
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'atleta' | 'admin'; data_cadastro: string; categoria_atual: string | null;
}

export default function AdminPainelPage() {
  // 1. OBTÉM O NOVO ESTADO 'isLoading' DO "CÉREBRO"
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [associados, setAssociados] = useState<Associado[]>([]);
  const [isLoadingLista, setIsLoadingLista] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // 2. EFEITO DE SEGURANÇA (MODIFICADO)
  useEffect(() => {
    // 2a. Se o "cérebro" AINDA ESTÁ a carregar, não faças nada. Espera.
    if (isAuthLoading) {
      return; 
    }

    // 2b. O "cérebro" terminou. AGORA sim, verifica as permissões.
    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); // Envia para a página inicial
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); // 2c. Adiciona 'isAuthLoading'

  // 3. EFEITO DE DADOS (MODIFICADO)
  useEffect(() => {
    // Só busca dados se a autenticação estiver OK (não está a carregar E é admin)
    if (!isAuthLoading && isAuthenticated && atleta?.role === 'admin' && token) {
      const fetchAssociados = async () => {
        setIsLoadingLista(true);
        setErro(null);
        try {
          const response = await axios.post(LISTAR_API_URL, { token: token });
          if (response.data.status === 'sucesso') {
            setAssociados(response.data.associados);
          } else {
            throw new Error(response.data.mensagem || 'Erro ao buscar associados');
          }
        } catch (error: any) {
          console.error("Erro ao buscar associados:", error);
          let msg = error.response?.data?.mensagem || 'Não foi possível carregar a lista.';
          setErro(msg);
          toast({ title: 'Erro', description: msg, variant: 'destructive' });
        } finally {
          setIsLoadingLista(false);
        }
      };
      fetchAssociados();
    } else if (!isAuthLoading) {
      // Se terminou de carregar auth e não é admin, não tenta buscar
      setIsLoadingLista(false);
    }
  }, [isAuthenticated, atleta, token, isAuthLoading, toast]); // 3b. Adiciona 'isAuthLoading'

  // 4. Função handleAtualizarStatus (MODIFICADA)
  // (Precisamos enviar o token no body, como no ReqBin)
  const handleAtualizarStatus = async (idAssociado: number, novoStatus: 'aprovado' | 'rejeitado') => {
    if (!token) return; 

    try {
      const payload = {
        token: token,
        data: {
          id_atleta: idAssociado,
          novo_status: novoStatus
        }
      };

      const response = await axios.post(ATUALIZAR_STATUS_API_URL, payload); // Envia o payload completo

      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: `Associado ${novoStatus === 'aprovado' ? 'aprovado' : 'rejeitado'}.` });
        setAssociados(prevAssociados => 
          prevAssociados.map(assoc => 
            assoc.id === idAssociado ? { ...assoc, status_cadastro: novoStatus } : assoc
          )
        );
      } else {
        throw new Error(response.data.mensagem || 'Erro ao atualizar status');
      }
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      let msg = error.response?.data?.mensagem || 'Não foi possível atualizar o status.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };

  // 5. ESTADO DE CARREGAMENTO PRINCIPAL
  // (Mostra 'A carregar...' enquanto o "cérebro" ou a lista estiverem a carregar)
  if (isAuthLoading || (atleta?.role === 'admin' && isLoadingLista)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar painel de administração...</p>
      </div>
    );
  }

  // 6. O resto do JSX (tabela) é o mesmo da Tarefa 164
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Painel de Administração
             </h1>
             <p className="text-xl text-muted-foreground mb-8">
               Gestão de Associados e Eventos
             </p>
           </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Associados Cadastrados
            </h2>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              {erro && <p className="text-red-600">{erro}</p>}
              {!isLoadingLista && !erro && (
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
                            {assoc.status_cadastro === 'pendente' && (
                              <div className="flex justify-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 border-green-600/50 hover:bg-green-600/10"
                                  onClick={() => handleAtualizarStatus(assoc.id, 'aprovado')} title="Aprovar Associado">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 border-red-600/50 hover:bg-red-600/10"
                                  onClick={() => handleAtualizarStatus(assoc.id, 'rejeitado')} title="Rejeitar Associado">
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