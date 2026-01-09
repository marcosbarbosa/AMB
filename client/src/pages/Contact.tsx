/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:10
 * Versão: 1.2 (Atualizado com Texto Temático)
 *
 * Descrição: Página de Contato (/contato).
 * ATUALIZADO para usar um subtítulo mais relevante para a AMB.
 *
 * ==========================================================
 */
import { ContactForm } from '@/components/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom'; 

export default function Contact() {
  const contactInfo = [
    { icon: MapPin, title: 'Endereço', content: 'R. Washington Luís, 111 - Dom Pedro, Manaus - AM, 69040-210' },
    { icon: Phone, title: 'Telefone', content: '+55 (92) 99252-1345' },
    { icon: Mail, title: 'Email', content: 'contato.ambamazonas@gmail.com' },
    { icon: Clock, title: 'Horário de Atendimento', content: 'Seg - Sex: 9h às 18h' },
  ];
  const googleMapsUrl = 'https://maps.app.goo.gl/dgpghYqDmS9gbkHH9'; 

  return (
    <main className="pt-16">
        {/* Secção do Título (Subtítulo Modificado) */}
        <section className="py-16 lg:py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-4xl sm:text-5xl font-semibold font-accent text-foreground leading-tight mb-6"
              data-testid="text-contact-title"
            >
              Entre em Contato 
            </h1>
            {/* 1. SUBSTITUI O SUBTÍTULO */}
            <p 
              className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              data-testid="text-contact-subtitle"
            >
              Tem dúvidas sobre a AMB? Quer saber mais sobre como se associar, 
              nossas categorias ou próximos eventos? Envie sua mensagem!
            </p>
          </div>
        </section>

        {/* Secção Principal (Formulário e Infos - Mantida) */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Coluna do Formulário */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Envie sua Mensagem
                </h2>
                <ContactForm />
              </div>

              {/* Coluna das Informações */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Informações de Contato
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex gap-4" data-testid={`contact-info-${index}`}>
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <info.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                        <p className="text-muted-foreground">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Link do Mapa (Mantido) */}
                <div className="mt-12 rounded-md bg-muted/30 p-8 text-center border border-border hover:shadow-md transition-shadow">
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="group" data-testid="link-google-maps">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 group-hover:text-primary transition-colors" />
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">
                      Ver localização no Google Maps
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}