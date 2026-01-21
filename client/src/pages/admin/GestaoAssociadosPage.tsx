// Nome: GestaoAssociadosPage.tsx
// Caminho: client/src/pages/admin/GestaoAssociadosPage.tsx
// Data: 2026-01-20
// Hora: 22:30 (America/Sao_Paulo)
// Função: Painel Admin com Importação CSV Ativa
// Versão: v44.0 Import Enabled
// Alteração: Ativação do botão Importar e integração com migracao_clientes.php

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Loader2, Search, Printer, FileSpreadsheet, Database, 
  ChevronLeft, ChevronRight, UploadCloud
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { AssociadosTable } from './components/AssociadosTable';
import { AssociadoModal } from './components/AssociadoModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function GestaoAssociadosPage() {
  const { atleta, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Referência para input de arquivo (Importação)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Estados de Dados ---
  const [associados, setAssociados] = useState<any[]>([]);
  const [filteredAssociados, setFilteredAssociados] = useState<any[]>([]);

  // --- Estados de Controle UI ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false); // Novo estado para loader de importação

  // --- Paginação ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // --- Modal State ---
  const [selectedAssoc, setSelectedAssoc] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Permissão
  const isSuperUser = String(atleta?.is_superuser) === '1';

  // 1. Carregamento
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

  // 2. Filtro Global Inteligente
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = associados.filter(a => 
      (a.nome_completo?.toLowerCase() || '').includes(term) || 
      (a.email?.toLowerCase() || '').includes(term) || 
      (a.cpf || '').includes(term) ||
      (a.status_cadastro?.toLowerCase() || '').includes(term) ||
      (a.status_financeiro?.toLowerCase() || '').includes(term)
    );
    setFilteredAssociados(filtered);
    setCurrentPage(1); 
  }, [searchTerm, associados]);

  // 3. Ações de Edição
  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/admin_update_associado.php`, { token, ...selectedAssoc });
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Dados atualizados com sucesso.", className: "bg-green-600 text-white" });

        // Atualiza lista localmente para evitar refresh total
        const updatedList = associados.map(a => a.id === selectedAssoc.id ? selectedAssoc : a);
        setAssociados(updatedList);
        setIsEditing(false);
      } else throw new Error(res.data.mensagem);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  // 4. Lógica de Importação CSV (NOVO)
  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
          toast({ title: "Formato Inválido", description: "Por favor, selecione um arquivo .csv", variant: "destructive" });
          return;
      }

      setIsImporting(true);
      const formData = new FormData();
      formData.append('csv_file', file);
      // Opcional: Enviar token se o PHP validar Header Authorization
      // formData.append('token', token!); 

      try {
          // Aumentar timeout pois migração pode demorar
          const res = await axios.post(`${API_BASE}/admin/migracao_clientes.php`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 60000 // 60 segundos
          });

          if (res.data.status === 'sucesso') {
              toast({ 
                  title: "Importação Concluída", 
                  description: res.data.mensagem, 
                  className: "bg-green-600 text-white" 
              });
              fetchAssociados(); // Recarrega a lista para mostrar os novos
          } else {
              throw new Error(res.data.mensagem || "Erro desconhecido na importação.");
          }
      } catch (error: any) {
          toast({ 
              title: "Falha na Importação", 
              description: error.response?.data?.mensagem || error.message, 
              variant: "destructive" 
          });
      } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = ''; // Limpa o input para permitir reenvio
      }
  };

  const handlePrint = () => window.print();

  // Paginação Lógica
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssociados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssociados.length / itemsPerPage);

  if (isAuthLoading || isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-12 w-12" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="print:hidden"><Navigation /></div>

      <main className="flex-grow pt-32 pb-16 px-4 max-w-7xl mx-auto w-full">

        {/* INPUT DE ARQUIVO INVISÍVEL */}
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv" 
            onChange={handleFileChange} 
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 print:hidden">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3">
                Gestão de Associados
                <Badge className="bg-slate-100 text-slate-700 border-0 text-sm px-3">
                    {filteredAssociados.length} Registros
                </Badge>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Gerenciamento completo da base de dados.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} title="Imprimir Relatório">
                <Printer className="h-4 w-4 mr-2" /> Relatório
            </Button>

            {/* BOTÃO DE IMPORTAÇÃO ATIVADO */}
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleImportClick} 
                disabled={isImporting}
                title="Importar CSV de Clientes"
                className={isImporting ? "opacity-70 cursor-wait" : "hover:bg-blue-50 hover:text-blue-600"}
            >
                {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 mr-2" />}
                {isImporting ? 'Importando...' : 'Importar CSV'}
            </Button>

            <Button variant="outline" size="sm" disabled title="Módulo Financeiro (Em breve)">
                <Database className="h-4 w-4 mr-2" /> Migrar Financeiro
            </Button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex flex-col md:flex-row gap-4 justify-between items-center print:hidden">
          <div className="relative w-full md:max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
                className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all" 
                placeholder="Buscar por nome, email, cpf, status..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Itens:</span>
            <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                <SelectTrigger className="w-[80px] h-10 bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:border-0 print:shadow-none">
          <AssociadosTable 
            data={currentItems} 
            isSuperUser={isSuperUser} 
            onView={(a) => { setSelectedAssoc({...a}); setIsEditing(false); }}
            onEdit={(a) => { setSelectedAssoc({...a}); setIsEditing(true); }}
            onToggleRole={() => {}} // Handler simplificado
          />

          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between print:hidden">
            <span className="text-xs text-slate-500">
                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </span>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                    Próximo <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
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
        toggleEdit={() => { 
            if(isEditing) setSelectedAssoc({...associados.find(a=>a.id===selectedAssoc.id)}); 
            setIsEditing(!isEditing); 
        }} 
        onSave={handleSave} 
        isProcessing={isProcessing} 
        isSuperUser={isSuperUser} 
      />
      <div className="print:hidden"><Footer /></div>
    </div>
  );
}
// linha 230 GestaoAssociadosPage.tsx