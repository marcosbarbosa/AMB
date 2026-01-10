/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa
 *
 * Data: 10 de janeiro de 2026
 * Tarefa: Remoção de Conteúdo Genérico
 *
 * Descrição: Página Inicial (Home).
 * CORREÇÃO: Remoção do componente "Services" (Consultoria, etc)
 * que não condiz com o escopo esportivo do projeto.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
// 1. CORREÇÃO: Importa o CarouselHero (o carrosel que sumiu)
import { CarouselHero } from '@/components/CarouselHero'; 
// 2. Importa o Placar
import { PlacarDestaque } from '@/components/PlacarDestaque'; 
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
        {/* 3. CORREÇÃO: Renderiza o CarouselHero */}
        <CarouselHero /> 

        {/* 4. Renderiza o Placar (como planeado) */}
        <PlacarDestaque /> 

        <About />
        {/* {/* REMOVIDO E DELETADO DO SISTEMA <Services / > */ } 
        <Stats />
        <CTABanner />
        <Testimonials />
        <ContactPreview />
      </main>
      <Footer />
    </div>
  );
}