/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 21:15
 * Versão: 1.3 (Adiciona ParceirosDestaque)
 *
 * Descrição: Página inicial (Home).
 * ATUALIZADO para incluir o novo componente ParceirosDestaque.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { CarouselHero } from '@/components/CarouselHero'; 
import { About } from '@/components/About';
import { Stats } from '@/components/Stats';
import { CTABanner } from '@/components/CTABanner';
import { Testimonials } from '@/components/Testimonials';
import { ContactPreview } from '@/components/ContactPreview';
import { Footer } from '@/components/Footer';

// 1. IMPORTA O NOVO COMPONENTE "VITRINE"
import { ParceirosDestaque } from '@/components/ParceirosDestaque'; 

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <CarouselHero /> 
        <About />
        <Stats />
        <CTABanner />

        {/* 2. ADICIONA A NOVA SECÇÃO DE PARCEIROS DESTAQUE AQUI */}
        <ParceirosDestaque />

        <Testimonials /> 
        <ContactPreview />
      </main>
      <Footer />
    </div>
  );
}