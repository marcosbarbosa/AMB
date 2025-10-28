/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:30
 * Versão: 1.1 (Atualizado com Imagens Reais AMB)
 *
 * Descrição: Componente Hero que usa Swiper.
 * ATUALIZADO para importar e exibir as imagens reais da AMB
 * enviadas para a pasta assets.
 *
 * ==========================================================
 */

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// 1. IMPORTA AS NOVAS IMAGENS DA PASTA assets
import bannerCampeonato from '@/assets/banner_logo_campeonato_05.png';
import fotoTime from '@/assets/foto-time-amb.jpg';

export function CarouselHero() {
  // 2. ATUALIZA O ARRAY DE SLIDES COM AS IMAGENS IMPORTADAS
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
      // 3. AJUSTA A ALTURA PARA MELHOR ACOMODAR AS IMAGENS (pode precisar de ajuste)
      className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh]" // Altura relativa à viewport
      data-testid="carousel-hero"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full h-full">
            {/* 4. Usa a imagem importada */}
            <img 
              src={slide.src} 
              alt={slide.alt} 
              className="w-full h-full object-cover" // object-cover tenta preencher sem distorcer
            />
            {/* Opcional: Área para sobrepor texto ou botões 
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white p-4">
               Poderíamos adicionar texto aqui se as imagens permitirem 
            </div> 
            */}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}