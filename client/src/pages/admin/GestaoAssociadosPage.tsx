/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: GestaoAssociadosPage.tsx
 * CAMINHO: client/src/pages/admin/GestaoAssociadosPage.tsx
 * DATA: 16 de Janeiro de 2026
 * FUNÇÃO: Interface Administrativa com Migrador XLSX/CSV
 * VERSÃO: 19.1 Prime Final Fix
 * Alteração: Garantia de sincronia com o motor de migração v3.1.2.
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback, useRef } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { 
  Check, X, Loader2, ArrowLeft, Trash2, 
  ShieldCheck, ShieldOff, AlertTriangle, 
  Search, Eye, Printer, Banknote, UserPlus, FileSpreadsheet
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

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredAssociados(associados.filter(a => 
      a.nome_completo.toLowerCase().includes(term) || 
      a.email.toLowerCase().includes(term) || 
      (a.cpf && a.cpf.includes(term))
    ));
  }, [searchTerm, associados]);

  const handleMigrationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setIsMigrating(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    formData.append('tipo', migrationType);

    try {
      const res = await axios.post(`${API_ENDPOINT}/migrar_dados.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 'sucesso') {
        const { relatorio } = res.data;
        toast({
          title: "Migração Concluída!",
          description: `Processados: ${relatorio.total} | Novos: ${relatorio.novos} | Atualizados: ${relatorio.atualizados}`,
          className: "bg-green-600 text-white font-bold"
        });
        fetchAssociados();
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (error: any) {
      toast({
        title: "Falha na Migração",
        description: error.message || "Erro de processamento no servidor.",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerMigration = (type: 'associados' | 'financeiro') => {
    setMigrationType(type);
    fileInputRef.current?.click();
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-slate-50">
      <div className="print:hidden"><Navigation /></div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleMigrationUpload} 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
      />

      <main className="pt-40 pb-16 print:pt-4 print:bg-white">
        <section className="max-w-7xl mx-auto px-4">

            <div className="flex flex-col gap-6 mb-8 print:hidden">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Associados</h1>
                    <Badge variant="secondary" className="text-lg bg-blue-100 text-blue-700">{filteredAssociados.length}</Badge>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Buscar por nome, e-mail ou CPF..." 
                            className="pl-10" 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          disabled={isMigrating} 
                          onClick={() => triggerMigration('financeiro')} 
                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          {isMigrating && migrationType === 'financeiro' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Banknote className="h-4 w-4 mr-2" />}
                          Migrar Financeiro
                        </Button>

                        <Button 
                          variant="outline" 
                          disabled={isMigrating} 
                          onClick={() => triggerMigration('associados')} 
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                          {isMigrating && migrationType === 'associados' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                          Migrar Associados
                        </Button>

                        <Button variant="ghost" className="text-slate-500" onClick={() => window.print()}>
                          <Printer className="h-4 w-4 mr-2" /> Imprimir
                        </Button>
                    </div>
                </div>
            </div>

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
                        {filteredAssociados.length === 0 ? (
                          <tr><td colSpan={4} className="py-10 text-center text-slate-400">Nenhum registro encontrado.</td></tr>
                        ) : (
                          filteredAssociados.map((assoc) => {
                            const badgeFin = assoc.status_financeiro === 'adimplente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
                            return (
                              <tr key={assoc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-slate-900">{assoc.nome_completo}</div>
                                    <div className="text-xs text-slate-500">{assoc.cpf ? `CPF: ${assoc.cpf}` : assoc.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={`${badgeFin} border-none`}>{assoc.status_financeiro?.toUpperCase() || 'PENDENTE'}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="outline" className={assoc.role === 'admin' ? 'border-purple-600 text-purple-600' : ''}>{assoc.role.toUpperCase()}</Badge>
                                </td>
                                <td className="px-6 py-4 text-center print:hidden">
                                    <Dialog>
                                      <DialogTrigger asChild><Button size="icon" variant="ghost" className="text-blue-500 h-8 w-8"><Eye className="h-4 w-4" /></Button></DialogTrigger>
                                      <DialogContent>
                                          <DialogHeader><DialogTitle>Perfil do Associado</DialogTitle></DialogHeader>
                                          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                              <div><p className="text-xs text-slate-400 uppercase">E-mail</p><p className="font-bold">{assoc.email}</p></div>
                                              <div><p className="text-xs text-slate-400 uppercase">Documento</p><p className="font-bold">{assoc.cpf || '-'}</p></div>
                                              <div><p className="text-xs text-slate-400 uppercase">Cadastro</p><p className="font-bold">{new Date(assoc.data_cadastro).toLocaleDateString()}</p></div>
                                              <div><p className="text-xs text-slate-400 uppercase">Telefone</p><p className="font-bold">{assoc.telefone_whatsapp || '-'}</p></div>
                                          </div>
                                      </DialogContent>
                                    </Dialog>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                </div>
            </div>
        </section>
      </main>
      <div className="print:hidden"><Footer /></div>
    </div>
    </TooltipProvider>
  );
}
// linha 318 GestaoAssociadosPage.tsx