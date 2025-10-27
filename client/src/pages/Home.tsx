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
 * Versão: 1.1 (Atualizado com CarouselHero)
 *
 * Descrição: Página inicial (Home).
 * ATUALIZADO para usar o novo CarouselHero em vez do Hero estático.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
// 1. IMPORTA O NOVO COMPONENTE DE CAROUSEL
import { CarouselHero } from '@/components/CarouselHero'; 
// import { Hero } from '@/components/Hero'; // Comenta ou remove a importação antiga
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Stats } from '@/components/Stats';
import { CTABanner } from '@/components/CTABanner';
import { Testimonials } from '@/components/Testimonials';
import { ContactPreview } from '@/components/ContactPreview';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* 2. USA O NOVO CAROUSEL HERO AQUI */}
        <CarouselHero /> 
        {/* <Hero /> */} {/* Comenta ou remove o Hero antigo */}

        {/* 3. O resto da página continua igual */}
        <About />
        <Services />
        <Stats />
        <CTABanner />
        <Testimonials />
        <ContactPreview />
      </main>
      <Footer />
    </div>
  );
}