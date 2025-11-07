/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 5 de novembro de 2025
 * Hora: 17:15
 * Versão: 2.2 (Refatorado - Plano B)
 * Tarefa: 282 (Módulo 29)
 *
 * Descrição: Página de Gestão de Eventos (/admin/eventos).
 * REFEITO DO ZERO (Plano B) para focar apenas no CRUD de Eventos.
 * Corrige o bug "Expected corresponding JSX closing tag for <Dialog>".
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
import { Textarea } from '@/components/ui/textarea'; 
import { Check, X, Loader2, ArrowLeft, Edit, Trash2, PlusCircle, Newspaper } from 'lucide-react'; // Removido Upload, FileText
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

// --- APIs (Apenas CRUD de Eventos) ---
const LISTAR_EVENTOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_eventos.php'; 
const CRIAR_EVENTO_API_URL = 'https://www.ambamazonas.com.br/api/admin_criar_evento.php';
const APAGAR_EVENTO_API_URL = 'https://www.ambamazonas.com.br/api/admin_apagar_evento.php';
const ATUALIZAR_EVENTO_API_URL = 'https://www.ambamazonas.com.br/api/admin_atualizar_evento.php';

// --- Interfaces ---
interface Evento {
  id: number; nome_evento: string; genero: 'masculino' | 'feminino' | 'misto';
  data_inicio: string; data_fim: string | null; descricao: string | null;
  tipo: 'campeonato' | 'torneio';
}
interface EventoFormData {
  nome_evento: string; genero: 'masculino' | 'feminino' | 'misto';
  tipo: 'campeonato' | 'torneio';
  data_inicio: string; data_fim: string; descricao: string;
}
interface EventoEditFormData extends EventoFormData { id: number; }


