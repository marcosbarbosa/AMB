/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: client/src/pages/admin/GestaoBannersAMB.tsx
 * FUNÇÃO: Gestão de Banners Institucionais (Rotativos da Home)
 * VERSÃO: 3.0 Prime (Exclusão Corrigida)
 * ==========================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, Plus, Edit, Trash2, ArrowLeft, Loader2, CalendarClock, MonitorPlay
} from 'lucide-react';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function GestaoBannersAMB() {
  const { token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    id: 0,
    titulo: '',
    link: '',
    modo_exibicao: 'cover', // 'cover' ou 'contain'
    ordem: '1',
    status: 'ativo',
    data_inicio: '',
    data_fim: ''
  });
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_BASE}/listar_banners_admin.php`, { params: { token } });
      if (res.data.status === 'sucesso') setBanners(res.data.banners);
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!formData.titulo) return toast({ title: "Erro", description: "Título obrigatório.", variant: "destructive" });
    if (!formData.id && !imagemFile) return toast({ title: "Erro", description: "Imagem obrigatória para novos banners.", variant: "destructive" });

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (imagemFile) data.append('imagem', imagemFile);
    data.append('token', token || '');

    try {
      const res = await axios.post(`${API_BASE}/admin_salvar_banner.php`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso!", description: "Banner salvo." });
        setIsModalOpen(false);
        fetchBanners();
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (e: any) {
      const msg = e.response?.data?.mensagem || e.message || "Erro desconhecido.";
      toast({ title: "Erro ao Salvar", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO DE EXCLUSÃO CORRIGIDA ---
  const handleDelete = async (id: number) => {
      if(!confirm("Tem certeza que deseja excluir este banner permanentemente?")) return;

      try {
          // Chama o endpoint real de exclusão
          const res = await axios.post(`${API_BASE}/admin_excluir_banner.php`, { 
              id: id,
              token: token // Envia o token para validação de segurança
          });

          if (res.data.status === 'sucesso') {
              toast({ title: "Sucesso", description: "Banner removido.", className: "bg-green-600 text-white" });
              // Remove da lista visualmente
              setBanners(prev => prev.filter(b => b.id !== id));
          } else {
              throw new Error(res.data.mensagem);
          }
      } catch (error: any) {
          console.error(error);
          const msg = error.response?.data?.mensagem || "Erro ao excluir.";
          toast({ title: "Erro", description: msg, variant: "destructive" });
      }
  };

  const openNew = () => {
      setFormData({ id: 0, titulo: '', link: '', modo_exibicao: 'cover', ordem: '1', status: 'ativo', data_inicio: '', data_fim: '' });
      setPreviewImagem(null);
      setImagemFile(null);
      setIsModalOpen(true);
  };

  const openEdit = (b: any) => {
      setFormData({
          id: b.id,
          titulo: b.titulo,
          link: b.link_destino || '',
          modo_exibicao: b.modo_exibicao || 'cover',
          ordem: b.ordem,
          status: b.status,
          data_inicio: b.data_inicio ? b.data_inicio.replace(' ', 'T') : '',
          data_fim: b.data_fim ? b.data_fim.replace(' ', 'T') : ''
      });
      setPreviewImagem(b.url_imagem ? `https://www.ambamazonas.com.br${b.url_imagem}` : null);
      setImagemFile(null);
      setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">
            <div>
                <Button variant="ghost" onClick={() => navigate('/admin/painel')} className="mb-2 pl-0 hover:bg-transparent text-slate-500"><ArrowLeft className="mr-2 h-4 w-4"/> Voltar</Button>
                <h1 className="text-3xl font-black text-slate-900 uppercase">Banners Institucionais</h1>
                <p className="text-slate-500">Gerencie os destaques rotativos da Home Page.</p>
            </div>
            <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 font-bold"><Plus className="mr-2 h-4 w-4"/> Novo Banner</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map(banner => (
                <Card key={banner.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        {banner.url_imagem && (
                            <img 
                                src={`https://www.ambamazonas.com.br${banner.url_imagem}`} 
                                className={`w-full h-full ${banner.modo_exibicao === 'contain' ? 'object-contain bg-black' : 'object-cover'}`}
                            />
                        )}
                        <Badge className={`absolute top-2 right-2 ${banner.status === 'ativo' ? 'bg-green-500' : 'bg-slate-500'}`}>{banner.status}</Badge>
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{banner.titulo}</h3>
                        <p className="text-xs text-slate-400 mb-4 flex items-center gap-1"><MonitorPlay className="h-3 w-3"/> Ordem: {banner.ordem} • {banner.modo_exibicao === 'cover' ? 'Expandido' : 'Inteiro'}</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(banner)}><Edit className="h-4 w-4 mr-2"/> Editar</Button>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(banner.id)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader><DialogTitle>{formData.id ? 'Editar Banner' : 'Novo Banner'}</DialogTitle></DialogHeader>
                <div className="grid md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <div 
                            className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden relative ${previewImagem ? 'border-slate-200' : 'border-slate-300 bg-slate-50'}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewImagem ? (
                                <img src={previewImagem} className={`w-full h-full ${formData.modo_exibicao === 'contain' ? 'object-contain bg-black' : 'object-cover'}`} />
                            ) : (
                                <div className="text-center text-slate-400"><ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50"/><span className="text-xs">Clique para imagem (1920x600)</span></div>
                            )}
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={e => { if(e.target.files?.[0]) { setImagemFile(e.target.files[0]); setPreviewImagem(URL.createObjectURL(e.target.files[0])); } }} />
                        </div>
                        <div className="space-y-2">
                            <Label>Modo de Exibição</Label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" name="modo" checked={formData.modo_exibicao === 'cover'} onChange={() => setFormData({...formData, modo_exibicao: 'cover'})} /> Expandir (Zoom)
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input type="radio" name="modo" checked={formData.modo_exibicao === 'contain'} onChange={() => setFormData({...formData, modo_exibicao: 'contain'})} /> Fundo Preto (Inteiro)
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2"><Label>Título Interno</Label><Input value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})}/></div>
                        <div className="space-y-2"><Label>Link de Destino (Opcional)</Label><Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..."/></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Ordem</Label><Input type="number" value={formData.ordem} onChange={e => setFormData({...formData, ordem: e.target.value})}/></div>
                            <div className="space-y-2"><Label>Status</Label><Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="space-y-2 pt-2 border-t">
                            <Label className="flex items-center gap-2 text-slate-500"><CalendarClock className="h-4 w-4"/> Agendamento (Opcional)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input type="datetime-local" value={formData.data_inicio} onChange={e => setFormData({...formData, data_inicio: e.target.value})} className="text-xs"/>
                                <Input type="datetime-local" value={formData.data_fim} onChange={e => setFormData({...formData, data_fim: e.target.value})} className="text-xs"/>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : 'Salvar'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}