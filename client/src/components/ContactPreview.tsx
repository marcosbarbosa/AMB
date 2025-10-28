/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 21:11
 * Versão: 1.1 (Atualizado com tema AMB)
 *
 * Descrição: Componente de prévia do Contato na página inicial.
 * ATUALIZADO para usar textos relevantes à AMB, incentivando
 * o contato para dúvidas sobre a associação.
 *
 * ==========================================================
 */
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ContactPreview() {
  return (
    // Mantém o estilo base
    <section id="contato-preview" className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Ícone de Email mantido */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-primary/10 text-primary mb-6">
          <Mail className="h-8 w-8" />
        </div>
        <h2 
          className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-6"
          data-testid="text-contact-preview-title"
        >
          {/* 1. ALTERA O TÍTULO */}
          Tem Alguma Dúvida sobre a AMB?
        </h2>
        <p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          data-testid="text-contact-preview-description"
        >
          {/* 2. ALTERA A DESCRIÇÃO */}
          Quer saber mais sobre como se associar, nossas categorias,
          campeonatos ou eventos? Fale conosco!
        </p>
        <Button 
          size="lg"
          className="text-base px-8 h-12"
          data-testid="button-contact-preview"
          asChild // Permite que o Button funcione como um Link
        >
          {/* 3. Mantém o Link e o texto do botão */}
          <Link to="/contato">
            Entre em Contato
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}