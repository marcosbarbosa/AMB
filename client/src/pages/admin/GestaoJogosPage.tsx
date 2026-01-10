/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 8 de novembro de 2025
 * Hora: 00:30
 * Versão: 1.1
 * Tarefa: 306 (Módulo 29-D - Placar ao Vivo)
 *
 * Descrição: Página para gerir a Tabela de Jogos (NBB).
 * ATUALIZADO para ligar o botão de Placar à nova página.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react'; 
import { useNavigate, Link, useParams } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Trash2, PlusCircle, User, Edit, CalendarClock } from 'lucide-react'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";

// APIs
const GERENCIAR_JOGOS_API_URL = 'https://www.ambamazonas.com.br/api/admin_gerenciar_jogos.php';
const GERENCIAR_INSCRICOES_API_URL = 'https://www.ambamazonas.com.br/api/admin_gerenciar_inscricoes_times.php'; 
const LISTAR_EVENTOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_eventos.php';

// Interfaces
interface Time { id: number; nome_time: string; }
interface Jogo {
  id: number; id_time_a: number; id_time_b: number;
  nome_time_a: string; nome_time_b: string;
  data_jogo: string; horario_jogo: string;
  local_jogo: string; fase: string;
  status_jogo: 'agendado' | 'ao_vivo' | 'finalizado';
}
interface Evento { id: number; nome_evento: string; }
interface JogoFormData {
  id_time_a: string; id_time_b: string; data_jogo: string;
  horario_jogo: string; local_jogo: string; fase: string;
}

