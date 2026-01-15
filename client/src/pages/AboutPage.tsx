/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: AboutPage.tsx
 * CAMINHO: client/src/pages/AboutPage.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Página "Sobre" (Wrapper do Componente About)
 * ==========================================================
 */

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { About } from '@/components/About'; // Reusa o componente inteligente

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-16">
        {/* Renderiza a seção Sobre completa */}
        <About />
      </main>
      <Footer />
    </div>
  );
}