export default function GestaoEventosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const initialEventoFormState: EventoFormData = {
    nome_evento: '', genero: 'misto', tipo: 'campeonato', 
    data_inicio: '', data_fim: '', descricao: ''
  };
  const [eventoFormData, setEventoFormData] = useState(initialEventoFormState);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventoParaEditar, setEventoParaEditar] = useState<EventoEditFormData | null>(null);

  // 1. FUNÇÃO DE FETCH DE EVENTOS
  const fetchEventos = useCallback(async () => {
    setIsLoadingEventos(true);
    setErroEventos(null);
    try {
      const response = await axios.get(LISTAR_EVENTOS_API_URL); 
      if (response.data.status === 'sucesso') {
        setEventos(response.data.eventos || []);
      } else {
        throw new Error(response.data.mensagem || 'Erro ao buscar eventos');
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      setErroEventos('Não foi possível carregar os eventos.');
    } finally {
      setIsLoadingEventos(false);
    }
  }, []);

  // Efeitos de Segurança e Dados
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) { 
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    } else {
      fetchEventos(); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast, fetchEventos]); 

  // Handlers de Formulário (Criação)
  const handleEventoFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEventoFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventoSelectChange = (name: string, value: string) => {
     setEventoFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleCriarEvento = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setIsSubmitting(true);

    const dataToSend = { ...eventoFormData, 
      data_fim: eventoFormData.data_fim || null, 
      descricao: eventoFormData.descricao || null 
    };

    const payload = { token: token, data: dataToSend };

    try {
      const response = await axios.post(CRIAR_EVENTO_API_URL, payload);
      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: 'Evento criado com sucesso!' });
        setEventoFormData(initialEventoFormState); 
        fetchEventos(); 
      } else { throw new Error(response.data.mensagem); }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível criar o evento.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para Apagar Evento
  const handleApagarEvento = async (idEvento: number) => {
    if (!token) return;
    try {
      const payload = { token: token, data: { id_evento: idEvento }};
      const response = await axios.post(APAGAR_EVENTO_API_URL, payload);
      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: 'Evento apagado com sucesso.' });
        setEventos(prev => prev.filter(evento => evento.id !== idEvento)); 
      } else { throw new Error(response.data.mensagem); }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível apagar o evento.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };

  // Handlers de Edição (Modal)
  const handleAbrirModalEditar = (evento: Evento) => {
    setEventoParaEditar({
      ...evento,
      id: evento.id, 
      data_inicio: evento.data_inicio ? evento.data_inicio.split('T')[0] : '',
      data_fim: evento.data_fim ? evento.data_fim.split('T')[0] : '',
      descricao: evento.descricao || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (eventoParaEditar) {
      setEventoParaEditar(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleEditSelectChange = (name: string, value: string) => {
     if (eventoParaEditar) {
      setEventoParaEditar(prev => ({ ...prev!, [name]: value as any }));
    }
  };

  const handleSalvarEdicaoEvento = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    if (!token || !eventoParaEditar) return;
    setIsSubmitting(true);

    const payload = {
      token: token,
      data: {
        id_evento: eventoParaEditar.id, 
        nome_evento: eventoParaEditar.nome_evento,
        genero: eventoParaEditar.genero,
        tipo: eventoParaEditar.tipo,
        data_inicio: eventoParaEditar.data_inicio,
        data_fim: eventoParaEditar.data_fim || null,
        descricao: eventoParaEditar.descricao || null,
      }
    };

    try {
      const response = await axios.post(ATUALIZAR_EVENTO_API_URL, payload);
      if (response.data.status === 'sucesso' || response.data.status === 'info') {
        toast({ title: 'Sucesso!', description: response.data.mensagem });
        setIsEditModalOpen(false); 
        fetchEventos(); 
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível atualizar o evento.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estado de Carregamento Principal
  if (isAuthLoading || isLoadingEventos) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar gestão de eventos...</p>
      </div>
    );
  }

  // Renderização (JSX)
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
              Gestão de Eventos
            </h1>

            {/* 1. (CORREÇÃO) O <Dialog> agora embrulha toda a secção */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              {/* Grid 1: Criar / Listar Eventos */}
              <div className="grid lg:grid-cols-2 gap-12">

                {/* Coluna 1: Formulário de Novo Evento */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    1. Criar Evento
                  </h3>
                  <form onSubmit={handleCriarEvento} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome_evento">Nome do Evento</Label>
                      <Input id="nome_evento" name="nome_evento" required 
                             value={eventoFormData.nome_evento} onChange={handleEventoFormChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="genero">Gênero</Label>
                        <Select name="genero" required
                                value={eventoFormData.genero} 
                                onValueChange={(value) => handleEventoSelectChange('genero', value)}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="misto">Misto</SelectItem>
                            <SelectItem value="masculino">Masculino</SelectItem>
                            <SelectItem value="feminino">Feminino</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select name="tipo" required
                                value={eventoFormData.tipo} 
                                onValueChange={(value) => handleEventoSelectChange('tipo', value)}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="campeonato">Campeonato</SelectItem>
                            <SelectItem value="torneio">Torneio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="data_inicio">Data de Início</Label>
                        <Input id="data_inicio" name="data_inicio" type="date" required 
                               value={eventoFormData.data_inicio} onChange={handleEventoFormChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="data_fim">Data de Fim (Opcional)</Label>
                        <Input id="data_fim" name="data_fim" type="date"
                               value={eventoFormData.data_fim} onChange={handleEventoFormChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição (Opcional)</Label>
                      <Textarea id="descricao" name="descricao" rows={4}
                                value={eventoFormData.descricao} onChange={handleEventoFormChange} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'A criar...' : 'Criar Evento'}
                      <PlusCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {/* Coluna 2: Lista de Eventos */}
                <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Eventos Cadastrados ({eventos.length})
                  </h3>
                  {isLoadingEventos && <p>A carregar eventos...</p>}
                  {erroEventos && <p className="text-red-600">{erroEventos}</p>}
                  {!isLoadingEventos && !erroEventos && (
                    <ul className="space-y-4 max-h-[600px] overflow-y-auto">
                      {eventos.map((evento) => (
                        <li key={evento.id} className="border-b border-border pb-4 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-foreground">{evento.nome_evento}</h4>
                              <p className="text-sm text-muted-foreground">
                                Início: {new Date(evento.data_inicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                               {/* O <DialogTrigger> ESTÁ AQUI */}
                               <DialogTrigger asChild>
                                 <Button 
                                   variant="outline" size="icon" className="h-8 w-8" 
                                   title="Editar Evento"
                                   onClick={() => handleAbrirModalEditar(evento)}
                                 >
                                   <Edit className="h-4 w-4" />
                                 </Button>
                               </DialogTrigger>

                               {/* NOVO: Botão para Gerir Conteúdo (Módulo 29) */}
                               <Button 
                                 variant="outline" size="icon" className="h-8 w-8" 
                                 title="Gerir Posts e Boletins"
                                 onClick={() => navigate(`/admin/eventos/${evento.id}/conteudo`)}
                               >
                                 <Newspaper className="h-4 w-4" />
                               </Button>

                               {/* O <AlertDialogTrigger> (Apagar) ESTÁ AQUI */}
                               <AlertDialog>
                                 <AlertDialogTrigger asChild>
                                   <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" title="Apagar Evento">
                                     <Trash2 className="h-4 w-4" />
                                   </Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                   <AlertDialogHeader>
                                     <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                                     <AlertDialogDescription>
                                       Esta ação não pode ser desfeita. Isto irá apagar permanentemente o evento: 
                                       <br/><strong>{evento.nome_evento}</strong>
                                     </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                     <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                     <AlertDialogAction 
                                        className="bg-destructive hover:bg-destructive/90"
                                        onClick={() => handleApagarEvento(evento.id)}
                                     >
                                       Sim, apagar evento
                                     </AlertDialogAction>
                                   </AlertDialogFooter>
                                 </AlertDialogContent>
                               </AlertDialog>
                            </div>
                          </div>
                          {evento.descricao && (
                            <p className="text-sm text-muted-foreground mt-2">{evento.descricao}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

            {/* O <DialogContent> (Modal de Edição) FICA AQUI DENTRO */}
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar Evento</DialogTitle>
                <DialogDescription>
                  Altere os detalhes do evento: {eventoParaEditar?.nome_evento}
                </DialogDescription>
              </DialogHeader>

              {eventoParaEditar && (
                <form onSubmit={(e) => { e.preventDefault(); handleSalvarEdicaoEvento(e); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nome_evento">Nome do Evento</Label>
                    <Input id="edit-nome_evento" name="nome_evento" 
                           value={eventoParaEditar.nome_evento} 
                           onChange={handleEditFormChange} />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="edit-genero">Gênero</Label>
                          <Select name="genero" 
                                  value={eventoParaEditar.genero} 
                                  onValueChange={(value) => handleEditSelectChange('genero', value)}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="misto">Misto</SelectItem>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="edit-tipo">Tipo</Label>
                          <Select name="tipo" 
                                  value={eventoParaEditar.tipo} 
                                  onValueChange={(value) => handleEditSelectChange('tipo', value)}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="campeonato">Campeonato</SelectItem>
                              <SelectItem value="torneio">Torneio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                   </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-data_inicio">Data de Início</Label>
                      <Input id="edit-data_inicio" name="data_inicio" type="date" 
                             value={eventoParaEditar.data_inicio} 
                             onChange={handleEditFormChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-data_fim">Data de Fim (Opcional)</Label>
                      <Input id="edit-data_fim" name="data_fim" type="date"
                             value={eventoParaEditar.data_fim || ''} 
                             onChange={handleEditFormChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-descricao">Descrição (Opcional)</Label>
                    <Textarea id="edit-descricao" name="descricao" rows={4}
                              value={eventoParaEditar.descricao || ''} 
                              onChange={handleEditFormChange} />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'A salvar...' : 'Salvar Alterações'}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog> 
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}