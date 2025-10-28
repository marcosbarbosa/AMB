/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 19:24
 * Versão: 1.2 (Remove Serviços)
 *
 * Descrição: Página inicial (Home).
 * ATUALIZADO para remover a secção genérica "Serviços".
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { CarouselHero } from '@/components/CarouselHero'; 
import { About } from '@/components/About';
// import { Services } from '@/components/Services'; // 1. REMOVE OU COMENTA A IMPORTAÇÃO
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
        <CarouselHero /> 
        <About />
        {/* <Services /> */} {/* 2. REMOVE OU COMENTA O USO DO COMPONENTE */}
        <Stats />
        <CTABanner />
        {/* TODO: Avaliar se a secção Testimonials faz sentido para a AMB */}
        <Testimonials /> 
        <ContactPreview />
      </main>
      <Footer />
    </div>
  );
}