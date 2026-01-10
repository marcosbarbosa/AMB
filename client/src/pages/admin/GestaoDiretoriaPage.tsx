/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - Gestão Diretoria & BI
 * ==========================================================
 * Versão: 6.0 (Versão Final Estabilizada - Design Elite)
 * ==========================================================
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from "recharts";
import { 
  Users, UserPlus, Handshake, TrendingUp, 
  ArrowLeft, Home, Plus, Upload, ImageIcon, Loader2, Trash2, AlertTriangle, ShieldCheck
} from "lucide-react";

// Componentes UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

// Hook de Mensagens (Caminho corrigido para o seu projeto)
import { useToast } from "@/hooks/use-toast";

// Configurações de URL
const API_BASE = "https://www.ambamazonas.com.br/api";
const UPLOADS_URL = "https://www.ambamazonas.com.br/uploads/diretoria/";

// Dados Mock para o BI (Enquanto o gráfico não é 100% dinâmico)
const dadosCrescimento = [
  { mes: "Jan", atletas: 45 }, { mes: "Fev", atletas: 52 },
  { mes: "Mar", atletas: 48 }, { mes: "Abr", atletas: 61 },
  { mes: "Mai", atletas: 85 }, { mes: "Jun", atletas: 110 },
  { mes: "Jul", atletas: 145 }, { mes: "Ago", atletas: 190 },
];

