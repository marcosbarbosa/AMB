/*
 * ==========================================================
 * MÓDULO: ParceirosPage.tsx
 * Versão: 34.0 (Fix: Preview some instantaneamente ao sair do mouse)
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
  Globe, Loader2, Search, X, MessageSquare, ImageIcon, 
  List, LayoutGrid, Award, Shield, Medal, Maximize2
} from 'lucide-react';

const API_PARCEIROS = 'https://www.ambamazonas.com.br/api/get_parceiros_publico.php';
const API_CATEGORIAS = 'https://www.ambamazonas.com.br/api/get_categorias_parceiros.php';
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

interface Parceiro {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  telefone_contato: string;
  whatsapp_contato: string | null;
  url_logo: string | null;
  link_site: string | null;
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'comum';
  endereco: string | null;
  url_banner?: string | null;
  banner_fit_mode?: 'cover' | 'contain';
  banner_status?: string;
}

const TIER_WEIGHT: Record<string, number> = {
  'ouro': 4, 
  'prata': 3, 
  'bronze': 2, 
  'comum': 1
};

export default function ParceirosPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  // Estado para Zoom (Modal Fullscreen)
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  // Estado para Preview Flutuante
  const [hoverPreview, setHoverPreview] = useState<{ url: string, fit: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resP, resC] = await Promise.all([
          axios.get(`${API_PARCEIROS}?t=${Date.now()}`),
          axios.get(`${API_CATEGORIAS}?t=${Date.now()}`)
        ]);
        if (resP.data.status === 'sucesso') setParceiros(resP.data.dados || []);
        if (resC.data.status === 'sucesso') setCategorias(resC.data.dados.map((c: any) => c.nome) || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBase = useMemo(() => {
    return parceiros.filter(p => {
      const matchesSearch = p.nome_parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'todas' || p.categoria === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [parceiros, searchTerm, selectedCategory]);

  const gridPartners = useMemo(() => {
    return filteredBase
      .filter(p => p.partner_tier === 'ouro' || p.partner_tier === 'prata')
      .sort((a, b) => (TIER_WEIGHT[b.partner_tier] || 0) - (TIER_WEIGHT[a.partner_tier] || 0));
  }, [filteredBase]);

  const listPartners = useMemo(() => {
    return [...filteredBase].sort((a, b) => a.nome_parceiro.localeCompare(b.nome_parceiro));
  }, [filteredBase]);

  const getImageUrl = (url: string | null, type: 'logo' | 'banner' = 'logo') => {
    if (!url || url === 'NULL') return null;
    let clean = url.replace(/['"]/g, '').trim();
    if (clean.startsWith('http')) return clean;
    if (clean.startsWith('/')) return `${DOMAIN_URL}${clean}`;
    const folder = type === 'logo' ? 'logos_parceiros' : 'banners_campanhas';
    return `${DOMAIN_URL}/uploads/${folder}/${clean}`;
  };

  const zapLink = (num: string | null) => {
    if (!num) return '#';
    const clean = num.replace(/\D/g, '');
    return `https://api.whatsapp.com/send?phone=55${clean}&text=Olá! Sou associado da AMB e gostaria de saber mais sobre o benefício.`;
  };

  const TierIcon = ({ tier }: { tier: string }) => {
    if (tier === 'ouro') return <Award className="h-4 w-4 text-yellow-500" />;
    if (tier === 'prata') return <Shield className="h-4 w-4 text-slate-400" />;
    if (tier === 'bronze') return <Medal className="h-4 w-4 text-orange-700" />;
    return null;
  };

  // Handler para mostrar preview (Hover In)
  const handleMouseEnterRow = (p: Parceiro) => {
    if (p.partner_tier === 'ouro') {
        const bannerUrl = getImageUrl(p.url_banner, 'banner');
        if (bannerUrl) {
            setHoverPreview({
                url: bannerUrl,
                fit: p.banner_fit_mode || 'cover'
            });
        }
    }
  };

  // Handler para esconder preview (Hover Out)
  const handleMouseLeaveRow = () => {
    setHoverPreview(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <Navigation />

      <main className="flex-grow pt-24 pb-12">
        <header className="container mx-auto px-4 mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Rede de Vantagens AMB</h1>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">Conheça as empresas que apoiam o esporte amazonense e aproveite benefícios exclusivos.</p>

          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar parceiro ou serviço..." 
                className="pl-10 border-slate-200 focus:ring-yellow-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[220px] border-slate-200">
                <SelectValue placeholder="Todas Categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas Categorias</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* GRID DESTAQUE (Cards Superiores) */}
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-center gap-2 mb-6">
             <LayoutGrid className="h-5 w-5 text-yellow-600" />
             <h2 className="text-xl font-bold text-slate-800">Destaques da Rede</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 text-yellow-500 animate-spin" />
                <p className="text-slate-500 font-medium">Carregando parceiros...</p>
              </div>
            ) : (
              gridPartners.map((p) => {
                const logoUrl = getImageUrl(p.url_logo, 'logo');
                const bannerUrl = getImageUrl(p.url_banner, 'banner');
                const isOuro = p.partner_tier === 'ouro';

                return (
                  <Card 
                    key={p.id} 
                    className={`relative overflow-hidden transition-all duration-300 group hover:shadow-xl border-slate-200 ${
                      isOuro ? 'ring-1 ring-yellow-400/50' : ''
                    }`}
                  >
                    <CardContent className="p-0">

                      <div 
                        className={`relative h-48 bg-white flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden 
                          ${isOuro ? 'cursor-zoom-in' : 'cursor-default'}`}
                        onClick={() => {
                          if (isOuro) {
                            if (bannerUrl) setImagemZoom(bannerUrl);
                            else if (logoUrl) setImagemZoom(logoUrl);
                          }
                        }}
                      >
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={p.nome_parceiro}
                            className={`max-h-full max-w-full object-contain transition-all duration-500 
                              ${isOuro ? 'group-hover:scale-110 group-hover:opacity-0' : ''} 
                            `}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center text-slate-300">
                             <ImageIcon className="h-10 w-10 mb-2" />
                             <span className="text-xs uppercase font-bold">{p.nome_parceiro}</span>
                          </div>
                        )}

                        {isOuro && bannerUrl && (
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black flex items-center justify-center">
                             {p.banner_fit_mode === 'contain' && (
                                <div className="absolute inset-0 bg-cover bg-center blur-md opacity-50 scale-110" style={{ backgroundImage: `url(${bannerUrl})` }} />
                             )}
                             <img 
                                src={bannerUrl}
                                className={`relative z-10 w-full h-full ${p.banner_fit_mode === 'contain' ? 'object-contain' : 'object-cover'}`}
                                alt={`Campanha ${p.nome_parceiro}`}
                             />
                          </div>
                        )}

                        <div className="absolute top-3 right-3 z-10 pointer-events-none">
                          {isOuro ? (
                            <Badge className="bg-yellow-500 text-black border-none shadow-sm">OURO 🏆</Badge>
                          ) : (
                            <Badge className="bg-slate-200 text-slate-600 border-none">PRATA</Badge>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">{p.categoria}</span>
                          <h3 className="text-lg font-bold text-slate-800 leading-tight">{p.nome_parceiro}</h3>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
                          {p.descricao_beneficio || "Consulte os benefícios exclusivos para membros da AMB."}
                        </p>
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-50 mt-4">
                          {p.whatsapp_contato && (
                            <Button variant="outline" size="sm" className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 h-9" asChild>
                              <a href={zapLink(p.whatsapp_contato)} target="_blank" rel="noreferrer">
                                <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
                              </a>
                            </Button>
                          )}
                          {p.link_site && (
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-slate-400 hover:text-slate-800" asChild>
                              <a href={p.link_site} target="_blank" rel="noreferrer"><Globe className="h-4 w-4" /></a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        {/* LISTA GERAL */}
        <section className="container mx-auto px-4 relative">
           <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
             <List className="h-5 w-5 text-slate-500" />
             <h2 className="text-xl font-bold text-slate-800">Lista Completa de Parceiros (A-Z)</h2>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                      <tr>
                         <th className="px-6 py-4">Parceiro</th>
                         <th className="px-6 py-4">Categoria</th>
                         <th className="px-6 py-4">Benefício</th>
                         <th className="px-6 py-4 text-right">Contato</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {listPartners.map((p) => {
                         const isOuro = p.partner_tier === 'ouro';
                         return (
                           <tr key={`list-${p.id}`} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-6 py-4">
                                 {/* NOME INTERATIVO: HOVER MOSTRA / SAIR ESCONDE / CLIQUE ABRE */}
                                 <div 
                                    className={`flex items-center gap-3 w-fit ${isOuro ? 'cursor-zoom-in' : ''}`}
                                    onMouseEnter={() => handleMouseEnterRow(p)}
                                    onMouseLeave={handleMouseLeaveRow} // CRUCIAL: Limpa o preview ao sair
                                    onClick={() => {
                                        if (isOuro) {
                                            const bannerUrl = getImageUrl(p.url_banner, 'banner');
                                            if (bannerUrl) {
                                                setImagemZoom(bannerUrl);
                                                setHoverPreview(null); // Fecha o preview ao abrir o modal
                                            }
                                        }
                                    }}
                                 >
                                    <TierIcon tier={p.partner_tier} />
                                    <span className={`font-semibold ${isOuro ? 'text-yellow-700' : 'text-slate-800'}`}>
                                        {p.nome_parceiro}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-slate-600"><Badge variant="outline" className="font-normal bg-slate-50">{p.categoria}</Badge></td>
                              <td className="px-6 py-4 text-slate-600 max-w-md truncate" title={p.descricao_beneficio}>{p.descricao_beneficio}</td>
                              <td className="px-6 py-4 text-right">
                                 {p.whatsapp_contato ? (
                                    <a href={zapLink(p.whatsapp_contato)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-green-600 font-medium hover:underline hover:text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                       <MessageSquare className="h-3.5 w-3.5" /> <span className="hidden sm:inline">WhatsApp</span>
                                    </a>
                                 ) : <span className="text-slate-400 text-xs italic">Sem contato</span>}
                              </td>
                           </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        </section>
      </main>

      {/* CARD FLUTUANTE DE PREVIEW (Apenas Visual, não bloqueia clique) */}
      {hoverPreview && (
         <div 
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" // pointer-events-none garante que o mouse "vaze" e não trave
         >
            <div 
              className="bg-black rounded-xl shadow-2xl border border-white/20 overflow-hidden w-[400px] animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="relative w-full aspect-video flex items-center justify-center bg-black">
                    {hoverPreview.fit === 'contain' && (
                        <div className="absolute inset-0 bg-cover bg-center blur-sm opacity-50" style={{ backgroundImage: `url(${hoverPreview.url})` }} />
                    )}
                    <img 
                      src={hoverPreview.url} 
                      className={`relative z-10 w-full h-full ${hoverPreview.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                      alt="Preview Campanha"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                        <Badge className="bg-white/20 backdrop-blur-md text-white border-none"><Maximize2 className="h-3 w-3 mr-1" /> Clique p/ Ampliar</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                         <Badge className="bg-yellow-500 text-black text-[10px] h-5 border-none">OURO</Badge>
                    </div>
                </div>
            </div>
         </div>
      )}

      {/* MODAL ZOOM FULLSCREEN */}
      <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none flex justify-center items-center p-0 outline-none ring-0">
           <div className="relative group">
             <button onClick={() => setImagemZoom(null)} className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-50"><X className="h-6 w-6"/></button>
             {imagemZoom && (
               <img 
                 src={imagemZoom} 
                 className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl bg-white object-contain cursor-zoom-out" 
                 alt="Zoom Parceiro" 
                 onClick={() => setImagemZoom(null)} 
               />
             )}
           </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}