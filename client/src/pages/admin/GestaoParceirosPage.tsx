/*
 * ==========================================================
 * MÓDULO: GestaoParceirosPage.tsx (ADMIN)
 * Versão: 8.1 (Revisada: Zoom + WhatsApp + Estabilidade)
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
import { Loader2, ArrowLeft, Edit, Trash2, Eye, MapPin, Globe, Search, X, ZoomIn, MessageSquare, Camera } from 'lucide-react';

// URLs da API
const API_LISTAR = 'https://www.ambamazonas.com.br/api/admin_listar_parceiros.php';
const API_EDITAR = 'https://www.ambamazonas.com.br/api/admin_editar_parceiro.php';
const API_EXCLUIR = 'https://www.ambamazonas.com.br/api/excluir_parceiro.php';
const API_STATUS = 'https://www.ambamazonas.com.br/api/admin_atualizar_parceiro.php';
const API_CATEGORIAS = 'https://www.ambamazonas.com.br/api/get_categorias_parceiros.php';
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
  const [categoriasDB, setCategoriasDB] = useState<Categoria[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [busca, setBusca] = useState('');

  // Estados dos Modais
  const [viewPartner, setViewPartner] = useState<Parceiro | null>(null);
  const [editPartner, setEditPartner] = useState<Parceiro | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

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
      const [resParceiros, resCats] = await Promise.all([
         axios.post(API_LISTAR, { token }),
         axios.get(`${API_CATEGORIAS}?t=${ts}`)
      ]);

      if (resParceiros.data.status === 'sucesso') setParceiros(resParceiros.data.parceiros);
      if (resCats.data.status === 'sucesso') setCategoriasDB(resCats.data.dados || []);
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

  // --- EDIÇÃO ---
  const handleOpenEdit = (p: Parceiro) => {
    setEditPartner({ ...p });
    setPreviewLogo(getImageUrl(p.url_logo));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = async () => {
    if (!editPartner) return;
    setIsSaving(true);
    const formData = new FormData();
    formData.append('id', editPartner.id.toString());
    formData.append('nome_parceiro', editPartner.nome_parceiro);
    formData.append('categoria', editPartner.categoria);
    formData.append('descricao_beneficio', editPartner.descricao_beneficio || '');
    formData.append('telefone_contato', editPartner.telefone_contato || '');
    formData.append('link_site', editPartner.link_site || '');
    formData.append('endereco', editPartner.endereco || '');
    formData.append('partner_tier', editPartner.partner_tier);
    formData.append('status', editPartner.status);
    if (fileInputRef.current?.files?.[0]) formData.append('logo', fileInputRef.current.files[0]);

    try {
      const res = await axios.post(API_EDITAR, formData);
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Parceiro atualizado!" });
        setEditPartner(null);
        fetchDados();
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickUpdate = async (id: number, field: 'novo_status' | 'novo_tier', value: string) => {
    try {
        await axios.post(API_STATUS, { token, data: { id_parceiro: id, [field]: value } });
        setParceiros(prev => prev.map(p => p.id === id ? { ...p, [field === 'novo_status' ? 'status' : 'partner_tier']: value } : p));
        toast({ title: "Atualizado", description: "Alteração salva." });
    } catch (error) {
        toast({ title: "Erro", description: "Falha na atualização.", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.post(API_EXCLUIR, JSON.stringify({ id: deleteId }));
      if (res.data.status === 'sucesso') {
        toast({ title: "Removido", description: "Parceiro excluído." });
        setParceiros(prev => prev.filter(p => p.id !== deleteId));
      }
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao excluir.", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = parceiros.filter(p => 
    p.nome_parceiro.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  if (isAuthLoading || loadingData) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin mr-2"/> Carregando parceiros...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin/painel" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Gestão de Parceiros</h1>
          </div>
          <div className="relative w-full md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input placeholder="Filtrar por nome ou categoria..." className="pl-9 bg-white shadow-sm" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>

        {/* TABELA PRINCIPAL */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 text-left">Empresa</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Nível</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-sm">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="h-12 w-12 rounded-lg border bg-white flex items-center justify-center cursor-zoom-in overflow-hidden hover:border-primary transition-colors group relative"
                          onClick={() => p.url_logo && setImagemZoom(getImageUrl(p.url_logo))}
                          title="Clique para ampliar"
                        >
                          {p.url_logo ? (
                            <>
                              <img src={getImageUrl(p.url_logo)!} className="h-full w-full object-contain p-1" alt={p.nome_parceiro} />
                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ZoomIn className="h-4 w-4 text-slate-600" />
                              </div>
                            </>
                          ) : (
                            <span className="text-slate-300 font-bold">{p.nome_parceiro.charAt(0)}</span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-700">{p.nome_parceiro}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Select value={p.status} onValueChange={(val) => handleQuickUpdate(p.id, 'novo_status', val)}>
                        <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="pendente">Pendente</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4">
                      <Select value={p.partner_tier} onValueChange={(val) => handleQuickUpdate(p.id, 'novo_tier', val)}>
                        <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="ouro">Ouro</SelectItem><SelectItem value="prata">Prata</SelectItem><SelectItem value="bronze">Bronze</SelectItem></SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary" onClick={() => setViewPartner(p)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600" onClick={() => handleOpenEdit(p)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600" onClick={() => setDeleteId(p.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL VISUALIZAÇÃO */}
        <Dialog open={!!viewPartner} onOpenChange={() => setViewPartner(null)}>
           <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle className="text-xl font-bold">{viewPartner?.nome_parceiro}</DialogTitle></DialogHeader>
              <div className="space-y-6 pt-4">
                 <div className="flex justify-center p-6 bg-white border-2 border-dashed rounded-xl cursor-zoom-in relative group" onClick={() => viewPartner?.url_logo && setImagemZoom(getImageUrl(viewPartner.url_logo))}>
                    {viewPartner?.url_logo ? (
                        <>
                          <img src={getImageUrl(viewPartner.url_logo)!} className="h-32 object-contain" alt="Logo" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn className="text-slate-600 h-10 w-10" /></div>
                        </>
                    ) : <span className="text-slate-400">Sem Logo</span>}
                 </div>
                 <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div className="space-y-1"><span className="text-slate-400 font-bold uppercase text-[9px]">Categoria</span><p className="font-semibold text-slate-700">{viewPartner?.categoria}</p></div>
                    <div className="space-y-1"><span className="text-slate-400 font-bold uppercase text-[9px]">Nível</span><p className="font-semibold text-slate-700 capitalize">{viewPartner?.partner_tier}</p></div>
                    <div className="col-span-2 pt-3 border-t">
                        <span className="text-slate-400 font-bold uppercase text-[9px]">WhatsApp de Contato</span>
                        <div className="flex items-center gap-3 mt-1 text-slate-800 font-bold text-base">
                            <div className="bg-green-500 p-1.5 rounded-full text-white shadow-sm"><MessageSquare className="h-4 w-4 fill-current" /></div>
                            {viewPartner?.telefone_contato || 'Não informado'}
                        </div>
                    </div>
                    {viewPartner?.link_site && <div className="col-span-2 pt-2"><span className="text-slate-400 font-bold uppercase text-[9px]">Site Oficial</span><div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /><a href={viewPartner.link_site} target="_blank" className="text-blue-600 underline truncate">{viewPartner.link_site}</a></div></div>}
                 </div>
                 <div className="space-y-2"><span className="text-slate-400 font-bold uppercase text-[9px]">Benefício</span><div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg italic text-slate-700 text-sm">"{viewPartner?.descricao_beneficio}"</div></div>
              </div>
           </DialogContent>
        </Dialog>

        {/* MODAL EDIÇÃO */}
        <Dialog open={!!editPartner} onOpenChange={() => setEditPartner(null)}>
           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Editar Parceiro</DialogTitle></DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                 <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-bold text-slate-400">Logomarca</Label>
                    <div className="relative h-48 w-full border-2 border-dashed rounded-xl flex items-center justify-center bg-slate-50 group cursor-zoom-in overflow-hidden" onClick={() => previewLogo && setImagemZoom(previewLogo)}>
                      {previewLogo ? (
                        <>
                          <img src={previewLogo} className="max-h-full max-w-full object-contain p-4" alt="Preview" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><ZoomIn className="text-white h-8 w-8" /></div>
                        </>
                      ) : <Camera className="h-10 w-10 text-slate-300" />}
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>Alterar Imagem</Button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2"><Label>Nome</Label><Input value={editPartner?.nome_parceiro} onChange={e => setEditPartner(p => p ? {...p, nome_parceiro: e.target.value} : null)} /></div>
                    <div className="space-y-2">
                       <Label>Categoria</Label>
                       <Select value={editPartner?.categoria} onValueChange={v => setEditPartner(p => p ? {...p, categoria: v} : null)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{categoriasDB.map(c => <SelectItem key={c.id} value={c.nome}>{c.nome}</SelectItem>)}</SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2"><Label>WhatsApp</Label><Input value={editPartner?.telefone_contato || ''} onChange={e => setEditPartner(p => p ? {...p, telefone_contato: e.target.value} : null)} /></div>
                 </div>
                 <div className="col-span-full space-y-2"><Label>Descrição</Label><Textarea value={editPartner?.descricao_beneficio} onChange={e => setEditPartner(p => p ? {...p, descricao_beneficio: e.target.value} : null)} /></div>
              </div>
              <DialogFooter><Button variant="ghost" onClick={() => setEditPartner(null)}>Cancelar</Button><Button onClick={saveEdit} disabled={isSaving}>{isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Salvar</Button></DialogFooter>
           </DialogContent>
        </Dialog>

        {/* ALERTA EXCLUSÃO */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
           <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Deseja remover este parceiro permanentemente?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Não</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Sim, Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>

        {/* MODAL ZOOM GLOBAL */}
        <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
            <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0 flex justify-center items-center outline-none">
                <div className="relative group">
                    <Button variant="secondary" size="icon" className="absolute -top-12 right-0 rounded-full bg-white/20 text-white hover:bg-white/40 border-none" onClick={() => setImagemZoom(null)}><X className="h-6 w-6"/></Button>
                    {imagemZoom && <img src={imagemZoom} className="max-h-[85vh] max-w-[95vw] rounded-lg shadow-2xl bg-white object-contain cursor-pointer" alt="Zoom" onClick={() => setImagemZoom(null)} />}
                </div>
            </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
}