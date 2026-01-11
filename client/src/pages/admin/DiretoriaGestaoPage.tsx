/*
 * ==========================================================
 * MÓDULO: DiretoriaGestaoPage.tsx
 * Versão: 10.0 (UI Prime: Confirmação de Exclusão Elegante)
 * ==========================================================
 */
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
// IMPORTANTE: Usamos o Dialog também para o alerta para garantir compatibilidade
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
const BASE_IMG_URL = 'https://www.ambamazonas.com.br/assets/diretoria-fotos/';

export default function DiretoriaGestaoPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [diretoria, setDiretoria] = useState<any[]>([]);

  // Estados do Modal de Cadastro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estado do Modal de Exclusão (NOVO)
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

  const getImageUrl = (dbUrl: string | null) => {
    if (!dbUrl || dbUrl === 'NULL' || dbUrl === '') return null;
    let cleanUrl = dbUrl.replace(/['"]/g, '');
    if (cleanUrl.startsWith('http')) return cleanUrl;
    cleanUrl = cleanUrl.replace(/^(\.\.\/)+assets\/diretoria-fotos\//, '');
    return `${BASE_IMG_URL}${cleanUrl}`;
  };

  const handleEdit = (diretor: any) => {
    setEditingId(diretor.id);
    setPreviewUrl(getImageUrl(diretor.url_foto));
    setIsModalOpen(true);
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
    if (file) setPreviewUrl(URL.createObjectURL(file));
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
        toast({ title: "Sucesso", description: editingId ? "Atualizado!" : "Criado!" });
        setIsModalOpen(false);
        loadDiretoria();
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. INICIA O PROCESSO DE EXCLUSÃO (Abre o Modal)
  const triggerDelete = (id: number) => {
    setIdToDelete(id);
  };

  // 2. CONFIRMA A EXCLUSÃO (Chama a API)
  const confirmDelete = async () => {
    if (!idToDelete) return;

    try {
      const response = await axios.post(API_DEL_DIR, JSON.stringify({ id: idToDelete }), {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.status === 'sucesso') {
        toast({ title: "Excluído", description: "Registro removido com sucesso." });
        setDiretoria(prev => prev.filter(d => d.id !== idToDelete));
      } else {
        toast({ title: "Erro", description: response.data.mensagem, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha na comunicação.", variant: "destructive" });
    } finally {
      setIdToDelete(null); // Fecha o modal
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin mr-2"/> Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin/painel" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" /> Gestão da Diretoria
            </h1>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90" onClick={handleNew}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
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
                  <div className="flex items-center gap-4 border p-2 rounded-md bg-slate-50">
                      {previewUrl ? (
                         <img src={previewUrl} className="w-12 h-12 rounded-full object-cover" alt="Preview" />
                      ) : (
                         <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center"><Users className="h-6 w-6 text-slate-400"/></div>
                      )}
                      <Input type="file" name="foto" accept="image/*" onChange={handleFileChange} className="border-0 bg-transparent text-sm cursor-pointer" />
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : (editingId ? 'Salvar Alterações' : 'Criar Registro')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* LISTA DE MEMBROS */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h2 className="text-lg font-semibold text-slate-800">Membros Ativos ({diretoria.length})</h2>
           </div>

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
                             {/* BOTÕES DE AÇÃO VISÍVEIS */}
                             <div className="absolute top-2 right-2 flex gap-2 z-20">
                               <button 
                                  className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors shadow-sm backdrop-blur-sm"
                                  onClick={() => handleEdit(membro)}
                                  title="Editar"
                               >
                                  <Edit className="h-4 w-4" />
                               </button>
                               <button 
                                  className="p-2 rounded-full bg-red-500/20 text-white hover:bg-red-600 transition-colors shadow-sm backdrop-blur-sm"
                                  // CHAMA O NOVO TRIGGER (NÃO O CONFIRM DO NAVEGADOR)
                                  onClick={() => triggerDelete(membro.id)}
                                  title="Excluir"
                               >
                                  <Trash2 className="h-4 w-4" />
                               </button>
                            </div>
                         </div>

                         <CardContent className="relative pt-0 pb-6 px-4 flex flex-col items-center">
                            <div className="-mt-12 w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white z-10 flex-shrink-0">
                               {photoUrl ? (
                                  <img 
                                    src={photoUrl} 
                                    alt={membro.nome} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display='none'; }} 
                                  />
                               ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-2xl">
                                     {membro.nome.charAt(0)}
                                  </div>
                               )}
                            </div>
                            <div className="mt-4 text-center w-full">
                               <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{membro.nome}</h3>
                               <p className="text-primary font-medium text-sm mt-1 mb-3 line-clamp-1">{membro.cargo}</p>
                               <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
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

      {/* 3. COMPONENTE DE ALERTA (MODAL ELEGANTE) */}
      <AlertDialog open={!!idToDelete} onOpenChange={() => setIdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
               <AlertTriangle className="h-5 w-5" /> Excluir Membro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível. O registro do diretor e a foto associada serão removidos permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
               onClick={confirmDelete} 
               className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
               Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}