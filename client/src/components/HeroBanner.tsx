/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: client/src/components/HeroBanner.tsx
 * ATUALIZAÇÃO: Setas de Navegação com Alta Visibilidade
 * VERSÃO: 4.0 Prime (Force Visible Arrows)
 * ==========================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, ChevronRight, ChevronLeft } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export function HeroBanner() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<any[]>([]);
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
        let eventoAtivo = null;
        try {
            const resEvento = await axios.get(`${API_BASE}/get_banner_ativo.php`);
            if (resEvento.data.status === 'sucesso' && resEvento.data.banner) {
                eventoAtivo = resEvento.data.banner;
            }
        } catch (e) { console.warn("Sem evento ativo"); }

        let bannersInst = [];
        try {
            const resInst = await axios.get(`${API_BASE}/listar_banners_publico.php`);
            if (resInst.data.status === 'sucesso') {
                bannersInst = resInst.data.banners;
            }
        } catch (e) { console.warn("Erro banners institucionais"); }

        let listaFinal = [];

        if (eventoAtivo) {
            listaFinal.push({
                type: 'evento',
                id: 'evt_' + eventoAtivo.id,
                titulo: eventoAtivo.nome_evento,
                subtitulo: `${eventoAtivo.genero || ''} • ${eventoAtivo.tipo || ''}`,
                imagem: eventoAtivo.url_imagem,
                link: '/campeonatos',
                modo: 'cover'
            });
        }

        if (Array.isArray(bannersInst)) {
            bannersInst.forEach((b: any) => {
                listaFinal.push({
                    type: 'institucional',
                    id: 'inst_' + b.id,
                    titulo: b.titulo,
                    subtitulo: 'AMB Amazonas',
                    imagem: b.url_imagem,
                    link: b.link_destino || b.url_link_destino || '',
                    modo: b.modo_exibicao || 'cover'
                });
            });
        }

        if (listaFinal.length === 0) {
            listaFinal.push({ type: 'fallback' });
        }

        setBanners(listaFinal);
      } catch (error) {
        console.error(error);
        setBanners([{ type: 'fallback' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-[500px] md:h-[600px] bg-slate-900 animate-pulse" />;

  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-slate-900 group">

      {/* Container do Embla Carousel */}
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((item, index) => (
            <div key={item.id || index} className="relative flex-[0_0_100%] h-full flex items-center justify-center min-w-0">

              {/* --- IMAGEM DE FUNDO --- */}
              <div className="absolute inset-0 z-0">
                  {item.type === 'fallback' ? (
                      <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&fit=crop" className="w-full h-full object-cover opacity-40 grayscale" />
                  ) : (
                      <div className={`w-full h-full ${item.modo === 'contain' ? 'bg-black flex items-center justify-center' : ''}`}>
                          {item.imagem ? (
                              <img 
                                  src={`https://www.ambamazonas.com.br${item.imagem}`} 
                                  className={`w-full h-full ${item.modo === 'contain' ? 'object-contain' : 'object-cover opacity-80'}`} 
                              />
                          ) : (
                              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">Imagem Indisponível</div>
                          )}
                      </div>
                  )}

                  {/* Gradiente */}
                  {(item.modo === 'cover' || item.type === 'fallback') && (
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  )}
              </div>

              {/* --- CONTEÚDO --- */}
              <div className="relative z-10 container mx-auto px-12 md:px-20 text-center pointer-events-none"> 
                  <div className="pointer-events-auto">
                    {item.type === 'evento' && (
                        <Badge className="mb-4 bg-yellow-500 text-black font-black uppercase tracking-wider text-xs md:text-sm px-4 py-1 hover:bg-yellow-400 border-none shadow-lg">
                            Acontecendo Agora
                        </Badge>
                    )}

                    {(item.type !== 'institucional' || item.modo === 'cover') && (
                        <>
                            <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg max-w-4xl mx-auto leading-tight">
                                {item.type === 'fallback' ? 'A Grandeza não tem idade' : item.titulo}
                            </h1>
                            {item.subtitulo && (
                                <p className="text-slate-200 text-sm md:text-xl font-medium mb-8 uppercase tracking-widest bg-black/30 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
                                    {item.subtitulo}
                                </p>
                            )}

                            {item.type === 'evento' && (
                                <div><Button size="lg" className="h-12 md:h-14 px-8 text-base md:text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl pointer-events-auto" onClick={() => navigate(item.link)}>Acompanhar Tabela <Trophy className="ml-2 h-5 w-5"/></Button></div>
                            )}

                            {item.type === 'fallback' && (
                                <div className="flex justify-center gap-4"><Button size="lg" className="bg-yellow-500 text-black font-bold pointer-events-auto" onClick={() => navigate('/seja-parceiro')}>Seja Parceiro</Button></div>
                            )}
                        </>
                    )}

                    {item.type === 'institucional' && item.link && (
                        <div className="absolute bottom-10 left-0 right-0 pointer-events-auto">
                            <Button variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur hover:bg-white/20" onClick={() => window.open(item.link, '_blank')}>
                                Saiba Mais <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- BOTÕES DE NAVEGAÇÃO "FORÇADOS" --- 
          Usando botões HTML normais para garantir visibilidade e Z-index máximo 
      */}
      {banners.length > 1 && (
          <>
            <button 
                onClick={scrollPrev}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-[100] h-12 w-12 rounded-full bg-black/40 text-white border border-white/20 flex items-center justify-center hover:bg-black/70 hover:scale-110 transition-all cursor-pointer backdrop-blur-md shadow-xl"
                aria-label="Anterior"
            >
                <ChevronLeft className="h-8 w-8"/>
            </button>

            <button 
                onClick={scrollNext}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-[100] h-12 w-12 rounded-full bg-black/40 text-white border border-white/20 flex items-center justify-center hover:bg-black/70 hover:scale-110 transition-all cursor-pointer backdrop-blur-md shadow-xl"
                aria-label="Próximo"
            >
                <ChevronRight className="h-8 w-8"/>
            </button>
          </>
      )}
    </div>
  );
}