export default function GestaoJogosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { eventoId } = useParams(); 
  const { toast } = useToast();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [jogos, setJogos] = useState<Jogo[]>([]); 
  const [timesInscritos, setTimesInscritos] = useState<Time[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormState: JogoFormData = {
    id_time_a: '', id_time_b: '', data_jogo: '', horario_jogo: '', local_jogo: '', fase: 'Fase de Grupos'
  };
  const [formData, setFormData] = useState<JogoFormData>(initialFormState);

  // 1. FUNÇÃO DE FETCH (Busca Evento, Times Inscritos, e Jogos Criados)
  const fetchData = useCallback(async () => {
    if (!token || !eventoId) {
      setIsLoading(false);
      setErro("Token ou ID do Evento não encontrado.");
      return;
    }
    setIsLoading(true);
    setErro(null);
    try {
      const [eventoResponse, inscritosResponse, jogosResponse] = await Promise.all([
        axios.get(LISTAR_EVENTOS_API_URL),
        axios.get(GERENCIAR_INSCRICOES_API_URL, { params: { token: token, id_evento: eventoId } }),
        axios.get(GERENCIAR_JOGOS_API_URL, { params: { token: token, id_evento: eventoId } })
      ]);

      const eventoEncontrado = eventoResponse.data.eventos.find((e: Evento) => e.id === Number(eventoId));
      if (eventoEncontrado) setEvento(eventoEncontrado);

      if (inscritosResponse.data.status === 'sucesso') {
        setTimesInscritos(inscritosResponse.data.times || []);
      }
      if (jogosResponse.data.status === 'sucesso') {
        setJogos(jogosResponse.data.jogos || []);
      }

    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
      let msg = error.response?.data?.mensagem || 'Não foi possível carregar os dados.';
      setErro(msg);
    } finally {
      setIsLoading(false);
    }
  }, [token, eventoId]);

  // Efeito de Segurança e Dados
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (atleta?.role !== 'admin')) { 
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    } else {
      if(token) { 
        fetchData(); 
      }
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, token, fetchData, toast]); 


  // Handlers do Formulário
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (name: string, value: string) => {
     setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. HANDLER PARA CRIAR JOGO
  const handleCriarJogo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !eventoId) return;

    if (formData.id_time_a === formData.id_time_b) {
        toast({ title: 'Erro', description: 'Time A e Time B não podem ser iguais.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);

    try {
      const payload = { 
        token: token, 
        data: {
          ...formData,
          id_evento: eventoId,
          id_time_a: Number(formData.id_time_a),
          id_time_b: Number(formData.id_time_b)
        }
      };

      const response = await axios.post(GERENCIAR_JOGOS_API_URL, payload);

      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: 'Jogo criado e adicionado à tabela!' });
        setFormData(initialFormState); 
        fetchData(); 
      } else { 
        throw new Error(response.data.mensagem); 
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível criar o jogo.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. HANDLER PARA APAGAR JOGO
  const handleApagarJogo = async (idJogo: number) => {
    if (!token) return;
    try {
      const payload = { token: token, data: { id_jogo: idJogo } };

      const response = await axios.delete(GERENCIAR_JOGOS_API_URL, {
        headers: { 'Content-Type': 'application/json' },
        data: payload 
      }); 

      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: `Jogo excluído da tabela.` });
        setJogos(prev => prev.filter(jogo => jogo.id !== idJogo));
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Falha ao excluir o jogo.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };


  // Renderização
  if (isAuthLoading || isLoading) {
     return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar tabela de jogos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Link para Voltar */}
            <div className="mb-8">
              <Link 
                to="/admin/eventos" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Gestão de Eventos
              </Link>
            </div>

            <h1 className="text-3xl font-semibold font-accent text-foreground mb-2">
              Tabela de Jogos
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Evento: <strong>{evento?.nome_evento}</strong>
            </p>

            {/* Grid de 2 Colunas: Criar e Listar */}
            <div className="grid lg:grid-cols-3 gap-12">

              {/* Coluna 1: Formulário de Criação */}
              <div className="lg:col-span-1 bg-card p-6 rounded-lg shadow-sm border border-border h-fit">
                <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">
                  Adicionar Jogo
                </h3>
                {timesInscritos.length < 2 ? (
                  <p className="text-muted-foreground text-sm">
                    Você precisa inscrever pelo menos 2 times neste evento antes de criar um jogo.
                  </p>
                ) : (
                  <form onSubmit={handleCriarJogo} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="id_time_a">Time A</Label>
                        <Select name="id_time_a" required
                                value={formData.id_time_a}
                                onValueChange={(value) => handleSelectChange('id_time_a', value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                          <SelectContent>
                            {timesInscritos.map(t => (
                              <SelectItem key={t.id} value={String(t.id)}>{t.nome_time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="id_time_b">Time B</Label>
                        <Select name="id_time_b" required
                                value={formData.id_time_b}
                                onValueChange={(value) => handleSelectChange('id_time_b', value)}
                        >
                          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                          <SelectContent>
                            {timesInscritos.map(t => (
                              <SelectItem key={t.id} value={String(t.id)}>{t.nome_time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="data_jogo">Data do Jogo</Label>
                        <Input id="data_jogo" name="data_jogo" type="date" required 
                               value={formData.data_jogo} onChange={handleFormChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="horario_jogo">Horário</Label>
                        <Input id="horario_jogo" name="horario_jogo" type="time" required
                               value={formData.horario_jogo} onChange={handleFormChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="local_jogo">Local (Opcional)</Label>
                      <Input id="local_jogo" name="local_jogo" 
                             value={formData.local_jogo} onChange={handleFormChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fase">Fase (Opcional)</Label>
                      <Input id="fase" name="fase" 
                             value={formData.fase} onChange={handleFormChange} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Jogo
                      <PlusCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>

              {/* Coluna 2: Lista de Jogos (Tabela NBB) */}
              <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4 border-b pb-2">
                  Jogos Agendados ({jogos.length})
                </h3>
                {erro && <p className="text-red-600 mb-4">{erro}</p>}
                {jogos.length === 0 && !isLoading && !erro && (
                  <p className="text-muted-foreground">Nenhum jogo cadastrado para este evento.</p>
                )}

                {!isLoading && jogos.length > 0 && (
                  <div className="overflow-x-auto max-h-[70vh]">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Jogo</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data/Hora</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fase</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {jogos.map((jogo) => (
                          <tr key={jogo.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-foreground">
                              {jogo.nome_time_a} vs {jogo.nome_time_b}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {new Date(jogo.data_jogo).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} - {jogo.horario_jogo}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{jogo.fase}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-2">
                                {/* (CORREÇÃO) Botão de Placar ao Vivo */}
                                <Button 
                                  variant="outline" size="icon" className="h-8 w-8" 
                                  title="Gerir Placar ao Vivo"
                                  onClick={() => navigate(`/admin/jogos/placar/${eventoId}/${jogo.id}`)}
                                >
                                  <CalendarClock className="h-4 w-4" />
                                </Button>
                                {/* Botão de Apagar com Confirmação */}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Apagar Jogo">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir este Jogo?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Time A: {jogo.nome_time_a} <br/>
                                        Time B: {jogo.nome_time_b} <br/>
                                        Data: {new Date(jogo.data_jogo).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={() => handleApagarJogo(jogo.id)}
                                      >
                                        Sim, Excluir Jogo
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