/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: ParceirosPage.tsx
 * CAMINHO: client/src/pages/ParceirosPage.tsx
 * DATA: 16 de Janeiro de 2026
 * FUNÇÃO: Vitrine de Parceiros (Expand Banner Interaction)
 * VERSÃO: 14.0 Prime (Lightbox Feature)
 * ==========================================================
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Search, Loader2, Star, Handshake, AlertCircle, ImageIcon, 
  MessageCircle, ExternalLink, MapPin, Medal, Award, Globe, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

interface Parceiro {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  url_logo: string | null;
  url_banner: string | null;
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  whatsapp_contato: string | null;
  link_site: string | null;
  endereco?: string | null;
}

export default function ParceirosPage() {
  const navigate = useNavigate();
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [erroApi, setErroApi] = useState<string | null>(null);

  // Estado para controlar o banner expandido (Lightbox)
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const res = await axios.get(`${API_URL}?t=${Date.now()}`);

        if (res.data.status === 'sucesso') {
          const lista = Array.isArray(res.data.parceiros) ? res.data.parceiros : [];
          // Ordenação: Ouro > Prata > Bronze > Alfabética
          lista.sort((a: Parceiro, b: Parceiro) => {
            const tiers = { ouro: 3, prata: 2, bronze: 1, pendente: 0 };
            const tierDiff = (tiers[b.partner_tier] || 0) - (tiers[a.partner_tier] || 0);
            if (tierDiff !== 0) return tierDiff;
            return a.nome_parceiro.localeCompare(b.nome_parceiro);
          });
          setParceiros(lista);
        } else {
          setParceiros([]);
        }
      } catch (error) {
        console.error("Erro crítico API Parceiros:", error);
        setErroApi("Não foi possível carregar a lista de parceiros.");
      } finally {
        setLoading(false);
      }
    };
    fetchParceiros();
  }, []);

  const getImageUrl = (url: string | null) => {
    if (!url || url === 'NULL' || url === '') return null;
    if (url.startsWith('http') || url.startsWith('/uploads')) {
        return url.startsWith('http') ? url : `${DOMAIN_URL}${url}`;
    }
    return `${DOMAIN_URL}/uploads/logos_parceiros/${url}`;
  };

  const zapLink = (num: string | null) => {
    if (!num) return '#';
    const clean = num.replace(/\D/g, ''); 
    return `https://api.whatsapp.com/send/?phone=55${clean}&text=Olá! Sou associado da AMB e gostaria de saber mais sobre o benefício.`;
  };

  // --- ÍCONES DE NÍVEL VISUAL ---
  const TierBadge = ({ tier }: { tier: string }) => {
      switch(tier) {
          case 'ouro':
              return <div className="flex items-center gap-1 bg-yellow-400 text-yellow-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-yellow-300 uppercase"><Medal className="h-3 w-3" /> Ouro</div>;
          case 'prata':
              return <div className="flex items-center gap-1 bg-slate-200 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-slate-300 uppercase"><Medal className="h-3 w-3" /> Prata</div>;
          case 'bronze':
              return <div className="flex items-center gap-1 bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-orange-200 uppercase"><Medal className="h-3 w-3" /> Bronze</div>;
          default:
              return null;
      }
  };

  const TierIcon = ({ tier }: { tier: string }) => {
    switch(tier) {
        case 'ouro': return <Award className="h-4 w-4 text-yellow-500 fill-yellow-500" />;
        case 'prata': return <Award className="h-4 w-4 text-slate-400 fill-slate-200" />;
        case 'bronze': return <Award className="h-4 w-4 text-orange-600 fill-orange-200" />;
        default: return null;
    }
  };

  // Filtros
  const filtrados = parceiros.filter(p => 
    p.nome_parceiro.toLowerCase().includes(busca.toLowerCase()) ||
    (p.categoria && p.categoria.toLowerCase().includes(busca.toLowerCase())) ||
    (p.descricao_beneficio && p.descricao_beneficio.toLowerCase().includes(busca.toLowerCase()))
  );

  const ouros = filtrados.filter(p => p.partner_tier === 'ouro');
  const pratas = filtrados.filter(p => p.partner_tier === 'prata');
  const todosParceiros = filtrados;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />

      <main className="pt-36 pb-16 px-4 max-w-7xl mx-auto">

        {/* CABEÇALHO PRIME */}
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Clube de Vantagens
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
                Descontos exclusivos e parcerias estratégicas para fortalecer o basquete master.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                        placeholder="Buscar benefícios..." 
                        className="pl-12 h-14 rounded-full border-slate-200 text-base shadow-sm focus:ring-4 focus:ring-blue-100 transition-all bg-white"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
                <Button 
                    onClick={() => navigate('/seja-parceiro')} 
                    className="bg-slate-900 hover:bg-black text-white font-bold h-14 rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                >
                    <Handshake className="mr-2 h-5 w-5"/> Cadastrar Empresa
                </Button>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-600"/></div>
        ) : (
            <>
                {erroApi && (
                    <div className="max-w-md mx-auto mb-8 bg-red-50 text-red-700 p-4 rounded-xl text-sm flex items-center justify-center gap-2 border border-red-100">
                        <AlertCircle className="h-5 w-5"/> {erroApi}
                    </div>
                )}

                {/* --- SEÇÃO DESTAQUES --- */}
                {(ouros.length > 0 || pratas.length > 0) && (
                    <div className="mb-20">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 animate-pulse"/>
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">Destaques Premium</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* OURO */}
                            {ouros.map(parceiro => {
                                const banner = getImageUrl(parceiro.url_banner);
                                const logo = getImageUrl(parceiro.url_logo);
                                return (
                                    <Card key={parceiro.id} className="group overflow-hidden border-yellow-400/30 shadow-md hover:shadow-2xl hover:border-yellow-400 transition-all bg-white relative hover:-translate-y-1 duration-300">

                                        {/* BANNER COM EXPANSÃO (Lightbox Trigger) */}
                                        <div 
                                            className="h-28 bg-slate-900 relative overflow-hidden cursor-zoom-in"
                                            onClick={() => banner && setZoomImage(banner)}
                                            title="Clique para ampliar o banner"
                                        >
                                            {banner ? (
                                                <img src={banner} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-out" alt="Banner" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-r from-yellow-500 to-amber-600 opacity-20" />
                                            )}
                                            <div className="absolute top-2 right-2 z-10 pointer-events-none">
                                                <TierBadge tier="ouro" />
                                            </div>
                                        </div>

                                        <CardContent className="relative pt-10 pb-5 px-5 text-center">
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 p-2 flex items-center justify-center pointer-events-none">
                                                {logo ? <img src={logo} className="w-full h-full object-contain" alt="Logo" /> : <ImageIcon className="w-8 h-8 text-slate-300"/>}
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg line-clamp-1 mt-2" title={parceiro.nome_parceiro}>{parceiro.nome_parceiro}</h3>
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wide">{parceiro.categoria}</p>

                                            {/* DESCRIÇÃO OURO */}
                                            <p className="text-xs text-slate-600 bg-yellow-50 p-2 rounded border border-yellow-100 mb-4 line-clamp-2 italic leading-relaxed">
                                                "{parceiro.descricao_beneficio}"
                                            </p>

                                            <div className="flex justify-center gap-2">
                                                {parceiro.whatsapp_contato && (
                                                    <Button size="icon" className="h-9 w-9 bg-green-600 hover:bg-green-700 shadow-green-200 shadow-sm rounded-full" onClick={() => window.open(zapLink(parceiro.whatsapp_contato), '_blank')} title="WhatsApp">
                                                        <MessageCircle className="h-5 w-5 text-white"/>
                                                    </Button>
                                                )}
                                                {parceiro.link_site && (
                                                    <Button size="icon" variant="outline" className="h-9 w-9 rounded-full hover:bg-slate-50" onClick={() => window.open(parceiro.link_site!, '_blank')} title="Ir para o site">
                                                        <Globe className="h-5 w-5 text-slate-600"/>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {/* PRATA */}
                            {pratas.map(parceiro => {
                                const logo = getImageUrl(parceiro.url_logo);
                                return (
                                    <Card key={parceiro.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-400 transition-all bg-white flex flex-col h-full hover:-translate-y-1">
                                        <div className="relative h-32 bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100">
                                            <div className="absolute top-2 right-2">
                                                <TierBadge tier="prata" />
                                            </div>
                                            {logo ? (
                                                <img src={logo} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt="Logo" />
                                            ) : (
                                                <span className="text-2xl font-bold text-slate-300">{parceiro.nome_parceiro[0]}</span>
                                            )}
                                        </div>
                                        <CardContent className="p-5 flex flex-col items-center text-center flex-1 justify-between">
                                            <div className="w-full">
                                                <h3 className="font-bold text-slate-800 text-base leading-tight mb-1" title={parceiro.nome_parceiro}>{parceiro.nome_parceiro}</h3>
                                                <p className="text-xs text-slate-400 uppercase font-bold mb-3">{parceiro.categoria}</p>
                                                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mb-4 line-clamp-2 italic">
                                                    "{parceiro.descricao_beneficio}"
                                                </p>
                                            </div>

                                            <div className="flex justify-center gap-2 mt-auto">
                                                {parceiro.whatsapp_contato && (
                                                    <Button variant="outline" size="icon" className="h-9 w-9 border-green-200 text-green-700 hover:bg-green-50 rounded-full" onClick={() => window.open(zapLink(parceiro.whatsapp_contato), '_blank')} title="WhatsApp">
                                                        <MessageCircle className="h-5 w-5"/>
                                                    </Button>
                                                )}

                                                {parceiro.link_site && (
                                                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" onClick={() => window.open(parceiro.link_site!, '_blank')} title="Ir para o site">
                                                        <Globe className="h-5 w-5"/>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- DIRETÓRIO (PLANILHA) --- */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                        <Handshake className="h-7 w-7 text-blue-600"/>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Diretório de Parceiros</h2>
                            <p className="text-sm text-slate-500 font-medium">Lista completa de convênios ativos</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-visible">
                        {/* Header Planilha */}
                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider rounded-t-2xl backdrop-blur-sm">
                            <div className="col-span-5 pl-2">Empresa / Parceiro</div>
                            <div className="col-span-4">Benefício Exclusivo</div>
                            <div className="col-span-3 text-right pr-4">Ações</div>
                        </div>

                        {/* Linhas */}
                        <div className="divide-y divide-slate-100">
                            {todosParceiros.map(parceiro => {
                                const isOuro = parceiro.partner_tier === 'ouro';
                                const isPrata = parceiro.partner_tier === 'prata';
                                const banner = getImageUrl(parceiro.url_banner);
                                const logo = getImageUrl(parceiro.url_logo);
                                const hasSiteAccess = (isOuro || isPrata) && parceiro.link_site;

                                return (
                                    <div 
                                        key={`list-${parceiro.id}`} 
                                        className={`group relative grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center transition-all duration-200 ${isOuro ? 'hover:bg-yellow-50/30' : 'hover:bg-slate-50'}`}
                                    >
                                        {/* HOVER BANNER (OURO) */}
                                        {isOuro && banner && (
                                            <div className="absolute left-14 bottom-full mb-2 z-50 hidden group-hover:block animate-in zoom-in-95 duration-200 pointer-events-none drop-shadow-2xl origin-bottom-left">
                                                <div className="bg-white p-1 rounded-xl border border-yellow-200 shadow-2xl w-80 h-48 relative">
                                                    <img src={banner} className="w-full h-full object-cover rounded-lg" alt="Banner Preview" />
                                                    <div className="absolute top-2 right-2">
                                                        <TierBadge tier="ouro"/>
                                                    </div>
                                                    <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-r border-yellow-200 transform rotate-45"></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Coluna 1 */}
                                        <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                                            <div className={`h-12 w-12 shrink-0 bg-white rounded-lg border flex items-center justify-center p-1 ${isOuro ? 'border-yellow-400 ring-2 ring-yellow-100' : 'border-slate-200'}`}>
                                                {logo ? <img src={logo} className="w-full h-full object-contain" alt="Logo" /> : <span className="font-bold text-slate-300">{parceiro.nome_parceiro[0]}</span>}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    {/* NOME CLICÁVEL APENAS PARA OURO/PRATA SE TIVER SITE */}
                                                    {hasSiteAccess ? (
                                                        <a 
                                                            href={parceiro.link_site!} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className={`text-base font-bold leading-tight hover:underline transition-all ${isOuro ? 'text-slate-900 hover:text-yellow-700' : 'text-slate-700 hover:text-blue-600'}`}
                                                            title="Visitar site oficial"
                                                        >
                                                            {parceiro.nome_parceiro}
                                                        </a>
                                                    ) : (
                                                        <h4 className={`text-base font-bold leading-tight ${isOuro ? 'text-slate-900' : 'text-slate-700'}`}>
                                                            {parceiro.nome_parceiro}
                                                        </h4>
                                                    )}

                                                    <TierIcon tier={parceiro.partner_tier} />
                                                </div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{parceiro.categoria}</p>
                                            </div>
                                        </div>

                                        {/* Coluna 2 */}
                                        <div className="col-span-1 md:col-span-4">
                                            <div className="flex items-start gap-2">
                                                <Star className={`h-3 w-3 mt-0.5 ${isOuro ? 'text-yellow-500' : 'text-slate-300'}`} />
                                                <div className="text-sm text-slate-600 font-medium leading-snug">
                                                    {parceiro.descricao_beneficio}
                                                    {parceiro.endereco && (
                                                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-normal">
                                                            <MapPin className="h-3 w-3"/> {parceiro.endereco}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Coluna 3 */}
                                        <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
                                            {hasSiteAccess && (
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" onClick={() => window.open(parceiro.link_site!, '_blank')} title="Visitar Site">
                                                    <Globe className="h-4 w-4"/>
                                                </Button>
                                            )}
                                            {parceiro.whatsapp_contato && (
                                                <Button 
                                                    size="icon" 
                                                    className={`h-9 w-9 rounded-full shadow-sm transition-all ${isOuro ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105' : 'bg-white border border-slate-200 text-slate-700 hover:border-green-500 hover:text-green-600'}`}
                                                    onClick={() => window.open(zapLink(parceiro.whatsapp_contato), '_blank')}
                                                    title="WhatsApp"
                                                >
                                                    <MessageCircle className="h-4 w-4"/>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {todosParceiros.length === 0 && !erroApi && (
                    <div className="text-center py-16 opacity-50">
                        <p>Nenhum parceiro encontrado.</p>
                    </div>
                )}
            </>
        )}

        {/* MODAL ZOOM (LIGHTBOX) */}
        <Dialog open={!!zoomImage} onOpenChange={() => setZoomImage(null)}>
            <DialogContent 
                className="max-w-5xl bg-transparent border-none shadow-none p-0 flex justify-center items-center outline-none ring-0 cursor-pointer"
                onClick={() => setZoomImage(null)} // Clicar em qualquer lugar do overlay fecha
            >
                <div className="relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setZoomImage(null); }}
                        className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-50 backdrop-blur-sm"
                    >
                        <X className="h-6 w-6"/>
                    </button>
                    {zoomImage && (
                        <img 
                            src={zoomImage} 
                            className="max-h-[85vh] max-w-[95vw] rounded-xl shadow-2xl bg-black object-contain" 
                            alt="Banner Expandido"
                            onClick={() => setZoomImage(null)} // Clicar na imagem fecha
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </div>
  );
}
// linha 470