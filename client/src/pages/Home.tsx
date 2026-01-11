/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa
 *
 * Data: 10 de janeiro de 2026
 * Versão: 1.5 (Final Integrada)
 *
 * Descrição: Página Inicial (Home).
 * ATUALIZADO:
 * 1. Inclui CarouselHero, Placar e ParceirosCarrossel.
 * 2. Adiciona lógica para rolar até #sobre quando vindo de outra página.
 *
 * ==========================================================
 */
import { useEffect } from 'react'; // NECESSÁRIO PARA O SCROLL
import { useLocation } from 'react-router-dom'; // NECESSÁRIO PARA LER O #SOBRE
import { Navigation } from '@/components/Navigation';
import { CarouselHero } from '@/components/CarouselHero'; 
import { PlacarDestaque } from '@/components/PlacarDestaque'; 
import { ParceirosCarrossel } from '@/components/ParceirosCarrossel'; 
import { About } from '@/components/About';
// import { Services } from '@/components/Services'; // Removido
import { Stats } from '@/components/Stats';
import { CTABanner } from '@/components/CTABanner';
import { Testimonials } from '@/components/Testimonials';
import { ContactPreview } from '@/components/ContactPreview';
import { Footer } from '@/components/Footer';

export default function Home() {
  // 1. Captura o "hash" da URL (ex: #sobre)
  const { hash } = useLocation();

  // 2. Efeito que monitora o hash e rola a tela suavemente
  useEffect(() => {
    if (hash) {
      // Pequeno atraso para garantir que os componentes carregaram
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Banner Principal Rotativo */}
        <CarouselHero /> 

        {/* Placar do Jogo */}
        <PlacarDestaque /> 

        {/* Faixa de Parceiros Ouro (Fundo Branco) */}
        <ParceirosCarrossel />

        {/* Secção Quem Somos (Com id="sobre") */}
        <About />

        {/* <Services /> Removido do escopo */}

        <Stats />
        <CTABanner />
        <Testimonials />
        <ContactPreview />
      </main>
      <Footer />
    </div>
  );
}