export default function GestaoDiretoriaPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados de Dados
  const [diretoria, setDiretoria] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [membroParaExcluir, setMembroParaExcluir] = useState<{id: number, nome: string} | null>(null);

  // Estados do Formulário
  const [form, setForm] = useState({ nome: "", cargo: "", ordem: 0, inicio: "2025-01-01", fim: "2027-12-31" });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 1. Carregar dados do Banco
  const carregarDados = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_diretoria.php`);
      setDiretoria(res.data.dados || []);
    } catch (e) {
      console.error("Erro ao carregar diretoria:", e);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  // 2. Lógica de Cadastro
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSalvar = async () => {
    if (!form.nome || !form.cargo) {
      toast({ title: "Erro", description: "Nome e cargo são obrigatórios.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("nome", form.nome);
    formData.append("cargo", form.cargo);
    formData.append("ordem", String(form.ordem));
    formData.append("inicio_gestao", form.inicio);
    formData.append("fim_gestao", form.fim);
    if (fotoFile) formData.append("foto", fotoFile);

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/cadastrar_diretor.php`, formData);
      if (res.data.status === "sucesso") {
        toast({ title: "Sucesso!", description: "Membro da diretoria cadastrado." });
        setIsModalOpen(false);
        setForm({ nome: "", cargo: "", ordem: 0, inicio: "2025-01-01", fim: "2027-12-31" });
        setFotoFile(null);
        setPreviewUrl(null);
        carregarDados();
      }
    } catch (e) {
      toast({ title: "Erro", description: "Falha na comunicação com o servidor.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // 3. Lógica de Exclusão Professional
  const abrirConfirmacaoExclusao = (id: number, nome: string) => {
    setMembroParaExcluir({ id, nome });
    setIsDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!membroParaExcluir) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/excluir_diretor.php`, { id: membroParaExcluir.id });
      if (res.data.status === "sucesso") {
        toast({ title: "Removido!", description: "O membro foi retirado da diretoria oficial." });
        setIsDeleteModalOpen(false);
        carregarDados();
      }
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível excluir.", variant: "destructive" });
    } finally {
      setLoading(false);
      setMembroParaExcluir(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <main className="max-w-7xl mx-auto py-6 px-6">

        {/* NAVEGAÇÃO SUPERIOR */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-slate-600 hover:text-orange-600">
            <ArrowLeft size={18} /> Voltar
          </Button>
          <Button variant="ghost" asChild className="gap-2 text-slate-600 hover:text-orange-600">
            <Link to="/"><Home size={18} /> Início</Link>
          </Button>
        </div>

        {/* HEADER DA PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic uppercase leading-none tracking-tighter">Diretoria & BI</h1>
            <p className="text-slate-500 font-medium mt-2 uppercase text-xs tracking-widest">Painel Administrativo de Inteligência</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 font-black uppercase italic tracking-widest px-8 shadow-lg shadow-orange-600/20">
                <Plus size={18} className="mr-2" /> Novo Diretor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
              <div className="bg-slate-900 py-6 px-8 text-white">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">Cadastrar Diretor</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase text-[10px]">Ata oficial da diretoria executiva</DialogDescription>
              </div>
              <div className="p-8 space-y-6 bg-white">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24 border-4 border-orange-100 shadow-md">
                    {previewUrl ? <AvatarImage src={previewUrl} className="object-cover" /> : <AvatarFallback><ImageIcon size={32}/></AvatarFallback>}
                  </Avatar>
                  <Input type="file" id="foto" className="hidden" onChange={handleFileChange} />
                  <Button asChild variant="outline" size="sm" className="cursor-pointer border-slate-300 font-bold uppercase text-[10px] tracking-widest">
                    <label htmlFor="foto"><Upload size={14} className="mr-2 text-orange-600" /> Carregar Foto</label>
                  </Button>
                </div>
                <div className="grid gap-4">
                  <Input placeholder="Nome Completo" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="h-12 border-slate-200" />
                  <Input placeholder="Cargo (Ex: Presidente)" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} className="h-12 border-slate-200" />
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Ordem</label>
                        <Input type="number" value={form.ordem} onChange={e => setForm({...form, ordem: Number(e.target.value)})} />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400">Gestão Inicial</label>
                        <Input type="date" value={form.inicio} onChange={e => setForm({...form, inicio: e.target.value})} />
                     </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="p-6 bg-slate-50 border-t">
                <Button onClick={handleSalvar} disabled={loading} className="w-full h-12 bg-orange-600 font-black uppercase italic tracking-widest">
                  {loading ? <Loader2 className="animate-spin" /> : "Confirmar Cadastro"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* ABAS: DASHBOARD vs MANUTENÇÃO */}
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="bg-slate-200/50 p-1 rounded-xl">
            <TabsTrigger value="dashboard" className="rounded-lg px-8 font-black italic uppercase text-xs tracking-widest">Dashboard BI</TabsTrigger>
            <TabsTrigger value="membros" className="rounded-lg px-8 font-black italic uppercase text-xs tracking-widest">Gestão de Membros</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-in fade-in duration-500">
             <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl bg-white">
                  <CardHeader><CardTitle className="italic uppercase font-black tracking-tighter">Crescimento de Associados</CardTitle></CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dadosCrescimento}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                        <Line type="monotone" dataKey="atletas" stroke="#ea580c" strokeWidth={4} dot={{r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#fff'}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-xl bg-slate-900 text-white">
                   <CardHeader>
                      <CardTitle className="italic uppercase font-black text-orange-500">Resumo AMB</CardTitle>
                      <CardDescription className="text-slate-400 font-bold uppercase text-[10px]">Indicadores rápidos do sistema</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                         <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Atletas</span>
                         <span className="text-2xl font-black italic text-white">545</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                         <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Parceiros</span>
                         <span className="text-2xl font-black italic text-orange-500">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Diretores Ativos</span>
                         <span className="text-2xl font-black italic text-white">{diretoria.length}</span>
                      </div>
                   </CardContent>
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="membros" className="animate-in slide-in-from-bottom duration-500">
            <Card className="border-none shadow-2xl overflow-hidden rounded-2xl bg-white">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="hover:bg-slate-900 border-none">
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest w-[120px]">Perfil</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest">Membro / Cargo</TableHead>
                    <TableHead className="text-white font-black uppercase text-[10px] tracking-widest text-right">Manutenção</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diretoria.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-20 text-slate-400 font-bold italic">Nenhum diretor cadastrado no sistema.</TableCell></TableRow>
                  ) : diretoria.map((m) => (
                    <TableRow key={m.id} className="hover:bg-slate-50 transition-colors border-slate-100">
                      <TableCell>
                        <Avatar className="w-16 h-16 border-2 border-white shadow-md rounded-xl">
                          <AvatarImage src={`${UPLOADS_URL}${m.url_foto}`} className="object-cover" />
                          <AvatarFallback className="bg-slate-100 text-slate-300 font-bold">AMB</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-black uppercase italic text-slate-900 tracking-tighter text-lg leading-none">{m.nome}</span>
                          <span className="text-orange-600 font-bold uppercase text-[10px] tracking-widest mt-1">{m.cargo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                          onClick={() => abrirConfirmacaoExclusao(m.id, m.nome)}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* MODAL DE EXCLUSÃO ELITE */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl">
            <div className="bg-gradient-to-r from-red-600 to-red-700 py-8 flex flex-col items-center justify-center text-white relative">
              <div className="absolute top-4 right-4 opacity-20"><AlertTriangle size={80} /></div>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-4"><Trash2 size={40} className="text-white" /></div>
              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Remover Membro?</DialogTitle>
            </div>
            <div className="p-8 bg-white text-center">
              <DialogDescription className="text-slate-600 text-base font-medium leading-relaxed">
                Você está prestes a remover <span className="text-slate-900 font-black uppercase italic underline decoration-red-500 decoration-2 underline-offset-4">{membroParaExcluir?.nome}</span> da diretoria oficial da AMB Amazonas.
              </DialogDescription>
              <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3 text-left">
                <AlertTriangle className="text-red-600 shrink-0" size={20} />
                <p className="text-xs text-red-800 font-bold uppercase leading-tight">Atenção: Esta ação é irreversível e removerá permanentemente os dados e a foto do servidor.</p>
              </div>
            </div>
            <DialogFooter className="p-6 bg-slate-50 flex flex-col sm:flex-row gap-3 border-t border-slate-100">
              <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-600 font-black uppercase italic tracking-widest hover:bg-slate-200" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
              <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest shadow-lg shadow-red-600/20" onClick={confirmarExclusao} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : "Confirmar Exclusão"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}