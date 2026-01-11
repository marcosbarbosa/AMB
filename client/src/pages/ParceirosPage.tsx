/*
 * ==========================================================
 * MÓDULO: ParceirosPage.tsx
 * Versão: 22.0 (Privilégios na Lista Geral + Categorias)
 * ==========================================================
 */

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from "@/components/ui/dialog"; 
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Phone, Globe, Loader2, MapPin, Award, Shield, Search, 
  ZoomIn, X, Medal, MessageSquare
} from 'lucide-react';

const API_PARCEIROS = 'https://www.ambamazonas.com.br/api/get_parceiros_publico.php';
const API_CATEGORIAS = 'https://www.ambamazonas.com.br/api/get_categorias_parceiros.php';
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

const TIER_WEIGHT: Record<string, number> = {
  'ouro': 3, 'prata': 2, 'bronze': 1, 'pendente': 0, 'null': 0
};

interface Categoria { id: number; nome: string; }

interface Parceiro {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  telefone_contato: string | null;
  whatsapp_contato?: string | null;
  whatsapp?: string | null;
  url_logo: string | null;
  endereco: string | null;
  link_site: string | null;
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  nivel?: string;
}

export default function ParceirosPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [categoriasDB, setCategoriasDB] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const ts = new Date().getTime();
        const [resParceiros, resCats] = await Promise.all([
            axios.get(`${API_PARCEIROS}?t=${ts}`),
            axios.get(`${API_CATEGORIAS}?t=${ts}`)
        ]);
        if (resParceiros.data.status === 'sucesso') setParceiros(resParceiros.data.dados || []);
        if (resCats.data.status === 'sucesso') setCategoriasDB(resCats.data.dados || []);
      } catch (error) {
        setErro('Erro de conexão.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (url: string | null) => {
    if (!url || url === 'NULL' || url === '' || url === 'undefined') return null;
    let clean = url.replace(/['"]/g, '').trim();
    if (clean.startsWith('http')) return clean;
    if (clean.startsWith('/')) return `${DOMAIN_URL}${clean}`;
    return `${DOMAIN_URL}/uploads/logos_parceiros/${clean}`;
  };

  const getWhatsAppLink = (p: Parceiro) => {
    const num = p.whatsapp_contato || p.whatsapp || p.telefone_contato;
    if (!num) return null;
    const clean = num.replace(/\D/g, '');
    return `https://wa.me/${clean.startsWith('55') ? clean : '55'+clean}`;
  };

  const { destaquesPremium, listaGeral } = useMemo(() => {
    let filtrados = [...parceiros];
    if (busca) {
      const termo = busca.toLowerCase();
      filtrados = filtrados.filter(p => (p.nome_parceiro || '').toLowerCase().includes(termo) || (p.categoria || '').toLowerCase().includes(termo));
    }
    if (categoriaSelecionada !== 'todas') {
      filtrados = filtrados.filter(p => (p.categoria || '').toLowerCase().includes(categoriaSelecionada.toLowerCase()));
    }
    const destaques = filtrados.filter(p => (p.partner_tier || p.nivel || '').toLowerCase() !== 'bronze');
    destaques.sort((a, b) => (TIER_WEIGHT[(b.partner_tier || b.nivel || '').toLowerCase()] || 0) - (TIER_WEIGHT[(a.partner_tier || a.nivel || '').toLowerCase()] || 0));
    const geral = [...filtrados].sort((a, b) => (a.nome_parceiro || '').localeCompare(b.nome_parceiro || ''));
    return { destaquesPremium: destaques, listaGeral: geral };
  }, [parceiros, busca, categoriaSelecionada]);

  const categoriasOrdenadas = useMemo(() => {
    return Array.from(new Set(categoriasDB.map(c => c.nome.trim()))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [categoriasDB]);

  const TierIcon = ({ tier, className }: { tier: string, className?: string }) => {
    const t = (tier || '').toLowerCase();
    if (t === 'ouro') return <Award className={`text-yellow-600 ${className}`} title="Ouro" />;
    if (t === 'prata') return <Shield className={`text-slate-400 ${className}`} title="Prata" />;
    return <Medal className={`text-orange-600 ${className}`} title="Bronze" />;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="pt-16 flex-grow">
        <section className="py-12 bg-slate-900 text-white text-center">
             <h1 className="text-3xl font-bold mb-2">Rede de Parceiros AMB</h1>
             <p className="text-slate-400">Descontos e vantagens exclusivas para associados.</p>
        </section>

        <section className="py-12 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4">

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-20 z-20">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Filtrar Parceiros</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                  <SelectTrigger className="w-full sm:w-[220px] border-slate-200 h-9"><SelectValue placeholder="Filtrar Categoria" /></SelectTrigger>
                  <SelectContent>{categoriasOrdenadas.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Buscar empresa..." className="pl-9 h-9 text-sm" value={busca} onChange={(e) => setBusca(e.target.value)} />
                </div>
              </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>
            ) : (
              <>
                {/* --- DESTAQUES PREMIUM (OURO/PRATA) --- */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                  {destaquesPremium.map((parceiro) => {
                    const imgUrl = getImageUrl(parceiro.url_logo);
                    const nivel = (parceiro.partner_tier || parceiro.nivel || '').toLowerCase();
                    const whatsUrl = getWhatsAppLink(parceiro);
                    const isOuro = nivel === 'ouro';

                    return (
                      <Card key={parceiro.id} className={`group relative flex flex-col overflow-hidden bg-white border-slate-200 hover:shadow-xl transition-all duration-300 ${isOuro ? 'border-t-4 border-t-yellow-400' : ''}`}>
                        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 items-end">
                          <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border flex items-center justify-center"><TierIcon tier={nivel} className="h-4 w-4" /></div>
                          {whatsUrl && <a href={whatsUrl} target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"><MessageSquare className="h-4 w-4" /></a>}
                        </div>
                        <div className="h-24 bg-slate-50 relative overflow-hidden flex items-center justify-center p-3 cursor-zoom-in border-b" onClick={() => imgUrl && setImagemZoom(imgUrl)}>
                          {imgUrl ? <img src={imgUrl} alt={parceiro.nome_parceiro} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" /> : <div className="text-slate-300 font-bold text-3xl">{parceiro.nome_parceiro?.charAt(0)}</div>}
                          {imgUrl && <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"><ZoomIn className="h-4 w-4 text-slate-600" /></div>}
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1">
                          <Badge variant="secondary" className="w-fit mb-2 text-[9px] uppercase tracking-tighter h-5">{parceiro.categoria}</Badge>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h3 className="text-base font-bold mb-2 leading-tight text-slate-800 cursor-help hover:text-primary transition-colors line-clamp-1 w-fit">{parceiro.nome_parceiro}</h3>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="p-0 border-none shadow-2xl bg-white text-slate-900 rounded-lg overflow-hidden w-64">
                                    <div className="bg-slate-900 text-white p-3">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Detalhes:</p>
                                        <p className="text-xs italic leading-relaxed">"{isOuro ? 'Informações de contato e localização' : parceiro.descricao_beneficio}"</p>
                                    </div>
                                    <div className="p-3 space-y-2 bg-white border-t border-slate-100 text-[11px] text-slate-600">
                                        {parceiro.telefone_contato && <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-primary" />{parceiro.telefone_contato}</div>}
                                        {parceiro.link_site && <div className="flex items-center gap-2"><Globe className="h-3 w-3 text-primary" /><span className="truncate">{parceiro.link_site}</span></div>}
                                        {parceiro.endereco && <div className="flex items-start gap-2"><MapPin className="h-3 w-3 text-primary mt-0.5 shrink-0" />{parceiro.endereco}</div>}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {isOuro && <p className="text-xs font-medium text-orange-700 bg-orange-50 p-2 rounded border border-orange-100 mb-3 leading-snug">{parceiro.descricao_beneficio}</p>}
                          <div className="mt-auto">
                            {parceiro.link_site ? <Button size="sm" variant="ghost" className="h-7 w-full text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold uppercase tracking-tighter" asChild><a href={parceiro.link_site} target="_blank" rel="noreferrer"><Globe className="h-3 w-3 mr-1.5" /> Site Oficial</a></Button> : <div className="h-7" />}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* --- LISTA GERAL (GRID MINIMALISTA) --- */}
                {listaGeral.length > 0 && (
                    <div className="border-t border-slate-200 pt-12">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">Lista Geral de Parceiros (A-Z)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {listaGeral.map((p) => {
                                const nivel = (p.partner_tier || p.nivel || '').toLowerCase();
                                const hasPrivilege = nivel === 'ouro' || nivel === 'prata';
                                const whatsUrl = getWhatsAppLink(p);

                                return (
                                    <div key={`geral-${p.id}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-primary/30 transition-colors group">
                                        <TooltipProvider delayDuration={100}>
                                            <Tooltip>
                                                {/* Tooltip apenas para OURO e PRATA */}
                                                <TooltipTrigger asChild={hasPrivilege} className={hasPrivilege ? "cursor-help" : ""}>
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <TierIcon tier={nivel} className="h-4 w-4 shrink-0" />
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="text-sm font-semibold text-slate-700 truncate leading-tight" title={p.nome_parceiro}>{p.nome_parceiro}</span>
                                                            <span className="text-[10px] text-muted-foreground uppercase tracking-tight truncate">{p.categoria}</span>
                                                        </div>
                                                    </div>
                                                </TooltipTrigger>

                                                {hasPrivilege && (
                                                    <TooltipContent side="top" className="p-0 border-none shadow-2xl bg-white text-slate-900 rounded-lg overflow-hidden w-64">
                                                        <div className="bg-slate-900 text-white p-2">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Descrição do Parceiro:</p>
                                                            <p className="text-xs italic">"{p.descricao_beneficio}"</p>
                                                        </div>
                                                        <div className="p-2 space-y-1.5 bg-white border-t text-[10px] text-slate-600">
                                                            {p.telefone_contato && <div className="flex items-center gap-2"><Phone className="h-2.5 w-2.5 text-primary" />{p.telefone_contato}</div>}
                                                            {p.link_site && <div className="flex items-center gap-2"><Globe className="h-2.5 w-2.5 text-primary" /><span className="truncate">{p.link_site}</span></div>}
                                                            {p.endereco && <div className="flex items-start gap-2"><MapPin className="h-2.5 w-2.5 text-primary mt-0.5" />{p.endereco}</div>}
                                                        </div>
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        </TooltipProvider>

                                        {whatsUrl && (
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <a href={whatsUrl} target="_blank" rel="noreferrer" className="text-green-500 hover:text-green-600 p-1 shrink-0"><MessageSquare className="h-5 w-5" /></a>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px] bg-slate-800 text-white">Falar no WhatsApp</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none flex justify-center items-center p-4 ring-0 focus:outline-none">
           <div className="relative">
             <Button variant="secondary" size="icon" className="absolute -top-12 right-0 rounded-full bg-white/20 text-white hover:bg-white/40 border-none" onClick={() => setImagemZoom(null)}><X className="h-6 w-6"/></Button>
             {imagemZoom && <img src={imagemZoom} className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl bg-white object-contain cursor-pointer" alt="Zoom" onClick={() => setImagemZoom(null)} />}
           </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}