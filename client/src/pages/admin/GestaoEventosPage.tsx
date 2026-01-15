/*
 * ==========================================================
 * PROJETO: Portal AMB DO AMAZONAS
 * ARQUIVO: GestaoEventosPage.tsx
 * CAMINHO: client/src/pages/admin/GestaoEventosPage.tsx
 * DATA: 15 de Janeiro de 2026
 * HORA: 22:15
 * FUNÇÃO: Gestão Completa (Eventos, Times, Jogos+MVP, Boletins)
 * VERSÃO: 4.0 Prime (MVP + Boletins + Criar Time)
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { Textarea } from '@/components/ui/textarea'; 
import { 
  Check, X, Loader2, ArrowLeft, Edit, Trash2, PlusCircle, Newspaper, 
  Users, CalendarClock, Trophy, Star, FileText, Download, Upload, Image as ImageIcon 
} from 'lucide-react'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// --- APIs ---
const API_BASE = 'https://www.ambamazonas.com.br/api';

// --- Interfaces ---
interface Evento {
  id: number; nome_evento: string; genero: 'masculino' | 'feminino' | 'misto';
  data_inicio: string; data_fim: string | null; descricao: string | null;
  tipo: 'campeonato' | 'torneio';
}
interface Boletim { id: number; titulo: string; rodada: string; url_arquivo: string; }
interface Time { id: number; nome_time: string; url_logo: string | null; }
interface Jogo { 
    id: number; id_time_a: string; id_time_b: string; 
    nome_time_a?: string; nome_time_b?: string; 
    placar_a: string; placar_b: string; 
    data_hora: string; local_jogo: string;
    mvp_nome?: string; mvp_foto?: string; // Campos MVP
}

export default function GestaoEventosPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();

  // Estados Gerais
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Estados para Sub-Funcionalidades
  const [timesDisponiveis, setTimesDisponiveis] = useState<Time[]>([]);
  const [timesInscritosIds, setTimesInscritosIds] = useState<number[]>([]);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [boletins, setBoletins] = useState<Boletim[]>([]);

  // Modais
  const [isNewTimeModalOpen, setIsNewTimeModalOpen] = useState(false);
  const [isJogoModalOpen, setIsJogoModalOpen] = useState(false);

  // Forms
  const [jogoForm, setJogoForm] = useState<any>({ id: 0, id_time_a: '', id_time_b: '', data_hora: '', local_jogo: '', placar_a: '', placar_b: '', mvp_nome: '' });
  const [mvpFile, setMvpFile] = useState<File | null>(null); // Foto MVP
  const [newTimeForm, setNewTimeForm] = useState({ nome: '', sigla: '' });
  const [newTimeLogo, setNewTimeLogo] = useState<File | null>(null);

  const [boletimForm, setBoletimForm] = useState({ titulo: '', rodada: '' });
  const [boletimFile, setBoletimFile] = useState<File | null>(null);

  useEffect(() => {
    if (isAuthenticated && atleta?.role === 'admin') {
      fetchEventos();
      fetchTimesGerais();
    }
  }, [isAuthenticated]);

  // --- FETCHS ---
  const fetchEventos = async () => {
    try {
        const res = await axios.get(`${API_BASE}/listar_eventos.php`);
        if (res.data.status === 'sucesso') setEventos(res.data.eventos || []);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const fetchTimesGerais = async () => {
    try {
        const res = await axios.get(`${API_BASE}/listar_times_admin.php`, { params: { token } });
        if (res.data.status === 'sucesso') setTimesDisponiveis(res.data.times);
    } catch (e) { console.error(e); }
  };

  const fetchDetalhesEvento = async (id: number) => {
      setSelectedEventId(id);
      try {
          const res = await axios.get(`${API_BASE}/public_get_evento_detalhes.php?id=${id}`);
          if (res.data.status === 'sucesso') {
              const dados = res.data.dados;
              // Mapeia inscritos se houver lógica no back, por enquanto carrega tudo no select
              setJogos(dados.jogos || []);
              setBoletins(dados.boletins || []);
          }
      } catch (e) { console.error(e); }
  };

  // --- AÇÕES DE TIMES ---
  const handleCriarTime = async () => {
      if(!newTimeForm.nome) return toast({ title: "Erro", description: "Nome obrigatório", variant: "destructive" });
      const data = new FormData();
      data.append('nome', newTimeForm.nome);
      data.append('sigla', newTimeForm.sigla);
      if(newTimeLogo) data.append('logo', newTimeLogo);
      data.append('token', token || '');

      try {
          const res = await axios.post(`${API_BASE}/admin_criar_time.php`, data);
          if(res.data.status === 'sucesso') {
              toast({ title: "Time Criado!" });
              setIsNewTimeModalOpen(false);
              fetchTimesGerais();
              setNewTimeForm({ nome: '', sigla: '' }); setNewTimeLogo(null);
          }
      } catch(e) { toast({ title: "Erro", variant: "destructive" }); }
  };

  // --- AÇÕES DE JOGOS E MVP ---
  const handleSaveJogo = async () => {
      if(!selectedEventId) return;

      const data = new FormData();
      data.append('id', jogoForm.id.toString());
      data.append('id_evento', selectedEventId.toString());
      data.append('id_time_a', jogoForm.id_time_a);
      data.append('id_time_b', jogoForm.id_time_b);
      data.append('data_hora', jogoForm.data_hora);
      data.append('local_jogo', jogoForm.local_jogo);
      data.append('placar_a', jogoForm.placar_a);
      data.append('placar_b', jogoForm.placar_b);
      data.append('mvp_nome', jogoForm.mvp_nome);
      if(mvpFile) data.append('foto', mvpFile); // FOTO DO MVP
      data.append('token', token || '');

      // Endpoint unificado ou separado. Vou usar o admin_salvar_jogo.php modificado ou admin_salvar_mvp separado.
      // Assumindo que admin_salvar_jogo.php agora aceita FormData e trata MVP.
      try {
          // Salva Jogo básico
          const resJogo = await axios.post(`${API_BASE}/admin_salvar_jogo.php`, data); // Precisa ser adaptado no back para receber FormData

          // Se tiver MVP e ID do jogo (update ou create), chama o endpoint específico do MVP se o jogo foi salvo
          if(resJogo.data.status === 'sucesso') {
             if(jogoForm.mvp_nome) {
                 // Se for novo, precisamos do ID retornado. Se for edição, usamos jogoForm.id
                 const jogoIdFinal = jogoForm.id || resJogo.data.id_jogo; 
                 data.append('jogo_id', jogoIdFinal);
                 await axios.post(`${API_BASE}/admin_salvar_mvp.php`, data);
             }
             toast({ title: "Jogo e MVP Salvos!" });
             setIsJogoModalOpen(false);
             fetchDetalhesEvento(selectedEventId);
          }
      } catch(e) { toast({ title: "Erro ao salvar", variant: "destructive" }); }
  };

  // --- AÇÕES DE BOLETINS ---
  const handleUploadBoletim = async () => {
      if(!selectedEventId || !boletimFile || !boletimForm.titulo) return toast({ title: "Dados incompletos", variant: "destructive" });

      const data = new FormData();
      data.append('evento_id', selectedEventId.toString());
      data.append('titulo', boletimForm.titulo);
      data.append('rodada', boletimForm.rodada);
      data.append('arquivo', boletimFile);
      data.append('token', token || '');

      try {
          const res = await axios.post(`${API_BASE}/admin_salvar_boletim.php`, data);
          if(res.data.status === 'sucesso') {
              toast({ title: "Boletim Enviado!" });
              setBoletimForm({ titulo: '', rodada: '' }); setBoletimFile(null);
              fetchDetalhesEvento(selectedEventId);
          }
      } catch(e) { toast({ title: "Erro no upload", variant: "destructive" }); }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 uppercase">Gestão de Eventos</h1>
            <Button variant="outline" onClick={() => navigate('/admin/painel')}><ArrowLeft className="mr-2 h-4 w-4"/> Voltar</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* LISTA DE EVENTOS (LATERAL) */}
            <Card className="lg:col-span-1 h-fit">
                <CardHeader><CardTitle>Selecione o Evento</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {eventos.map(evt => (
                        <div key={evt.id} onClick={() => fetchDetalhesEvento(evt.id)} className={`p-3 rounded border cursor-pointer hover:bg-slate-100 ${selectedEventId === evt.id ? 'bg-blue-50 border-blue-500' : ''}`}>
                            <div className="font-bold">{evt.nome_evento}</div>
                            <div className="text-xs text-slate-500">{evt.tipo} • {evt.genero}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* ÁREA DE TRABALHO */}
            {selectedEventId ? (
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Painel do Evento</CardTitle></CardHeader>
                    <CardContent>
                        <Tabs defaultValue="jogos">
                            <TabsList className="mb-4">
                                <TabsTrigger value="jogos">Jogos & MVP</TabsTrigger>
                                <TabsTrigger value="boletins">Boletins</TabsTrigger>
                                <TabsTrigger value="times">Times</TabsTrigger>
                            </TabsList>

                            {/* ABA JOGOS */}
                            <TabsContent value="jogos">
                                <div className="flex justify-end mb-4"><Button onClick={() => { setJogoForm({ id: 0, id_time_a: '', id_time_b: '', data_hora: '', local_jogo: '', placar_a: '', placar_b: '', mvp_nome: '' }); setMvpFile(null); setIsJogoModalOpen(true); }}><PlusCircle className="mr-2 h-4 w-4"/> Novo Jogo</Button></div>
                                <div className="space-y-2">
                                    {jogos.map(jogo => (
                                        <div key={jogo.id} className="p-3 border rounded flex justify-between items-center bg-white">
                                            <div>
                                                <div className="font-bold text-sm">{jogo.nome_time_a} vs {jogo.nome_time_b}</div>
                                                <div className="text-xs text-slate-500">{new Date(jogo.data_hora).toLocaleDateString()} • {jogo.local_jogo}</div>
                                                {jogo.mvp_nome && <Badge variant="secondary" className="mt-1 text-[10px] bg-yellow-100 text-yellow-800"><Star className="h-3 w-3 mr-1"/> MVP: {jogo.mvp_nome}</Badge>}
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => { setJogoForm(jogo); setIsJogoModalOpen(true); }}><Edit className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* ABA BOLETINS */}
                            <TabsContent value="boletins">
                                <div className="bg-slate-50 p-4 rounded-lg mb-6 border">
                                    <h4 className="font-bold text-sm mb-3">Publicar Novo Boletim</h4>
                                    <div className="grid gap-3">
                                        <Input placeholder="Título (ex: Boletim 01)" value={boletimForm.titulo} onChange={e => setBoletimForm({...boletimForm, titulo: e.target.value})} />
                                        <Input placeholder="Rodada (ex: Fase de Grupos)" value={boletimForm.rodada} onChange={e => setBoletimForm({...boletimForm, rodada: e.target.value})} />
                                        <Input type="file" accept=".pdf" onChange={e => setBoletimFile(e.target.files?.[0] || null)} />
                                        <Button onClick={handleUploadBoletim}><Upload className="mr-2 h-4 w-4"/> Enviar PDF</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {boletins.map(bol => (
                                        <div key={bol.id} className="flex justify-between items-center p-3 border rounded bg-white">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-red-500 h-5 w-5"/>
                                                <div><div className="font-bold text-sm">{bol.titulo}</div><div className="text-xs text-slate-500">{bol.rodada}</div></div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => window.open(`https://www.ambamazonas.com.br${bol.url_arquivo}`)}><Download className="h-4 w-4"/></Button>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* ABA TIMES (Com Criar Novo) */}
                            <TabsContent value="times">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold">Times no Evento</h4>
                                    <Button variant="outline" size="sm" onClick={() => setIsNewTimeModalOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/> Cadastrar Time Novo</Button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {timesDisponiveis.map(time => (
                                        <div key={time.id} className="p-2 border rounded flex items-center gap-2">
                                            <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                                {time.url_logo ? <img src={`https://www.ambamazonas.com.br/uploads/logos_times/${time.url_logo}`} className="h-full w-full object-contain"/> : <Users className="h-4 w-4"/>}
                                            </div>
                                            <span className="text-sm font-medium">{time.nome_time}</span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            ) : (
                <div className="lg:col-span-2 flex items-center justify-center text-slate-400">Selecione um evento para gerenciar</div>
            )}
        </div>

        {/* MODAL NOVO JOGO / MVP */}
        <Dialog open={isJogoModalOpen} onOpenChange={setIsJogoModalOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Gerenciar Jogo</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Time A</Label><Select value={String(jogoForm.id_time_a)} onValueChange={v => setJogoForm({...jogoForm, id_time_a: v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{timesDisponiveis.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.nome_time}</SelectItem>)}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Time B</Label><Select value={String(jogoForm.id_time_b)} onValueChange={v => setJogoForm({...jogoForm, id_time_b: v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{timesDisponiveis.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.nome_time}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="datetime-local" value={jogoForm.data_hora} onChange={e => setJogoForm({...jogoForm, data_hora: e.target.value})} />
                        <Input placeholder="Local" value={jogoForm.local_jogo} onChange={e => setJogoForm({...jogoForm, local_jogo: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4"><Input placeholder="Placar A" value={jogoForm.placar_a} onChange={e => setJogoForm({...jogoForm, placar_a: e.target.value})} /><Input placeholder="Placar B" value={jogoForm.placar_b} onChange={e => setJogoForm({...jogoForm, placar_b: e.target.value})} /></div>

                    <div className="border-t pt-4 mt-2">
                        <Label className="flex items-center gap-2 mb-2 text-yellow-600"><Star className="h-4 w-4"/> Destaque (MVP)</Label>
                        <Input placeholder="Nome do Jogador MVP" value={jogoForm.mvp_nome || ''} onChange={e => setJogoForm({...jogoForm, mvp_nome: e.target.value})} className="mb-2"/>
                        <div className="flex items-center gap-2">
                            <Input type="file" accept="image/*" onChange={e => setMvpFile(e.target.files?.[0] || null)} />
                            {jogoForm.mvp_foto && !mvpFile && <Badge variant="outline">Foto atual existe</Badge>}
                        </div>
                    </div>
                </div>
                <DialogFooter><Button onClick={handleSaveJogo}>Salvar Jogo</Button></DialogFooter>
            </DialogContent>
        </Dialog>

        {/* MODAL NOVO TIME */}
        <Dialog open={isNewTimeModalOpen} onOpenChange={setIsNewTimeModalOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Cadastrar Novo Time</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2"><Label>Nome do Time</Label><Input value={newTimeForm.nome} onChange={e => setNewTimeForm({...newTimeForm, nome: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Sigla (3 letras)</Label><Input value={newTimeForm.sigla} onChange={e => setNewTimeForm({...newTimeForm, sigla: e.target.value})} maxLength={3}/></div>
                    <div className="space-y-2"><Label>Logo do Time</Label><Input type="file" accept="image/*" onChange={e => setNewTimeLogo(e.target.files?.[0] || null)} /></div>
                </div>
                <DialogFooter><Button onClick={handleCriarTime}>Criar Time</Button></DialogFooter>
            </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
}