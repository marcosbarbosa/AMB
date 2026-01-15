/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: GestaoTimesPage.tsx
 * CAMINHO: client/src/pages/admin/GestaoTimesPage.tsx
 * DATA: 14 de Janeiro de 2026
 * HORA: 23:58
 * FUNÇÃO: Gestão de Times (CRUD Completo)
 * VERSÃO: 8.0 Prime (Fix Delete Token)
 * ==========================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Upload, Loader2, Edit, Trash2, Eye, 
  Search, XCircle, ArrowLeft, PlusCircle 
} from 'lucide-react';

const API_BASE = 'https://www.ambamazonas.com.br/api';

interface Time {
  id: number;
  nome_time: string;
  categoria?: string;
  url_logo: string | null;
  url_logo_time?: string | null;
}

export default function GestaoTimesPage() {
  const { token, isAuthenticated, atleta, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [times, setTimes] = useState<Time[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ nome_time: '', categoria: '' });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [viewTime, setViewTime] = useState<Time | null>(null);

  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (atleta?.role !== 'admin')) { 
      navigate('/'); 
    } else {
      fetchTimes(); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate]); 

  const fetchTimes = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/listar_times_admin.php`, { params: { token } });
      if (res.data.status === 'sucesso') {
        const timesNormalizados = res.data.times.map((t: any) => ({
            ...t,
            url_logo: t.url_logo || t.url_logo_time
        }));
        setTimes(timesNormalizados);
      } else {
        setTimes([]);
      }
    } catch (error) {
      console.error("Erro buscar times", error);
      toast({ title: "Erro de Conexão", description: "Não foi possível carregar os times.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (time: Time) => {
    setEditingId(time.id);
    setFormData({ 
        nome_time: time.nome_time, 
        categoria: time.categoria || '' 
    });
    const urlImagem = time.url_logo || time.url_logo_time;
    setPreviewLogo(urlImagem ? `https://www.ambamazonas.com.br${urlImagem}` : null);
    setLogoFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ nome_time: '', categoria: '' });
    setPreviewLogo(null);
    setLogoFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- CORREÇÃO CRÍTICA NA FUNÇÃO DE EXCLUSÃO ---
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este time permanentemente?")) return;

    try {
        // CORREÇÃO: Enviando ID e TOKEN no corpo da requisição
        const res = await axios.post(`${API_BASE}/admin_excluir_time.php`, { 
            id: id,
            token: token // <--- O SEGREDO ESTAVA AQUI!
        });

        if (res.data.status === 'sucesso') {
            toast({ title: "Sucesso", description: "Time removido com sucesso.", className: "bg-green-600 text-white" });
            setTimes(prev => prev.filter(t => t.id !== id));

            // Se o usuário estava editando o time que acabou de excluir, limpa o form
            if (editingId === id) {
                handleCancelEdit();
            }
        } else {
            throw new Error(res.data.mensagem);
        }
    } catch (error: any) {
        console.error("Erro ao excluir:", error);
        const msg = error.response?.data?.mensagem || "Falha ao excluir.";
        toast({ title: "Erro", description: msg, variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome_time) return toast({ title: "Erro", description: "Nome obrigatório.", variant: "destructive" });

    setIsSubmitting(true);
    const data = new FormData();
    data.append('nome_time', formData.nome_time);
    data.append('categoria', formData.categoria);
    data.append('token', token || '');

    if (editingId) data.append('id', editingId.toString());
    if (logoFile) data.append('logo', logoFile);

    try {
        const res = await axios.post(`${API_BASE}/admin_salvar_time.php`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.status === 'sucesso') {
            toast({ title: "Sucesso!", description: editingId ? "Time atualizado." : "Time criado." });
            fetchTimes();
            handleCancelEdit();
        } else {
            throw new Error(res.data.mensagem);
        }
    } catch (error: any) {
        toast({ title: "Erro", description: error.message || "Falha ao salvar.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  const filteredTimes = times.filter(t => t.nome_time.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
            <Link to="/admin/painel" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Painel
            </Link>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Gestão de Times (Equipes)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* --- FORMULÁRIO --- */}
            <Card className={`border-none shadow-xl h-fit ${editingId ? 'ring-2 ring-yellow-400' : ''}`}>
                <CardHeader className={editingId ? "bg-yellow-50 rounded-t-xl" : "bg-white rounded-t-xl"}>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                        {editingId ? <Edit className="h-5 w-5 text-yellow-600"/> : <PlusCircle className="h-5 w-5 text-slate-900"/>}
                        {editingId ? "Editar Time" : "Criar Novo Time"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nome do Time</Label>
                            <Input placeholder="Ex: Botafogo AM" value={formData.nome_time} onChange={e => setFormData({...formData, nome_time: e.target.value})} className="font-bold"/>
                        </div>
                        <div className="space-y-2">
                            <Label>Categoria (Opcional)</Label>
                            <Input placeholder="Ex: Master 40+" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}/>
                        </div>
                        <div className="space-y-2">
                            <Label>Escudo / Logo</Label>
                            {/* PREVIEW DO UPLOAD: MANTIDO QUADRADO PARA VISUALIZAÇÃO CLARA */}
                            <div className="flex flex-col items-center gap-4 border-2 border-dashed rounded-xl p-4 bg-slate-50">
                                {previewLogo ? (
                                    <div className="relative h-32 w-32 bg-white rounded-lg shadow-sm border p-1">
                                        <img src={previewLogo} className="h-full w-full object-contain" />
                                        <button type="button" onClick={() => { setPreviewLogo(null); setLogoFile(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"><XCircle className="h-4 w-4"/></button>
                                    </div>
                                ) : ( <Shield className="h-12 w-12 text-slate-300" /> )}
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4"/> Escolher Imagem</Button>
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) { setLogoFile(e.target.files[0]); setPreviewLogo(URL.createObjectURL(e.target.files[0])); }}} />
                            </div>
                        </div>
                        <div className="pt-2 flex gap-2">
                            {editingId && <Button type="button" variant="outline" className="flex-1" onClick={handleCancelEdit}>Cancelar</Button>}
                            <Button type="submit" disabled={isSubmitting} className={`flex-1 font-bold ${editingId ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-blue-600 hover:bg-blue-700'}`}>{isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? 'Atualizar' : 'Criar Time'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* --- LISTAGEM --- */}
            <div className="lg:col-span-2 space-y-4">
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Times Cadastrados ({times.length})</CardTitle>
                            <div className="relative w-64"><Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400"/><Input placeholder="Buscar..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? ( <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-400"/></div> ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                                        <tr><th className="px-6 py-3">Escudo</th><th className="px-6 py-3">Nome</th><th className="px-6 py-3">ID</th><th className="px-6 py-3 text-right">Ações</th></tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredTimes.map((time) => (
                                            <tr key={time.id} className={`hover:bg-slate-50 transition-colors ${editingId === time.id ? 'bg-yellow-50' : ''}`}>
                                                <td className="px-6 py-3">
                                                    {/* MINIATURA: Aumentei o padding (p-1.5) para não cortar */}
                                                    <div className="h-10 w-10 bg-white rounded-full border flex items-center justify-center overflow-hidden">
                                                        {(time.url_logo || time.url_logo_time) ? (
                                                            <img src={`https://www.ambamazonas.com.br${time.url_logo || time.url_logo_time}`} className="h-full w-full object-contain p-1.5" />
                                                        ) : (
                                                            <Shield className="h-5 w-5 text-slate-300"/>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 font-bold text-slate-800">{time.nome_time} {time.categoria && <span className="block text-xs text-slate-400 font-normal">{time.categoria}</span>}</td>
                                                <td className="px-6 py-3 text-slate-400 font-mono text-xs">#{time.id}</td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" onClick={() => setViewTime(time)}><Eye className="h-4 w-4 text-slate-400 hover:text-blue-600" /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(time)}><Edit className="h-4 w-4 text-slate-400 hover:text-yellow-600" /></Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(time.id)}><Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredTimes.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">Nenhum time encontrado.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* --- MODAL DE VISUALIZAÇÃO --- */}
        <Dialog open={!!viewTime} onOpenChange={() => setViewTime(null)}>
            <DialogContent>
                <DialogHeader><DialogTitle>Detalhes do Time</DialogTitle></DialogHeader>
                {viewTime && (
                    <div className="flex flex-col items-center py-6 gap-4">
                        {/* CORREÇÃO CRÍTICA AQUI:
                            Mudado de 'rounded-full' para 'rounded-2xl' (Quadrado Arredondado).
                            Isso evita que escudos quadrados ou pontudos sejam cortados.
                        */}
                        <div className="h-40 w-40 bg-white rounded-2xl border-2 border-slate-100 shadow-xl flex items-center justify-center overflow-hidden p-2">
                             {(viewTime.url_logo || viewTime.url_logo_time) ? (
                                <img src={`https://www.ambamazonas.com.br${viewTime.url_logo || viewTime.url_logo_time}`} className="w-full h-full object-contain" />
                             ) : (
                                <Shield className="h-16 w-16 text-slate-300"/>
                             )}
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-slate-900 uppercase">{viewTime.nome_time}</h2>
                            <Badge variant="secondary" className="mt-2">{viewTime.categoria || 'Categoria Geral'}</Badge>
                            <p className="text-xs text-slate-400 mt-4 font-mono">ID SISTEMA: #{viewTime.id}</p>
                        </div>
                    </div>
                )}
                <DialogFooter><Button onClick={() => setViewTime(null)}>Fechar</Button></DialogFooter>
            </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}