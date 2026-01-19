// Nome: GestaoAssociadosPage.tsx
// Caminho: client/src/pages/admin/GestaoAssociadosPage.tsx
// Data: 2026-01-19
// Hora: 06:00
// Função: Gestão de Associados com Auditoria de Permissão
// Versão: v27.0 Audit Mode

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { 
  Loader2, Search, Eye, Printer, Banknote, UserPlus, 
  ChevronLeft, ChevronRight, Shield, ShieldOff, Filter, AlertOctagon
} from 'lucide-react';
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

const API_ENDPOINT = 'https://www.ambamazonas.com.br/api';

export default function GestaoAssociadosPage() {
  const { atleta, token, isLoading: isAuthLoading, isAuthenticated } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [associados, setAssociados] = useState<any[]>([]);
  const [filteredAssociados, setFilteredAssociados] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationType, setMigrationType] = useState<'associados' | 'financeiro'>('associados');
  const [isProcessingRole, setIsProcessingRole] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // --- LÓGICA DE PERMISSÃO "TRIPLA CHECAGEM" ---
  const isId10 = String(atleta?.id) === '10';
  const isSuperFlag = String(atleta?.is_superuser) === '1' || atleta?.is_superuser === true;
  const isEmailElite = atleta?.email === 'mbelitecoach@gmail.com'; // Fallback final

  const isSuperUser = isId10 || isSuperFlag || isEmailElite;

  const fetchAssociados = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_ENDPOINT}/listar_associados.php`, { token });
      if (response.data.status === 'sucesso') {
        setAssociados(response.data.associados);
        setFilteredAssociados(response.data.associados);
      }
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  }, [token]);

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || atleta?.role !== 'admin')) { navigate('/'); } 
    else { fetchAssociados(); }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, fetchAssociados]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = associados.filter(a => 
      a.nome_completo.toLowerCase().includes(term) || a.email.toLowerCase().includes(term) || (a.cpf && a.cpf.includes(term))
    );
    setFilteredAssociados(filtered);
    setCurrentPage(1); 
  }, [searchTerm, associados]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssociados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssociados.length / itemsPerPage);

  const handleToggleRole = async (targetUser: any) => {
    if (!token) return;
    const isPromoting = targetUser.role === 'atleta';
    const endpoint = isPromoting ? 'admin_promover_associado.php' : 'admin_rebaixar_associado.php';

    if (!window.confirm(`ATENÇÃO: Deseja realmente mudar o nível de ${targetUser.nome_completo} para ${isPromoting ? 'ADMIN' : 'ATLETA'}?`)) return;

    setIsProcessingRole(targetUser.id);
    try {
        const res = await axios.post(`${API_ENDPOINT}/${endpoint}`, { token, data: { id_atleta: targetUser.id } });
        if (res.data.status === 'sucesso') {
            toast({ title: "Sucesso", description: res.data.mensagem, className: "bg-green-600 text-white" });
            const newRole = isPromoting ? 'admin' : 'atleta';
            const updateList = (list: any[]) => list.map(a => a.id === targetUser.id ? { ...a, role: newRole } : a);
            setAssociados(prev => updateList(prev));
            setFilteredAssociados(prev => updateList(prev));
        } else { toast({ title: "Erro", description: res.data.mensagem, variant: "destructive" }); }
    } catch (error: any) { toast({ title: "Erro API", description: error.message, variant: "destructive" }); } 
    finally { setIsProcessingRole(null); }
  };

  // Migração
  const handleMigrationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
  const triggerMigration = (type: any) => { setMigrationType(type); fileInputRef.current?.click(); };

  if (isAuthLoading || isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-10 w-10" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="print:hidden"><Navigation /></div>
      <input type="file" ref={fileInputRef} onChange={handleMigrationUpload} accept=".xlsx,.xls,.csv" className="hidden" />

      {/* --- DEBUG DE PERMISSÃO (Visível apenas se houver dúvida) --- */}
      <div className={`w-full text-center py-1 text-[10px] font-mono uppercase tracking-widest text-white print:hidden ${isSuperUser ? 'bg-purple-600' : 'bg-red-500'}`}>
          Status: {isSuperUser ? `SUPER USUÁRIO (ID: ${atleta?.id})` : `ADMIN RESTRITO (ID: ${atleta?.id}) - Sem permissão de troca de cargo`}
      </div>

      <main className="pt-32 pb-16 print:pt-4 print:bg-white">
        <section className="max-w-7xl mx-auto px-4">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 print:hidden">
                <h1 className="text-2xl font-black text-slate-900 uppercase">Gestão de Associados</h1>
                <Badge className="bg-blue-600 text-white">{filteredAssociados.length}</Badge>
            </div>

            {/* --- TOOLBAR UNIFICADA (Nativa) --- */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 print:hidden flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Buscar nome..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    {/* Paginação Nativa - Visibilidade Garantida */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                        <span className="text-xs font-bold text-slate-500 pl-2">Exibir:</span>
                        <select 
                            className="bg-transparent text-sm font-bold p-1 outline-none cursor-pointer"
                            value={itemsPerPage} 
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>

                {/* Navegação */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                    <span className="text-xs font-bold text-slate-400">
                        {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAssociados.length)} de {filteredAssociados.length}
                    </span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>

            {/* --- TABELA --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">Associado</th>
                          <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left font-bold text-slate-500 uppercase">Acesso</th>
                          <th className="px-6 py-3 text-center font-bold text-slate-500 uppercase">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentItems.map((assoc) => {
                            const isAdmin = assoc.role === 'admin';
                            return (
                              <tr key={assoc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3">
                                    <div className="font-bold text-slate-900">{assoc.nome_completo}</div>
                                    <div className="text-xs text-slate-500">{assoc.email}</div>
                                </td>
                                <td className="px-6 py-3"><Badge variant={assoc.status_financeiro === 'adimplente' ? 'default' : 'destructive'}>{assoc.status_financeiro || 'PENDENTE'}</Badge></td>

                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={isAdmin ? 'text-purple-600 bg-purple-50 border-purple-200' : 'text-slate-600'}>
                                            {assoc.role.toUpperCase()}
                                        </Badge>

                                        {/* BOTÕES DE AÇÃO - APENAS SUPER USUÁRIO */}
                                        {isSuperUser && (
                                            <div className="flex items-center">
                                                {isProcessingRole === assoc.id ? (
                                                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                                ) : (
                                                    <button 
                                                        onClick={() => handleToggleRole(assoc)}
                                                        className={`p-1.5 rounded-full transition-all hover:bg-slate-100 border border-transparent ${isAdmin ? 'hover:border-red-200' : 'hover:border-green-200'}`}
                                                        title={isAdmin ? "Clique para REMOVER acesso Admin" : "Clique para DAR acesso Admin"}
                                                    >
                                                        {isAdmin ? (
                                                            <ShieldOff className="h-5 w-5 text-red-400 hover:text-red-600" />
                                                        ) : (
                                                            <Shield className="h-5 w-5 text-slate-300 hover:text-green-500" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-3 text-center">
                                    <Dialog>
                                      <DialogTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Eye className="h-4 w-4" /></Button></DialogTrigger>
                                      <DialogContent><DialogHeader><DialogTitle>Detalhes</DialogTitle></DialogHeader>
                                          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                              <div><p className="text-xs text-slate-400">ID</p><p className="font-bold">{assoc.id}</p></div>
                                              <div><p className="text-xs text-slate-400">CPF</p><p className="font-bold">{assoc.cpf || '-'}</p></div>
                                          </div>
                                      </DialogContent>
                                    </Dialog>
                                </td>
                              </tr>
                            );
                        })}
                      </tbody>
                    </table>
                </div>
            </div>
        </section>
      </main>
      <div className="print:hidden"><Footer /></div>
    </div>
  );
}
// linha 340 GestaoAssociadosPage.tsx