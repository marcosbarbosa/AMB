/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 14 de Janeiro de 2026
 * Hora: 20:15
 * Versão: 6.0 (Command Center Definitivo)
 *
 * Descrição: Console unificado para gestão total de campeonatos.
 * Funcionalidades: CRUD Evento, Switch Times, Modal Jogos, Upload Banners.
 * ==========================================================
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; 
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Icons
import { 
  Trophy, Calendar, Users, FileText, Image as ImageIcon, 
  Plus, Save, Trash2, Search, MapPin, Upload, Loader2, Edit, XCircle
} from 'lucide-react';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function GestaoEventosMaster() {
  const { token } = useAuth();
  const { toast } = useToast();

  // --- ESTADOS GLOBAIS ---
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState<any[]>([]);
  const [timesDisponiveis, setTimesDisponiveis] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // --- ESTADOS DE FORMULÁRIO (EVENTO) ---
  const [formData, setFormData] = useState({
    nome_evento: '', tipo: 'campeonato', genero: 'masculino', 
    data_inicio: '', data_fim: '', descricao: '', status: 'ativo'
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);

  // --- ESTADOS DE CONTEXTO (INSCRITOS & JOGOS) ---
  const [timesInscritosIds, setTimesInscritosIds] = useState<number[]>([]);
  const [jogos, setJogos] = useState<any[]>([]);

  // --- ESTADOS DO MODAL DE JOGO ---
  const [isJogoModalOpen, setIsJogoModalOpen] = useState(false);
  const [jogoForm, setJogoForm] = useState({
      id: 0, id_time_a: '', id_time_b: '', data_hora: '', local_jogo: '', placar_a: '', placar_b: ''
  });

  // 1. CARREGAMENTO INICIAL
  useEffect(() => {
    fetchEventos();
    fetchTimesGerais();
  }, []);

  // 2. SELEÇÃO DE EVENTO (CARREGA DEPENDÊNCIAS)
  useEffect(() => {
    if (selectedEventId) {
      const evt = eventos.find(e => e.id === selectedEventId);
      if (evt) {
        setFormData({
            nome_evento: evt.nome_evento,
            tipo: evt.tipo || 'campeonato',
            genero: evt.genero || 'masculino',
            data_inicio: evt.data_inicio || '',
            data_fim: evt.data_fim || '',
            descricao: evt.descricao || '',
            status: evt.status || 'ativo'
        });
        setPreviewBanner(evt.url_imagem ? `https://www.ambamazonas.com.br${evt.url_imagem}` : null);

        // Carrega dados profundos
        fetchInscritos(selectedEventId);
        fetchJogos(selectedEventId);
      }
    } else {
        // Reset para Novo Evento
        setFormData({
            nome_evento: '', tipo: 'campeonato', genero: 'masculino', 
            data_inicio: '', data_fim: '', descricao: '', status: 'ativo'
        });
        setPreviewBanner(null);
        setTimesInscritosIds([]);
        setJogos([]);
    }
  }, [selectedEventId]);

  // --- FUNÇÕES DE API (GET) ---
  const fetchEventos = async () => {
    try {
        const res = await axios.get(`${API_BASE}/listar_eventos.php`);
        if (res.data.status === 'sucesso') setEventos(res.data.eventos);
    } catch (e) { console.error(e); }
  };

  const fetchTimesGerais = async () => {
    try {
        const res = await axios.get(`${API_BASE}/listar_times_simples.php`); // Criar endpoint simples se n existir
        // Fallback se não existir o endpoint simples, usa o completo
        if (!res.data || res.data.status !== 'sucesso') {
             const res2 = await axios.get(`${API_BASE}/listar_times_admin.php`); 
             setTimesDisponiveis(res2.data.times || []);
        } else {
             setTimesDisponiveis(res.data.times);
        }
    } catch (e) { console.error(e); }
  };

  const fetchInscritos = async (idEvento: number) => {
      // Implementar endpoint real. Por enquanto simulamos ou usamos listar_times com filtro
      // DICA: Crie get_event_details.php no futuro. 
      // Aqui vamos assumir que existe um endpoint ou carregaremos via lógica simples
      try {
          const res = await axios.get(`${API_BASE}/get_inscritos_evento.php?id_evento=${idEvento}`);
          if (res.data.status === 'sucesso') {
              setTimesInscritosIds(res.data.ids_times); // Array de IDs [1, 5, 9]
          }
      } catch (e) { setTimesInscritosIds([]); }
  };

  const fetchJogos = async (idEvento: number) => {
      try {
          const res = await axios.get(`${API_BASE}/get_jogos_evento.php?id_evento=${idEvento}`);
          if (res.data.status === 'sucesso') setJogos(res.data.jogos);
      } catch (e) { setJogos([]); }
  };

  // --- AÇÕES DE SALVAMENTO ---

  // 1. Salvar Evento Principal
  const handleSaveOverview = async () => {
    if (!formData.nome_evento) return toast({ title: "Erro", description: "Nome obrigatório", variant: "destructive" });

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (selectedEventId) data.append('id', selectedEventId.toString());
    if (bannerFile) data.append('banner', bannerFile);
    data.append('token', token || '');

    try {
        const res = await axios.post(`${API_BASE}/admin_salvar_evento.php`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.status === 'sucesso') {
            toast({ title: "Sucesso", description: "Dados do evento salvos." });
            fetchEventos(); // Recarrega lista lateral
            if(!selectedEventId) setFormData({...formData, nome_evento: ''});
        }
    } catch (e) { toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" }); } 
    finally { setLoading(false); }
  };

  // 2. Toggle Inscrição Time
  const handleTimeToggle = async (idTime: number) => {
      if (!selectedEventId) return;
      const isAdding = !timesInscritosIds.includes(idTime);

      // Otimista: Atualiza UI antes
      setTimesInscritosIds(prev => isAdding ? [...prev, idTime] : prev.filter(id => id !== idTime));

      try {
          await axios.post(`${API_BASE}/admin_salvar_inscricao.php`, {
              id_evento: selectedEventId,
              id_time: idTime,
              acao: isAdding ? 'adicionar' : 'remover',
              token: token
          });
          toast({ title: isAdding ? "Time Inscrito" : "Time Removido", className: isAdding ? "bg-green-600 text-white" : "" });
      } catch (e) {
          // Reverte se der erro
          setTimesInscritosIds(prev => !isAdding ? [...prev, idTime] : prev.filter(id => id !== idTime));
          toast({ title: "Erro", description: "Falha na sincronização.", variant: "destructive" });
      }
  };

  // 3. Salvar Jogo (Modal)
  const handleSaveJogo = async () => {
      if (!jogoForm.id_time_a || !jogoForm.id_time_b || !jogoForm.data_hora) {
          return toast({ title: "Incompleto", description: "Preencha times e data.", variant: "destructive" });
      }

      try {
          const res = await axios.post(`${API_BASE}/admin_salvar_jogo.php`, {
              ...jogoForm,
              id_evento: selectedEventId,
              token: token
          });

          if (res.data.status === 'sucesso') {
              toast({ title: "Jogo Salvo!", description: "Tabela atualizada." });
              setIsJogoModalOpen(false);
              fetchJogos(selectedEventId!); // Recarrega tabela
          }
      } catch (e) { toast({ title: "Erro", description: "Erro ao salvar jogo.", variant: "destructive" }); }
  };

  // 4. Excluir Jogo
  const handleDeleteJogo = async (idJogo: number) => {
      if(!confirm("Excluir este jogo?")) return;
      // Implementar endpoint de exclusão ou usar um genérico
      // await axios.post(...)
      // fetchJogos(selectedEventId!)
  };

  const openNewJogo = () => {
      setJogoForm({ id: 0, id_time_a: '', id_time_b: '', data_hora: '', local_jogo: '', placar_a: '', placar_b: '' });
      setIsJogoModalOpen(true);
  };

  const openEditJogo = (j: any) => {
      setJogoForm({
          id: j.id,
          id_time_a: j.id_time_a,
          id_time_b: j.id_time_b,
          data_hora: j.data_hora, // Garantir formato YYYY-MM-DDTHH:MM
          local_jogo: j.local_jogo || '',
          placar_a: j.placar_a ?? '',
          placar_b: j.placar_b ?? ''
      });
      setIsJogoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-[1600px] w-full mx-auto pt-24 pb-8 px-4 flex gap-6 items-start h-[calc(100vh-60px)]">

        {/* ESQUERDA: LISTA DE EVENTOS */}
        <Card className="w-80 h-full flex flex-col border-none shadow-xl bg-white overflow-hidden shrink-0">
            <CardHeader className="bg-slate-900 text-white p-4 shrink-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex justify-between items-center">
                    Eventos
                    <Button size="icon" variant="secondary" className="h-6 w-6" onClick={() => setSelectedEventId(null)}><Plus className="h-4 w-4" /></Button>
                </CardTitle>
                <div className="mt-2 relative">
                    <Search className="absolute left-2 top-2 h-3 w-3 text-slate-400" />
                    <Input className="h-8 pl-7 bg-slate-800 border-none text-xs text-white placeholder:text-slate-500" placeholder="Filtrar..." />
                </div>
            </CardHeader>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {eventos.map(evt => (
                        <div key={evt.id} onClick={() => setSelectedEventId(evt.id)} className={`p-3 rounded-lg cursor-pointer transition-all border ${selectedEventId === evt.id ? 'bg-blue-50 border-blue-200' : 'border-transparent hover:bg-slate-50'}`}>
                            <div className="font-bold text-sm text-slate-800 line-clamp-1">{evt.nome_evento}</div>
                            <div className="flex justify-between items-center mt-1">
                                <Badge variant="outline" className="text-[10px] h-4">{evt.tipo}</Badge>
                                <span className={`h-2 w-2 rounded-full ${evt.status === 'ativo' ? 'bg-green-500' : 'bg-slate-300'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>

        {/* DIREITA: ÁREA DE TRABALHO */}
        <Card className="flex-1 h-full border-none shadow-xl bg-white flex flex-col overflow-hidden">
            <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <div className="border-b px-6 pt-4 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{selectedEventId ? formData.nome_evento : 'Novo Evento'}</h2>
                        <p className="text-xs text-slate-500 font-medium mb-4">{selectedEventId ? `ID: #${selectedEventId} • Gerenciamento` : 'Preencha os dados para começar'}</p>
                    </div>
                    <TabsList className="bg-slate-200">
                        <TabsTrigger value="overview" className="gap-2"><Trophy className="h-4 w-4"/> Visão Geral</TabsTrigger>
                        <TabsTrigger value="times" className="gap-2" disabled={!selectedEventId}><Users className="h-4 w-4"/> Times</TabsTrigger>
                        <TabsTrigger value="jogos" className="gap-2" disabled={!selectedEventId}><Calendar className="h-4 w-4"/> Jogos</TabsTrigger>
                    </TabsList>
                </div>

                {/* ABA 1: VISÃO GERAL */}
                <TabsContent value="overview" className="flex-1 p-8 overflow-y-auto m-0">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2"><Label>Nome do Evento</Label><Input value={formData.nome_evento} onChange={e => setFormData({...formData, nome_evento: e.target.value})} className="font-bold text-lg"/></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Tipo</Label><Select value={formData.tipo} onValueChange={v => setFormData({...formData, tipo: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="campeonato">Campeonato</SelectItem><SelectItem value="torneio">Torneio</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label>Gênero</Label><Select value={formData.genero} onValueChange={v => setFormData({...formData, genero: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="masculino">Masculino</SelectItem><SelectItem value="feminino">Feminino</SelectItem><SelectItem value="misto">Misto</SelectItem></SelectContent></Select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Início</Label><Input type="date" value={formData.data_inicio} onChange={e => setFormData({...formData, data_inicio: e.target.value})} /></div>
                                <div className="space-y-2"><Label>Fim</Label><Input type="date" value={formData.data_fim} onChange={e => setFormData({...formData, data_fim: e.target.value})} /></div>
                            </div>
                            <div className="space-y-2"><Label>Descrição</Label><Textarea value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} rows={4}/></div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <Label className="flex items-center gap-2 mb-4 text-blue-700 font-bold"><ImageIcon className="h-5 w-5"/> Banner Promocional</Label>
                            <div className="aspect-[16/6] bg-white border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-blue-500 transition-colors" onClick={() => document.getElementById('banner-input')?.click()}>
                                {previewBanner ? <img src={previewBanner} className="w-full h-full object-cover" /> : <div className="text-center text-slate-400"><Upload className="h-8 w-8 mx-auto mb-2 opacity-50"/><p className="text-xs">Clique para fazer upload</p></div>}
                                <input id="banner-input" type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) { setBannerFile(e.target.files[0]); setPreviewBanner(URL.createObjectURL(e.target.files[0])); }}}/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end"><Button size="lg" onClick={handleSaveOverview} disabled={loading} className="font-bold">{loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>} {selectedEventId ? 'SALVAR ALTERAÇÕES' : 'CRIAR EVENTO'}</Button></div>
                </TabsContent>

                {/* ABA 2: TIMES (SWITCH ON/OFF) */}
                <TabsContent value="times" className="flex-1 p-8 m-0 overflow-y-auto">
                    <div className="mb-6"><h3 className="text-lg font-bold text-slate-700">Inscrição de Times</h3><p className="text-sm text-slate-500">Ative os times que participarão deste campeonato.</p></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {timesDisponiveis.map(time => (
                            <div key={time.id} className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${timesInscritosIds.includes(time.id) ? 'bg-green-50 border-green-500 ring-1 ring-green-500' : 'bg-white border-slate-200 hover:border-slate-300'}`} onClick={() => handleTimeToggle(time.id)}>
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden text-xs">
                                    {time.url_logo ? <img src={`https://www.ambamazonas.com.br${time.url_logo}`} className="w-full h-full object-cover"/> : time.nome_time.substring(0,2)}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm text-slate-800 line-clamp-1">{time.nome_time}</div>
                                    <div className="text-[10px] text-slate-400">{time.categoria || 'Geral'}</div>
                                </div>
                                <Switch checked={timesInscritosIds.includes(time.id)} />
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* ABA 3: JOGOS (TABELA + MODAL) */}
                <TabsContent value="jogos" className="flex-1 p-8 m-0 overflow-y-auto">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-700">Tabela de Jogos</h3>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={openNewJogo}><Plus className="mr-2 h-4 w-4"/> Agendar Jogo</Button>
                     </div>
                     <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Data/Hora</th>
                                    <th className="px-4 py-3 text-right">Time A</th>
                                    <th className="px-4 py-3 text-center">Placar</th>
                                    <th className="px-4 py-3">Time B</th>
                                    <th className="px-4 py-3">Local</th>
                                    <th className="px-4 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {jogos.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">Nenhum jogo agendado.</td></tr>
                                ) : jogos.map(jogo => (
                                    <tr key={jogo.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-mono text-slate-600 text-xs">{jogo.data_formatada} <br/> {jogo.hora_formatada}</td>
                                        <td className="px-4 py-3 text-right font-bold">{jogo.nome_time_a}</td>
                                        <td className="px-4 py-3 text-center font-mono font-bold bg-slate-100 mx-2 rounded">
                                            {jogo.placar_a !== null ? `${jogo.placar_a} x ${jogo.placar_b}` : 'vs'}
                                        </td>
                                        <td className="px-4 py-3 font-bold">{jogo.nome_time_b}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs"><MapPin className="inline h-3 w-3 mr-1"/>{jogo.local_jogo}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => openEditJogo(jogo)}><Edit className="h-4 w-4 text-blue-500"/></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteJogo(jogo.id)}><Trash2 className="h-4 w-4 text-red-400"/></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </TabsContent>
            </Tabs>
        </Card>

        {/* --- MODAL DE JOGO (GLOBAL) --- */}
        <Dialog open={isJogoModalOpen} onOpenChange={setIsJogoModalOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>{jogoForm.id ? 'Editar Jogo / Placar' : 'Agendar Novo Jogo'}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Time A (Mandante)</Label>
                            <Select value={String(jogoForm.id_time_a)} onValueChange={v => setJogoForm({...jogoForm, id_time_a: v})}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>{timesDisponiveis.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.nome_time}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Time B (Visitante)</Label>
                            <Select value={String(jogoForm.id_time_b)} onValueChange={v => setJogoForm({...jogoForm, id_time_b: v})}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>{timesDisponiveis.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.nome_time}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Data e Hora</Label><Input type="datetime-local" value={jogoForm.data_hora} onChange={e => setJogoForm({...jogoForm, data_hora: e.target.value})}/></div>
                        <div className="space-y-2"><Label>Local</Label><Input placeholder="Ginásio..." value={jogoForm.local_jogo} onChange={e => setJogoForm({...jogoForm, local_jogo: e.target.value})}/></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded border">
                        <div className="space-y-2"><Label>Placar A</Label><Input type="number" placeholder="-" value={jogoForm.placar_a} onChange={e => setJogoForm({...jogoForm, placar_a: e.target.value})}/></div>
                        <div className="space-y-2"><Label>Placar B</Label><Input type="number" placeholder="-" value={jogoForm.placar_b} onChange={e => setJogoForm({...jogoForm, placar_b: e.target.value})}/></div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsJogoModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSaveJogo}>Salvar Jogo</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}