/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ARQUIVO: GestaoTransparencia.tsx
 * CAMINHO: client/src/pages/admin/GestaoTransparencia.tsx
 * DATA: 15 de Janeiro de 2026
 * HORA: 19:15
 * FUNÇÃO: Painel de Upload e Edição (Com Visualização do Arquivo Atual)
 * VERSÃO: 6.2 Prime (Touch of Class)
 * ==========================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Upload, FileCheck, ArrowLeft, Trash2, Eye, FileType, 
  ShieldCheck, History, TrendingUp, FileText, Pencil, XCircle, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const API_BASE = 'https://www.ambamazonas.com.br/api';

interface Documento {
  id: number;
  titulo: string;
  tipo: string;
  ano_referencia: string;
  url_arquivo: string;
  data_formatada: string;
}

export default function GestaoTransparencia() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para limpar o input

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);

  // Estado do formulário (Adicionado currentUrl para mostrar o link na edição)
  const [formData, setFormData] = useState({
    id: 0,
    titulo: '',
    tipo: 'geral',
    ano_referencia: new Date().getFullYear().toString(),
    currentUrl: '' // Guarda a URL do arquivo atual durante a edição
  });

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/listar_documentos_admin.php`, { params: { token }});
      if (res.data.status === 'sucesso') {
        setDocumentos(res.data.documentos);
      }
    } catch (error) {
      console.error("Erro ao listar", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast({ title: "Formato Inválido", description: "Apenas PDF permitido.", variant: "destructive" });
        return;
      }
      setFile(selectedFile);
    }
  };

  // Prepara o formulário para edição
  const handleEdit = (doc: Documento) => {
    setFormData({
      id: doc.id,
      titulo: doc.titulo,
      tipo: doc.tipo,
      ano_referencia: doc.ano_referencia,
      currentUrl: doc.url_arquivo // Salva a URL para mostrar o link
    });
    setFile(null); 
    if (fileInputRef.current) fileInputRef.current.value = ""; // Limpa o input file visualmente

    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({ title: "Modo de Edição", description: `Editando: ${doc.titulo}` });
  };

  // Limpa o formulário (Cancela edição)
  const resetForm = () => {
    setFormData({
      id: 0,
      titulo: '',
      tipo: 'geral',
      ano_referencia: new Date().getFullYear().toString(),
      currentUrl: ''
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((formData.id === 0 && !file) || !formData.titulo || !formData.tipo) {
      toast({ title: "Incompleto", description: "Preencha os campos obrigatórios.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('id', formData.id.toString());
    if (file) data.append('arquivo', file);
    data.append('titulo', formData.titulo);
    data.append('tipo', formData.tipo);
    data.append('ano_referencia', formData.ano_referencia);
    data.append('token', token || '');

    try {
      const res = await axios.post(`${API_BASE}/admin_salvar_documento.php`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso!", description: formData.id > 0 ? "Documento atualizado." : "Documento publicado." });
        resetForm();
        fetchDocumentos(); 
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || error.message;
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja EXCLUIR este documento?")) return;
    try {
        const res = await axios.post(`${API_BASE}/admin_excluir_documento.php`, { id, token });
        if (res.data.status === 'sucesso') {
            toast({ title: "Removido", description: "Documento apagado." });
            setDocumentos(prev => prev.filter(d => d.id !== id));
        } else {
            throw new Error(res.data.mensagem);
        }
    } catch (error) {
        toast({ title: "Erro", description: "Falha na exclusão.", variant: "destructive" });
    }
  };

  const getIcon = (tipo: string) => {
      switch(tipo) {
          case 'estatuto': return <ShieldCheck className="h-4 w-4 text-yellow-600"/>;
          case 'historico': return <History className="h-4 w-4 text-blue-600"/>;
          case 'financeiro': return <TrendingUp className="h-4 w-4 text-green-600"/>;
          default: return <FileText className="h-4 w-4 text-slate-500"/>;
      }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-12">

        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/admin/painel')} className="hover:bg-slate-200">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gestão de Documentos</h1>
                <p className="text-slate-500 text-sm">Publique Estatutos, Históricos e Balanços na área de Transparência.</p>
            </div>
        </div>

        {/* --- UPLOAD / EDIÇÃO --- */}
        <Card className={`border-none shadow-lg rounded-2xl overflow-hidden mb-10 bg-white ${formData.id > 0 ? 'ring-2 ring-yellow-400' : ''}`}>
          <CardHeader className={`${formData.id > 0 ? 'bg-yellow-500' : 'bg-slate-900'} text-white p-6 border-b border-slate-800 transition-colors duration-300`}>
            <CardTitle className="flex items-center justify-between text-lg font-bold uppercase tracking-wider">
              <div className="flex items-center gap-3">
                {formData.id > 0 ? <Pencil className="h-5 w-5 text-white" /> : <Upload className="h-5 w-5 text-yellow-500" />}
                {formData.id > 0 ? 'Editando Documento' : 'Upload de Arquivo'}
              </div>
              {formData.id > 0 && (
                <Button variant="ghost" size="sm" onClick={resetForm} className="text-white hover:bg-white/20 hover:text-white">
                    <XCircle className="mr-2 h-4 w-4"/> Cancelar Edição
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-6 space-y-2">
                  <Label className="text-slate-600 font-bold">Título do Documento</Label>
                  <Input 
                    placeholder="Ex: Estatuto Social ou Histórico Equipes 2025" 
                    value={formData.titulo} 
                    onChange={e => setFormData({...formData, titulo: e.target.value})} 
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-slate-600 font-bold">Categoria / Tipo</Label>
                  <Select value={formData.tipo} onValueChange={v => setFormData({...formData, tipo: v})}>
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estatuto">📜 Estatuto / Oficial</SelectItem>
                      <SelectItem value="historico">🏛️ Histórico / Memória</SelectItem>
                      <SelectItem value="financeiro">💰 Financeiro / Balanço</SelectItem>
                      <SelectItem value="geral">📂 Geral / Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-slate-600 font-bold">Ano Referência</Label>
                  <Input 
                    type="number" 
                    value={formData.ano_referencia} 
                    onChange={e => setFormData({...formData, ano_referencia: e.target.value})} 
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {/* --- TOQUE DE CLASSE: Link para o arquivo atual durante a edição --- */}
                {formData.id > 0 && formData.currentUrl && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md border border-blue-100 mb-2">
                        <FileText className="h-4 w-4"/>
                        <span className="font-semibold">Arquivo Atual em uso:</span>
                        <a 
                            href={`https://www.ambamazonas.com.br${formData.currentUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-800 flex items-center gap-1"
                        >
                            Visualizar PDF <ExternalLink className="h-3 w-3"/>
                        </a>
                    </div>
                )}

                <div 
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`} 
                    onClick={() => document.getElementById('file')?.click()}
                >
                    <input ref={fileInputRef} id="file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                    {file ? (
                        <div className="flex items-center justify-center gap-2 text-green-700 font-bold">
                            <FileCheck className="h-6 w-6"/> {file.name}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400 font-medium">
                            <FileType className="h-8 w-8 opacity-50"/> 
                            <span>{formData.id > 0 ? 'Clique para substituir o PDF (Opcional)' : 'Clique para selecionar o PDF (Máx 10MB)'}</span>
                            <span className="text-xs text-slate-300">Salvo em: /uploads/docs-oficiais/</span>
                        </div>
                    )}
                </div>
              </div>

              <Button type="submit" disabled={loading} className={`w-full h-12 text-lg font-bold shadow-lg ${formData.id > 0 ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : (formData.id > 0 ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR DOCUMENTO')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* --- LISTAGEM --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[120px] font-bold text-slate-600 uppercase text-xs">Ano</TableHead>
                        <TableHead className="w-[180px] font-bold text-slate-600 uppercase text-xs">Tipo</TableHead>
                        <TableHead className="font-bold text-slate-600 uppercase text-xs">Documento</TableHead>
                        <TableHead className="text-right font-bold text-slate-600 uppercase text-xs">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documentos.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center py-10 text-slate-400">Nenhum documento encontrado.</TableCell></TableRow>
                    ) : (
                        documentos.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-slate-50 transition-colors">
                                <TableCell>
                                    <Badge variant="outline" className="font-bold bg-slate-100 text-slate-700 border-slate-300">
                                        {doc.ano_referencia}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 capitalize">
                                        {getIcon(doc.tipo)} {doc.tipo}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <a 
                                        href={`https://www.ambamazonas.com.br${doc.url_arquivo}`} 
                                        target="_blank" rel="noopener noreferrer"
                                        className="font-bold text-slate-800 hover:text-blue-600 hover:underline flex items-center gap-2"
                                    >
                                        {doc.titulo}
                                    </a>
                                    <p className="text-[10px] text-slate-400 font-mono mt-1">Postado em: {doc.data_formatada}</p>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => window.open(`https://www.ambamazonas.com.br${doc.url_arquivo}`, '_blank')} className="h-8 w-8 text-slate-400 hover:text-blue-600" title="Visualizar">
                                            <Eye className="h-4 w-4" />
                                        </Button>

                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(doc)} className="h-8 w-8 text-slate-400 hover:text-yellow-600" title="Editar">
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="h-8 w-8 text-slate-400 hover:text-red-600" title="Excluir">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
      </main>
      <Footer />
    </div>
  );
}