/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 28 de outubro de 2025 // Atualizado
 * Hora: 06:25 // Atualizado
 * Versão: 1.2 (Correção de Path da Imagem)
 *
 * Descrição: Componente Hero que usa Swiper.
 * ATUALIZADO para garantir que os caminhos de importação
 * das imagens estão corretos e consistentes.
 *
 * ==========================================================
 */

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// 1. VERIFICA OS CAMINHOS E NOMES EXATOS DOS FICHEIROS
// Garante que estes nomes correspondem EXATAMENTE aos ficheiros em client/src/assets/
import bannerCampeonato from '@/assets/banner_logo_campeonato_05.png'; 
import fotoTime from '@/assets/foto-time-amb.jpg';

export function CarouselHero() {
  const slides = [
    { id: 1, src: bannerCampeonato, alt: 'Banner Campeonato Master AMB' }, 
    { id: 2, src: fotoTime, alt: 'Foto do Time AMB Master' },
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]} 
      spaceBetween={0} 
      slidesPerView={1} 
      loop={true} 
      navigation 
      pagination={{ clickable: true }} 
      autoplay={{ delay: 5000, disableOnInteraction: false }} 
      effect="fade" 
      className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh]" 
      data-testid="carousel-hero"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full h-full">
            <img 
              src={slide.src} 
              alt={slide.alt} 
              className="w-full h-full object-cover" 
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}