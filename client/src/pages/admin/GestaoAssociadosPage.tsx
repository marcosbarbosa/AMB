// Nome: GestaoAssociadosPage.tsx
// Caminho: client/src/pages/admin/GestaoAssociadosPage.tsx
// Data: 2026-01-22
// Hora: 19:30
// Função: Gestão Completa (Visualizar, Editar, Listar)
// Versão: v35.0 Verified Heavy Duty

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Loader2, Search, Eye, Edit, Save, X, 
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

// URLs
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

  // --- Edição ---
  const [selectedAssoc, setSelectedAssoc] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  // --- Permissão Silenciosa ---
  const isSuperUser = String(atleta?.is_superuser) === '1' || atleta?.email === 'mbelitecoach@gmail.com';

  // 1. Fetch
  const fetchAssociados = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.post(API_LISTAR, { token });
      if (response.data.status === 'sucesso') {
        setAssociados(response.data.associados);
        setFilteredAssociados(response.data.associados);
      } else {
        toast({ title: "Erro", description: response.data.mensagem, variant: "destructive" });
      }
    } catch (error) { 
        console.error("Erro Fetch:", error);
    } finally { 
        setIsLoading(false); 
    }
  }, [token, toast]);

  useEffect(() => {
    if (!isAuthLoading) {
        if (!isAuthenticated || (atleta?.role !== 'admin')) { 
            navigate('/'); 
        } else { 
            fetchAssociados(); 
        }
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, fetchAssociados]);

  // 2. Filtros
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = associados.filter(a => 
      (a.nome_completo && a.nome_completo.toLowerCase().includes(term)) || 
      (a.email && a.email.toLowerCase().includes(term)) || 
      (a.cpf && a.cpf.includes(term))
    );
    setFilteredAssociados(filtered);
    setCurrentPage(1); 
  }, [searchTerm, associados]);

  // 3. Handlers Modal
  const handleOpenModal = (assoc: any, startEditing: boolean) => {
    setSelectedAssoc(assoc);
    setEditForm({ ...assoc }); // Copia dados para form
    setIsEditing(startEditing);
  };

  const handleEditToggle = () => {
    if (isEditing) {
        // Reverte se cancelar
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
                title: "Sucesso", 
                description: "Registro atualizado.", 
                className: "bg-green-600 text-white border-0" 
            });

            // Atualiza lista local
            const updatedList = associados.map(a => a.id === editForm.id ? { ...a, ...editForm } : a);
            setAssociados(updatedList);

            // Mantém modal aberto mas sai do modo edição
            setSelectedAssoc({ ...editForm });
            setIsEditing(false);
        } else {
            throw new Error(res.data.mensagem);
        }
    } catch (error: any) {
        toast({ title: "Erro ao Salvar", description: error.message || "Erro desconhecido.", variant: "destructive" });
    } finally {
        setIsProcessing(false);
    }
  };

  // Lógica de Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssociados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssociados.length / itemsPerPage);

  if (isAuthLoading || isLoading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 h-12 w-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="print:hidden"><Navigation /></div>

      <main className="flex-grow pt-32 pb-16 px-4">
        <section className="max-w-7xl mx-auto space-y-6">

            {/* Cabeçalho */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase">Gestão de Associados</h1>
                    <p className="text-sm text-slate-500 mt-1">Gerenciamento da base de dados.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" disabled className="text-slate-400">
                        <Printer className="h-4 w-4 mr-2" /> Relatório
                    </Button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Buscar por nome, email ou CPF..." 
                        className="pl-10" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(Number(v))}>
                    <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs">Associado</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs">Documentos</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs">Situação</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs">Acesso</th>
                          <th className="px-6 py-4 text-center font-bold text-slate-600 uppercase text-xs">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentItems.map((assoc) => (
                          <tr key={assoc.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{assoc.nome_completo}</div>
                                <div className="text-xs text-slate-500">{assoc.email}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                                {assoc.cpf || '-'}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1 items-start">
                                    <Badge variant="outline" className="text-[10px] uppercase border-slate-200 text-slate-500">
                                        {assoc.status_cadastro}
                                    </Badge>
                                    {/* Exibição exata do banco em minúsculo, mas com cor condicional */}
                                    <span className={`text-[10px] font-bold uppercase ${assoc.status_financeiro === 'adimplente' ? 'text-green-600' : 'text-red-500'}`}>
                                        {assoc.status_financeiro || 'pendente'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-mono">
                                {assoc.role}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 bg-blue-50" onClick={() => handleOpenModal(assoc, false)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 bg-orange-50" onClick={() => handleOpenModal(assoc, true)}>
                                        <PenSquare className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>

                {/* Rodapé Tabela */}
                <div className="bg-slate-50 px-6 py-3 border-t flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

        </section>
      </main>

      {/* --- MODAL UNIFICADO --- */}
      <Dialog open={!!selectedAssoc} onOpenChange={(open) => !open && setSelectedAssoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                <DialogTitle className="text-xl font-bold text-slate-800">
                    {isEditing ? 'Editando Registro' : 'Detalhes do Associado'}
                </DialogTitle>
                <div className="flex gap-2">
                    {isEditing ? (
                        <Button onClick={handleSave} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />} Salvar
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            <PenSquare className="mr-2 h-4 w-4" /> Editar
                        </Button>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1 p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    {/* COLUNA 1 */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2">
                            <User size={14} /> Dados Pessoais
                        </h4>

                        <div className="space-y-3">
                            <div><Label>Nome Completo</Label><Input value={editForm.nome_completo || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, nome_completo: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-2">
                                <div><Label>CPF</Label><Input value={editForm.cpf || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, cpf: e.target.value})} /></div>
                                <div><Label>RG</Label><Input value={editForm.rg || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, rg: e.target.value})} /></div>
                            </div>
                            <div><Label>Data Nascimento</Label><Input type="date" value={editForm.data_nascimento || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, data_nascimento: e.target.value})} /></div>
                            <div><Label>Filiação</Label><Input value={editForm.filiacao || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, filiacao: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-2">
                                <div><Label>Nacionalidade</Label><Input value={editForm.nacionalidade || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, nacionalidade: e.target.value})} /></div>
                                <div><Label>Naturalidade</Label><Input value={editForm.naturalidade || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, naturalidade: e.target.value})} /></div>
                            </div>
                        </div>
                    </div>

                    {/* COLUNA 2 */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2">
                            <AlertTriangle size={14} /> Contato & Sistema
                        </h4>

                        <div className="space-y-3">
                            <div><Label>Email (Login)</Label><Input value={editForm.email || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, email: e.target.value})} /></div>
                            <div><Label>Telefone / WhatsApp</Label><Input value={editForm.telefone_whatsapp || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, telefone_whatsapp: e.target.value})} /></div>
                            <div><Label>Endereço Completo</Label><Input value={editForm.endereco || ''} disabled={!isEditing} onChange={e => setEditForm({...editForm, endereco: e.target.value})} /></div>

                            <div className="bg-slate-50 p-4 rounded border border-slate-100 mt-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Status Cadastro</Label>
                                        <Select disabled={!isEditing} value={editForm.status_cadastro} onValueChange={v => setEditForm({...editForm, status_cadastro: v})}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pendente">pendente</SelectItem>
                                                <SelectItem value="aprovado">aprovado</SelectItem>
                                                <SelectItem value="rejeitado">rejeitado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Financeiro</Label>
                                        <Select disabled={!isEditing} value={editForm.status_financeiro} onValueChange={v => setEditForm({...editForm, status_financeiro: v})}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pendente">pendente</SelectItem>
                                                <SelectItem value="adimplente">adimplente</SelectItem>
                                                <SelectItem value="bloqueado">bloqueado</SelectItem>
                                                <SelectItem value="isento">isento</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <Label>Nível de Acesso (Role)</Label>
                                    <Select disabled={!isEditing || !isSuperUser} value={editForm.role} onValueChange={v => setEditForm({...editForm, role: v})}>
                                        <SelectTrigger className={isSuperUser && isEditing ? "bg-white" : "bg-slate-100 opacity-50"}><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="atleta">atleta</SelectItem>
                                            <SelectItem value="admin">admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
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
// linha 400 GestaoAssociadosPage.tsx