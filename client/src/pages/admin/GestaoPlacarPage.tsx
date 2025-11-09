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
 * Versão: 1.0
 * Tarefa: 304 (Módulo 29-D - Placar ao Vivo)
 *
 * Descrição: Página para gerir o Placar ao Vivo (NBB)
 * de um jogo específico.
 * Rota: /admin/jogos/placar/:jogoId
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
import { Loader2, ArrowLeft, Save } from 'lucide-react'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

// APIs
const OBTER_JOGO_API_URL = 'https://www.ambamazonas.com.br/api/admin_obter_detalhes_jogo.php';
const ATUALIZAR_PLACAR_API_URL = 'https://www.ambamazonas.com.br/api/admin_atualizar_placar.php';

// Interfaces
interface JogoDetalhado {
  id: number;
  id_evento: number;
  nome_time_a: string;
  logo_time_a: string | null;
  nome_time_b: string;
  logo_time_b: string | null;
  placar_q1_a: number; placar_q1_b: number;
  placar_q2_a: number; placar_q2_b: number;
  placar_q3_a: number; placar_q3_b: number;
  placar_q4_a: number; placar_q4_b: number;
  placar_final_a: number; placar_final_b: number;
  periodo_atual: string;
  status_jogo: 'agendado' | 'ao_vivo' | 'finalizado';
}

// Interface para o formulário
type PlacarFormData = Omit<JogoDetalhado, 'id' | 'id_evento' | 'nome_time_a' | 'logo_time_a' | 'nome_time_b' | 'logo_time_b'>;


