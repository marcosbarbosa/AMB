/*
 * ==========================================================
 * MÓDULO: GestaoParceirosPage.tsx (ADMIN)
 * Versão: 6.0 (Correção Definitiva: Categorias Dinâmicas no CRUD)
 * ==========================================================
 * ATUALIZAÇÕES:
 * 1. CATEGORIAS: Agora carrega do banco e usa <Select> na edição.
 * 2. IMAGENS: Lógica de URL unificada com o site público.
 * ==========================================================
 */
import { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';

// Componentes UI
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Edit, Trash2, Eye, MapPin, Globe, Phone, Search } from 'lucide-react';

// URLs da API
const API_LISTAR = 'https://www.ambamazonas.com.br/api/admin_listar_parceiros.php';
const API_EDITAR = 'https://www.ambamazonas.com.br/api/admin_editar_parceiro.php';
const API_EXCLUIR = 'https://www.ambamazonas.com.br/api/excluir_parceiro.php';
const API_STATUS = 'https://www.ambamazonas.com.br/api/admin_atualizar_parceiro.php';
const API_CATEGORIAS = 'https://www.ambamazonas.com.br/api/get_categorias_parceiros.php'; // NOVA API
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

interface Parceiro {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  status: 'ativo' | 'inativo' | 'pendente';
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  url_logo: string | null;
  telefone_contato: string | null;
  link_site: string | null;
  endereco: string | null;
  data_cadastro: string;
}

interface Categoria {
  id: number;
  nome: string;
}

