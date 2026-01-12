/*
 * ==========================================================
 * MÓDULO: GestaoParceirosPage.tsx (ADMIN)
 * Versão: 27.0 (Adição de campos WhatsApp e Site)
 * ==========================================================
 */
import { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; 
import { 
  Loader2, Edit, Eye, Search, X, Camera, Layout, FileText, Smartphone, Monitor
} from 'lucide-react';

const API_LISTAR = 'https://www.ambamazonas.com.br/api/admin_listar_parceiros.php';
const API_EDITAR = 'https://www.ambamazonas.com.br/api/admin_editar_parceiro.php';
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
  url_banner?: string | null;
  banner_status?: 'aprovado' | 'pendente' | 'rejeitado';
  banner_fit_mode?: 'cover' | 'contain';
  banner_fit_mobile?: 'cover' | 'contain';
  banner_expiracao?: string | null;
  whatsapp_contato?: string | null; // Adicionado
  link_site?: string | null; // Adicionado
  telefone_contato: string | null;
  endereco: string | null;
}

export default function GestaoParceirosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [busca, setBusca] = useState('');

  const [viewPartner, setViewPartner] = useState<Parceiro | null>(null);
  const [editPartner, setEditPartner] = useState<Parceiro | null>(null);
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null); 

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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
      const [resParceiros] = await Promise.all([
         axios.post(API_LISTAR, { token }),
         axios.get(`${API_CATEGORIAS}?t=${ts}`) // Apenas para cache warm-up
      ]);
      if (resParceiros.data.status === 'sucesso') setParceiros(resParceiros.data.parceiros);
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao carregar dados.", variant: "destructive" });
    } finally {
      setLoadingData(false);
    }
  };

  const getImageUrl = (url: string | null, path: string = 'logos_parceiros') => {
    if (!url || url === 'NULL' || url === '' || url === 'undefined') return null;
    let clean = url.replace(/['"]/g, '').trim();
    if (clean.startsWith('http')) return clean;
    if (clean.startsWith('/')) return `${DOMAIN_URL}${clean}`;
    return `${DOMAIN_URL}/uploads/${path}/${clean}`;
  };

  const handleOpenEdit = (p: Parceiro) => {
    setEditPartner({ 
        ...p, 
        banner_fit_mode: p.banner_fit_mode || 'cover',
        banner_fit_mobile: p.banner_fit_mobile || 'cover',
        banner_status: p.banner_status || 'pendente',
        whatsapp_contato: p.whatsapp_contato || '',
        link_site: p.link_site || ''
    });
    setPreviewLogo(getImageUrl(p.url_logo));
    setPreviewBanner(getImageUrl(p.url_banner, 'banners_campanhas')); 
  };

  const getBannerUrl = (url: string | null) => {
      if(!url) return null;
      if(url.startsWith('http') || url.startsWith('/')) return getImageUrl(url, 'banners_campanhas');
      return `${DOMAIN_URL}/uploads/banners_campanhas/${url}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') setPreviewLogo(reader.result as string);
        else setPreviewBanner(reader.result as string);
      };
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
    formData.append('partner_tier', editPartner.partner_tier);
    formData.append('status', editPartner.status);
    
    // Contatos
    formData.append('telefone_contato', editPartner.telefone_contato || '');
    formData.append('whatsapp_contato', editPartner.whatsapp_contato || ''); // NOVO
    formData.append('link_site', editPartner.link_site || ''); // NOVO
    formData.append('endereco', editPartner.endereco || '');

    // BI & Banner
    formData.append('banner_status', editPartner.banner_status || 'pendente');
    formData.append('banner_fit_mode', editPartner.banner_fit_mode || 'cover');
    formData.append('banner_fit_mobile', editPartner.banner_fit_mobile || 'cover');
    formData.append('banner_expiracao', editPartner.banner_expiracao || '');

    if (fileInputRef.current?.files?.[0]) formData.append('logo', fileInputRef.current.files[0]);
    if (bannerInputRef.current?.files?.[0]) formData.append('banner', bannerInputRef.current.files[0]);

    try {
      const res = await axios.post(API_EDITAR, formData);
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Atualizado com sucesso!" });
        setEditPartner(null);
        fetchDados();
      } else {
         toast({ title: "Erro", description: res.data.mensagem || "Erro ao salvar.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha técnica ao salvar.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = parceiros.filter(p => 
    p.nome_parceiro.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Parceiros</h1>
            <p className="text-slate-500 text-sm">Administração de benefícios e campanhas Ouro.</p>
          </div>
          <div className="relative w-full md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input placeholder="Filtrar..." className="pl-9 bg-white" value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-8">
            {loadingData ? (
                <div className="p-8 text-center text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" /> Carregando...
                </div>
            ) : (
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4 text-left">Empresa</th>
                            <th className="px-6 py-4 text-left">Nível</th>
                            <th className="px-6 py-4 text-left">Campanha</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 text-sm">
                        {filtered.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded border bg-white flex items-center justify-center overflow-hidden">
                                            {p.url_logo ? <img src={getImageUrl(p.url_logo)!} className="h-full w-full object-contain p-1" /> : <span className="font-bold">{p.nome_parceiro.charAt(0)}</span>}
                                        </div>
                                        <span className="font-semibold text-slate-700">{p.nome_parceiro}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 capitalize">{p.partner_tier}</td>
                                <td className="px-6 py-4">
                                    {p.partner_tier === 'ouro' ? (
                                        <Badge variant={p.banner_status === 'aprovado' ? 'default' : 'secondary'} className="text-[10px]">
                                            {p.banner_status || 'sem arte'}
                                        </Badge>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" onClick={() => setViewPartner(p)}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)}><Edit className="h-4 w-4" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* MODAL EDITAR (HÍBRIDO) */}
        <Dialog open={!!editPartner} onOpenChange={() => setEditPartner(null)}>
           <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                    <Layout className="h-6 w-6 text-primary" /> Editar Parceiro & Campanha
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
                 
                 {/* COLUNA 1: DADOS CADASTRAIS */}
                 <div className="space-y-6">
                    <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-lg border">
                        <div className="h-20 w-20 bg-white border rounded flex items-center justify-center overflow-hidden">
                             {previewLogo ? <img src={previewLogo} className="h-full w-full object-contain" /> : <Camera className="text-slate-300"/>}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Alterar Logo</Button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Nome da Empresa</Label>
                        <Input value={editPartner?.nome_parceiro} onChange={e => setEditPartner(p => p ? {...p, nome_parceiro: e.target.value} : null)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>WhatsApp (Somente números)</Label>
                            <Input placeholder="559299..." value={editPartner?.whatsapp_contato || ''} onChange={e => setEditPartner(p => p ? {...p, whatsapp_contato: e.target.value} : null)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Site / Instagram</Label>
                            <Input placeholder="https://..." value={editPartner?.link_site || ''} onChange={e => setEditPartner(p => p ? {...p, link_site: e.target.value} : null)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Tier</Label><Select value={editPartner?.partner_tier} onValueChange={v => setEditPartner(p => p ? {...p, partner_tier: v as any} : null)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ouro">Ouro 🏆</SelectItem><SelectItem value="prata">Prata</SelectItem><SelectItem value="bronze">Bronze</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>Status</Label><Select value={editPartner?.status} onValueChange={v => setEditPartner(p => p ? {...p, status: v as any} : null)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent></Select></div>
                    </div>
                    
                    <div className="space-y-2"><Label>Benefício</Label><Textarea rows={3} value={editPartner?.descricao_beneficio} onChange={e => setEditPartner(p => p ? {...p, descricao_beneficio: e.target.value} : null)} /></div>
                 </div>

                 {/* COLUNA 2: BANNER E MÍDIA */}
                 <div className="bg-slate-900 text-white p-6 rounded-xl space-y-6 shadow-xl border border-slate-800">
                    <div className="flex justify-between"><Label className="text-slate-400 font-bold text-[10px] uppercase">Banner Promocional</Label><Badge className="bg-yellow-500 text-black">Máx 5MB</Badge></div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center"><Label className="text-[10px] text-slate-500 uppercase">Desktop View</Label><RadioGroup value={editPartner?.banner_fit_mode} onValueChange={v => setEditPartner(p => p ? {...p, banner_fit_mode: v as any} : null)} className="flex gap-2"><div className="flex items-center space-x-1"><RadioGroupItem value="cover" id="dc" className="text-yellow-500 border-slate-600"/><Label htmlFor="dc" className="text-[10px]">Expandir</Label></div><div className="flex items-center space-x-1"><RadioGroupItem value="contain" id="dt" className="text-yellow-500 border-slate-600"/><Label htmlFor="dt" className="text-[10px]">Preto</Label></div></RadioGroup></div>
                        <div className={`aspect-[1920/600] w-full rounded border border-slate-700 overflow-hidden relative ${editPartner?.banner_fit_mode === 'contain' ? 'bg-black' : 'bg-slate-800'}`}>
                             {previewBanner ? <img src={previewBanner} className={`w-full h-full ${editPartner?.banner_fit_mode === 'cover' ? 'object-cover' : 'object-contain'}`} /> : <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-500">Sem Banner</span>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-[10px] text-slate-500 uppercase">Mobile View</Label><RadioGroup value={editPartner?.banner_fit_mobile} onValueChange={v => setEditPartner(p => p ? {...p, banner_fit_mobile: v as any} : null)} className="flex flex-col gap-1 bg-slate-800 p-2 rounded"><div className="flex items-center space-x-1"><RadioGroupItem value="cover" id="mc" className="text-yellow-500 border-slate-600"/><Label htmlFor="mc" className="text-[10px]">Expandir</Label></div><div className="flex items-center space-x-1"><RadioGroupItem value="contain" id="mt" className="text-yellow-500 border-slate-600"/><Label htmlFor="mt" className="text-[10px]">Preto</Label></div></RadioGroup><div className={`aspect-[9/16] h-32 mx-auto rounded border border-slate-700 overflow-hidden mt-2 ${editPartner?.banner_fit_mobile === 'contain' ? 'bg-black' : 'bg-slate-800'}`}>{previewBanner && <img src={previewBanner} className={`w-full h-full ${editPartner?.banner_fit_mobile === 'cover' ? 'object-cover' : 'object-contain'}`} />}</div></div>
                        <div className="flex flex-col justify-end gap-3"><Label className="text-[10px] text-slate-500">Aprovação</Label><Select value={editPartner?.banner_status} onValueChange={v => setEditPartner(p => p ? {...p, banner_status: v as any} : null)}><SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pendente">Pendente</SelectItem><SelectItem value="aprovado">Aprovar ✅</SelectItem><SelectItem value="rejeitado">Rejeitar</SelectItem></SelectContent></Select><Button variant="secondary" size="sm" onClick={() => bannerInputRef.current?.click()}>📂 Upload Banner</Button><input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} /></div>
                    </div>
                 </div>
              </div>
              <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6 border-t"><Button variant="ghost" onClick={() => setEditPartner(null)}>Cancelar</Button><Button onClick={saveEdit} disabled={isSaving}>{isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Salvar Alterações</Button></DialogFooter>
           </DialogContent>
        </Dialog>

        {/* MODAL VISUALIZAR (Simples) */}
        <Dialog open={!!viewPartner} onOpenChange={() => setViewPartner(null)}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-slate-500" /> Ficha Técnica
                    </DialogTitle>
                </DialogHeader>
                {viewPartner && (
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border">
                            <div className="h-16 w-16 bg-white rounded border flex items-center justify-center p-1">
                                {viewPartner.url_logo ? <img src={getImageUrl(viewPartner.url_logo)!} className="max-h-full max-w-full" /> : <span className="font-bold text-xl">{viewPartner.nome_parceiro.charAt(0)}</span>}
                            </div>
                            <div><h3 className="font-bold text-lg">{viewPartner.nome_parceiro}</h3><Badge>{viewPartner.status}</Badge></div>
                        </div>
                        <div><span className="font-bold">WhatsApp:</span> {viewPartner.whatsapp_contato || '-'}</div>
                        <div><span className="font-bold">Site:</span> {viewPartner.link_site || '-'}</div>
                    </div>
                )}
                <DialogFooter><Button onClick={() => setViewPartner(null)}>Fechar</Button></DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
            <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0 flex justify-center items-center outline-none">
                <div className="relative"><Button variant="secondary" size="icon" className="absolute -top-12 right-0 rounded-full bg-white/20 text-white" onClick={() => setImagemZoom(null)}><X className="h-6 w-6"/></Button>{imagemZoom && <img src={imagemZoom} className="max-h-[85vh] max-w-[95vw] rounded-xl shadow-2xl bg-white object-contain" />}</div>
            </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
}