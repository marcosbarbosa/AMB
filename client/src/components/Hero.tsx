import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroImage from '@assets/generated_images/Hero_office_collaboration_scene_bd9bbe45.png';

export function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById('contato-preview');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold font-accent text-white leading-tight mb-6"
          data-testid="text-hero-title"
        >
          Soluções Institucionais
          <br />
          com Excelência
        </h1>
        
        <p 
          className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          Transformamos desafios em oportunidades com soluções profissionais 
          personalizadas para o crescimento sustentável da sua organização.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            size="lg" 
            className="bg-primary/90 backdrop-blur-md hover:bg-primary text-primary-foreground border border-primary-border text-base px-8 h-12"
            data-testid="button-hero-primary"
            asChild
          >
            <Link to="/contato">
              Fale Conosco
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-background/10 backdrop-blur-md border-white/30 text-white hover:bg-background/20 text-base px-8 h-12"
            onClick={scrollToContact}
            data-testid="button-hero-secondary"
          >
            Saiba Mais
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
          <CheckCircle className="h-5 w-5 text-primary" />
          <span data-testid="text-trust-indicator">
            Confiado por mais de 100+ organizações
          </span>
        </div>
      </div>
    </section>
  );
}
