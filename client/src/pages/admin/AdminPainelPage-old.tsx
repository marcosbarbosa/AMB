/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 2 de novembro de 2025
 * Hora: 02:00
 * Versão: 1.7 (Corrige "Apagar Evento")
 * Tarefa: 264
 *
 * Descrição: Página do Painel de Administração.
 * CORRIGIDO: Adiciona o <AlertDialog> (pop-up "Tem a certeza?")
 * ao botão de apagar evento, que estava em falta.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { Textarea } from '@/components/ui/textarea'; 
import { Check, X, Loader2, Award, Shield, Gem, Edit, Trash2, PlusCircle } from 'lucide-react'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// 1. (CORREÇÃO) Importa o componente de Diálogo/Alerta
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

// --- APIs de Admin ---
const LISTAR_ASSOCIADOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_associados.php';
const ATUALIZAR_ASSOCIADO_API_URL = 'https://www.ambamazonas.com.br/api/atualizar_status_atleta.php'; 
const LISTAR_PARCEIROS_API_URL = 'https://www.ambamazonas.com.br/api/admin_listar_parceiros.php';
const ATUALIZAR_PARCEIRO_API_URL = 'https://www.ambamazonas.com.br/api/admin_atualizar_parceiro.php';
const LISTAR_EVENTOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_eventos.php'; 
const CRIAR_EVENTO_API_URL = 'https://www.ambamazonas.com.br/api/admin_criar_evento.php';
const APAGAR_EVENTO_API_URL = 'https://www.ambamazonas.com.br/api/admin_apagar_evento.php'; 

// --- Interfaces (Mantidas) ---
interface Associado { /* ... (mantida) ... */ 
  id: number; nome_completo: string; email: string; 
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  role: 'atleta' | 'admin'; data_cadastro: string; categoria_atual: string | null;
}
interface Parceiro { /* ... (mantida) ... */
  id: number; nome_parceiro: string; categoria: string;
  status: 'ativo' | 'inativo';
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  data_cadastro: string;
}
interface Evento { /* ... (mantida) ... */
  id: number; nome_evento: string; genero: 'masculino' | 'feminino' | 'misto';
  data_inicio: string; data_fim: string | null; descricao: string | null;
}
interface EventoFormData { /* ... (mantida) ... */
  nome_evento: string; genero: 'masculino' | 'feminino' | 'misto';
  data_inicio: string; data_fim: string; descricao: string;
}

