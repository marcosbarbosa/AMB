/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - Diretoria & BI
 * ==========================================================
 * Versão: 5.1 (Correção de Importação do Toast e Manutenção)
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  Users, UserPlus, Handshake, TrendingUp, 
  ArrowLeft, Home, Plus, Upload, ImageIcon, Loader2, Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// CORREÇÃO DO IMPORT AQUI
import { useToast } from "@/hooks/use-toast"; 

export default function GestaoDiretoriaPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [diretoria, setDiretoria] = useState<any[]>([]);

  const [form, setForm] = useState({
    nome: "", cargo: "", inicio_gestao: "2025-01-01", fim_gestao: "2027-12-31", ordem: 0
  });

  const carregarDados = async () => {
    try {
      const res = await axios.get("https://www.ambamazonas.com.br/api/get_diretoria.php");
      setDiretoria(res.data.dados || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { carregarDados(); }, []);

  const handleSalvar = async () => {
    if (!form.nome || !form.cargo) {
      toast({ title: "Atenção", description: "Nome e cargo são obrigatórios.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));
    if (fotoFile) formData.append('foto', fotoFile);

    try {
      setLoading(true);
      const res = await axios.post("https://www.ambamazonas.com.br/api/cadastrar_diretor.php", formData);
      if (res.data.status === "sucesso") {
        toast({ title: "Sucesso!", description: "Diretor cadastrado com sucesso." });
        setIsModalOpen(false);
        setPreviewUrl(null);
        carregarDados();
      }
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao salvar no servidor.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="mr-2" /> Voltar</Button>
          <Button variant="ghost" asChild><Link to="/"><Home className="mr-2" /> Início</Link></Button>
        </div>

        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black italic uppercase">Gestão Diretoria</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 font-bold uppercase italic"><Plus size={18} className="mr-2" /> Novo Diretor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle className="uppercase italic font-black">Adicionar Diretor</DialogTitle></DialogHeader>
              <div className="grid gap-6 py-4 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24 border-2 border-orange-500">
                    {previewUrl ? <AvatarImage src={previewUrl} className="object-cover" /> : <AvatarFallback><ImageIcon /></AvatarFallback>}
                  </Avatar>
                  <Input type="file" id="foto" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setFotoFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                  }} />
                  <Button asChild variant="outline" size="sm" className="cursor-pointer">
                    <label htmlFor="foto"><Upload size={14} className="mr-2" /> Carregar Foto</label>
                  </Button>
                </div>
                <Input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
                <Input placeholder="Cargo" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} />
              </div>
              <DialogFooter>
                <Button onClick={handleSalvar} disabled={loading} className="w-full bg-orange-600 font-bold uppercase">{loading ? <Loader2 className="animate-spin" /> : "Confirmar"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABELA DE MEMBROS REAIS */}
        <Card className="border-none shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow>
                <TableHead className="text-white">Foto</TableHead>
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {diretoria.map(m => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://www.ambamazonas.com.br/uploads/diretoria/${m.url_foto}`} className="object-cover" />
                      <AvatarFallback>AMB</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-bold">{m.nome}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={18}/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}