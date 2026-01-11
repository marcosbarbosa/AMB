        /*
         * ==========================================================
         * MÓDULO: ParceirosPage.tsx
         * Versão: 23.1 (Correção de Importação + Efeito Hover Ouro)
         * ==========================================================
         */

        import { useState, useEffect, useMemo } from 'react';
        import axios from 'axios';
        import { Navigation } from '@/components/Navigation';
        import { Footer } from '@/components/Footer';
        import { Card, CardContent } from '@/components/ui/card';
        import { Input } from '@/components/ui/input';
        import { Badge } from '@/components/ui/badge';
        // CORREÇÃO AQUI: Removido o espaço entre @ e /
        import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
        import { Button } from '@/components/ui/button';
        import { Dialog, DialogContent } from "@/components/ui/dialog"; 
        import { 
          Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
        } from "@/components/ui/tooltip";
        import { 
          Phone, Globe, Loader2, MapPin, Search, 
          ZoomIn, X, MessageSquare
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
          // Campos Novos Ouro
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
          const [imagemZoom, setImagemZoom] = useState<string | null>(null);

          useEffect(() => {
            const fetchData = async () => {
              try {
                const [resP, resC] = await Promise.all([
                  axios.get(API_PARCEIROS),
                  axios.get(API_CATEGORIAS)
                ]);
                if (resP.data.status === 'sucesso') setParceiros(resP.data.dados || []); // Ajuste para ler .dados conforme sua API
                if (resC.data.status === 'sucesso') setCategorias(resC.data.dados.map((c: any) => c.nome) || []); // Ajuste para ler estrutura da API
              } catch (error) {
                console.error("Erro ao carregar dados:", error);
              } finally {
                setLoading(false);
              }
            };
            fetchData();
          }, []);

          const filteredParceiros = useMemo(() => {
            return parceiros
              .filter(p => {
                const matchesSearch = p.nome_parceiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.categoria.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCat = selectedCategory === 'todas' || p.categoria === selectedCategory;
                return matchesSearch && matchesCat;
              })
              .sort((a, b) => (TIER_WEIGHT[b.partner_tier] || 0) - (TIER_WEIGHT[a.partner_tier] || 0));
          }, [parceiros, searchTerm, selectedCategory]);

          const getImageUrl = (path: string | null) => {
            if (!path) return null;
            return path.startsWith('http') ? path : `${DOMAIN_URL}${path}`;
          };

          const zapLink = (num: string | null) => {
            if (!num) return '#';
            const clean = num.replace(/\D/g, '');
            return `https://api.whatsapp.com/send?phone=55${clean}&text=Olá! Vi sua marca no Portal AMB.`;
          };

          return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
              <Navigation />

              <main className="flex-grow pt-24 pb-12">
                {/* HEADER & FILTROS */}
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

                <section className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-10 w-10 text-yellow-500 animate-spin" />
                        <p className="text-slate-500 font-medium">Carregando parceiros...</p>
                      </div>
                    ) : (
                      filteredParceiros.map((p) => (
                        <Card 
                          key={p.id} 
                          className={`relative overflow-hidden transition-all duration-300 group hover:shadow-xl border-slate-200 ${
                            p.partner_tier === 'ouro' ? 'ring-2 ring-yellow-400/30' : ''
                          }`}
                        >
                          <CardContent className="p-0">
                            {/* ÁREA DA LOGO / BANNER HOVER */}
                            <div className="relative h-48 bg-white flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden">
                              {/* Logo Principal */}
                              <img 
                                src={getImageUrl(p.url_logo) || '/placeholder-logo.png'} 
                                alt={p.nome_parceiro}
                                className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:opacity-0"
                              />

                              {/* BANNER DE CAMPANHA (Aparece no Hover apenas para Ouro) */}
                              {p.partner_tier === 'ouro' && p.url_banner && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black">
                                   <img 
                                      src={getImageUrl(p.url_banner)!}
                                      className={`w-full h-full ${p.banner_fit_mode === 'cover' ? 'object-cover' : 'object-contain'}`}
                                      alt={`Campanha ${p.nome_parceiro}`}
                                   />
                                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                </div>
                              )}

                              {/* Selos de Nível */}
                              <div className="absolute top-3 right-3 z-10">
                                {p.partner_tier === 'ouro' ? (
                                  <Badge className="bg-yellow-500 text-black border-none hover:bg-yellow-600">OURO 🏆</Badge>
                                ) : p.partner_tier === 'prata' ? (
                                  <Badge className="bg-slate-300 text-slate-800 border-none">PRATA</Badge>
                                ) : null}
                              </div>

                              {/* Botão de Zoom na Logo */}
                              <button 
                                onClick={() => setImagemZoom(getImageUrl(p.url_logo))}
                                className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                              >
                                <ZoomIn className="h-4 w-4 text-slate-600" />
                              </button>
                            </div>

                            {/* CONTEÚDO INFORMATIVO */}
                            <div className="p-5">
                              <div className="mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-600">{p.categoria}</span>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight">{p.nome_parceiro}</h3>
                              </div>

                              <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
                                {p.descricao_beneficio || "Consulte os benefícios exclusivos para membros da AMB."}
                              </p>

                              <div className="space-y-2 border-t border-slate-50 pt-4">
                                {p.endereco && (
                                  <div className="flex items-start gap-2 text-[11px] text-slate-500">
                                    <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-slate-400" />
                                    <span className="line-clamp-1">{p.endereco}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                  {p.whatsapp_contato && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 h-9"
                                      asChild
                                    >
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
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </section>
              </main>

              {/* MODAL ZOOM */}
              <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
                <DialogContent className="max-w-4xl bg-transparent border-none shadow-none flex justify-center items-center p-4 ring-0 focus:outline-none">
                   <div className="relative group">
                     <Button variant="secondary" size="icon" className="absolute -top-12 right-0 rounded-full bg-white/20 text-white hover:bg-white/40 border-none" onClick={() => setImagemZoom(null)}><X className="h-6 w-6"/></Button>
                     {imagemZoom && <img src={imagemZoom} className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl bg-white object-contain" alt="Zoom" />}
                   </div>
                </DialogContent>
              </Dialog>

              <Footer />
            </div>
          );
        }