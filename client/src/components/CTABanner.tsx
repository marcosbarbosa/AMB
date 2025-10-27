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
          Pronto para Transformar sua Organização?
        </h2>
        <p 
          className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8 leading-relaxed"
          data-testid="text-cta-description"
        >
          Entre em contato conosco hoje mesmo e descubra como podemos ajudar 
          sua empresa a alcançar novos patamares de sucesso.
        </p>
        <Button 
          size="lg" 
          variant="secondary"
          className="text-base px-8 h-12"
          data-testid="button-cta"
          asChild
        >
          <Link to="/contato">
            Solicitar Consulta
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
