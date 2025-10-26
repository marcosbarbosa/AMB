import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'Av. Paulista, 1000 - São Paulo, SP',
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: '+55 (11) 1234-5678',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@ambportal.com.br',
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      content: 'Seg - Sex: 9h às 18h',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="py-16 lg:py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-4xl sm:text-5xl font-semibold font-accent text-foreground leading-tight mb-6"
              data-testid="text-contact-title"
            >
              Entre em Contato
            </h1>
            <p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              data-testid="text-contact-subtitle"
            >
              Estamos aqui para ajudar. Entre em contato conosco e descubra 
              como podemos transformar sua organização.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Envie sua Mensagem
                </h2>
                <ContactForm />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Informações de Contato
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div 
                      key={index} 
                      className="flex gap-4"
                      data-testid={`contact-info-${index}`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <info.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {info.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 rounded-md bg-muted/30 p-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Visualização do mapa estará disponível em breve
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
