/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 28 de outubro de 2025
 * Hora: 09:35
 * Versão: 1.2 (Atualizado com Textos Finais AMB)
 *
 * Descrição: Componente de Chamada para Ação (CTA) na página inicial.
 * ATUALIZADO com textos focados na comunidade e paixão pelo
 * basquete master da AMB.
 *
 * ==========================================================
 */
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTABanner() {
  return (
    <section className="py-20 lg:py-24 bg-primary"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          className="text-3xl sm:text-4xl font-semibold font-accent text-primary-foreground leading-tight mb-6"
          data-testid="text-cta-title"
        >
          {/* 1. ATUALIZA O TÍTULO */}
          Saudade da Resenha e da Competição? A Família AMB te espera! 
        </h2>
        <p 
          className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8 leading-relaxed"
          data-testid="text-cta-description"
        >
          {/* 2. ATUALIZA A DESCRIÇÃO */}
          O apito vai soar de novo! A AMB oferece competições organizadas, 
          um ambiente de camaradagem e a chance de fazer o que você mais ama.
        </p>
        <Button 
          size="lg" 
          variant="secondary" 
          className="text-base px-8 h-12"
          data-testid="button-cta"
          asChild 
        >
          {/* 3. Mantém o Link e o texto do botão */}
          <Link to="/cadastro"> 
            Quero me Associar!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}