/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 11 de janeiro de 2026 // Atualizado
 * Hora: 20:15 // Atualizado
 * Versão: 2.2 (Smart Fit Híbrido: Mobile/Desktop Independente)
 *
 * Descrição: Componente Hero com suporte a regras de exibição
 * independentes para telas pequenas e grandes.
 *
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

// 1. IMPORTAÇÕES INSTITUCIONAIS
import bannerCampeonato from '@/assets/banner_logo_campeonato_05.png'; 
import fotoTime from '@/assets/foto-time-amb.jpg';

const API_BANNERS = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';

interface BannerOuro {
  id: number;
  nome_parceiro: string;
  url_banner: string;
  // Campos de Configuração Híbrida
  banner_fit_mode: 'cover' | 'contain';    // Regra Desktop
  banner_fit_mobile?: 'cover' | 'contain'; // Regra Mobile (Opcional, fallback para cover)
  banner_status: 'aprovado' | 'pendente' | 'rejeitado';
  whatsapp_contato: string | null;
  partner_tier: string;
}

export function CarouselHero() {
  const [bannersParceiros, setBannersParceiros] = useState<BannerOuro[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${API_BANNERS}?t=${new Date().getTime()}`);
        if (res.data.status === 'sucesso' && res.data.parceiros) {
          const aprovados = res.data.parceiros.filter((p: BannerOuro) => 
            p.partner_tier === 'ouro' && 
            p.url_banner && 
            p.banner_status === 'aprovado'
          );
          setBannersParceiros(aprovados);
        }
      } catch (error) {
        console.error("Erro ao carregar campanhas dinâmicas:", error);
      }
    };
    fetchBanners();
  }, []);

  const gerarLinkWhatsapp = (numero: string | null) => {
    if (!numero) return '#';
    const limpo = numero.replace(/\D/g, ''); 
    const fone = limpo.length <= 11 ? `55${limpo}` : limpo;
    return `https://api.whatsapp.com/send/?phone=${fone}&text=Olá! Vi sua campanha no Portal AMB.`;
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]} 
      spaceBetween={0} 
      slidesPerView={1} 
      loop={true} 
      navigation 
      pagination={{ clickable: true }} 
      autoplay={{ delay: 6000, disableOnInteraction: false }} 
      effect="fade" 
      className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] bg-black shadow-inner" 
      data-testid="carousel-hero"
    >
      {/* SEÇÃO 1: BANNERS INSTITUCIONAIS AMB */}
      <SwiperSlide key="amb-main">
        <div className="relative w-full h-full">
          <img 
            src={bannerCampeonato} 
            alt="Banner Campeonato Master AMB" 
            className="w-full h-full object-cover" 
          />
        </div>
      </SwiperSlide>

      <SwiperSlide key="amb-team">
        <div className="relative w-full h-full">
          <img 
            src={fotoTime} 
            alt="Foto do Time AMB Master" 
            className="w-full h-full object-cover" 
          />
        </div>
      </SwiperSlide>

      {/* SEÇÃO 2: BANNERS DINÂMICOS PARCEIROS OURO */}
      {bannersParceiros.map((banner) => {
        // Lógica Híbrida de Classes CSS
        // 1. Mobile (Base): Usa a config mobile. Se não existir, usa cover.
        const mobileClass = banner.banner_fit_mobile === 'contain' ? 'object-contain' : 'object-cover';

        // 2. Desktop (md: prefix): Sobrescreve a regra base quando a tela for média/grande.
        const desktopClass = banner.banner_fit_mode === 'contain' ? 'md:object-contain' : 'md:object-cover';

        return (
          <SwiperSlide key={`ouro-${banner.id}`}>
            <a 
              href={gerarLinkWhatsapp(banner.whatsapp_contato)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative w-full h-full block group overflow-hidden"
              title={`Falar com ${banner.nome_parceiro}`}
            >
              {/* Container Preto (Segurança para modo Contain) */}
              <div className="w-full h-full flex items-center justify-center bg-black">
                <img 
                  src={`https://www.ambamazonas.com.br${banner.url_banner}`} 
                  alt={banner.nome_parceiro} 
                  // Aplicação das classes responsivas combinadas
                  className={`w-full h-full transition-transform duration-1000 group-hover:scale-105 ${mobileClass} ${desktopClass}`} 
                />
              </div>

              {/* Indicador Prime */}
              <div className="absolute top-6 right-6 z-10 flex flex-col items-end gap-2">
                <span className="bg-yellow-500 text-black text-[10px] font-bold px-3 py-1.5 rounded shadow-2xl uppercase tracking-widest border border-white/20">
                  Parceiro Ouro 🏆
                </span>
              </div>

              {/* Overlay CTA */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-400" /> Clique para falar no WhatsApp
                  </span>
              </div>
            </a>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}