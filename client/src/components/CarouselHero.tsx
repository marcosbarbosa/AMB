/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 18:55
 * Versão: 1.0
 *
 * Descrição: Novo componente Hero que usa Swiper para criar
 * um carousel de imagens, inspirado no site da FBBM.
 * Substitui o componente Hero.tsx estático.
 *
 * ==========================================================
 */

// 1. Importações do Swiper (como a IA sugeriu)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'; // Adicionei EffectFade

// 2. Importações dos CSS do Swiper (ESSENCIAL para o visual)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // CSS para o efeito de transição

// 3. (Opcional) Podemos importar botões se quisermos sobrepor
// import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom';

export function CarouselHero() {
  // Array de imagens (placeholders por agora)
  // Use URLs de um serviço como placeholder.com ou unsplash
  const slides = [
    { id: 1, src: 'https://via.placeholder.com/1920x600/022873/FFFFFF?text=Slide+AMB+1', alt: 'Slide 1 AMB' },
    { id: 2, src: 'https://via.placeholder.com/1920x600/F2921D/000000?text=Slide+AMB+2', alt: 'Slide 2 AMB' },
    { id: 3, src: 'https://via.placeholder.com/1920x600/F26E22/FFFFFF?text=Slide+AMB+3', alt: 'Slide 3 AMB' },
  ];

  return (
    // 4. Configuração do Swiper
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]} // Módulos a usar
      spaceBetween={0} // Sem espaço entre slides
      slidesPerView={1} // Mostrar 1 slide de cada vez
      loop={true} // Repetir o carousel
      navigation // Mostrar setas de navegação
      pagination={{ clickable: true }} // Mostrar bolinhas de paginação
      autoplay={{ delay: 5000, disableOnInteraction: false }} // Mudar a cada 5 segundos
      effect="fade" // Efeito de transição (fade em vez de slide)
      className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh]" // Define a altura
      data-testid="carousel-hero"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          {/* 5. Conteúdo de cada slide */}
          <div className="relative w-full h-full">
            <img 
              src={slide.src} 
              alt={slide.alt} 
              className="w-full h-full object-cover" // Garante que a imagem cobre o espaço
            />
            {/* 6. (Opcional) Área para sobrepor texto ou botões */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
              <h2 className="text-4xl md:text-6xl font-bold font-accent mb-4 text-center">Título do Slide {slide.id}</h2>
              <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">Descrição curta do slide.</p>
              <Button size="lg" asChild>
                <Link to="/sobre">Saiba Mais</Link>
              </Button>
            </div> 
            */}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

// 7. Exporta o componente para poder ser importado noutro sítio
// (Esta linha é opcional se usar 'export default function...' no início)
// export default CarouselHero;