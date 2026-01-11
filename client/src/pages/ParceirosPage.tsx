/*
 * ==========================================================
 * MÓDULO: ParceirosPage.tsx
 * Versão: 16.0 (Badges de Nível Visíveis e Ícones Premium)
 * ==========================================================
 * ATUALIZAÇÕES:
 * 1. VISUALIZAÇÃO: Adicionado 'relative' ao Card para fixar o ícone de nível.
 * 2. ÍCONES: Novos ícones (Trophy, Shield, Medal) para Ouro/Prata/Bronze.
 * 3. LAYOUT: Mantida a redução dos banners (h-28) e correções anteriores.
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
  Phone, Globe, Loader2, MapPin, Search, Mail, ZoomIn, X,
  Trophy, Shield, Medal // Ícones importados para os níveis
} from 'lucide-react';

// --- CONFIGURAÇÃO ---
const API_PARCEIROS = 'https://www.ambamazonas.com.br/api/get_parceiros_publico.php';
const API_CATEGORIAS = 'https://www.ambamazonas.com.br/api/get_categorias_parceiros.php';
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

const TIER_WEIGHT: Record<string, number> = {
  'ouro': 3, 'prata': 2, 'bronze': 1, 'pendente': 0, 'null': 0
};

interface Categoria {
  id: number;
  nome: string;
}

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

        if (resParceiros.data.status === 'sucesso') {
          setParceiros(resParceiros.data.dados || []);
        }
        if (resCats.data.status === 'sucesso') {
            setCategoriasDB(resCats.data.dados || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro('Erro ao conectar com o servidor.');
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
    if (clean.length < 8) return null;
    const final = clean.startsWith('55') || clean.length < 12 ? clean : `55${clean}`;
    return `https://wa.me/${clean.startsWith('55') ? clean : '55'+clean}`;
  };

  const categoriasOrdenadas = useMemo(() => {
    const unicas = new Set(categoriasDB.map(c => c.nome.trim()));
    return Array.from(unicas).sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
  }, [categoriasDB]);

  const parceirosProcessados = useMemo(() => {
    let lista = [...parceiros];

    if (busca) {
      const termo = busca.toLowerCase();
      lista = lista.filter(p => {
        const nome = p.nome_parceiro || p.nome_empresa || '';
        const desc = p.descricao_beneficio || '';
        const cat = p.categoria || '';
        return nome.toLowerCase().includes(termo) || 
               desc.toLowerCase().includes(termo) ||
               cat.toLowerCase().includes(termo);
      });
    }

    if (categoriaSelecionada !== 'todas') {
      lista = lista.filter(p => {
        const catItem = (p.categoria || '').toLowerCase();
        const catFiltro = categoriaSelecionada.toLowerCase();
        return catItem.includes(catFiltro) || catFiltro.includes(catItem);
      });
    }

    return lista.sort((a, b) => {
      const tA = (a.partner_tier || a.nivel || '').toLowerCase();
      const tB = (b.partner_tier || b.nivel || '').toLowerCase();
      if (TIER_WEIGHT[tA] !== TIER_WEIGHT[tB]) {
        return (TIER_WEIGHT[tB] || 0) - (TIER_WEIGHT[tA] || 0);
      }
      const nomeA = a.nome_parceiro || a.nome_empresa || '';
      const nomeB = b.nome_parceiro || b.nome_empresa || '';
      return nomeA.localeCompare(nomeB);
    });
  }, [parceiros, busca, categoriaSelecionada]);

  // --- BADGE DE NÍVEL (COM ÍCONES NOVOS) ---
  const NivelBadge = ({ tier }: { tier: string }) => {
    const t = (tier || '').toLowerCase();

    // OURO: Troféu
    if (t === 'ouro') return (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-yellow-100 text-yellow-800 border border-yellow-300 px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
            <Trophy className="h-3.5 w-3.5 text-yellow-700 fill-yellow-700" />
            <span className="text-[10px] font-bold tracking-wide">OURO</span>
        </div>
    );

    // PRATA: Escudo
    if (t === 'prata') return (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
            <Shield className="h-3.5 w-3.5 text-slate-500 fill-slate-300" />
            <span className="text-[10px] font-bold tracking-wide">PRATA</span>
        </div>
    );

    // BRONZE: Medalha
    if (t === 'bronze') return (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-orange-50 text-orange-800 border border-orange-200 px-2.5 py-1 rounded-full shadow-sm pointer-events-none">
            <Medal className="h-3.5 w-3.5 text-orange-700" />
            <span className="text-[10px] font-bold tracking-wide">BRONZE</span>
        </div>
    );
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">

        <section className="py-16 bg-card border-b border-border">
           <div className="max-w-7xl mx-auto px-4 text-center">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">Rede de Parceiros AMB</h1>
             <p className="text-xl text-muted-foreground">Conectando associados às melhores marcas.</p>
           </div>
        </section>

        <section className="py-12 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4">

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-20 z-20">
              <h2 className="text-lg font-semibold whitespace-nowrap">Parceiros ({parceirosProcessados.length})</h2>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada}>
                  <SelectTrigger className="w-full sm:w-[240px] border-slate-200">
                     <SelectValue placeholder="Filtrar por Categoria" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="todas">Todas as Categorias</SelectItem>
                    {categoriasOrdenadas.map((catNome) => (
                       <SelectItem key={catNome} value={catNome}>{catNome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar empresa..." className="pl-9" value={busca} onChange={(e) => setBusca(e.target.value)} />
                </div>
              </div>
            </div>

            {isLoading && <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /><p className="mt-2 text-muted-foreground">Carregando...</p></div>}

            {!isLoading && !erro && parceirosProcessados.length === 0 && (
               <div className="py-20 text-center bg-white rounded-xl border border-dashed border-slate-300">
                  <Search className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-muted-foreground">Nenhum parceiro encontrado.</p>
                  <Button variant="link" onClick={() => {setBusca(''); setCategoriaSelecionada('todas')}}>Limpar Filtros</Button>
               </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {parceirosProcessados.map((parceiro) => {
                const imgUrl = getImageUrl(parceiro.url_logo);
                const nome = parceiro.nome_parceiro || parceiro.nome_empresa;
                const nivel = parceiro.partner_tier || parceiro.nivel;
                const whatsUrl = getWhatsAppLink(parceiro);

                return (
                  // ADICIONADO 'relative' PARA O ÍCONE APARECER
                  <Card key={parceiro.id} className={`group relative flex flex-col overflow-hidden bg-white border-slate-200 hover:shadow-xl transition-all duration-300 ${
                    (nivel?.toLowerCase() === 'ouro') ? 'border-t-4 border-t-yellow-400' : ''
                  }`}>

                    {/* Ícone de Nível (Badge) */}
                    <NivelBadge tier={nivel} />

                    {/* IMAGEM COM ZOOM */}
                    <div 
                      className="h-28 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4 cursor-zoom-in border-b border-slate-100"
                      onClick={() => imgUrl && setImagemZoom(imgUrl)}
                      title="Clique para ampliar"
                    >
                      {imgUrl ? (
                        <img 
                          src={imgUrl} 
                          alt={nome} 
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="text-slate-300 font-bold text-4xl select-none">{nome?.charAt(0)}</div>
                      )}

                      {imgUrl && (
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                           <span className="bg-white/90 text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
                             <ZoomIn className="h-3 w-3" /> Ampliar
                           </span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="mb-2">
                        <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-600 capitalize px-2 py-0.5 text-[10px] tracking-wide">
                          {parceiro.categoria}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight text-slate-800">{nome}</h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2 leading-relaxed">{parceiro.descricao_beneficio}</p>

                      <div className="space-y-3 pt-3 border-t border-slate-100 mt-auto">
                        {parceiro.endereco && (
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" /> <span className="line-clamp-1">{parceiro.endereco}</span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          {whatsUrl && (
                            <Button size="sm" variant="outline" className="h-8 w-full text-xs border-green-200 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors" asChild>
                              <a href={whatsUrl} target="_blank" rel="noreferrer"><Phone className="h-3.5 w-3.5 mr-1.5" /> WhatsApp</a>
                            </Button>
                          )}
                          {parceiro.link_site && (
                            <Button size="sm" variant="ghost" className="h-8 w-full text-xs bg-slate-50 hover:bg-slate-100 text-slate-600" asChild>
                              <a href={parceiro.link_site} target="_blank" rel="noreferrer"><Globe className="h-3.5 w-3.5 mr-1.5" /> Site</a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none flex justify-center items-center">
           <div className="relative">
             <Button 
                variant="secondary" 
                size="icon" 
                className="absolute -top-12 right-0 rounded-full bg-white/20 hover:bg-white/40 text-white" 
                onClick={() => setImagemZoom(null)}
             >
                <X className="h-6 w-6"/>
             </Button>

             {imagemZoom && (
                <img 
                  src={imagemZoom} 
                  className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl bg-white object-contain cursor-pointer" 
                  alt="Zoom" 
                  onClick={() => setImagemZoom(null)} 
                  title="Clique para fechar"
                />
             )}
           </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}