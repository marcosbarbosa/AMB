/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 8 de novembro de 2025
 * Hora: 00:45
 * Versão: 1.1
 * Tarefa: 310 (Módulo 29-E - Placar Público)
 *
 * Descrição: Página principal (Homepage).
 * ATUALIZADO para incluir o novo componente PlacarDestaque.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
// 1. IMPORTA O NOVO COMPONENTE
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
        <Hero />
        {/* 2. ADICIONA O PLACAR AO VIVO (ANTES DO "QUEM SOMOS") */}
        <PlacarDestaque />
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