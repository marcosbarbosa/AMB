/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: GestaoAssociadosPage.tsx
 * CAMINHO: client/src/pages/admin/GestaoAssociadosPage.tsx
 * DATA: 16 de Janeiro de 2026
 * FUNÇÃO: Gestão Completa (Relatório de Impressão Otimizado)
 * VERSÃO: 16.0 Print Layout Fix
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { 
  Check, X, Loader2, ArrowLeft, Trash2, 
  ShieldCheck, ShieldOff, AlertTriangle, 
  Search, Eye, Printer, Banknote, UserPlus 
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge';

// APIs
const LISTAR_ASSOCIADOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_associados.php';
const ATUALIZAR_ASSOCIADO_API_URL = 'https://www.ambamazonas.com.br/api/atualizar_status_atleta.php'; 
const APAGAR_ASSOCIADO_API_URL = 'https://www.ambamazonas.com.br/api/admin_apagar_associado.php'; 
const PROMOVER_ADMIN_API_URL = 'https://www.ambamazonas.com.br/api/admin_promover_associado.php';
const REBAIXAR_ADMIN_API_URL = 'https://www.ambamazonas.com.br/api/admin_rebaixar_associado.php';

interface Associado {
  id: number; 
  nome_completo: string; 
  email: string; 
  status_cadastro: 'pendente' | 'aprovado' | 'rejeitado';
  status_financeiro?: 'adimplente' | 'pendente' | 'bloqueado';
  role: 'atleta' | 'admin'; 
  data_cadastro: string; 
  data_nascimento?: string;
  categoria_atual: string | null;
  is_superuser?: number;
}

export default function GestaoAssociadosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [associados, setAssociados] = useState<Associado[]>([]);
  const [filteredAssociados, setFilteredAssociados] = useState<Associado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingAssociados, setIsLoadingAssociados] = useState(true);
  const [erroAssociados, setErroAssociados] = useState<string | null>(null);

  const isLoggedSuperUser = 
    (atleta?.id && Number(atleta.id) === 10) || 
    ((atleta as any)?.is_superuser && Number((atleta as any).is_superuser) === 1);

  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão.', variant: 'destructive' });
      navigate('/'); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

  const fetchAssociados = useCallback(async () => {
    if (!isAuthLoading && isAuthenticated && atleta?.role === 'admin' && token) {
      setIsLoadingAssociados(true);
      setErroAssociados(null);
      try {
        const response = await axios.post(LISTAR_ASSOCIADOS_API_URL, { token: token });
        if (response.data.status === 'sucesso') {
          setAssociados(response.data.associados);
          setFilteredAssociados(response.data.associados);
        } else {
          throw new Error(response.data.mensagem);
        }
      } catch (error: any) {
        console.error("Erro API:", error);
        let msg = error.response?.data?.mensagem || error.message || 'Falha ao carregar a lista.';
        setErroAssociados(msg);
      } finally {
        setIsLoadingAssociados(false);
      }
    }
  }, [isAuthenticated, atleta, token, isAuthLoading]);

  useEffect(() => { fetchAssociados(); }, [fetchAssociados]);

  // Filtro
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = associados.filter(a => 
      a.nome_completo.toLowerCase().includes(term) || 
      a.email.toLowerCase().includes(term) ||
      a.id.toString().includes(term)
    );
    setFilteredAssociados(filtered);
  }, [searchTerm, associados]);

  // Handlers
  const handleAtualizarAssociado = async (id: number, status: 'aprovado' | 'rejeitado') => {
    if (!token) return;
    try {
      const res = await axios.post(ATUALIZAR_ASSOCIADO_API_URL, { token, data: { id_atleta: id, novo_status: status }});
      if (res.data.status === 'sucesso') {
        toast({ title: 'Sucesso', description: `Status alterado para ${status}` });
        setAssociados(prev => prev.map(a => a.id === id ? { ...a, status_cadastro: status } : a));
      } else throw new Error(res.data.mensagem);
    } catch (e: any) { toast({ title: 'Erro', description: e.message, variant: 'destructive' }); }
  };

  const handleApagarAssociado = async (id: number, nome: string) => {
    if (!token) return;
    try {
      const res = await axios.post(APAGAR_ASSOCIADO_API_URL, { token, data: { id_atleta: id }});
      if (res.data.status === 'sucesso') {
        toast({ title: 'Excluído', description: `${nome} removido.` });
        setAssociados(prev => prev.filter(a => a.id !== id));
      } else throw new Error(res.data.mensagem);
    } catch (e: any) { toast({ title: 'Erro', description: e.message, variant: 'destructive' }); }
  };

  const handleRoleChange = async (id: number, nome: string, action: 'promover' | 'rebaixar') => {
    if (!token) return;
    try {
        const url = action === 'promover' ? PROMOVER_ADMIN_API_URL : REBAIXAR_ADMIN_API_URL;
        const res = await axios.post(url, { token, data: { id_atleta: id }});
        if (res.data.status === 'sucesso') {
            const newRole = action === 'promover' ? 'admin' : 'atleta';
            toast({ title: 'Sucesso', description: 'Permissão atualizada.', className: "bg-blue-900 text-white" });
            setAssociados(prev => prev.map(a => a.id === id ? { ...a, role: newRole } : a));
        } else throw new Error(res.data.mensagem);
    } catch (e: any) { toast({ title: 'Erro', description: e.message, variant: 'destructive' }); }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isAuthLoading || isLoadingAssociados) {
     return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-slate-50">

      {/* Ocultar Menu na Impressão */}
      <div className="print:hidden">
        <Navigation />
      </div>

      <main className="pt-40 pb-16 print:pt-4 print:pb-0 print:bg-white"> 
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0 print:max-w-none">

            {/* Header Flexível: Ajusta para impressão */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center gap-4 print:justify-center print:mb-4">
                    {/* Botão Voltar: Oculto na impressão */}
                    <Link to="/admin/painel" className="text-slate-500 hover:text-blue-600 font-bold flex items-center text-sm transition-colors print:hidden">
                        <ArrowLeft className="h-4 w-4 mr-1"/> Voltar
                    </Link>
                    <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block print:hidden"></div>

                    {/* Título: Sempre visível, centralizado na impressão */}
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight print:text-2xl print:text-black">
                        Gestão de Associados
                    </h1>

                    {/* Badge: Oculto na impressão */}
                    <Badge variant="secondary" className="text-lg bg-slate-200 text-slate-700 ml-2 print:hidden">
                        {filteredAssociados.length}
                    </Badge>
                </div>

                {/* Barra de Ferramentas: Oculta na impressão */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">

                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Pesquisar por nome ou e-mail..." 
                            className="pl-10 border-slate-200 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" className="text-slate-500 border-slate-200 hover:bg-slate-50 cursor-not-allowed opacity-60">
                                    <Banknote className="h-4 w-4 mr-2" /> Migrar Financeiro
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Ainda em construção</p></TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" className="text-slate-500 border-slate-200 hover:bg-slate-50 cursor-not-allowed opacity-60">
                                    <UserPlus className="h-4 w-4 mr-2" /> Migrar Associados
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Ainda em construção</p></TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100" onClick={handlePrint}>
                                    <Printer className="h-4 w-4 mr-2" /> Listar/Imprimir
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Imprimir lista atual</p></TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {/* Tabela: Ajustes para impressão (remove sombras, bordas, scroll) */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none print:border print:border-black print:overflow-visible">
              {erroAssociados ? (
                  <div className="p-8 text-center flex flex-col items-center">
                      <div className="bg-red-100 p-4 rounded-full mb-4"><AlertTriangle className="h-8 w-8 text-red-600" /></div>
                      <h3 className="text-lg font-bold text-red-700 mb-2">Falha ao carregar dados</h3>
                      <p className="text-red-600 bg-red-50 p-3 rounded font-mono text-xs max-w-2xl border border-red-200">{erroAssociados}</p>
                      <Button variant="outline" className="mt-6 border-red-200 text-red-700 hover:bg-red-50" onClick={() => window.location.reload()}>Tentar Novamente</Button>
                  </div>
              ) : (
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="min-w-full divide-y divide-slate-100 print:divide-black">
                      <thead className="bg-slate-50 print:bg-white print:border-b-2 print:border-black">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase print:text-black">Associado</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase print:text-black">Cadastro</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase print:text-black">Situação Fin.</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase print:text-black">Acesso</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase print:text-black">Categoria</th>
                          <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase print:hidden">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white print:divide-gray-300">
                        {filteredAssociados.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-slate-400">Nenhum associado encontrado.</td></tr> : filteredAssociados.map((assoc) => {

                          const isTargetSuperUser = Number(assoc.id) === 10 || Number(assoc.is_superuser) === 1;

                          let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
                          let labelFin = "Desconhecido";

                          if (assoc.status_financeiro === 'adimplente') {
                              badgeColor = "bg-green-100 text-green-700 border-green-200";
                              labelFin = "Adimplente";
                          } else if (assoc.status_financeiro === 'bloqueado') {
                              badgeColor = "bg-red-100 text-red-700 border-red-200";
                              labelFin = "Bloqueado";
                          } else { 
                              badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-200";
                              labelFin = "Pendente";
                          }

                          return (
                            <tr key={assoc.id} className="hover:bg-blue-50/50 transition-colors group print:break-inside-avoid">
                              <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-bold text-slate-900 print:text-black">{assoc.nome_completo}</div>
                                  <div className="text-xs text-slate-500 print:text-gray-600">{assoc.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {/* Badges coloridas podem não imprimir cor de fundo dependendo da config do navegador, mas o texto sairá */}
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                  assoc.status_cadastro === 'aprovado' ? 'bg-green-100 text-green-700 border-green-200' :
                                  assoc.status_cadastro === 'rejeitado' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                }`}>{assoc.status_cadastro}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${badgeColor}`}>
                                    {labelFin}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                  {isTargetSuperUser ? <Badge className="bg-yellow-500 text-black border-none text-[10px] print:border print:border-black">SUPERUSER</Badge> : 
                                   assoc.role === 'admin' ? <Badge className="bg-slate-900 text-white border-none text-[10px] print:text-black print:border print:border-black">ADMIN</Badge> : 
                                   <span className="text-xs text-slate-400 font-medium print:text-black">Atleta</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium print:text-black">{assoc.categoria_atual || '-'}</td>

                              <td className="px-6 py-4 whitespace-nowrap text-center print:hidden">
                                <div className="flex justify-center gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full" title="Ver Detalhes"><Eye className="h-4 w-4" /></Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Dados do Associado</DialogTitle>
                                            <DialogDescription>Informações detalhadas do cadastro.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 text-sm mt-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><span className="text-slate-500 block text-xs uppercase">Nome</span><span className="font-bold text-slate-900">{assoc.nome_completo}</span></div>
                                                <div><span className="text-slate-500 block text-xs uppercase">ID</span><span className="font-mono text-slate-900">#{assoc.id}</span></div>
                                                <div><span className="text-slate-500 block text-xs uppercase">E-mail</span><span className="text-slate-900">{assoc.email}</span></div>
                                                <div><span className="text-slate-500 block text-xs uppercase">Nascimento</span><span className="text-slate-900">{assoc.data_nascimento ? new Date(assoc.data_nascimento).toLocaleDateString('pt-BR') : '-'}</span></div>
                                                <div><span className="text-slate-500 block text-xs uppercase">Data Cadastro</span><span className="text-slate-900">{new Date(assoc.data_cadastro).toLocaleDateString('pt-BR')}</span></div>
                                                <div><span className="text-slate-500 block text-xs uppercase">Categoria</span><span className="text-slate-900">{assoc.categoria_atual || 'Sem Categoria'}</span></div>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <h4 className="font-bold text-slate-700 mb-2 text-xs uppercase">Situação</h4>
                                                <div className="flex gap-2"><Badge variant="outline">{assoc.status_cadastro.toUpperCase()}</Badge><Badge variant="outline" className={badgeColor}>{labelFin.toUpperCase()}</Badge></div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                  </Dialog>
                                  {assoc.status_cadastro === 'pendente' && (
                                    <>
                                      <Button size="icon" className="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200 rounded-full" onClick={() => handleAtualizarAssociado(assoc.id, 'aprovado')} title="Aprovar Cadastro"><Check className="h-4 w-4" /></Button>
                                      <Button size="icon" className="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200 rounded-full" onClick={() => handleAtualizarAssociado(assoc.id, 'rejeitado')} title="Rejeitar Cadastro"><X className="h-4 w-4" /></Button>
                                    </>
                                  )}
                                  {isLoggedSuperUser && assoc.status_cadastro === 'aprovado' && !isTargetSuperUser && (
                                      <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                              {assoc.role === 'admin' ? 
                                                <Button size="icon" className="h-8 w-8 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-full shadow-sm" title="Remover acesso Admin"><ShieldOff className="h-4 w-4" /></Button> : 
                                                <Button size="icon" className="h-8 w-8 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full shadow-sm" title="Promover a Admin"><ShieldCheck className="h-4 w-4" /></Button>
                                              }
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                              <AlertDialogHeader><AlertDialogTitle>Alterar Permissões</AlertDialogTitle><AlertDialogDescription>Confirma a alteração para {assoc.nome_completo}?</AlertDialogDescription></AlertDialogHeader>
                                              <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleRoleChange(assoc.id, assoc.nome_completo, assoc.role === 'admin' ? 'rebaixar' : 'promover')}>Confirmar</AlertDialogAction></AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                  )}
                                  {!isTargetSuperUser && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 hover:text-red-600 rounded-full" title="Excluir Permanentemente"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Excluir</AlertDialogTitle><AlertDialogDescription>Apagar {assoc.nome_completo}?</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction className="bg-red-600" onClick={() => handleApagarAssociado(assoc.id, assoc.nome_completo)}>Apagar</AlertDialogAction></AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
              )}
            </div>
        </section>
      </main>

      {/* Ocultar Rodapé na Impressão */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
    </TooltipProvider>
  );
}
// linha 420 GestaoAssociadosPage.tsx