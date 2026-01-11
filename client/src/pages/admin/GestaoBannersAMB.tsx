/*
 * ==========================================================
 * MÓDULO: GestaoBannersAMB.tsx (ADMIN)
 * Versão: 2.1 (Com Guia de Tamanhos e Help Visual)
 * ==========================================================
 */

import { useEffect, useState, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; 
import { 
  Loader2, ArrowLeft, Edit, Trash2, Calendar, Link as LinkIcon, 
  Image as ImageIcon, Plus, CheckCircle, Clock, AlertCircle, Monitor, Info
} from 'lucide-react';

const API_LISTAR = 'https://www.ambamazonas.com.br/api/admin_listar_banners.php';
const API_SALVAR = 'https://www.ambamazonas.com.br/api/admin_salvar_banner.php';
const API_EXCLUIR = 'https://www.ambamazonas.com.br/api/admin_excluir_banner.php';
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

interface BannerInstitucional {
  id: number;
  titulo: string;
  url_imagem: string;
  url_link_destino: string | null;
  ordem_exibicao: number;
  data_inicio: string | null;
  data_fim: string | null;
  status: 'ativo' | 'inativo';
  fit_mode?: 'cover' | 'contain';
  status_real?: 'ativo' | 'inativo' | 'agendado' | 'expirado';
}

export default function GestaoBannersAMB() {
  const { isAuthenticated, atleta, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  const [banners, setBanners] = useState<BannerInstitucional[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerInstitucional | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [formData, setFormData] = useState({
      titulo: '',
      link: '',
      ordem: 10,
      status: 'ativo',
      fit_mode: 'cover',
      data_inicio: '',
      data_fim: ''
  });

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || atleta?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchBanners();
  }, [isAuthenticated, isAuthLoading]);

  const fetchBanners = async () => {
    setLoading(true);
    try {
        const res = await axios.get(`${API_LISTAR}?t=${new Date().getTime()}`);
        if (res.data.status === 'sucesso') {
            setBanners(res.data.banners);
        }
    } catch (error) {
        toast({ title: "Erro", description: "Falha ao carregar banners.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${DOMAIN_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleOpenModal = (banner?: BannerInstitucional) => {
      if (banner) {
          setEditingBanner(banner);
          setFormData({
              titulo: banner.titulo,
              link: banner.url_link_destino || '',
              ordem: banner.ordem_exibicao,
              status: banner.status,
              fit_mode: banner.fit_mode || 'cover',
              data_inicio: banner.data_inicio ? banner.data_inicio.replace(' ', 'T') : '',
              data_fim: banner.data_fim ? banner.data_fim.replace(' ', 'T') : ''
          });
          setPreviewImage(getImageUrl(banner.url_imagem));
      } else {
          setEditingBanner(null);
          setFormData({ titulo: '', link: '', ordem: 10, status: 'ativo', fit_mode: 'cover', data_inicio: '', data_fim: '' });
          setPreviewImage(null);
      }
      setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
      if (!formData.titulo) return toast({ title: "Atenção", description: "O título é obrigatório.", variant: "destructive" });
      if (!editingBanner && !fileInputRef.current?.files?.[0]) return toast({ title: "Atenção", description: "Selecione uma imagem para o banner.", variant: "destructive" });

      setIsSaving(true);
      const data = new FormData();
      if (editingBanner) data.append('id', editingBanner.id.toString());

      data.append('titulo', formData.titulo);
      data.append('link', formData.link);
      data.append('ordem', formData.ordem.toString());
      data.append('status', formData.status);
      data.append('fit_mode', formData.fit_mode);
      data.append('data_inicio', formData.data_inicio ? formData.data_inicio.replace('T', ' ') : '');
      data.append('data_fim', formData.data_fim ? formData.data_fim.replace('T', ' ') : '');

      if (fileInputRef.current?.files?.[0]) {
          data.append('imagem', fileInputRef.current.files[0]);
      }

      try {
          const res = await axios.post(API_SALVAR, data);
          if (res.data.status === 'sucesso') {
              toast({ title: "Sucesso", description: "Banner salvo com sucesso!" });
              setModalOpen(false);
              fetchBanners();
          } else {
              toast({ title: "Erro", description: res.data.mensagem, variant: "destructive" });
          }
      } catch (error) {
          toast({ title: "Erro", description: "Erro de conexão.", variant: "destructive" });
      } finally {
          setIsSaving(false);
      }
  };

  const handleDelete = async (id: number) => {
      if (!confirm("Tem certeza que deseja excluir este banner?")) return;
      try {
          const res = await axios.post(API_EXCLUIR, { id });
          if (res.data.status === 'sucesso') {
              toast({ title: "Excluído", description: "Banner removido." });
              fetchBanners();
          }
      } catch (error) {
          toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" });
      }
  };

  const StatusBadge = ({ status, real }: { status: string, real?: string }) => {
      if (status === 'inativo') return <Badge variant="secondary" className="bg-slate-200 text-slate-500">Inativo</Badge>;
      if (real === 'agendado') return <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50 flex gap-1"><Clock className="h-3 w-3"/> Agendado</Badge>;
      if (real === 'expirado') return <Badge variant="outline" className="border-slate-300 text-slate-400 flex gap-1"><AlertCircle className="h-3 w-3"/> Expirado</Badge>;
      return <Badge className="bg-green-500 hover:bg-green-600 flex gap-1"><CheckCircle className="h-3 w-3"/> No Ar</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin/painel" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Banners Institucionais</h1>
            <p className="text-slate-500 text-sm">Gerencie os destaques rotativos da página inicial.</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 gap-2 shadow-lg">
              <Plus className="h-4 w-4" /> Novo Banner
          </Button>
        </div>

        {/* LISTAGEM */}
        {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        <div className={`relative aspect-video group ${banner.fit_mode === 'contain' ? 'bg-black' : 'bg-slate-100'}`}>
                            <img src={getImageUrl(banner.url_imagem)} alt={banner.titulo} className={`w-full h-full ${banner.fit_mode === 'contain' ? 'object-contain' : 'object-cover'}`} />
                            <div className="absolute top-2 right-2">
                                <StatusBadge status={banner.status} real={banner.status_real} />
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="sm" variant="secondary" onClick={() => handleOpenModal(banner)}><Edit className="h-4 w-4 mr-2" /> Editar</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(banner.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-slate-800 line-clamp-1" title={banner.titulo}>{banner.titulo}</h3>
                                <Badge variant="outline" className="text-[10px]">Ordem: {banner.ordem_exibicao}</Badge>
                            </div>
                            <div className="space-y-2 mt-auto text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Monitor className="h-3 w-3" />
                                    <span className="capitalize">{banner.fit_mode === 'contain' ? 'Fundo Preto' : 'Expandido'}</span>
                                </div>
                                {banner.data_inicio && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        <span>{new Date(banner.data_inicio).toLocaleDateString()} até {banner.data_fim ? new Date(banner.data_fim).toLocaleDateString() : 'Indefinido'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
                        <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Nenhum banner cadastrado.</p>
                        <Button variant="link" onClick={() => handleOpenModal()}>Criar o primeiro</Button>
                    </div>
                )}
            </div>
        )}

        {/* MODAL DE CRIAÇÃO/EDIÇÃO COM GUIA DE TAMANHOS */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingBanner ? 'Editar Banner' : 'Novo Banner Institucional'}</DialogTitle>
                    <DialogDescription>Configure a imagem, link e modo de exibição.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Lado Esquerdo: Upload */}
                    <div className="space-y-4">
                        <div className={`flex flex-col items-center gap-4 p-6 rounded-lg border border-dashed border-slate-300 ${formData.fit_mode === 'contain' ? 'bg-black' : 'bg-slate-50'}`}>
                            {previewImage ? (
                                <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-sm">
                                    <img src={previewImage} className={`w-full h-full ${formData.fit_mode === 'contain' ? 'object-contain' : 'object-cover'}`} />
                                    <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 text-xs h-7" onClick={() => fileInputRef.current?.click()}>Alterar Imagem</Button>
                                </div>
                            ) : (
                                <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <ImageIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                                    <span className={`text-sm font-medium ${formData.fit_mode === 'contain' ? 'text-slate-400' : 'text-slate-500'}`}>Clique para selecionar</span>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>

                        {/* HELP BOX VISUAL (NOVO) */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 space-y-2">
                             <div className="flex items-center gap-2 font-bold">
                                 <Info className="h-4 w-4" />
                                 Guia de Tamanhos
                             </div>
                             <ul className="list-disc pl-4 space-y-1">
                                 <li><strong>1920 x 600 px:</strong> Ideal para telas largas. Preenche bem sem ocupar a tela toda.</li>
                                 <li><strong>1920 x 1080 px:</strong> Full HD. Se usar "Expandir", o topo/rodapé pode ser cortado.</li>
                             </ul>
                             <p className="mt-1 pt-1 border-t border-blue-100 italic">
                                 <strong>Dica:</strong> Se sua imagem tem textos nas bordas e está sendo cortada, selecione a opção <strong>"Fundo Preto (Inteiro)"</strong> ao lado.
                             </p>
                        </div>
                    </div>

                    {/* Lado Direito: Form */}
                    <div className="space-y-4">
                        <div>
                            <Label>Modo de Exibição</Label>
                            <RadioGroup 
                                value={formData.fit_mode} 
                                onValueChange={(v) => setFormData({...formData, fit_mode: v})}
                                className="flex gap-4 mt-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="cover" id="r-cover" className="text-yellow-500 border-slate-400" />
                                    <Label htmlFor="r-cover" className="cursor-pointer font-normal text-sm">Expandir (Zoom)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="contain" id="r-contain" className="text-yellow-500 border-slate-400" />
                                    <Label htmlFor="r-contain" className="cursor-pointer font-normal text-sm">Fundo Preto (Inteiro)</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label>Título Interno</Label>
                            <Input placeholder="Ex: Campanha Natal" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} />
                        </div>

                        <div>
                            <Label>Link de Destino (Opcional)</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input className="pl-9" placeholder="https://..." value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Ordem</Label>
                                <Input type="number" min="1" value={formData.ordem} onChange={(e) => setFormData({...formData, ordem: Number(e.target.value)})} />
                            </div>
                            <div>
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as any})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <Label className="mb-2 block text-slate-700 font-bold text-xs uppercase">Agendamento (Opcional)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="text-[10px] text-slate-500">Início</span><Input type="datetime-local" className="text-xs" value={formData.data_inicio} onChange={(e) => setFormData({...formData, data_inicio: e.target.value})} /></div>
                                <div><span className="text-[10px] text-slate-500">Fim</span><Input type="datetime-local" className="text-xs" value={formData.data_fim} onChange={(e) => setFormData({...formData, data_fim: e.target.value})} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={isSaving}>{isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}