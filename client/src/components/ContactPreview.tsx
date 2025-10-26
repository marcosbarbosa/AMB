import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function ContactPreview() {
  return (
    <section id="contato-preview" className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-primary/10 text-primary mb-6">
          <Mail className="h-8 w-8" />
        </div>
        <h2 
          className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-6"
          data-testid="text-contact-preview-title"
        >
          Vamos Conversar?
        </h2>
        <p 
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          data-testid="text-contact-preview-description"
        >
          Estamos prontos para ouvir suas necessidades e apresentar soluções 
          personalizadas para o sucesso da sua organização.
        </p>
        <Button 
          size="lg"
          className="text-base px-8 h-12"
          data-testid="button-contact-preview"
          asChild
        >
          <Link href="/contato">
            Entre em Contato
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
