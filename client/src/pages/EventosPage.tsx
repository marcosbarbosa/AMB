/*
// Nome: EventosPage.tsx
// Caminho: client/src/pages/EventosPage.tsx
// Data: 2026-01-18
// Hora: 00:40 (America/Sao_Paulo)
// Função: Vitrine de Campeonatos (Hover Banner + Modal de Detalhes)
// Versão: v3.0 Prime
*/

import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Trophy, CalendarDays, MapPin, FileText, Users, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function EventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);
  const [detalhes, setDetalhes] = useState<any>({ times: [], jogos: [], boletins: [] });
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/get_eventos_publicos.php`)
      .then(res => { if (res.data.status === 'sucesso') setEventos(res.data.dados); })
      .finally(() => setLoading(false));
  }, []);

  const openDetalhes = async (evento: any) => {
    setSelectedEvento(evento);
    setLoadingDetalhes(true);
    try {
      const res = await axios.get(`${API_BASE}/get_evento_detalhes.php?id=${evento.id}`);
      if (res.data.status === 'sucesso') setDetalhes(res.data.dados);
    } catch (error) { console.error(error); } finally { setLoadingDetalhes(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4 uppercase">Campeonatos Oficiais</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">Acompanhe as tabelas, times e resultados da AMB Amazonas.</p>
          </div>

          {loading ? ( <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-blue-600"/></div> ) : 
           eventos.length === 0 ? ( <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed"><Trophy className="h-16 w-16 mx-auto mb-4 opacity-20"/><p>Nenhum campeonato ativo.</p></div> ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventos.map((evt) => (
                <Dialog key={evt.id} onOpenChange={(open) => { if(open) openDetalhes(evt); }}>
                  <DialogTrigger asChild>
                    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border border-slate-100 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 group-hover:w-full group-hover:opacity-5 transition-all duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 uppercase tracking-widest text-[10px]">{evt.tipo}</Badge>
                                <span className="text-xs font-bold text-slate-400">{new Date(evt.data_inicio).getFullYear()}</span>
                            </div>
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors">{evt.nome_evento}</h3>
                                </HoverCardTrigger>
                                {evt.url_imagem && ( <HoverCardContent className="w-80 p-0 border-none shadow-2xl rounded-xl overflow-hidden"><img src={`https://www.ambamazonas.com.br${evt.url_imagem}`} alt="Banner" className="w-full h-auto object-cover"/></HoverCardContent> )}
                            </HoverCard>
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 border-t border-slate-100 pt-4 mt-4">
                                <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4"/> DATA</span>
                                <span className="flex items-center gap-1"><Users className="h-4 w-4"/> {evt.genero.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
                    <DialogHeader><DialogTitle className="text-2xl font-black text-slate-900 uppercase">{selectedEvento?.nome_evento}</DialogTitle></DialogHeader>
                    {loadingDetalhes ? ( <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600"/></div> ) : (
                        <Tabs defaultValue="jogos" className="w-full mt-4">
                            <TabsList className="w-full justify-start bg-slate-100 p-1 rounded-xl mb-6">
                                <TabsTrigger value="jogos" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Jogos</TabsTrigger>
                                <TabsTrigger value="times" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Equipes</TabsTrigger>
                                <TabsTrigger value="boletins" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Boletins</TabsTrigger>
                            </TabsList>
                            <TabsContent value="jogos" className="space-y-4">
                                {detalhes.jogos.length === 0 ? <p className="text-center text-slate-400 py-10">Nenhum jogo.</p> : detalhes.jogos.map((jogo: any) => (
                                    <div key={jogo.id} className="flex flex-col md:flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        <div className="text-center md:text-left w-full md:w-32"><div className="text-xs font-bold text-slate-400 uppercase">{new Date(jogo.data_jogo).toLocaleDateString()}</div><div className="text-lg font-black text-slate-900">{jogo.horario_jogo.substring(0,5)}</div><div className="text-[10px] text-slate-500 truncate">{jogo.local_jogo}</div></div>
                                        <div className="flex items-center gap-4 flex-1 justify-center"><div className="text-center w-24"><img src={`https://www.ambamazonas.com.br${jogo.time_a_logo}`} className="w-10 h-10 mx-auto object-contain mb-1"/><p className="text-xs font-bold truncate">{jogo.time_a_nome}</p></div><div className="text-2xl font-black bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">{jogo.status_jogo === 'finalizado' ? `${jogo.placar_final_a} x ${jogo.placar_final_b}` : 'VS'}</div><div className="text-center w-24"><img src={`https://www.ambamazonas.com.br${jogo.time_b_logo}`} className="w-10 h-10 mx-auto object-contain mb-1"/><p className="text-xs font-bold truncate">{jogo.time_b_nome}</p></div></div>
                                    </div>
                                ))}
                            </TabsContent>
                            <TabsContent value="times"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{detalhes.times.map((time: any) => (<div key={time.id} className="text-center p-4 bg-white border border-slate-100 rounded-xl"><img src={`https://www.ambamazonas.com.br${time.url_logo_time}`} className="w-16 h-16 mx-auto object-contain mb-3"/><h4 className="font-bold text-sm text-slate-800">{time.nome_time}</h4></div>))}</div></TabsContent>
                            <TabsContent value="boletins" className="space-y-2">{detalhes.boletins.map((bol: any, idx: number) => (<div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg cursor-pointer hover:bg-blue-50" onClick={() => window.open(bol.url_pdf, '_blank')}><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-blue-600"/><span className="font-medium text-sm">{bol.titulo_boletim}</span></div></div>))}</TabsContent>
                        </Tabs>
                    )}
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 140 EventosPage.tsx