/*
 * ==========================================================
 * COMPONENTE: CarouselHero.tsx
 * Versão: 4.0 (Técnica "Blur Backdrop" - Visual de Cinema)
 * Descrição: Quando o banner não preencher a tela (Contain),
 * cria um fundo desfocado com a própria imagem para eliminar
 * as barras pretas sólidas.
 * ==========================================================
 */

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import axios from 'axios';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { MessageSquare, ExternalLink } from 'lucide-react';

const API_BANNERS = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';

// Interfaces (Mantidas)
interface BannerOuro {
  type: 'parceiro';
  id: number;
  nome_parceiro: string;
  url_banner: string;
  banner_fit_mode: 'cover' | 'contain';
  banner_fit_mobile?: 'cover' | 'contain';
  banner_status: 'aprovado' | 'pendente' | 'rejeitado';
  whatsapp_contato: string | null;
  partner_tier: string;
}

interface BannerInstitucional {
  type: 'institucional';
  id: number;
  titulo: string;
  url_imagem: string;
  url_link_destino: string | null;
  ordem_exibicao: number;
  fit_mode?: 'cover' | 'contain';
}

type SlideItem = BannerOuro | BannerInstitucional;

export function CarouselHero() {
  const [slides, setSlides] = useState<SlideItem[]>([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const res = await axios.get(`${API_BANNERS}?t=${new Date().getTime()}`);
        if (res.data.status === 'sucesso') {
          const listaFinal: SlideItem[] = [];

          // Institucionais
          if (res.data.institucionais) {
            listaFinal.push(...res.data.institucionais.map((b: any) => ({ ...b, type: 'institucional' })));
          }
          // Parceiros
          if (res.data.parceiros) {
            listaFinal.push(...res.data.parceiros
              .filter((p: any) => p.partner_tier === 'ouro' && p.url_banner && p.banner_status === 'aprovado')
              .map((p: any) => ({ ...p, type: 'parceiro' }))
            );
          }
          setSlides(listaFinal);
        }
      } catch (error) {
        console.error("Erro ao carregar banners:", error);
      }
    };
    fetchDados();
  }, []);

  const gerarLinkWhatsapp = (numero: string | null) => {
    if (!numero) return '#';
    const limpo = numero.replace(/\D/g, ''); 
    return `https://api.whatsapp.com/send/?phone=${limpo.length <= 11 ? '55'+limpo : limpo}&text=Olá! Vi sua campanha no Portal AMB.`;
  };

  const DOMAIN_URL = 'https://www.ambamazonas.com.br';
  const getFullUrl = (url: string) => url ? (url.startsWith('http') ? url : `${DOMAIN_URL}${url}`) : '';

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]} 
      spaceBetween={0} 
      slidesPerView={1} 
      loop={slides.length > 1}
      navigation={slides.length > 1} 
      pagination={slides.length > 1 ? { clickable: true } : false} 
      autoplay={{ delay: 6000, disableOnInteraction: false }} 
      effect="fade" 
      className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] bg-black shadow-inner"
    >
      {slides.map((slide) => {
        const isInst = slide.type === 'institucional';
        const urlImagem = getFullUrl(isInst ? (slide as BannerInstitucional).url_imagem : (slide as BannerOuro).url_banner);
        const fitMode = isInst ? (slide as BannerInstitucional).fit_mode : (slide as BannerOuro).banner_fit_mode;

        // Verifica se devemos usar o efeito Blur (apenas se for Contain)
        const useBlurEffect = fitMode === 'contain';

        // Lógica de Link
        const linkUrl = isInst ? (slide as BannerInstitucional).url_link_destino : gerarLinkWhatsapp((slide as BannerOuro).whatsapp_contato);
        const LinkComp = linkUrl ? 'a' : 'div';
        const linkProps = linkUrl ? { href: linkUrl, target: '_blank', rel: 'noopener noreferrer' } : {};

        return (
            <SwiperSlide key={`${slide.type}-${slide.id}`}>
              <LinkComp 
                {...linkProps}
                className={`relative w-full h-full block group overflow-hidden ${linkUrl ? 'cursor-pointer' : ''}`}
              >
                {/* 1. CAMADA DE FUNDO (Blur Backdrop) - Só aparece no modo Contain */}
                {useBlurEffect && (
                    <>
                        {/* Imagem esticada e borrada no fundo */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-60 scale-110 transition-transform duration-1000"
                            style={{ backgroundImage: `url(${urlImagem})` }}
                        />
                        {/* Camada escura para dar destaque à imagem principal */}
                        <div className="absolute inset-0 bg-black/50" />
                    </>
                )}

                {/* 2. IMAGEM PRINCIPAL */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <img 
                      src={urlImagem} 
                      alt={isInst ? (slide as BannerInstitucional).titulo : (slide as BannerOuro).nome_parceiro} 
                      className={`max-w-full max-h-full transition-transform duration-700 
                        ${useBlurEffect ? 'object-contain shadow-2xl scale-95 hover:scale-100' : 'object-cover w-full h-full'}
                      `} 
                    />
                </div>

                {/* 3. ELEMENTOS VISUAIS EXTRAS (Badges e Overlays) */}
                {!isInst && (
                    <div className="absolute top-6 right-6 z-20">
                        <span className="bg-yellow-500 text-black text-[10px] font-bold px-3 py-1.5 rounded shadow-lg uppercase tracking-widest border border-white/20">
                            Parceiro Ouro 🏆
                        </span>
                    </div>
                )}

                {linkUrl && (
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30">
                        <span className="text-white font-semibold flex items-center gap-2">
                            {isInst ? <ExternalLink className="h-4 w-4 text-yellow-400" /> : <MessageSquare className="h-4 w-4 text-green-400" />}
                            {isInst ? 'Clique para acessar' : 'Falar no WhatsApp'}
                        </span>
                    </div>
                )}
              </LinkComp>
            </SwiperSlide>
        );
      })}

      {slides.length === 0 && (
          <SwiperSlide>
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <span className="text-white/20 text-xl font-bold">Carregando Destaques...</span>
              </div>
          </SwiperSlide>
      )}
    </Swiper>
  );
}