/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Versão: 1.5 (Limpeza de Layout e Conteúdo Pertinente)
 *
 * Descrição: Página principal (Homepage).
 * REMOVIDO: Navigation e Footer manuais (renderizados via App.tsx).
 * MANTIDO: Carousel, Placar, Testemunhos e Parceiros.
 *
 * ==========================================================
 */

import { CarouselHero } from '@/components/CarouselHero'; 
import { PlacarDestaque } from '@/components/PlacarDestaque'; 
import { About } from '@/components/About';
import { Testimonials } from '@/components/Testimonials';
import { CTABanner } from '@/components/CTABanner';
import { ParceirosDestaque } from '@/components/ParceirosDestaque';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Banner de Destaque com as fotos da AMB */}
        <CarouselHero /> 

        {/* Placar de Jogos em Tempo Real */}
        <PlacarDestaque /> 

        {/* Seção Institucional: Sobre a Associação */}
        <About />

        {/* Depoimentos dos Atletas Associados */}
        <Testimonials />

        {/* Banner de Incentivo ao Recadastro Anual */}
        <CTABanner />

        {/* Seção de Patrocinadores e Apoiadores */}
        <section className="py-16 bg-white border-t border-slate-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-10">
              Nossos Parceiros Estratégicos
            </h3>
            <ParceirosDestaque />
          </div>
        </section>
      </main>
    </div>
  );
}