export default function GestaoParceirosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  // Estados de Dados
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [categoriasDB, setCategoriasDB] = useState<Categoria[]>([]); // Estado para categorias
  const [loadingData, setLoadingData] = useState(true);
  const [busca, setBusca] = useState('');

  // Estados dos Modais
  const [viewPartner, setViewPartner] = useState<Parceiro | null>(null);
  const [editPartner, setEditPartner] = useState<Parceiro | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Estados de Edição
  const [isSaving, setIsSaving] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. CARREGAMENTO INICIAL ---
  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || atleta?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDados();
  }, [isAuthenticated, atleta, token, isAuthLoading]);

  const fetchDados = async () => {
    if(!token) return;
    setLoadingData(true);
    try {
      const ts = new Date().getTime();

      // Carrega Parceiros e Categorias em Paralelo
      const [resParceiros, resCats] = await Promise.all([
         axios.post(API_LISTAR, { token }),
         axios.get(`${API_CATEGORIAS}?t=${ts}`)
      ]);

      if (resParceiros.data.status === 'sucesso') {
        setParceiros(resParceiros.data.parceiros);
      }

      if (resCats.data.status === 'sucesso') {
        setCategoriasDB(resCats.data.dados || []);
      }

    } catch (error) {
      console.error("Erro listagem:", error);
      toast({ title: "Erro", description: "Falha ao carregar dados.", variant: "destructive" });
    } finally {
      setLoadingData(false);
    }
  };

  // --- HELPERS ---
  const getImageUrl = (url: string | null) => {
    if (!url || url === 'NULL' || url === '' || url === 'undefined') return null;
    let clean = url.replace(/['"]/g, '').trim();
    if (clean.startsWith('http')) return clean;
    if (clean.startsWith('/')) return `${DOMAIN_URL}${clean}`;
    return `${DOMAIN_URL}/uploads/logos_parceiros/${clean}`;
  };

  // --- 2. EDIÇÃO ---
  const handleOpenEdit = (p: Parceiro) => {
    setEditPartner({ ...p });
    if (p.url_logo) {
       setPreviewLogo(getImageUrl(p.url_logo));
    } else {
       setPreviewLogo(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const saveEdit = async () => {
    if (!editPartner) return;
    setIsSaving(true);

    const formData = new FormData();
    // Preenche todos os campos
    formData.append('id', editPartner.id.toString());
    formData.append('nome_parceiro', editPartner.nome_parceiro);
    formData.append('categoria', editPartner.categoria); // Agora vem do Select
    formData.append('descricao_beneficio', editPartner.descricao_beneficio || '');
    formData.append('telefone_contato', editPartner.telefone_contato || '');
    formData.append('link_site', editPartner.link_site || '');
    formData.append('endereco', editPartner.endereco || '');
    formData.append('partner_tier', editPartner.partner_tier);
    formData.append('status', editPartner.status);

    if (fileInputRef.current?.files?.[0]) {
      formData.append('logo', fileInputRef.current.files[0]);
    }

    try {
      const res = await axios.post(API_EDITAR, formData);
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Parceiro atualizado!" });
        setEditPartner(null);
        fetchDados(); // Recarrega para ver mudanças
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. ATUALIZAÇÃO RÁPIDA (Tabela) ---
  const handleQuickUpdate = async (id: number, field: 'novo_status' | 'novo_tier', value: string) => {
    try {
        const payload = { token, data: { id_parceiro: id, [field]: value } };
        await axios.post(API_STATUS, payload);

        setParceiros(prev => prev.map(p => {
            if (p.id === id) {
                return field === 'novo_status' ? { ...p, status: value as any } : { ...p, partner_tier: value as any };
            }
            return p;
        }));
        toast({ title: "Atualizado", description: "Alteração salva." });
    } catch (error) {
        toast({ title: "Erro", description: "Falha na atualização.", variant: "destructive" });
    }
  };

  // --- 4. EXCLUSÃO ---
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.post(API_EXCLUIR, JSON.stringify({ id: deleteId }));
      if (res.data.status === 'sucesso') {
        toast({ title: "Removido", description: "Parceiro excluído." });
        setParceiros(prev => prev.filter(p => p.id !== deleteId));
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  // Filtro de Busca
  const filtered = parceiros.filter(p => 
    p.nome_parceiro.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  if (isAuthLoading || loadingData) {
     return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2"/> Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <Link to="/admin/painel" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestão de Parceiros</h1>
          </div>
          <div className="relative w-full md:w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Buscar empresa..." 
               className="pl-9 bg-white"
               value={busca}
               onChange={(e) => setBusca(e.target.value)}
             />
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nível</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden border">
                           {p.url_logo ? (
                             <img src={getImageUrl(p.url_logo) || ''} alt="" className="h-full w-full object-cover" />
                           ) : (
                             <span className="font-bold text-slate-400">{p.nome_parceiro.charAt(0)}</span>
                           )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{p.nome_parceiro}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <Badge variant="outline" className="font-normal capitalize">{p.categoria}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <Select 
                         value={p.status} 
                         onValueChange={(val) => handleQuickUpdate(p.id, 'novo_status', val)}
                       >
                         <SelectTrigger className={`w-[110px] h-8 text-xs font-medium ${p.status === 'ativo' ? 'text-green-700 bg-green-50 border-green-200' : 'text-slate-700 bg-slate-50'}`}>
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="ativo">Ativo</SelectItem>
                           <SelectItem value="pendente">Pendente</SelectItem>
                           <SelectItem value="inativo">Inativo</SelectItem>
                         </SelectContent>
                       </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <Select 
                         value={p.partner_tier} 
                         onValueChange={(val) => handleQuickUpdate(p.id, 'novo_tier', val)}
                       >
                         <SelectTrigger className="w-[110px] h-8 text-xs">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="ouro">Ouro 🏆</SelectItem>
                           <SelectItem value="prata">Prata 🛡️</SelectItem>
                           <SelectItem value="bronze">Bronze 🥉</SelectItem>
                           <SelectItem value="pendente">--</SelectItem>
                         </SelectContent>
                       </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewPartner(p)} title="Ver Detalhes">
                             <Eye className="h-4 w-4 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(p)} title="Editar">
                             <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => setDeleteId(p.id)} title="Excluir">
                             <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL EDITAR (COM SELECT DE CATEGORIAS) --- */}
        <Dialog open={!!editPartner} onOpenChange={(open) => !open && setEditPartner(null)}>
           <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                 <DialogTitle>Editar Parceiro</DialogTitle>
                 <DialogDescription>Altere os dados cadastrais da empresa.</DialogDescription>
              </DialogHeader>
              {editPartner && (
                 <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Nome da Empresa</Label>
                          <Input value={editPartner.nome_parceiro} onChange={(e) => setEditPartner({...editPartner, nome_parceiro: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <Label>Categoria</Label>
                          {/* AQUI ESTÁ A MUDANÇA: SELECT DINÂMICO */}
                          <Select 
                             value={editPartner.categoria} 
                             onValueChange={(val) => setEditPartner({...editPartner, categoria: val})}
                          >
                             <SelectTrigger>
                               <SelectValue placeholder="Selecione..." />
                             </SelectTrigger>
                             <SelectContent>
                               {categoriasDB.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.nome}>{cat.nome}</SelectItem>
                               ))}
                             </SelectContent>
                          </Select>
                       </div>
                    </div>

                    {/* Restante dos campos (mantido igual) */}
                    <div className="space-y-2">
                       <Label>Logo da Empresa</Label>
                       <div className="flex items-center gap-4 border p-3 rounded bg-slate-50">
                          {previewLogo && <img src={previewLogo} className="h-12 w-12 object-contain bg-white border" />}
                          <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="cursor-pointer" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Benefício / Desconto</Label>
                       <Textarea value={editPartner.descricao_beneficio} onChange={(e) => setEditPartner({...editPartner, descricao_beneficio: e.target.value})} rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Telefone / WhatsApp</Label>
                          <Input value={editPartner.telefone_contato || ''} onChange={(e) => setEditPartner({...editPartner, telefone_contato: e.target.value})} />
                       </div>
                       <div className="space-y-2">
                          <Label>Site / Instagram</Label>
                          <Input value={editPartner.link_site || ''} onChange={(e) => setEditPartner({...editPartner, link_site: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Endereço Completo</Label>
                       <Input value={editPartner.endereco || ''} onChange={(e) => setEditPartner({...editPartner, endereco: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Status</Label>
                          <Select value={editPartner.status} onValueChange={(val: any) => setEditPartner({...editPartner, status: val})}>
                             <SelectTrigger><SelectValue/></SelectTrigger>
                             <SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label>Nível (Tier)</Label>
                          <Select value={editPartner.partner_tier} onValueChange={(val: any) => setEditPartner({...editPartner, partner_tier: val})}>
                             <SelectTrigger><SelectValue/></SelectTrigger>
                             <SelectContent><SelectItem value="ouro">Ouro</SelectItem><SelectItem value="prata">Prata</SelectItem><SelectItem value="bronze">Bronze</SelectItem></SelectContent>
                          </Select>
                       </div>
                    </div>
                 </div>
              )}
              <DialogFooter>
                 <Button variant="outline" onClick={() => setEditPartner(null)}>Cancelar</Button>
                 <Button onClick={saveEdit} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar Alterações
                 </Button>
              </DialogFooter>
           </DialogContent>
        </Dialog>

        {/* ALERTA EXCLUIR */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
           <AlertDialogContent>
              <AlertDialogHeader>
                 <AlertDialogTitle className="text-red-600">Excluir Parceiro?</AlertDialogTitle>
                 <AlertDialogDescription>Esta ação é irreversível.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
                 <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
              </AlertDialogFooter>
           </AlertDialogContent>
        </AlertDialog>

        {/* MODAL VIEW (Mantido simples) */}
        <Dialog open={!!viewPartner} onOpenChange={() => setViewPartner(null)}>
           <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>{viewPartner?.nome_parceiro}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                 <div className="flex justify-center p-4 bg-slate-50 border rounded">
                    {viewPartner?.url_logo ? <img src={getImageUrl(viewPartner.url_logo)||''} className="h-32 object-contain"/> : 'Sem Logo'}
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Categoria:</strong> {viewPartner?.categoria}</div>
                    <div><strong>Nível:</strong> {viewPartner?.partner_tier}</div>
                    <div><strong>Contato:</strong> {viewPartner?.telefone_contato}</div>
                    <div><strong>Site:</strong> {viewPartner?.link_site}</div>
                 </div>
                 <div><strong>Benefício:</strong> {viewPartner?.descricao_beneficio}</div>
              </div>
           </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
}