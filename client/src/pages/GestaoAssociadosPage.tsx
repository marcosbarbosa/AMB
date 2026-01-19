// Nome: GestaoAssociadosPage.tsx
// Caminho: client/src/pages/admin/GestaoAssociadosPage.tsx
// Data: 2026-01-18
// Hora: 22:55
// Função: Gestão de Associados com Paginação e Controle de Nível (Super User)
// Versão: 20.0 Pagination + Role Manager
// Alteração: Implementação de paginação responsiva e botões de promover/rebaixar admin.

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, Search, Eye, Printer, Banknote, UserPlus, 
  ChevronLeft, ChevronRight, Shield, ShieldOff, ShieldAlert
} from 'lucide-react';
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge';

const API_ENDPOINT = 'https://www.ambamazonas.com.br/api';

export default function GestaoAssociadosPage() {
  const { atleta, token, isLoading: isAuthLoading, isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de Dados
  const [associados, setAssociados] = useState<any[]>([]);
  const [filteredAssociados, setFilteredAssociados] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de UI/Controle
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationType, setMigrationType] = useState<'associados' | 'financeiro'>('associados');
  const [isProcessingRole, setIsProcessingRole] = useState<number | null>(null);

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Detecta Mobile para sugerir paginação menor
  useEffect(() => {
    if (window.innerWidth < 768) {
        setItemsPerPage(10);
    }
  }, []);

  const fetchAssociados = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_ENDPOINT}/listar_associados.php`, { token });
      if (response.data.status === 'sucesso') {
        setAssociados(response.data.associados);
        setFilteredAssociados(response.data.associados);
      }
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || atleta?.role !== 'admin')) {
      navigate('/');
    } else {
      fetchAssociados();
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, fetchAssociados]);

  // Filtro e Reset de Página
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = associados.filter(a => 
      a.nome_completo.toLowerCase().includes(term) || 
      a.email.toLowerCase().includes(term) || 
      (a.cpf && a.cpf.includes(term))
    );
    setFilteredAssociados(filtered);
    setCurrentPage(1); // Volta para a primeira página ao filtrar
  }, [searchTerm, associados]);

  // Lógica de Paginação (Cálculo)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssociados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssociados.length / itemsPerPage);

  // Lógica de Troca de Cargo (Promover/Rebaixar)
  const handleToggleRole = async (targetUser: any) => {
    if (!token) return;

    const isPromoting = targetUser.role === 'atleta';
    const endpoint = isPromoting ? 'admin_promover_associado.php' : 'admin_rebaixar_associado.php';
    const actionVerb = isPromoting ? "promover" : "rebaixar";

    if (!window.confirm(`Tem certeza que deseja ${actionVerb} ${targetUser.nome_completo}?`)) return;

    setIsProcessingRole(targetUser.id);

    try {
        const res = await axios.post(`${API_ENDPOINT}/${endpoint}`, {
            token,
            data: { id_atleta: targetUser.id }
        });

        if (res.data.status === 'sucesso') {
            toast({
                title: "Sucesso",
                description: res.data.mensagem,
                className: "bg-green-600 text-white"
            });
            // Atualiza localmente para evitar re-fetch
            const newRole = isPromoting ? 'admin' : 'atleta';
            setAssociados(prev => prev.map(a => a.id === targetUser.id ? { ...a, role: newRole } : a));
        } else {
            toast({ title: "Erro", description: res.data.mensagem, variant: "destructive" });
        }
    } catch (error: any) {
        toast({ title: "Erro na Requisição", description: error.message, variant: "destructive" });
    } finally {
        setIsProcessingRole(null);
    }
  };

  // Funções de Migração (Mantidas da versão anterior)
  const handleMigrationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;
    setIsMigrating(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    formData.append('tipo', migrationType);
    try {
      const res = await axios.post(`${API_ENDPOINT}/migrar_dados.php`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.status === 'sucesso') {
        const { relatorio } = res.data;
        toast({ title: "Migração Concluída!", description: `Processados: ${relatorio.total} | Novos: ${relatorio.novos}`, className: "bg-green-600 text-white font-bold" });
        fetchAssociados();
      } else { throw new Error(res.data.mensagem); }
    } catch (error: any) {
      toast({ title: "Falha na Migração", description: error.message, variant: "destructive" });
    } finally { setIsMigrating(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const triggerMigration = (type: 'associados' | 'financeiro') => { setMigrationType(type); fileInputRef.current?.click(); };

  if (isAuthLoading || isLoading) {
    return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600 h-10 w-10" /></div>;
  }

  // Verifica permissão de Super User (Elite)
  // Nota: is_superuser vem do banco como 1 ou 0 (number) ou boolean dependendo do PHP/Driver.
  const isSuperUser = atleta?.is_superuser == 1 || atleta?.is_superuser === true;

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-slate-50">
      <div className="print:hidden"><Navigation /></div>

      <input type="file" ref={fileInputRef} onChange={handleMigrationUpload} accept=".xlsx, .xls, .csv" className="hidden" />

      <main className="pt-40 pb-16 print:pt-4 print:bg-white">
        <section className="max-w-7xl mx-auto px-4">

            {/* Cabeçalho e Ações */}
            <div className="flex flex-col gap-6 mb-8 print:hidden">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Associados</h1>
                    <Badge variant="secondary" className="text-lg bg-blue-100 text-blue-700">{filteredAssociados.length}</Badge>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Buscar por nome, e-mail ou CPF..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="outline" disabled={isMigrating} onClick={() => triggerMigration('financeiro')} className="border-orange-200 text-orange-700 hover:bg-orange-50">
                          {isMigrating && migrationType === 'financeiro' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Banknote className="h-4 w-4 mr-2" />} Migrar Financeiro
                        </Button>
                        <Button variant="outline" disabled={isMigrating} onClick={() => triggerMigration('associados')} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                          {isMigrating && migrationType === 'associados' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />} Migrar Associados
                        </Button>
                        <Button variant="ghost" className="text-slate-500" onClick={() => window.print()}>
                          <Printer className="h-4 w-4 mr-2" /> Imprimir
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabela de Dados */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden print:shadow-none print:border-black">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                      <thead className="bg-slate-50 print:bg-white print:border-b-2 print:border-black">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase print:text-black">Associado</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase print:text-black">Financeiro</th>
                          <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase print:text-black">Acesso</th>
                          <th className="px-6 py-4 text-center text-xs font-black text-slate-500 uppercase print:hidden">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {currentItems.length === 0 ? (
                          <tr><td colSpan={4} className="py-10 text-center text-slate-400">Nenhum registro encontrado.</td></tr>
                        ) : (
                          currentItems.map((assoc) => {
                            const badgeFin = assoc.status_financeiro === 'adimplente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
                            const isAdmin = assoc.role === 'admin';

                            return (
                              <tr key={assoc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-slate-900">{assoc.nome_completo}</div>
                                    <div className="text-xs text-slate-500">{assoc.cpf ? `CPF: ${assoc.cpf}` : assoc.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`${badgeFin} border-none`}>{assoc.status_financeiro?.toUpperCase() || 'PENDENTE'}</Badge>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Badge variant="outline" className={isAdmin ? 'border-purple-600 text-purple-600' : ''}>{assoc.role.toUpperCase()}</Badge>

                                    {/* Botão de Super Usuário para Troca de Cargo */}
                                    {isSuperUser && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-6 w-6 ml-2"
                                                    onClick={() => handleToggleRole(assoc)}
                                                    disabled={isProcessingRole === assoc.id}
                                                >
                                                    {isProcessingRole === assoc.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                                    ) : isAdmin ? (
                                                        <ShieldOff className="h-4 w-4 text-red-400 hover:text-red-600" />
                                                    ) : (
                                                        <Shield className="h-4 w-4 text-green-400 hover:text-green-600" />
                                                    )}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{isAdmin ? "Rebaixar para Atleta" : "Promover a Admin"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center print:hidden">
                                    <div className="flex justify-center gap-1">
                                        <Dialog>
                                        <DialogTrigger asChild><Button size="icon" variant="ghost" className="text-blue-500 h-8 w-8"><Eye className="h-4 w-4" /></Button></DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>Perfil do Associado</DialogTitle></DialogHeader>
                                            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                                <div><p className="text-xs text-slate-400 uppercase">E-mail</p><p className="font-bold break-all">{assoc.email}</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase">Documento</p><p className="font-bold">{assoc.cpf || '-'}</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase">Cadastro</p><p className="font-bold">{new Date(assoc.data_cadastro).toLocaleDateString()}</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase">Telefone</p><p className="font-bold">{assoc.telefone_whatsapp || '-'}</p></div>
                                                <div><p className="text-xs text-slate-400 uppercase">Categoria</p><p className="font-bold">{assoc.categoria_atual || '-'}</p></div>
                                            </div>
                                        </DialogContent>
                                        </Dialog>
                                    </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                </div>

                {/* --- COMPONENTE DE PAGINAÇÃO --- */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-bold uppercase">Linhas por página:</span>
                        <Select 
                            value={String(itemsPerPage)} 
                            onValueChange={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); }}
                        >
                            <SelectTrigger className="w-[70px] h-8 text-xs bg-white">
                                <SelectValue placeholder="20" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 font-medium">
                            Página <strong>{currentPage}</strong> de <strong>{totalPages || 1}</strong>
                        </span>
                        <div className="flex gap-1">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
      </main>
      <div className="print:hidden"><Footer /></div>
    </div>
    </TooltipProvider>
  );
}
// linha 285 GestaoAssociadosPage.tsx