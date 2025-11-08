/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 7 de novembro de 2025
 * Hora: 23:55
 * Versão: 1.0
 * Tarefa: 292 (Módulo 29-B - Inscrição de Times)
 *
 * Descrição: Página para inscrever/desinscrever Times em um Evento.
 * Rota: /admin/eventos/inscricoes/:eventoId
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react'; 
import { useNavigate, Link, useParams } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Loader2, ArrowLeft, Check, PlusCircle, XCircle } from 'lucide-react'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// APIs
const GERENCIAR_TIMES_API_URL = 'https://www.ambamazonas.com.br/api/admin_gerenciar_times.php';
const LISTAR_EVENTOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_eventos.php';
const GERENCIAR_INSCRICOES_API_URL = 'https://www.ambamazonas.com.br/api/admin_gerenciar_inscricoes_times.php'; // <--- NOVO SCRIPT (Tarefa 293)

// Interfaces
interface Time {
  id: number;
  nome_time: string;
  url_logo_time: string | null;
  inscrito?: boolean; // Novo campo para UI
}
interface Evento {
  id: number;
  nome_evento: string;
}

export default function GestaoInscricaoTimesPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();
  const { eventoId } = useParams(); // <-- Lê o ID do evento da URL

  const [evento, setEvento] = useState<Evento | null>(null);
  const [times, setTimes] = useState<Time[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. FUNÇÃO DE FETCH (Busca Times e o Evento)
  const fetchData = useCallback(async () => {
    if (!token || !eventoId) {
      setIsLoading(false);
      setErro("Token ou ID do Evento não encontrado.");
      return;
    }

    setIsLoading(true);
    setErro(null);
    try {
      // 1. Buscar o evento específico
      const eventoResponse = await axios.get(LISTAR_EVENTOS_API_URL);
      if (eventoResponse.data.status === 'sucesso' && eventoResponse.data.eventos) {
        const eventoEncontrado = eventoResponse.data.eventos.find((e: Evento) => e.id === Number(eventoId));
        if (eventoEncontrado) {
          setEvento(eventoEncontrado);
        } else {
          throw new Error(`Evento com ID ${eventoId} não encontrado.`);
        }
      }

      // 2. Buscar TODOS os times
      const timesResponse = await axios.get(GERENCIAR_TIMES_API_URL, {
        params: { token: token } 
      }); 

      // 3. Buscar times JÁ INSCRITOS neste evento (do novo endpoint)
      const inscritosResponse = await axios.get(GERENCIAR_INSCRICOES_API_URL, {
        params: { token: token, id_evento: eventoId }
      });

      if (timesResponse.data.status === 'sucesso' && inscritosResponse.data.status === 'sucesso') {
        const todosTimes = timesResponse.data.times || [];
        const timesInscritosIds = new Set(inscritosResponse.data.times.map((t: Time) => t.id));

        // 4. Marcar quais times estão inscritos
        const timesComStatus = todosTimes.map((time: Time) => ({
          ...time,
          inscrito: timesInscritosIds.has(time.id)
        }));

        setTimes(timesComStatus);
      } else {
        throw new Error(inscritosResponse.data.mensagem || 'Erro ao buscar dados.');
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
  }, [isAuthenticated, atleta, isAuthLoading, navigate, token, fetchData]); 


  // 2. HANDLER PARA INSCREVER/DESINSCREVER TIME
  const handleToggleInscricao = async (idTime: number, nomeTime: string, acao: 'inscrever' | 'desinscrever') => {
    if (!token || !eventoId) return;
    setIsSubmitting(true);

    try {
      const payload = { 
        token: token, 
        data: {
          id_evento: eventoId,
          id_time: idTime,
          acao: acao
        }
      };

      // Usamos POST para inscrever/desinscrever
      const response = await axios.post(GERENCIAR_INSCRICOES_API_URL, payload);

      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: `Time ${nomeTime} ${acao === 'inscrever' ? 'inscrito' : 'removido'}!` });
        // Atualiza a lista localmente
        setTimes(prevTimes => 
          prevTimes.map(time => 
            time.id === idTime ? { ...time, inscrito: acao === 'inscrever' } : time
          )
        );
      } else { 
        throw new Error(response.data.mensagem); 
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível alterar a inscrição.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderização
  if (isAuthLoading || isLoading) {
     return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar gestão de inscrições...</p>
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
              Gestão de Inscrições de Times
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Evento: <strong>{evento?.nome_evento}</strong>
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Selecione os Times participantes</CardTitle>
              </CardHeader>
              <CardContent>
                {erro && <p className="text-red-600 mb-4">{erro}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {times.map((time) => (
                    <div 
                      key={time.id} 
                      className={`p-4 border rounded-lg flex items-center justify-between ${
                        time.inscrito ? 'bg-green-600/10 border-green-600/50' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={time.url_logo_time ? `https://www.ambamazonas.com.br${time.url_logo_time}` : '/default-logo.png'} 
                          alt={time.nome_time} 
                          className="h-10 w-10 object-contain rounded-full bg-white" 
                        />
                        <span className="font-medium">{time.nome_time}</span>
                      </div>

                      {time.inscrito ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleInscricao(time.id, time.nome_time, 'desinscrever')}
                          disabled={isSubmitting}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Remover
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleInscricao(time.id, time.nome_time, 'inscrever')}
                          disabled={isSubmitting}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Inscrever
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}