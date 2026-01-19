// Nome: DiretoriaGestaoPage.tsx
// Caminho: client/src/pages/admin/DiretoriaGestaoPage.tsx
// Data: 2026-01-19
// Hora: 21:00
// Função: Gestão com Correção de Preview de Imagem
// Versão: v11.0 Image Path Fix

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation'; 
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowLeft, Trash2, Plus, Briefcase, Calendar, Loader2, Edit, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_BASE = 'https://www.ambamazonas.com.br/api';
const API_LIST_DIR = `${API_BASE}/get_diretoria.php`;
const API_ADD_DIR = `${API_BASE}/cadastrar_diretor.php`;
const API_EDIT_DIR = `${API_BASE}/editar_diretor.php`;
const API_DEL_DIR = `${API_BASE}/excluir_diretor.php`;

// CAMINHO BASE PADRONIZADO
const BASE_IMG_URL = 'https://www.ambamazonas.com.br/uploads/diretoria/';

export default function DiretoriaGestaoPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [diretoria, setDiretoria] = useState<any[]>([]);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // Refs
  const nomeRef = useRef<HTMLInputElement>(null);
  const cargoRef = useRef<HTMLInputElement>(null);
  const inicioRef = useRef<HTMLInputElement>(null);
  const fimRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDiretoria();
  }, []);

  const loadDiretoria = async () => {
    try {
      // Timestamp para evitar cache de imagem antiga
      const res = await axios.get(`${API_LIST_DIR}?t=${new Date().getTime()}`);
      if (res.data.status === 'sucesso') {
         setDiretoria(res.data.dados || []);
      } else {
         setDiretoria([]);
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  // LÓGICA INTELIGENTE DE URL DE IMAGEM
  const getImageUrl = (dbUrl: string | null) => {
    if (!dbUrl || dbUrl === 'NULL' || dbUrl === '') return null;

    // Remove aspas extras se vierem do JSON mal formatado
    let cleanUrl = dbUrl.replace(/['"]/g, '');

    // 1. Se já for URL completa
    if (cleanUrl.startsWith('http')) return cleanUrl;

    // 2. Se for caminho relativo legado (/uploads/...)
    if (cleanUrl.startsWith('/uploads')) return `https://www.ambamazonas.com.br${cleanUrl}`;

    // 3. Se for apenas o nome do arquivo (novo padrão)
    return `${BASE_IMG_URL}${cleanUrl}`;
  };

  const handleEdit = (diretor: any) => {
    setEditingId(diretor.id);
    setPreviewUrl(getImageUrl(diretor.url_foto));
    setIsModalOpen(true);
    // Timeout para garantir que o modal renderizou os inputs
    setTimeout(() => {
        if(nomeRef.current) nomeRef.current.value = diretor.nome;
        if(cargoRef.current) cargoRef.current.value = diretor.cargo;
        if(inicioRef.current) inicioRef.current.value = diretor.inicio_gestao;
        if(fimRef.current) fimRef.current.value = diretor.fim_gestao;
    }, 100);
  };

  const handleNew = () => {
    setEditingId(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
    setTimeout(() => {
        if(nomeRef.current) nomeRef.current.value = "";
        if(cargoRef.current) cargoRef.current.value = "";
        if(inicioRef.current) inicioRef.current.value = "2026-01-01";
        if(fimRef.current) fimRef.current.value = "2028-12-31";
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('nome', nomeRef.current?.value || '');
    formData.append('cargo', cargoRef.current?.value || '');
    formData.append('inicio_gestao', inicioRef.current?.value || '');
    formData.append('fim_gestao', fimRef.current?.value || '');
    formData.append('ordem', '99');

    const fileInput = (e.target as any).foto as HTMLInputElement;
    if (fileInput?.files?.[0]) {
        formData.append('foto', fileInput.files[0]);
    }

    try {
      let response;
      if (editingId) {
        formData.append('id', editingId.toString());
        response = await axios.post(API_EDIT_DIR, formData);
      } else {
        response = await axios.post(API_ADD_DIR, formData);
      }

      if (response.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: editingId ? "Membro atualizado!" : "Membro criado!", className: "bg-green-600 text-white" });
        setIsModalOpen(false);
        loadDiretoria(); // Recarrega lista
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Falha ao salvar", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerDelete = (id: number) => {
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    try {
      const response = await axios.post(API_DEL_DIR, JSON.stringify({ id: idToDelete }), {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.status === 'sucesso') {
        toast({ title: "Excluído", description: "Membro removido." });
        setDiretoria(prev => prev.filter(d => d.id !== idToDelete));
      } else {
        toast({ title: "Erro", description: response.data.mensagem, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha na comunicação.", variant: "destructive" });
    } finally {
      setIdToDelete(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2"/> Carregando Diretoria...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="print:hidden"><Navigation /></div>
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin/painel" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-blue-600" /> Gestão da Diretoria
            </h1>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg" onClick={handleNew}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
                <DialogDescription>{editingId ? 'Atualize as informações oficiais.' : 'Preencha os dados do integrante.'}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label>Nome Completo</Label>
                      <Input ref={nomeRef} name="nome" required placeholder="Ex: Nome do Diretor" />
                   </div>
                   <div className="space-y-2">
                      <Label>Cargo</Label>
                      <Input ref={cargoRef} name="cargo" required placeholder="Ex: Presidente" />
                   </div>
                </div>
                <div className="space-y-2">
                  <Label>Foto Oficial</Label>
                  <div className="flex items-center gap-4 border p-4 rounded-xl bg-slate-50 border-dashed border-slate-300">
                      {previewUrl ? (
                         <img src={previewUrl} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" alt="Preview" />
                      ) : (
                         <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center"><Users className="h-8 w-8 text-slate-400"/></div>
                      )}
                      <div>
                        <Input type="file" name="foto" accept="image/*" onChange={handleFileChange} className="max-w-[220px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        <p className="text-[10px] text-slate-400 mt-1">Recomendado: 500x500px (JPG/PNG)</p>
                      </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label>Início</Label>
                      <Input ref={inicioRef} type="date" name="inicio_gestao" />
                   </div>
                   <div className="space-y-2">
                      <Label>Fim</Label>
                      <Input ref={fimRef} type="date" name="fim_gestao" />
                   </div>
                </div>
                <Button type="submit" className="w-full bg-slate-900 hover:bg-black font-bold h-12" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : (editingId ? 'Salvar Alterações' : 'Criar Registro')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* LISTA DE MEMBROS */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           {diretoria.length === 0 ? (
              <div className="text-center py-12">
                 <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                 <p className="text-muted-foreground">Nenhum diretor cadastrado.</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                 {diretoria.map((membro) => {
                    const photoUrl = getImageUrl(membro.url_foto);

                    return (
                      <Card key={membro.id} className="group relative overflow-visible border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                         <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-lg relative">
                             <div className="absolute top-2 right-2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                               <button 
                                  className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-50 transition-colors shadow-md"
                                  onClick={() => handleEdit(membro)}
                                  title="Editar"
                               >
                                  <Edit className="h-4 w-4" />
                               </button>
                               <button 
                                  className="p-2 rounded-full bg-white text-red-600 hover:bg-red-50 transition-colors shadow-md"
                                  onClick={() => triggerDelete(membro.id)}
                                  title="Excluir"
                               >
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                         </div>

                         <CardContent className="relative pt-0 pb-6 px-4 flex flex-col items-center">
                            <div className="-mt-12 w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white z-10 flex-shrink-0 relative">
                               {photoUrl ? (
                                  <img 
                                    src={photoUrl} 
                                    alt={membro.nome} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { 
                                        e.currentTarget.style.display='none'; 
                                        // Fallback visual se a imagem quebrar
                                        e.currentTarget.parentElement?.classList.add('bg-slate-200', 'flex', 'items-center', 'justify-center');
                                        e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-bold text-slate-400">?</span>';
                                    }} 
                                  />
                               ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-2xl">
                                     {membro.nome.charAt(0)}
                                  </div>
                               )}
                            </div>
                            <div className="mt-4 text-center w-full">
                               <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{membro.nome}</h3>
                               <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mt-1 mb-3">{membro.cargo}</p>
                               <div className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(membro.inicio_gestao).getFullYear()} - {new Date(membro.fim_gestao).getFullYear()}</span>
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                    );
                 })}
              </div>
           )}
        </section>
      </main>

      <AlertDialog open={!!idToDelete} onOpenChange={() => setIdToDelete(null)}>
        <AlertDialogContent className="bg-white border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600 font-black">
               <AlertTriangle className="h-6 w-6" /> Excluir Membro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 font-medium">
              Esta ação é irreversível. O registro do diretor e a foto associada serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold border-0 hover:bg-slate-100">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
               onClick={confirmDelete} 
               className="bg-red-600 hover:bg-red-700 text-white font-bold border-0 shadow-lg shadow-red-200"
            >
               Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="print:hidden"><Footer /></div>
    </div>
  );
}
// linha 250 DiretoriaGestaoPage.tsx