/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 10 de janeiro de 2026
 * Hora: 16:55
 * Versão: 2.0
 * Tarefa: 351
 *
 * Descrição: Página Inicial (Home).
 * ATUALIZAÇÃO: Removido Footer interno para evitar duplicação.
 *
 * ==========================================================
 */

import React from "react";
import CarouselHero from "@/components/CarouselHero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import CTABanner from "@/components/CTABanner";
import Testimonials from "@/components/Testimonials";
import ContactPreview from "@/components/ContactPreview";
import ParceirosDestaque from "@/components/ParceirosDestaque";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <CarouselHero /> 
        <About />
        <Stats />
        <CTABanner />

        {/* Secção de Parceiros em Destaque */}
        <ParceirosDestaque />

        <Testimonials /> 
        <ContactPreview />
      </main>
    </div>
  );
}