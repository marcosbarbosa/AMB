/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 14 de Janeiro de 2026
 * Hora: 18:00
 * Versão: 5.0 (Grid Compacto Prime)
 *
 * Descrição: Gestão de transparência com tabela otimizada.
 * MELHORIA: Coluna de Tipo fundida com Nome para design limpo.
 *
 * ==========================================================
 */

import React, { useState, useEffect } from 'react';
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
  Loader2, Upload, FileCheck, ArrowLeft, FileText, Trash2, 
  Eye, Pencil, FileType
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Documento {
  id: number;
  titulo: string;
  mes: string;
  ano: number;
  url_arquivo: string;
  data_formatada: string;
}

export default function GestaoTransparencia() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);

  const [formData, setFormData] = useState({
    titulo: '',
    mes: '',
    ano: new Date().getFullYear().toString()
  });

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const fetchDocumentos = async () => {
    try {
      const res = await axios.get('https://www.ambamazonas.com.br/api/listar_transparencia.php');
      if (res.data.status === 'sucesso') {
        setDocumentos(res.data.documentos);
      }
    } catch (error) {
      console.error("Erro ao listar documentos", error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.titulo || !formData.mes || !formData.ano) {
      toast({ title: "Incompleto", description: "Preencha todos os campos e anexe o arquivo.", variant: "destructive" });
      return;
    }
    if (!token) { navigate('/login'); return; }

    setLoading(true);
    const data = new FormData();
    data.append('arquivo', file);
    data.append('titulo', formData.titulo);
    data.append('mes', formData.mes);
    data.append('ano', formData.ano);
    data.append('token', token);

    try {
      const res = await axios.post('https://www.ambamazonas.com.br/api/admin_salvar_transparencia.php', data, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });

      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso!", description: "Documento publicado." });
        setFormData({ ...formData, titulo: '' });
        setFile(null);
        fetchDocumentos(); 
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Falha no envio.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja EXCLUIR este documento permanentemente?")) return;
    try {
        const res = await axios.post('https://www.ambamazonas.com.br/api/admin_excluir_transparencia.php', { id });
        if (res.data.status === 'sucesso') {
            toast({ title: "Removido", description: "Documento apagado com sucesso." });
            setDocumentos(prev => prev.filter(d => d.id !== id));
        } else {
            toast({ title: "Erro", description: res.data.mensagem, variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Erro", description: "Falha na conexão.", variant: "destructive" });
    }
  };

  const handleEdit = (doc: Documento) => {
    setFormData({
        titulo: doc.titulo,
        mes: doc.mes,
        ano: doc.ano.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({ 
        title: "Modo de Edição", 
        description: "Os dados foram carregados. Anexe o PDF para atualizar." 
    });
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
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gestão de Transparência</h1>
                <p className="text-slate-500 text-sm">Controle de balancetes e documentos oficiais</p>
            </div>
        </div>

        {/* --- UPLOAD --- */}
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden mb-10 bg-white">
          <CardHeader className="bg-slate-900 text-white p-6 border-b border-slate-800">
            <CardTitle className="flex items-center gap-3 text-lg font-bold uppercase tracking-wider">
              <Upload className="h-5 w-5 text-yellow-500" /> Nova Publicação
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-12 gap-6">
                <div className="md:col-span-6 space-y-2">
                  <Label className="text-slate-600 font-bold">Título do Documento</Label>
                  <Input 
                    placeholder="Ex: Balancete Financeiro - Janeiro" 
                    value={formData.titulo} 
                    onChange={e => setFormData({...formData, titulo: e.target.value})} 
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-slate-600 font-bold">Mês de Ref.</Label>
                  <Select value={formData.mes} onValueChange={v => setFormData({...formData, mes: v})}>
                    <SelectTrigger className="h-11 bg-slate-50 border-slate-200"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-slate-600 font-bold">Ano</Label>
                  <Input 
                    type="number" 
                    value={formData.ano} 
                    onChange={e => setFormData({...formData, ano: e.target.value})} 
                    className="h-11 bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}`} 
                onClick={() => document.getElementById('file')?.click()}
              >
                <input id="file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                {file ? (
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold">
                        <FileCheck className="h-6 w-6"/> {file.name}
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
                        <Upload className="h-6 w-6 opacity-50"/> Clique para selecionar o PDF (Máx 10MB)
                    </div>
                )}
              </div>
              <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="animate-spin mr-2" /> : 'PUBLICAR DOCUMENTO'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* --- HISTÓRICO COMPACTO --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="w-[180px] font-bold text-slate-600 uppercase text-xs">Referência</TableHead>
                        <TableHead className="w-[150px] font-bold text-slate-600 uppercase text-xs">Postado em</TableHead>
                        {/* Coluna TIPO removida do header */}
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
                                        {doc.ano} • {doc.mes.toUpperCase().substring(0, 3)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 font-mono text-xs">{doc.data_formatada}</TableCell>

                                {/* CÉLULA MERGEADA: ÍCONE + NOME */}
                                <TableCell>
                                    <a 
                                        href={`https://www.ambamazonas.com.br${doc.url_arquivo}`} 
                                        target="_blank" rel="noopener noreferrer"
                                        className="font-bold text-slate-800 hover:text-blue-600 hover:underline flex items-center gap-3"
                                    >
                                        <div className="bg-red-50 p-1.5 rounded-md border border-red-100">
                                            <FileType className="h-4 w-4 text-red-500" />
                                        </div>
                                        {doc.titulo}
                                    </a>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => window.open(`https://www.ambamazonas.com.br${doc.url_arquivo}`, '_blank')} className="h-8 w-8 text-slate-400 hover:text-blue-600"><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(doc)} className="h-8 w-8 text-slate-400 hover:text-yellow-600"><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
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