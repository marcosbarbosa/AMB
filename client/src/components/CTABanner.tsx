/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 20:00
 * Versão: 1.1 (Atualizado com tema AMB)
 *
 * Descrição: Componente de Chamada para Ação (CTA) na página inicial.
 * ATUALIZADO para usar textos e link relevantes à AMB
 * (convite para se associar, link para /cadastro).
 *
 * ==========================================================
 */
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function CTABanner() {
  return (
    // 1. Mantém o estilo base, mas podemos ajustar cores depois se necessário
    <section className="py-20 lg:py-24 bg-primary"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          className="text-3xl sm:text-4xl font-semibold font-accent text-primary-foreground leading-tight mb-6"
          data-testid="text-cta-title"
        >
          {/* 2. ALTERA O TÍTULO */}
          Pronto para Voltar aos Tempos de Associado? 
        </h2>
        <p 
          className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8 leading-relaxed"
          data-testid="text-cta-description"
        >
          {/* 3. ADAPTA A DESCRIÇÃO */}
          Junte-se à Associação Master de Basquetebol do Amazonas! 
          Reviva a paixão pelo esporte, faça novas amizades e participe das nossas competições.
        </p>
        <Button 
          size="lg" 
          variant="secondary" // Usa a cor secundária (contraste com o fundo primário)
          className="text-base px-8 h-12"
          data-testid="button-cta"
          asChild // Permite que o Button funcione como um Link
        >
          {/* 4. ALTERA O LINK E O TEXTO DO BOTÃO */}
          <Link to="/cadastro"> 
            Quero me Associar!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}