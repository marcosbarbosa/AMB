/*
 * ==========================================================
 * MÓDULO: ParceirosPage.tsx
 * Versão: 7.0 (Zoom Lightbox + UX Premium)
 * Descrição:
 * - Imagem: Clique abre Zoom (Lightbox).
 * - Rodapé: Botões de contato dedicados.
 * - Filtros e Ordenação mantidos.
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from "@/components/ui/dialog"; // Import para o Modal de Zoom
import { 
  Phone, Globe, Loader2, MapPin, Award, Shield, Gem, Search, 
  Mail, ZoomIn, X 
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// API
const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros.php';

const CATEGORIAS_OFICIAIS = [
  "Saúde e Bem-estar",
  "Academia e Fitness",
  "Alimentação",
  "Artigos Esportivos",
  "Serviços Gerais",
  "Outros"
];

const TIER_WEIGHT: Record<string, number> = {
  'ouro': 3,
  'prata': 2,
  'bronze': 1,
  'pendente': 0
};

interface Parceiro {
  id: number;
  nome_parceiro: string;
  nome_empresa?: string;
  categoria: string;
  descricao_beneficio: string;
  telefone_contato: string | null;
  whatsapp_contato?: string | null;
  whatsapp?: string | null;
  email_responsavel?: string | null;
  url_logo: string | null;
  endereco: string | null;
  link_site: string | null;
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  nivel?: string;
}

export default function ParceirosPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Filtros
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');

  // Estado do Zoom (Lightbox)
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodosParceiros = async () => {
      setIsLoading(true);
      setErro(null);
      try {
        const response = await axios.get(`${API_URL}?t=${new Date().getTime()}`);
        if (response.data.status === 'sucesso') {
          setParceiros(response.data.parceiros || []);
        } else {
          setParceiros([]); 
        }
      } catch (error) {
        console.error("Erro ao buscar parceiros:", error);
        setErro('Não foi possível carregar a rede de parceiros.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodosParceiros();
  }, []);

  const parceirosProcessados = useMemo(() => {
    let lista = [...parceiros];

    if (busca) {
      const termo = busca.toLowerCase();
      lista = lista.filter(p => {
        const nome = p.nome_parceiro || p.nome_empresa || '';
        const desc = p.descricao_beneficio || '';
        return nome.toLowerCase().includes(termo) || desc.toLowerCase().includes(termo);
      });
    }

    if (categoriaSelecionada !== 'todas') {
      lista = lista.filter(p => {
        return (p.categoria || '').includes(categoriaSelecionada) || 
               (categoriaSelecionada === 'Outros' && !CATEGORIAS_OFICIAIS.some(c => (p.categoria || '').includes(c.split(' ')[0])));
      });
    }

    return lista.sort((a, b) => {
      const tierA = (a.partner_tier || a.nivel || '').toLowerCase();
      const tierB = (b.partner_tier || b.nivel || '').toLowerCase();
      const weightA = TIER_WEIGHT[tierA] || 0;
      const weightB = TIER_WEIGHT[tierB] || 0;

      if (weightA !== weightB) return weightB - weightA;

      const nomeA = a.nome_parceiro || a.nome_empresa || '';
      const nomeB = b.nome_parceiro || b.nome_empresa || '';
      return nomeA.localeCompare(nomeB);
    });

  }, [parceiros, busca, categoriaSelecionada]);

  const getWhatsAppLink = (p: Parceiro) => {
    const num = p.whatsapp_contato || p.whatsapp || p.telefone_contato;
    if (!num) return null;
    const clean = num.replace(/\D/g, '');
    if (clean.length < 10) return null;
    return `https://wa.me/55${clean}`;
  };

  const getImageUrl = (url: string | null) => {
    if (!url || url === 'NULL') return null;
    const clean = url.replace(/['"]/g, '');
    if (clean.startsWith('http')) return clean;
    return `https://www.ambamazonas.com.br${clean}`;
  };

  const NivelBadge = ({ tier }: { tier: string }) => {
    const t = (tier || '').toLowerCase();
    if (t === 'ouro') return (
      <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-[10px] font-bold border border-yellow-200 shadow-sm flex items-center gap-1 z-10 pointer-events-none">
        <Award className="h-3 w-3" /> OURO
      </div>
    );
    if (t === 'prata') return (
      <div className="absolute top-3 right-3 bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-[10px] font-bold border border-slate-200 shadow-sm flex items-center gap-1 z-10 pointer-events-none">
        <Shield className="h-3 w-3" /> PRATA
      </div>
    );
    if (t === 'bronze') return (
      <div className="absolute top-3 right-3 bg-orange-50 text-orange-800 px-2 py-1 rounded-full text-[10px] font-bold border border-orange-100 shadow-sm flex items-center gap-1 z-10 pointer-events-none">
        <Gem className="h-3 w-3" /> BRONZE
      </div>
    );
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 

        {/* Cabeçalho */}
        <section className="py-16 lg:py-20 bg-card border-b border-border">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Rede de Parceiros AMB
             </h1>
             <p className="text-xl text-muted-foreground">
               Benefícios e descontos exclusivos para associados.
             </p>
           </div>
        </section>

        {/* Conteúdo Principal */}
        <section className="py-12 lg:py-16 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Barra de Ferramentas */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-20 z-20">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground whitespace-nowrap">
                  Parceiros ({parceirosProcessados.length})
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Todas as Categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Categorias</SelectItem>
                    {CATEGORIAS_OFICIAIS.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar nome ou benefício..." 
                    className="pl-9 h-10"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Grid de Parceiros */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin mb-2 text-primary" /> 
                <p>Carregando rede de parceiros...</p>
              </div>
            )}

            {erro && (
              <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center border border-red-100">
                <p>{erro}</p>
              </div>
            )}

            {!isLoading && !erro && parceirosProcessados.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {parceirosProcessados.map((parceiro) => {
                  const logoUrl = getImageUrl(parceiro.url_logo);
                  const nome = parceiro.nome_parceiro || parceiro.nome_empresa;
                  const nivel = parceiro.partner_tier || parceiro.nivel;

                  return (
                    <Card 
                      key={parceiro.id} 
                      className={`group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden flex flex-col bg-white ${
                        nivel === 'ouro' ? 'border-t-4 border-t-yellow-400' : ''
                      }`}
                    >
                      <NivelBadge tier={nivel} />

                      {/* ÁREA DA IMAGEM - CLIQUE PARA ZOOM */}
                      <div 
                         className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center p-6 cursor-zoom-in"
                         onClick={() => logoUrl && setImagemZoom(logoUrl)}
                         title="Clique para ampliar a imagem"
                      >
                         {logoUrl ? (
                           <img 
                             src={logoUrl} 
                             alt={nome} 
                             className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                           />
                         ) : (
                           <div className="text-slate-300 font-bold text-5xl select-none">
                             {nome?.charAt(0)}
                           </div>
                         )}

                         {/* Overlay de Lupa no Hover */}
                         {logoUrl && (
                           <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                              <span className="bg-white/90 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <ZoomIn className="h-4 w-4" /> Ampliar
                              </span>
                           </div>
                         )}
                      </div>

                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-3">
                           <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-600">
                             {parceiro.categoria}
                           </Badge>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
                          {nome}
                        </h3>

                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                          {parceiro.descricao_beneficio}
                        </p>

                        {/* RODAPÉ DE CONTATOS */}
                        <div className="space-y-3 border-t border-slate-100 pt-4 mt-auto">

                          {parceiro.endereco && (
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                              <span className="line-clamp-1" title={parceiro.endereco}>{parceiro.endereco}</span>
                            </div>
                          )}

                          {parceiro.email_responsavel && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="h-3.5 w-3.5 text-slate-400" />
                              <span className="truncate">{parceiro.email_responsavel}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-3 pt-2">
                             {/* Botão Telefone/Whats */}
                             {(parceiro.whatsapp_contato || parceiro.telefone_contato) && (
                                <Button size="sm" variant="outline" className="h-9 text-xs gap-1.5 w-full border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300" asChild>
                                   <a href={getWhatsAppLink(parceiro) || '#'} target="_blank" rel="noreferrer">
                                      <Phone className="h-3.5 w-3.5" /> WhatsApp
                                   </a>
                                </Button>
                             )}

                             {/* Botão Site */}
                             {parceiro.link_site && (
                                <Button size="sm" variant="ghost" className="h-9 text-xs gap-1.5 w-full bg-slate-50 hover:bg-slate-100" asChild>
                                   <a href={parceiro.link_site} target="_blank" rel="noreferrer">
                                      <Globe className="h-3.5 w-3.5" /> Site
                                   </a>
                                </Button>
                             )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL LIGHTBOX (ZOOM DA IMAGEM) */}
      <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none flex flex-col items-center justify-center ring-0 focus:outline-none">
           <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -top-10 right-0 text-white hover:bg-white/20 rounded-full" 
                onClick={() => setImagemZoom(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              {imagemZoom && (
                <img 
                  src={imagemZoom} 
                  alt="Zoom" 
                  className="w-auto h-auto max-h-[80vh] max-w-[95vw] rounded-lg shadow-2xl object-contain bg-white"
                />
              )}
           </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}