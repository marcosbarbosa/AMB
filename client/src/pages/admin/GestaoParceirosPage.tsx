/*
 * ==========================================================
 * MÓDULO: GestaoParceirosPage.tsx (ADMIN - VERSÃO CEO)
 * Descrição: Gestão completa com BI (Business Intelligence)
 * e métricas de conversão para estratégias AIDA.
 * ==========================================================
 */
import { useEffect, useState, useRef, useMemo } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; 
import { 
  Loader2, Edit, Eye, Search, X, Camera, Layout, FileText, 
  BarChart3, MousePointerClick, TrendingUp, Trophy
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
  whatsapp_contato?: string | null;
  link_site?: string | null;
  telefone_contato: string | null;
  endereco: string | null;
  // --- CAMPOS DE BI (INTELIGÊNCIA) ---
  views_total?: number;    // Quantas vezes apareceu na tela
  clicks_whatsapp?: number; // Quantos clicaram no "Falar Agora"
  clicks_banner?: number;   // Quantos clicaram no Banner da Home
}

export default function GestaoParceirosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [busca, setBusca] = useState('');
  const [orderBy, setOrderBy] = useState<'nome' | 'cliques'>('nome');

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
         axios.get(`${API_CATEGORIAS}?t=${ts}`)
      ]);
      
      // Se a API retornar dados, usamos. Se não, populamos com 0 para não quebrar o BI.
      if (resParceiros.data.status === 'sucesso') {
        const dadosFormatados = resParceiros.data.parceiros.map((p: any) => ({
            ...p,
            views_total: p.views_total || 0,
            clicks_whatsapp: p.clicks_whatsapp || 0,
            clicks_banner: p.clicks_banner || 0
        }));
        setParceiros(dadosFormatados);
      }
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

  // --- CÁLCULOS DE BI ---
  const stats = useMemo(() => {
    const totalParceiros = parceiros.length;
    const totalCliquesZap = parceiros.reduce((acc, p) => acc + (p.clicks_whatsapp || 0), 0);
    const parceiroTop = [...parceiros].sort((a, b) => (b.clicks_whatsapp || 0) - (a.clicks_whatsapp || 0))[0];
    
    return { totalParceiros, totalCliquesZap, parceiroTop };
  }, [parceiros]);

  const filtered = useMemo(() => {
    let lista = parceiros.filter(p => 
      p.nome_parceiro.toLowerCase().includes(busca.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busca.toLowerCase())
    );

    if (orderBy === 'cliques') {
        lista = lista.sort((a, b) => (b.clicks_whatsapp || 0) - (a.clicks_whatsapp || 0));
    } else {
        lista = lista.sort((a, b) => a.nome_parceiro.localeCompare(b.nome_parceiro));
    }
    return lista;
  }, [parceiros, busca, orderBy]);

  // --- HANDLERS ---
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
    formData.append('telefone_contato', editPartner.telefone_contato || '');
    formData.append('whatsapp_contato', editPartner.whatsapp_contato || ''); 
    formData.append('link_site', editPartner.link_site || '');
    formData.append('endereco', editPartner.endereco || '');

    // Dados de Banner
    formData.append('banner_status', editPartner.banner_status || 'pendente');
    formData.append('banner_fit_mode', editPartner.banner_fit_mode || 'cover');
    formData.append('banner_fit_mobile', editPartner.banner_fit_mobile || 'cover');

    if (fileInputRef.current?.files?.[0]) formData.append('logo', fileInputRef.current.files[0]);
    if (bannerInputRef.current?.files?.[0]) formData.append('banner', bannerInputRef.current.files[0]);

    try {
      const res = await axios.post(API_EDITAR, formData);
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Dados atualizados com sucesso!" });
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        {/* --- DASHBOARD DE BI (NOVOS INDICADORES) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 uppercase">Parceiros Ativos</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-slate-800">{stats.totalParceiros}</div>
                    <p className="text-xs text-slate-400 mt-1">Na base de dados</p>
                </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-green-500 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 uppercase flex items-center gap-2"><MousePointerClick className="h-4 w-4"/> Cliques no Zap</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-green-600">{stats.totalCliquesZap}</div>
                    <p className="text-xs text-slate-400 mt-1">Interesse direto gerado</p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-yellow-700 uppercase flex items-center gap-2"><Trophy className="h-4 w-4"/> Parceiro Top</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-xl font-bold text-slate-800 truncate">{stats.parceiroTop?.nome_parceiro || 'Nenhum'}</div>
                    <p className="text-xs text-yellow-600 mt-1 font-bold">{stats.parceiroTop?.clicks_whatsapp || 0} conversões</p>
                </CardContent>
            </Card>
        </div>

        {/* HEADER DA PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Parceiros</h1>
            <p className="text-slate-500 text-sm">Controle de contratos, banners e métricas de desempenho.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Buscar parceiro..." className="pl-9 bg-white" value={busca} onChange={(e) => setBusca(e.target.value)} />
             </div>
             <Select value={orderBy} onValueChange={(v: any) => setOrderBy(v)}>
                <SelectTrigger className="w-[160px] bg-white"><SelectValue placeholder="Ordenar" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="nome">Ordem Alfabética</SelectItem>
                    <SelectItem value="cliques">Mais Populares 🔥</SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>

        {/* TABELA DE DADOS */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-8">
            {loadingData ? (
                <div className="p-8 text-center text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" /> Carregando base de dados...
                </div>
            ) : (
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4 text-left">Empresa</th>
                            <th className="px-6 py-4 text-left">Nível</th>
                            <th className="px-6 py-4 text-center">Cliques Zap</th>
                            <th className="px-6 py-4 text-center">Status Banner</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 text-sm">
                        {filtered.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg border bg-white flex items-center justify-center overflow-hidden shrink-0">
                                            {p.url_logo ? <img src={getImageUrl(p.url_logo)!} className="h-full w-full object-contain p-1" /> : <span className="font-bold">{p.nome_parceiro.charAt(0)}</span>}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800">{p.nome_parceiro}</div>
                                            <div className="text-[10px] text-slate-400 uppercase">{p.categoria}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={p.partner_tier === 'ouro' ? 'default' : 'outline'} className={p.partner_tier === 'ouro' ? 'bg-yellow-500 text-black hover:bg-yellow-600' : ''}>
                                        {p.partner_tier.toUpperCase()}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center gap-1 font-mono text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded">
                                        <TrendingUp className="h-3 w-3" /> {p.clicks_whatsapp || 0}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {p.partner_tier === 'ouro' ? (
                                        <div className="flex flex-col items-center">
                                            <div className={`w-2 h-2 rounded-full mb-1 ${p.banner_status === 'aprovado' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-[10px] text-slate-500">{p.banner_status || 'sem arte'}</span>
                                        </div>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <Button variant="ghost" size="icon" onClick={() => setViewPartner(p)} title="Ver Detalhes"><Eye className="h-4 w-4 text-slate-500" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)} title="Editar"><Edit className="h-4 w-4 text-blue-600" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            )}
        </div>

        {/* MODAL EDITAR (COMPLETO) */}
        <Dialog open={!!editPartner} onOpenChange={() => setEditPartner(null)}>
           <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                    <Layout className="h-6 w-6 text-primary" /> Editor de Parceiro
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
                 
                 {/* LADO ESQUERDO: DADOS */}
                 <div className="space-y-5">
                    <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-lg border">
                        <div className="h-20 w-20 bg-white border rounded flex items-center justify-center overflow-hidden">
                             {previewLogo ? <img src={previewLogo} className="h-full w-full object-contain" /> : <Camera className="text-slate-300"/>}
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs text-slate-500 mb-1 block">Logotipo</Label>
                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">Alterar Imagem</Button>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'logo')} />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Nome da Empresa</Label>
                        <Input value={editPartner?.nome_parceiro} onChange={e => setEditPartner(p => p ? {...p, nome_parceiro: e.target.value} : null)} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-green-600">WhatsApp (Números)</Label>
                            <Input placeholder="559299..." value={editPartner?.whatsapp_contato || ''} onChange={e => setEditPartner(p => p ? {...p, whatsapp_contato: e.target.value} : null)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-blue-600">Site / Instagram</Label>
                            <Input placeholder="https://..." value={editPartner?.link_site || ''} onChange={e => setEditPartner(p => p ? {...p, link_site: e.target.value} : null)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Plano</Label><Select value={editPartner?.partner_tier} onValueChange={v => setEditPartner(p => p ? {...p, partner_tier: v as any} : null)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ouro">Ouro 🏆</SelectItem><SelectItem value="prata">Prata</SelectItem><SelectItem value="bronze">Bronze</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>Status</Label><Select value={editPartner?.status} onValueChange={v => setEditPartner(p => p ? {...p, status: v as any} : null)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent></Select></div>
                    </div>
                    
                    <div className="space-y-2"><Label>Benefício / Desconto</Label><Textarea rows={3} value={editPartner?.descricao_beneficio} onChange={e => setEditPartner(p => p ? {...p, descricao_beneficio: e.target.value} : null)} /></div>
                 </div>

                 {/* LADO DIREITO: BANNER & BI */}
                 <div className="space-y-6">
                    {/* CARTÃO DE MÉTRICAS INDIVIDUAIS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                            <div className="text-2xl font-bold text-blue-700">{editPartner?.views_total || 0}</div>
                            <div className="text-[10px] uppercase font-bold text-blue-400">Visualizações</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                            <div className="text-2xl font-bold text-green-700">{editPartner?.clicks_whatsapp || 0}</div>
                            <div className="text-[10px] uppercase font-bold text-green-400">Cliques Zap</div>
                        </div>
                    </div>

                    {/* EDITOR DE BANNER */}
                    <div className="bg-slate-900 text-white p-5 rounded-xl space-y-4 shadow-xl border border-slate-800">
                        <div className="flex justify-between items-center"><Label className="text-slate-400 font-bold text-[10px] uppercase">Banner da Home</Label><Badge className="bg-yellow-500 text-black border-none text-[10px]">Área Vip</Badge></div>

                        <div className="space-y-2">
                             <div className="flex justify-between items-center"><Label className="text-[10px] text-slate-500 uppercase">Ajuste Desktop</Label><RadioGroup value={editPartner?.banner_fit_mode} onValueChange={v => setEditPartner(p => p ? {...p, banner_fit_mode: v as any} : null)} className="flex gap-2"><div className="flex items-center space-x-1"><RadioGroupItem value="cover" id="dc" className="text-yellow-500 border-slate-600"/><Label htmlFor="dc" className="text-[10px] cursor-pointer">Expandir</Label></div><div className="flex items-center space-x-1"><RadioGroupItem value="contain" id="dt" className="text-yellow-500 border-slate-600"/><Label htmlFor="dt" className="text-[10px] cursor-pointer">Inteiro</Label></div></RadioGroup></div>
                             
                             <div className={`aspect-[16/5] w-full rounded border border-slate-700 overflow-hidden relative ${editPartner?.banner_fit_mode === 'contain' ? 'bg-black' : 'bg-slate-800'}`}>
                                 {previewBanner ? <img src={previewBanner} className={`w-full h-full ${editPartner?.banner_fit_mode === 'cover' ? 'object-cover' : 'object-contain'}`} /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600"><BarChart3 className="h-8 w-8 mb-2 opacity-50"/><span className="text-[10px]">Sem Banner</span></div>}
                             </div>
                        </div>

                        <div className="flex justify-between gap-3 pt-2">
                            <div className="flex-1 space-y-1">
                                <Label className="text-[10px] text-slate-500">Status da Campanha</Label>
                                <Select value={editPartner?.banner_status} onValueChange={v => setEditPartner(p => p ? {...p, banner_status: v as any} : null)}><SelectTrigger className="bg-slate-800 border-slate-700 text-white h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pendente">Pendente ⏳</SelectItem><SelectItem value="aprovado">No Ar 🟢</SelectItem><SelectItem value="rejeitado">Pausado 🔴</SelectItem></SelectContent></Select>
                            </div>
                            <div className="flex items-end">
                                <Button variant="secondary" size="sm" onClick={() => bannerInputRef.current?.click()} className="h-8 text-xs">📂 Enviar Novo Banner</Button>
                                <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
              <DialogFooter className="bg-slate-50 p-4 -mx-6 -mb-6 border-t"><Button variant="ghost" onClick={() => setEditPartner(null)}>Cancelar</Button><Button onClick={saveEdit} disabled={isSaving} className="bg-slate-900 text-white hover:bg-black">{isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Salvar Alterações</Button></DialogFooter>
           </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
}