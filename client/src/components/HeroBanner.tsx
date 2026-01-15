/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: client/src/components/HeroBanner.tsx
 * FUNÇÃO: Banner Principal (Institucional + Parceiros + Setas Visíveis)
 * VERSÃO: 5.0 Prime (Force Visible Arrows + Unified API)
 * ==========================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Usamos a API unificada que já traz Institucionais + Parceiros Ouro
const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';

interface BannerItem {
  id: string | number;
  titulo: string;
  subtitulo?: string;
  url_imagem: string;
  url_link_destino?: string | null;
  fit_mode?: 'cover' | 'contain';
  tipo?: 'institucional' | 'parceiro';
}

export function HeroBanner() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Configuração do Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);

  // Funções de Navegação Manuais
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}?t=${Date.now()}`);
        if (res.data.status === 'sucesso') {
            // A API já retorna um array "institucionais" que contem tanto banners da AMB quanto de parceiros Ouro
            const listaMista = res.data.institucionais || [];

            if (listaMista.length > 0) {
                setBanners(listaMista);
            } else {
                // Fallback se não vier nada
                setBanners([{ 
                    id: 'default', 
                    titulo: 'A Grandeza não tem idade', 
                    url_imagem: '', // Vai cair no fallback de imagem
                    tipo: 'institucional' 
                }]);
            }
        }
      } catch (error) {
        console.error("Erro Banner:", error);
        setBanners([{ id: 'err', titulo: 'AMB Amazonas', url_imagem: '', tipo: 'institucional' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-[500px] md:h-[600px] bg-slate-900 flex items-center justify-center"><Loader2 className="h-10 w-10 text-slate-500 animate-spin"/></div>;

  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-slate-900 group">

      {/* Container do Embla Carousel */}
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((item, index) => {
             // Tratamento de URL
             const imgUrl = item.url_imagem && item.url_imagem.startsWith('http') 
                ? item.url_imagem 
                : (item.url_imagem ? `https://www.ambamazonas.com.br${item.url_imagem}` : null);

             return (
                <div key={item.id || index} className="relative flex-[0_0_100%] h-full flex items-center justify-center min-w-0">

                {/* --- IMAGEM DE FUNDO --- */}
                <div className="absolute inset-0 z-0">
                    {imgUrl ? (
                        <>
                            {/* Blur Background se for Contain */}
                            {item.fit_mode === 'contain' && (
                                <div 
                                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-50"
                                    style={{ backgroundImage: `url(${imgUrl})` }}
                                />
                            )}

                            {/* Imagem Principal */}
                            <img 
                                src={imgUrl} 
                                className={`w-full h-full ${item.fit_mode === 'contain' ? 'object-contain' : 'object-cover opacity-90'}`} 
                                alt={item.titulo}
                            />
                        </>
                    ) : (
                        <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&fit=crop" className="w-full h-full object-cover opacity-40 grayscale" />
                    )}

                    {/* Gradiente Overlay */}
                    {(item.fit_mode === 'cover' || !imgUrl) && (
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    )}
                </div>

                {/* --- CONTEÚDO --- */}
                <div className="relative z-10 container mx-auto px-12 md:px-20 text-center pointer-events-none"> 
                    <div className="pointer-events-auto">

                        {/* Se for Parceiro, mostra Badge */}
                        {item.tipo === 'parceiro' && (
                            <Badge className="mb-4 bg-yellow-500 text-black font-black uppercase tracking-wider text-xs md:text-sm px-4 py-1 hover:bg-yellow-400 border-none shadow-lg animate-in fade-in slide-in-from-top-4">
                                Parceiro Oficial
                            </Badge>
                        )}

                        {/* Título e Subtítulo (Oculta se for apenas imagem 'cover' de parceiro sem título definido, opcional) */}
                        {item.titulo && item.titulo !== '' && (
                            <>
                                <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg max-w-4xl mx-auto leading-tight">
                                    {item.titulo}
                                </h1>
                                {item.url_link_destino && (
                                    <div className="mt-8">
                                        <Button 
                                            size="lg" 
                                            className={`h-12 px-8 text-base font-bold shadow-xl pointer-events-auto transition-transform hover:scale-105 ${item.tipo === 'parceiro' ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`} 
                                            onClick={() => window.open(item.url_link_destino!, '_blank')}
                                        >
                                            Saiba Mais <ArrowRight className="ml-2 h-5 w-5"/>
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                </div>
             );
          })}
        </div>
      </div>

      {/* --- BOTÕES DE NAVEGAÇÃO "FORÇADOS" --- 
          Z-Index 100 para garantir que fiquem sobre tudo
      */}
      {banners.length > 1 && (
          <>
            <button 
                onClick={scrollPrev}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-[100] h-12 w-12 rounded-full bg-black/40 text-white border border-white/20 flex items-center justify-center hover:bg-black/70 hover:scale-110 transition-all cursor-pointer backdrop-blur-md shadow-xl group/btn"
                aria-label="Anterior"
            >
                <ChevronLeft className="h-8 w-8 group-hover/btn:-translate-x-0.5 transition-transform"/>
            </button>

            <button 
                onClick={scrollNext}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-[100] h-12 w-12 rounded-full bg-black/40 text-white border border-white/20 flex items-center justify-center hover:bg-black/70 hover:scale-110 transition-all cursor-pointer backdrop-blur-md shadow-xl group/btn"
                aria-label="Próximo"
            >
                <ChevronRight className="h-8 w-8 group-hover/btn:translate-x-0.5 transition-transform"/>
            </button>
          </>
      )}
    </div>
  );
}