export default function GestaoPlacarPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();
  const { eventoId, jogoId } = useParams(); // <-- Lê os IDs da URL

  const [jogo, setJogo] = useState<JogoDetalhado | null>(null);
  const [formData, setFormData] = useState<PlacarFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. FUNÇÃO DE FETCH (Busca Jogo Específico)
  const fetchJogo = useCallback(async () => {
    if (!token || !jogoId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(OBTER_JOGO_API_URL, {
        params: { token: token, id_jogo: jogoId } 
      }); 

      if (response.data.status === 'sucesso') {
        const jogoData: JogoDetalhado = response.data.jogo;
        setJogo(jogoData);
        // Preenche o formulário com os dados atuais do banco
        setFormData({
          placar_q1_a: jogoData.placar_q1_a, placar_q1_b: jogoData.placar_q1_b,
          placar_q2_a: jogoData.placar_q2_a, placar_q2_b: jogoData.placar_q2_b,
          placar_q3_a: jogoData.placar_q3_a, placar_q3_b: jogoData.placar_q3_b,
          placar_q4_a: jogoData.placar_q4_a, placar_q4_b: jogoData.placar_q4_b,
          placar_final_a: jogoData.placar_final_a, placar_final_b: jogoData.placar_final_b,
          periodo_atual: jogoData.periodo_atual,
          status_jogo: jogoData.status_jogo,
        });
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      console.error("Erro ao buscar jogo:", error);
      toast({ title: 'Erro', description: error.response?.data?.mensagem || 'Não foi possível carregar o jogo.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [token, jogoId, toast]);

  // Efeito de Segurança e Dados
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (atleta?.role !== 'admin')) { 
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    } else {
      if(token) { 
        fetchJogo(); 
      }
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, token, fetchJogo]); 


  // Handlers do Formulário
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Garante que apenas números sejam inseridos nos placares
    const valorNumerico = (name.startsWith('placar_') && value !== '') ? parseInt(value, 10) : value;

    setFormData(prev => (prev ? { ...prev, [name]: valorNumerico } : null));
  };

  const handleSelectChange = (name: string, value: string) => {
     setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };

  // 2. HANDLER PARA ATUALIZAR PLACAR
  const handleSalvarPlacar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !jogoId || !formData) return;

    setIsSubmitting(true);

    try {
      const payload = { 
        token: token, 
        data: {
          id_jogo: jogoId,
          ...formData
        }
      };

      const response = await axios.post(ATUALIZAR_PLACAR_API_URL, payload);

      if (response.data.status === 'sucesso' || response.data.status === 'info') {
        toast({ title: 'Sucesso!', description: response.data.mensagem });
      } else { 
        throw new Error(response.data.mensagem); 
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível atualizar o placar.';
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
        <p className="text-muted-foreground">A carregar placar...</p>
      </div>
    );
  }

  if (!jogo || !formData) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <p className="text-destructive">Erro ao carregar dados do jogo.</p>
       </div>
     )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Link para Voltar */}
            <div className="mb-8">
              <Link 
                to={`/admin/eventos/jogos/${eventoId}`} 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Tabela de Jogos
              </Link>
            </div>

            <h1 className="text-3xl font-semibold font-accent text-foreground mb-6">
              Placar ao Vivo (Admin)
            </h1>

            <form onSubmit={handleSalvarPlacar}>
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex justify-around items-center">
                     <span>{jogo.nome_time_a}</span>
                     <span>VS</span>
                     <span>{jogo.nome_time_b}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* --- PLACAR POR PERÍODO --- */}
                  <div>
                    <h4 className="font-medium mb-2">Placar por Período</h4>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <Label className="text-muted-foreground">Equipe</Label>
                      <Label className="text-muted-foreground">Q1</Label>
                      <Label className="text-muted-foreground">Q2</Label>
                      <Label className="text-muted-foreground">Q3</Label>
                      <Label className="text-muted-foreground">Q4</Label>

                      {/* Time A */}
                      <Label className="text-left py-2">{jogo.nome_time_a}</Label>
                      <Input type="number" name="placar_q1_a" value={formData.placar_q1_a} onChange={handleFormChange} className="text-center" />
                      <Input type="number" name="placar_q2_a" value={formData.placar_q2_a} onChange={handleFormChange} className="text-center" />
                      <Input type="number" name="placar_q3_a" value={formData.placar_q3_a} onChange={handleFormChange} className="text-center" />
                      <Input type="number" name="placar_q4_a" value={formData.placar_q4_a} onChange={handleFormChange} className="text-center" />

                      {/* Time B */}
                      <Label className="text-left py-2">{jogo.nome_time_b}</Label>
                      <Input type="number" name="placar_q1_b" value={formData.placar_q1_b} onChange={handleFormChange} className="text-center" />
                      <Input type="number" name="placar_q2_b" value={formData.placar_q2_b} onChange={handleFormChange} className="text-center" />
                      <Input type="number" name="placar_q3_b" value={formData.placar_q3_b} onChange={handleFormChange} className="text-center" />
                      <Input type="number" name="placar_q4_b" value={formData.placar_q4_b} onChange={handleFormChange} className="text-center" />
                    </div>
                  </div>

                  {/* --- PLACAR FINAL E STATUS --- */}
                  <div className="grid grid-cols-3 gap-6 pt-4 border-t">
                     <div className="space-y-2">
                        <Label htmlFor="placar_final_a">Placar Final (Time A)</Label>
                        <Input type="number" name="placar_final_a" value={formData.placar_final_a} onChange={handleFormChange} className="text-xl h-12" />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="placar_final_b">Placar Final (Time B)</Label>
                        <Input type="number" name="placar_final_b" value={formData.placar_final_b} onChange={handleFormChange} className="text-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status_jogo">Status do Jogo</Label>
                        <Select name="status_jogo" required
                                value={formData.status_jogo}
                                onValueChange={(value) => handleSelectChange('status_jogo', value)}
                        >
                          <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agendado">Agendado</SelectItem>
                            <SelectItem value="ao_vivo">Ao Vivo</SelectItem>
                            <SelectItem value="finalizado">Finalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                  </div>

                   <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="periodo_atual">Período Atual</Label>
                        <Input name="periodo_atual" value={formData.periodo_atual} onChange={handleFormChange} placeholder="Ex: 1Q, Intervalo, Fim 4Q" />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="tempo_restante">Tempo Restante (Opcional)</Label>
                        <Input name="tempo_restante" value={formData.tempo_restante || ''} onChange={handleFormChange} placeholder="Ex: 02:15" />
                      </div>
                  </div>

                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Placar
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </form>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}