// Nome: GestaoAssociadosPage.tsx
// Caminho: client/src/pages/admin/GestaoAssociadosPage.tsx
// Data: 2026-01-20
// Hora: 23:30 (America/Sao_Paulo)
// Função: Painel Admin com Importação Unificada e Feedback Claro
// Versão: v48.0 Crystal Clear Feedback
// Alteração: Melhoria nas mensagens de sucesso/erro da importação.

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader2, Search, Printer, FileSpreadsheet, 
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Info
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { AssociadosTable } from './components/AssociadosTable';
import { AssociadoModal } from './components/AssociadoModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function GestaoAssociadosPage() {
  const { atleta, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Estados ---
  const [associados, setAssociados] = useState<any[]>([]);
  const [filteredAssociados, setFilteredAssociados] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  // --- Paginação ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // --- Modal ---
  const [selectedAssoc, setSelectedAssoc] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isSuperUser = String(atleta?.is_superuser) === '1';

  // 1. Fetch Data
  const fetchAssociados = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/listar_associados.php`, { token });
      if (res.data.status === 'sucesso') {
        setAssociados(res.data.associados);
        setFilteredAssociados(res.data.associados);
      }
    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  }, [token]);

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || atleta?.role !== 'admin')) navigate('/');
    else fetchAssociados();
  }, [isAuthenticated, isAuthLoading, fetchAssociados]);

  // 2. Filtro
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = associados.filter(a => 
      (a.nome_completo?.toLowerCase() || '').includes(term) || 
      (a.email?.toLowerCase() || '').includes(term) || 
      (a.cpf || '').includes(term) ||
      (a.status_financeiro?.toLowerCase() || '').includes(term)
    );
    setFilteredAssociados(filtered);
    setCurrentPage(1); 
  }, [searchTerm, associados]);

  // 3. Edição Manual
  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/admin_update_associado.php`, { token, ...selectedAssoc });
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Atualizado.", className: "bg-green-600 text-white" });
        const updatedList = associados.map(a => a.id === selectedAssoc.id ? selectedAssoc : a);
        setAssociados(updatedList);
        setIsEditing(false);
      } else throw new Error(res.data.mensagem);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  // 4. Importação Unificada
  const handleImportClick = () => {
      setImportResult(null);
      fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      const formData = new FormData();
      formData.append('csv_file', file);

      try {
          const res = await axios.post(`${API_BASE}/admin/migracao_clientes.php`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 180000 
          });

          if (res.data.status === 'sucesso') {
              setImportResult({ type: 'success', message: res.data.mensagem });
              toast({ title: "Importação Finalizada", description: "Dados sincronizados com sucesso.", className: "bg-green-600 text-white" });
              fetchAssociados(); // Reload Critical
          } else {
              setImportResult({ type: 'error', message: res.data.mensagem || "Erro no processamento." });
          }
      } catch (error: any) {
          const msg = error.response?.data?.mensagem || error.message;
          setImportResult({ type: 'error', message: "Falha técnica: " + msg });
      } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = ''; 
      }
  };

  const handlePrint = () => window.print();

  // Render
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssociados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssociados.length / itemsPerPage);

  if (isAuthLoading || isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-12 w-12"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="print:hidden"><Navigation /></div>

      <main className="flex-grow pt-32 pb-16 px-4 max-w-7xl mx-auto w-full">
        <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 print:hidden">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3">
                Gestão de Associados
                <Badge className="bg-slate-100 text-slate-700 border-0 text-sm px-3">{filteredAssociados.length}</Badge>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Cadastro e Financeiro Unificados.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}> <Printer className="h-4 w-4 mr-2"/> Relatório </Button>

            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleImportClick} 
                disabled={isImporting}
                className={isImporting ? "opacity-70 cursor-wait" : "hover:bg-blue-50 hover:text-blue-600"}
            >
                {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 mr-2" />}
                {isImporting ? 'Processando...' : 'Importar CSV Unificado'}
            </Button>
          </div>
        </div>

        {importResult && (
            <Alert className={`mb-6 ${importResult.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {importResult.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{importResult.type === 'success' ? 'Sucesso' : 'Atenção'}</AlertTitle>
                <AlertDescription>{importResult.message}</AlertDescription>
            </Alert>
        )}

        {/* Busca e Filtros */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-10 h-10 bg-slate-50 border-slate-200" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-[80px] h-10 bg-slate-50"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-0 print:shadow-none">
          <AssociadosTable 
            data={currentItems} 
            isSuperUser={isSuperUser} 
            onView={(a) => { setSelectedAssoc({...a}); setIsEditing(false); }}
            onEdit={(a) => { setSelectedAssoc({...a}); setIsEditing(true); }}
            onToggleRole={() => {}} 
          />
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between print:hidden">
            <span className="text-xs text-slate-500">Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </main>

      <AssociadoModal 
        isOpen={!!selectedAssoc} 
        onClose={() => setSelectedAssoc(null)} 
        data={selectedAssoc} 
        setData={setSelectedAssoc} 
        isEditing={isEditing} 
        toggleEdit={() => { if(isEditing) setSelectedAssoc({...associados.find(a=>a.id===selectedAssoc.id)}); setIsEditing(!isEditing); }} 
        onSave={handleSave} 
        isProcessing={isProcessing} 
        isSuperUser={isSuperUser} 
      />
      <div className="print:hidden"><Footer /></div>
    </div>
  );
}
// linha 250 GestaoAssociadosPage.tsx