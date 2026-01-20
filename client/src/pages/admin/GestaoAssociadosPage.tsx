// Nome: GestaoAssociadosPage.tsx
// Caminho: client/src/pages/admin/GestaoAssociadosPage.tsx
// Versão: v40.0 Modularized

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Printer } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { AssociadosTable } from './components/AssociadosTable';
import { AssociadoModal } from './components/AssociadoModal';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function GestaoAssociadosPage() {
  const { atleta, token, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [associados, setAssociados] = useState<any[]>([]);
  const [filteredAssociados, setFilteredAssociados] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedAssoc, setSelectedAssoc] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isSuperUser = String(atleta?.is_superuser) === '1' || atleta?.email === 'mbelitecoach@gmail.com';

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

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredAssociados(associados.filter(a => 
      a.nome_completo?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term) || a.cpf?.includes(term)
    ));
  }, [searchTerm, associados]);

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/admin_update_associado.php`, { token, ...selectedAssoc });
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Dados atualizados." });
        setAssociados(prev => prev.map(a => a.id === selectedAssoc.id ? selectedAssoc : a));
        setIsEditing(false);
      } else throw new Error(res.data.mensagem);
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally { setIsProcessing(false); }
  };

  const handleToggleRole = async (target: any) => {
    if (!window.confirm("Alterar nível de acesso?")) return;
    try {
      const ep = target.role === 'atleta' ? 'admin_promover_associado.php' : 'admin_rebaixar_associado.php';
      await axios.post(`${API_BASE}/admin/${ep}`, { token, data: { id_atleta: target.id } });
      fetchAssociados();
      toast({ title: "Sucesso" });
    } catch (e) {}
  };

  if (isAuthLoading || isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-12 w-12" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="print:hidden"><Navigation /></div>
      <main className="flex-grow pt-32 pb-16 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center bg-white p-6 rounded-xl border mb-6">
          <h1 className="text-2xl font-black uppercase">Gestão ({filteredAssociados.length})</h1>
          <Button variant="ghost" disabled><Printer className="mr-2 h-4 w-4" /> Relatório</Button>
        </div>

        <div className="bg-white p-4 rounded-xl border mb-4 flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input className="pl-10" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <AssociadosTable 
            data={filteredAssociados} 
            isSuperUser={isSuperUser} 
            onView={(a) => { setSelectedAssoc({...a}); setIsEditing(false); }}
            onEdit={(a) => { setSelectedAssoc({...a}); setIsEditing(true); }}
            onToggleRole={handleToggleRole}
          />
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
// linha 100 GestaoAssociadosPage.tsx