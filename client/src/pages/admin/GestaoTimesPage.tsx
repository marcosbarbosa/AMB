/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 3 de novembro de 2025
 * Hora: 11:35
 * Versão: 1.0
 * Tarefa: 285 (Módulo 29 - Gestão de Times)
 *
 * Descrição: Página dedicada à Gestão de Times (Equipes).
 * Permite ao Admin Criar, Listar e Apagar equipes.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label';
import { Check, Loader2, ArrowLeft, Trash2, PlusCircle, User, Upload, Edit } from 'lucide-react'; 
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

// APIs de Times
const GERENCIAR_TIMES_API_URL = 'https://www.ambamazonas.com.br/api/admin_gerenciar_times.php';

// Interface para Times (Equipes)
interface Time {
  id: number;
  nome_time: string;
  url_logo_time: string | null;
}

export default function GestaoTimesPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [times, setTimes] = useState<Time[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para o formulário de Criação
  const [nomeNovoTime, setNomeNovoTime] = useState('');
  const [logoNovoTime, setLogoNovoTime] = useState<File | null>(null);


  // 1. FUNÇÃO DE FETCH DE TIMES
  const fetchTimes = useCallback(async () => {
    // Usamos GET para listar (não precisa de token no body, apenas admin logado)
    setIsLoading(true);
    setErro(null);
    try {
      // O token vai na URL (params) para requisições GET
      const response = await axios.get(GERENCIAR_TIMES_API_URL, {
        params: { token: token } 
      }); 

      if (response.data.status === 'sucesso') {
        setTimes(response.data.times || []);
      } else {
        throw new Error(response.data.mensagem || 'Erro ao buscar times');
      }
    } catch (error) {
      console.error("Erro ao buscar times:", error);
      let msg = 'Não foi possível carregar a lista de times. (Acesso negado ou erro no servidor)';
      // NOVO: Adicionado tratamento para o erro 403/401 do backend
       if (axios.isAxiosError(error) && error.response?.status === 403) {
            msg = "Acesso negado. Você não é um administrador válido.";
       }
      setErro(msg);
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, atleta]); // Adicionado isAuthenticated e atleta

  // Efeito de Segurança e Dados
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (atleta?.role !== 'admin')) { 
      // Não mostra toast aqui, pois o Navigation já trata.
      navigate('/'); 
    } else {
      fetchTimes(); // Busca os times se for admin
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, fetchTimes]); 


  // 2. HANDLER PARA CRIAR TIME
  const handleCriarTime = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !nomeNovoTime) return;
    setIsSubmitting(true);

    // Usa FormData para upload de ficheiros e token
    const formData = new FormData();
    formData.append('token', token); 
    formData.append('nome_time', nomeNovoTime);
    if (logoNovoTime) {
      formData.append('url_logo_time', logoNovoTime);
    }

    try {
      const response = await axios.post(GERENCIAR_TIMES_API_URL, formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: response.data.mensagem });
        setNomeNovoTime(''); // Limpa o nome
        setLogoNovoTime(null); // Limpa o logo
        (event.target as HTMLFormElement).reset(); // Limpa o input de arquivo
        fetchTimes(); // Recarrega a lista
      } else { 
        throw new Error(response.data.mensagem); 
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível criar o time.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. HANDLER PARA APAGAR TIME
  const handleApagarTime = async (idTime: number, nomeTime: string) => {
    if (!token) return;
    try {
      // O backend PHP está configurado para ler o ID do GET/URL
      const response = await axios.delete(GERENCIAR_TIMES_API_URL + '?id=' + idTime, {
        headers: { 
          'Content-Type': 'application/json' 
        },
        // Enviamos o token no body (JSON)
        data: { token: token } 
      }); 

      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: `Time ${nomeTime} excluído.` });
        setTimes(prev => prev.filter(time => time.id !== idTime));
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Falha ao excluir. Verifique se o time tem jogos pendentes.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };


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
              Gestão de Times (Equipes)
            </h1>

            {/* Grid de 2 Colunas: Criar e Listar */}
            <div className="grid lg:grid-cols-3 gap-12">

              {/* Coluna 1: Formulário de Criação */}
              <div className="lg:col-span-1 bg-card p-6 rounded-lg shadow-sm border border-border h-fit">
                <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">
                  Criar Novo Time
                </h3>
                <form onSubmit={handleCriarTime} className="space-y-4">

                  <div className="space-y-2">
                    <Label htmlFor="nome_time">Nome do Time</Label>
                    <Input id="nome_time" name="nome_time" required
                           value={nomeNovoTime} onChange={(e) => setNomeNovoTime(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo_time">Logo do Time (Opcional)</Label>
                    <Input id="logo_time" name="url_logo_time" type="file" accept="image/*"
                           onChange={(e) => setLogoNovoTime(e.target.files ? e.target.files[0] : null)} />
                    <p className="text-sm text-muted-foreground">Use JPG, PNG, WEBP. Ideal: 150x150px.</p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Time
                    <PlusCircle className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Coluna 2: Lista de Times */}
              <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">
                  Times Cadastrados ({times.length})
                </h3>
                {erro && <p className="text-red-600 mb-4">{erro}</p>}

                {times.length === 0 && !erro ? (
                  <p className="text-muted-foreground">Nenhum time cadastrado ainda.</p>
                ) : (
                  <div className="overflow-x-auto max-h-[70vh]">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Logo</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Time</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {times.map((time) => (
                          <tr key={time.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-foreground">
                              {time.url_logo_time ? (
                                <img src={time.url_logo_time} alt={time.nome_time} className="h-8 w-8 object-contain" />
                              ) : (
                                <User className="h-6 w-6 text-muted-foreground" />
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-foreground">{time.nome_time}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{time.id}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" title="Editar Time (em breve)">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {/* Botão de Apagar com Confirmação */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Apagar Time">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir {time.nome_time}?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação é permanente. Isto irá APAGAR completamente o time 
                                        e todas as referências em jogos futuros ou inscrições.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={() => handleApagarTime(time.id, time.nome_time)}
                                      >
                                        Sim, Excluir Time
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

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}