export default function AdminPainelPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  // Estados (Mantidos)
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [isLoadingAssociados, setIsLoadingAssociados] = useState(true);
  const [erroAssociados, setErroAssociados] = useState<string | null>(null);
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoadingParceiros, setIsLoadingParceiros] = useState(true);
  const [erroParceiros, setErroParceiros] = useState<string | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState<string | null>(null);
  const [isSubmittingEvento, setIsSubmittingEvento] = useState(false);
  const initialEventoFormState: EventoFormData = {
    nome_evento: '', genero: 'misto', data_inicio: '', data_fim: '', descricao: ''
  };
  const [eventoFormData, setEventoFormData] = useState(initialEventoFormState);

  // Funções de Fetch e Segurança (Mantidas)
  const fetchAdminData = useCallback(async (
    url: string, 
    setter: React.Dispatch<React.SetStateAction<any[]>>, 
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    isPost: boolean = false
  ) => { /* ... (código mantido) ... */ 
    if (isPost && !token) return; 
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isPost) {
        response = await axios.post(url, { token: token }); 
      } else {
        response = await axios.get(url); 
      }
      if (response.data.status === 'sucesso') {
        setter(response.data.associados || response.data.parceiros || response.data.eventos || []);
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      console.error("Erro ao buscar dados:", error);
      let msg = error.response?.data?.mensagem || 'Não foi possível carregar os dados.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && atleta?.role === 'admin' && token) {
      fetchAdminData(LISTAR_ASSOCIADOS_API_URL, setAssociados, setErroAssociados, setIsLoadingAssociados, true);
      fetchAdminData(LISTAR_PARCEIROS_API_URL, setParceiros, setErroParceiros, setIsLoadingParceiros, true);
      fetchAdminData(LISTAR_EVENTOS_API_URL, setEventos, setErroEventos, setIsLoadingEventos, false);
    }
  }, [isAuthenticated, atleta, token, isAuthLoading, fetchAdminData, toast]); 

  // Funções de Handler (Mantidas)
  const handleAtualizarAssociado = async (idAssociado: number, novoStatus: 'aprovado' | 'rejeitado') => { /* ... (código mantido) ... */ 
    if (!token) return;
    try {
      const payload = { token: token, data: { id_atleta: idAssociado, novo_status: novoStatus }};
      const response = await axios.post(ATUALIZAR_ASSOCIADO_API_URL, payload);
      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: `Associado ${novoStatus}.` });
        setAssociados(prev => prev.map(a => a.id === idAssociado ? { ...a, status_cadastro: novoStatus } : a));
      } else { throw new Error(response.data.mensagem); }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível atualizar o status.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    }
  };
  const handleAtualizarParceiro = async (idParceiro: number, acao: { novo_tier?: string, novo_status?: string }) => { /* ... (código mantido) ... */ 
    if (!token) return;
    try {
      const payload = { token: token, data: { id_parceiro: idParceiro, ...acao }};
      const response = await axios.post(ATUALIZAR_PARCEIRO_API_URL, payload);
      if (response.data.status === 'sucesso' || response.data.status === 'info') {
        toast({ title: 'Sucesso!', description: response.data.mensagem });
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
  const handleCriarEvento = async (event: React.FormEvent<HTMLFormElement>) => { /* ... (código mantido) ... */ 
    event.preventDefault();
    if (!token) return;
    setIsSubmittingEvento(true);
    const payload = {
      token: token,
      data: { ...eventoFormData, data_fim: eventoFormData.data_fim || null, descricao: eventoFormData.descricao || null }
    };
    try {
      const response = await axios.post(CRIAR_EVENTO_API_URL, payload);
      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: 'Evento criado com sucesso!' });
        setEventoFormData(initialEventoFormState); 
        fetchAdminData(LISTAR_EVENTOS_API_URL, setEventos, setErroEventos, setIsLoadingEventos, false);
      } else { throw new Error(response.data.mensagem); }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível criar o evento.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmittingEvento(false);
    }
  };
  const handleApagarEvento = async (idEvento: number) => { /* ... (código mantido) ... */ 
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
  const handleEventoFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEventoFormData(prev => ({ ...prev, [name]: value }));
  };

  // Estado de Carregamento Principal (Mantido)
  if (isAuthLoading || (atleta?.role === 'admin' && (isLoadingAssociados || isLoadingParceiros || isLoadingEventos))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar painel de administração...</p>
      </div>
    );
  }

  // Renderização (JSX)
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        {/* ... (Secções Título e Associados mantidas) ... */}
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Painel de Administração
             </h1>
             <p className="text-xl text-muted-foreground mb-8">
               Gestão de Associados, Parceiros e Eventos
             </p>
           </div>
        </section>
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Associados Cadastrados ({associados.length})
            </h2>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
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

        {/* ... (Secção Parceiros mantida) ... */}
        <section className="py-16 lg:py-20 bg-muted/30"> 
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Parceiros Cadastrados ({parceiros.length})
            </h2>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </section>

        {/* Secção Gestão de Eventos (Mantida) */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Gestão de Eventos
            </h2>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Criar Novo Evento
                </h3>
                <form onSubmit={handleCriarEvento} className="space-y-4">
                  {/* ... (Formulário de Evento mantido) ... */}
                   <div className="space-y-2">
                    <Label htmlFor="nome_evento">Nome do Evento</Label>
                    <Input id="nome_evento" name="nome_evento" required 
                           value={eventoFormData.nome_evento} onChange={handleEventoFormChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genero">Gênero</Label>
                    <Select name="genero" required
                            value={eventoFormData.genero} 
                            onValueChange={(value) => setEventoFormData(prev => ({ ...prev, genero: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="misto">Misto</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Button type="submit" className="w-full" disabled={isSubmittingEvento}>
                    {isSubmittingEvento && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmittingEvento ? 'A criar...' : 'Criar Evento'}
                    <PlusCircle className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Coluna 2: Lista de Eventos (MODIFICADA) */}
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
                             <Button variant="outline" size="icon" className="h-8 w-8" title="Editar Evento (em breve)">
                               <Edit className="h-4 w-4" />
                             </Button>
                             {/* 2. (CORREÇÃO) ADICIONA O DIÁLOGO DE CONFIRMAÇÃO PARA APAGAR */}
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
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}