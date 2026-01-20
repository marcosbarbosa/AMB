// Nome: GestaoAssociadosPage.tsx
// Caminho: client/src/pages/admin/GestaoAssociadosPage.tsx
// Data: 2026-01-22
// Hora: 18:30
// Função: Painel de Gestão com Ação Direta de Edição
// Versão: v33.0 Direct Edit Action

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, Search, Eye, Edit, Save, 
  ChevronLeft, ChevronRight, Shield, ShieldOff, 
  FileUp, Printer, UserCog, CheckCircle2, AlertTriangle, User, PenSquare
} from 'lucide-react';
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Configuração de API
const API_BASE = 'https://www.ambamazonas.com.br/api';
const API_LISTAR = `${API_BASE}/listar_associados.php`;
const API_ADMIN = `${API_BASE}/admin`;

export default function GestaoAssociadosPage() {
  const { atleta, token, isLoading: isAuthLoading, isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Estados de Dados ---
  const [associados, setAssociados] = useState<any[]>([]);
  const [filteredAssociados, setFilteredAssociados] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Estados de Controle ---
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Paginação ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // --- Modal de Edição ---
  const [selectedAssoc, setSelectedAssoc] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // --- Permissões (Lógica Silenciosa) ---
  const isSuperUser = String(atleta?.is_superuser) === '1' || atleta?.email === 'mbelitecoach@gmail.com';

  // 1. Carregar Dados
  const fetchAssociados = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.post(API_LISTAR, { token });
      if (response.data.status === 'sucesso') {
        setAssociados(response.data.associados);
        setFilteredAssociados(response.data.associados);
      } else {
        toast({ title: "Erro ao carregar", description: response.data.mensagem, variant: "destructive" });
      }
    } catch (error: any) { 
        console.error("Erro Fetch:", error);
        toast({ title: "Falha de Conexão", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
    } finally { 
        setIsLoading(false); 
    }
  }, [token, toast]);

  // 2. Proteção de Acesso
  useEffect(() => {
    if (!isAuthLoading) {
        if (!isAuthenticated || (atleta?.role !== 'admin')) { 
            navigate('/'); 
        } else { 
            fetchAssociados(); 
        }
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, fetchAssociados]);

  // 3. Filtro Local
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = associados.filter(a => 
      (a.nome_completo && a.nome_completo.toLowerCase().includes(term)) || 
      (a.email && a.email.toLowerCase().includes(term)) || 
      (a.cpf && a.cpf.includes(term)) ||
      (a.status_cadastro && a.status_cadastro.toLowerCase().includes(term))
    );
    setFilteredAssociados(filtered);
    setCurrentPage(1); 
  }, [searchTerm, associados]);

  // 4. Manipulação do Modal (ATUALIZADA)
  // Agora aceita 'startEditing' para abrir direto no modo de edição
  const handleOpenModal = (assoc: any, startEditing: boolean = false) => {
    setSelectedAssoc(assoc);
    setEditForm({ ...assoc }); // Clona para o form
    setIsEditing(startEditing); // Define o modo inicial
  };

  const handleEditToggle = () => {
    if (isEditing) {
        // Se cancelar, reverte mudanças visualmente
        setEditForm({ ...selectedAssoc });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
        const payload = {
            token,
            id: editForm.id,
            ...editForm
        };

        const res = await axios.post(`${API_ADMIN}/admin_update_associado.php`, payload);

        if (res.data.status === 'sucesso') {
            toast({ 
                title: "Atualizado!", 
                description: res.data.mensagem, 
                className: "bg-green-600 text-white border-0" 
            });

            // Atualiza a lista local para não precisar recarregar tudo
            const updatedList = associados.map(a => a.id === editForm.id ? { ...a, ...editForm } : a);
            setAssociados(updatedList);

            // Atualiza o objeto original selecionado para refletir a edição
            setSelectedAssoc({ ...editForm });
            setIsEditing(false);
        } else {
            throw new Error(res.data.mensagem);
        }
    } catch (error: any) {
        toast({ 
            title: "Erro ao Salvar", 
            description: error.message || "Verifique os dados.", 
            variant: "destructive" 
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleToggleRole = async (targetUser: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSuperUser) return; // Segurança silenciosa

    const isPromoting = targetUser.role === 'atleta';
    if (!window.confirm(`Confirma ${isPromoting ? 'PROMOVER' : 'REBAIXAR'} ${targetUser.nome_completo}?`)) return;

    const endpoint = isPromoting ? 'admin_promover_associado.php' : 'admin_rebaixar_associado.php';

    try {
        const res = await axios.post(`${API_ADMIN}/${endpoint}`, { 
            token, 
            data: { id_atleta: targetUser.id } 
        });

        if (res.data.status === 'sucesso') {
            toast({ title: "Permissão Alterada", description: res.data.mensagem });
            fetchAssociados(); // Recarrega a lista
        } else {
            throw new Error(res.data.mensagem);
        }
    } catch (e: any) { 
        toast({ title: "Erro", description: e.message, variant: "destructive" }); 
    }
  };

  // Cálculos de Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssociados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssociados.length / itemsPerPage);

  // Loader de Tela Cheia
  if (isAuthLoading || isLoading) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <Loader2 className="animate-spin text-blue-600 h-12 w-12" />
            <p className="text-slate-500 font-medium animate-pulse">Carregando painel...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="print:hidden"><Navigation /></div>

      <main className="flex-grow pt-32 pb-16 px-4">
        <section className="max-w-7xl mx-auto space-y-6">

            {/* --- CABEÇALHO LIMPO --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        Gestão de Associados
                        <Badge className="bg-slate-100 text-slate-700 border-0 text-sm px-3">
                            {filteredAssociados.length}
                        </Badge>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Gerencie cadastros, status e permissões.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" disabled className="text-slate-400 cursor-not-allowed">
                        <Printer className="h-4 w-4 mr-2" /> Relatório
                    </Button>
                    <Button variant="ghost" size="sm" disabled className="text-slate-400 cursor-not-allowed">
                        <FileUp className="h-4 w-4 mr-2" /> Importar
                    </Button>
                </div>
            </div>

            {/* --- BARRA DE FILTROS --- */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Buscar por nome, email ou CPF..." 
                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Exibir:</span>
                    <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[80px] h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- TABELA PRINCIPAL --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Associado</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Documentos</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Cargo</th>
                          <th className="px-6 py-4 text-center font-bold text-slate-600 uppercase text-xs tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {currentItems.map((assoc) => {
                            const isAdmin = assoc.role === 'admin';

                            return (
                              <tr key={assoc.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 text-base">{assoc.nome_completo}</span>
                                        <span className="text-slate-500 text-xs mt-0.5">{assoc.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-slate-600">
                                        <span className="font-mono">{assoc.cpf || '-'}</span>
                                        <span className="text-xs text-slate-400">RG: {assoc.rg || '-'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-2 items-start">
                                        <Badge variant="outline" className="border-slate-200 text-slate-600 text-[10px] uppercase">
                                            CAD: {assoc.status_cadastro}
                                        </Badge>
                                        <Badge variant="outline" className={`border-0 text-[10px] uppercase ${assoc.status_financeiro === 'adimplente' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                                            FIN: {assoc.status_financeiro || 'PENDENTE'}
                                        </Badge>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${isAdmin ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {isAdmin ? 'ADMIN' : 'ATLETA'}
                                        </span>

                                        {/* Botão de Toggle Role (Apenas SuperUser) */}
                                        {isSuperUser && (
                                            <button 
                                                onClick={(e) => handleToggleRole(assoc, e)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded"
                                                title="Alterar nível de acesso"
                                            >
                                                {isAdmin ? <ShieldOff size={14} className="text-red-400" /> : <Shield size={14} className="text-slate-400" />}
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {/* BOTÃO OLHO (VISUALIZAR) */}
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            title="Ver Detalhes"
                                            onClick={() => handleOpenModal(assoc, false)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>

                                        {/* BOTÃO LÁPIS (EDITAR) */}
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                            title="Editar Cadastro"
                                            onClick={() => handleOpenModal(assoc, true)}
                                        >
                                            <PenSquare className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                              </tr>
                            );
                        })}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    <p>Nenhum associado encontrado para esta busca.</p>
                                </td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                </div>

                {/* Paginador */}
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                        Exibindo {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredAssociados.length)} de {filteredAssociados.length}
                    </span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

        </section>
      </main>

      {/* --- MODAL DE DETALHES & EDIÇÃO --- */}
      <Dialog open={!!selectedAssoc} onOpenChange={(open) => !open && setSelectedAssoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div>
                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {isEditing ? <Edit className="h-5 w-5 text-orange-500" /> : <Eye className="h-5 w-5 text-slate-500" />}
                        {isEditing ? 'Editar Ficha do Associado' : 'Ficha do Associado'}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                        ID Sistema: {editForm.id}
                    </DialogDescription>
                </div>
                <div className="flex gap-2">
                    <Button variant={isEditing ? "ghost" : "outline"} onClick={handleEditToggle}>
                        {isEditing ? 'Cancelar Edição' : 'Editar Dados'}
                    </Button>
                    {isEditing && (
                        <Button onClick={handleSave} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Alterações
                        </Button>
                    )}
                </div>
            </div>

            {/* Corpo Scrollável */}
            <ScrollArea className="flex-1 p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Bloco 1: Identificação */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <div className="bg-blue-100 p-1.5 rounded text-blue-600"><User className="h-4 w-4" /></div>
                            <h3 className="font-bold text-slate-800">Dados Pessoais</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input 
                                    value={editForm.nome_completo || ''} 
                                    disabled={!isEditing} 
                                    onChange={e => setEditForm({...editForm, nome_completo: e.target.value})}
                                    className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none font-medium"}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>CPF</Label>
                                    <Input 
                                        value={editForm.cpf || ''} 
                                        disabled={!isEditing} 
                                        onChange={e => setEditForm({...editForm, cpf: e.target.value})}
                                        className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none font-mono text-slate-600"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>RG</Label>
                                    <Input 
                                        value={editForm.rg || ''} 
                                        disabled={!isEditing} 
                                        onChange={e => setEditForm({...editForm, rg: e.target.value})}
                                        className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none text-slate-600"}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Data de Nascimento</Label>
                                <Input 
                                    type="date" 
                                    value={editForm.data_nascimento || ''} 
                                    disabled={!isEditing} 
                                    onChange={e => setEditForm({...editForm, data_nascimento: e.target.value})}
                                    className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none text-slate-600"}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Filiação</Label>
                                <Input 
                                    value={editForm.filiacao || ''} 
                                    disabled={!isEditing} 
                                    onChange={e => setEditForm({...editForm, filiacao: e.target.value})}
                                    className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none text-slate-600"}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nacionalidade</Label>
                                    <Input value={editForm.nacionalidade || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, nacionalidade: e.target.value})} className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none"} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Naturalidade</Label>
                                    <Input value={editForm.naturalidade || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, naturalidade: e.target.value})} className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none"} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bloco 2: Contato e Administrativo */}
                    <div className="space-y-8">

                        <div className="space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <div className="bg-green-100 p-1.5 rounded text-green-600"><AlertTriangle className="h-4 w-4" /></div>
                                <h3 className="font-bold text-slate-800">Contato & Endereço</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>E-mail (Login)</Label>
                                    <Input 
                                        value={editForm.email || ''} 
                                        disabled={!isEditing} 
                                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                                        className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none font-medium"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>WhatsApp / Telefone</Label>
                                    <Input 
                                        value={editForm.telefone_whatsapp || ''} 
                                        disabled={!isEditing} 
                                        onChange={e => setEditForm({...editForm, telefone_whatsapp: e.target.value})}
                                        className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Endereço Completo</Label>
                                    <Input 
                                        value={editForm.endereco || ''} 
                                        disabled={!isEditing} 
                                        onChange={e => setEditForm({...editForm, endereco: e.target.value})}
                                        className={isEditing ? "bg-white border-slate-300" : "bg-slate-50 border-transparent shadow-none"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Painel Administrativo */}
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                                <div className="bg-purple-100 p-1.5 rounded text-purple-600"><UserCog className="h-4 w-4" /></div>
                                <h3 className="font-bold text-slate-800">Status & Acesso</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Status Cadastro</Label>
                                    <Select 
                                        disabled={!isEditing} 
                                        value={editForm.status_cadastro} 
                                        onValueChange={v => setEditForm({...editForm, status_cadastro: v})}
                                    >
                                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pendente">Pendente</SelectItem>
                                            <SelectItem value="aprovado">Aprovado</SelectItem>
                                            <SelectItem value="rejeitado">Rejeitado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status Financeiro</Label>
                                    <Select 
                                        disabled={!isEditing} 
                                        value={editForm.status_financeiro} 
                                        onValueChange={v => setEditForm({...editForm, status_financeiro: v})}
                                    >
                                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pendente">Pendente</SelectItem>
                                            <SelectItem value="adimplente">Adimplente</SelectItem>
                                            <SelectItem value="bloqueado">Bloqueado</SelectItem>
                                            <SelectItem value="isento">Isento</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="text-slate-600">Cargo / Nível de Acesso</Label>
                                <Select 
                                    disabled={!isEditing || !isSuperUser} 
                                    value={editForm.role} 
                                    onValueChange={v => setEditForm({...editForm, role: v})}
                                >
                                    <SelectTrigger className={isSuperUser && isEditing ? "bg-white" : "bg-slate-200/50 text-slate-500 cursor-not-allowed"}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="atleta">Atleta (Padrão)</SelectItem>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                    </div>
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>

      <div className="print:hidden"><Footer /></div>
    </div>
  );
}
// linha 420 GestaoAssociadosPage.tsx