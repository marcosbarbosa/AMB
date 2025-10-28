/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 21:34
 * Versão: 1.1 (Atualizado com dados AMB)
 *
 * Descrição: Página de Contato (/contato).
 * ATUALIZADO para exibir o endereço, telefone e email corretos da AMB
 * e adicionar um link para o Google Maps.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom'; // 1. Importa o Link para o mapa

export default function Contact() {
  // 2. ATUALIZA O ARRAY COM AS INFORMAÇÕES REAIS DA AMB
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'R. Washington Luís, 111 - Dom Pedro, Manaus - AM, 69040-210', //
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: '+55 (92) 99252-1345', //
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contato.ambamazonas@gmail.com', //
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      content: 'Seg - Sex: 9h às 18h', // (Mantido - ajuste se necessário)
    },
  ];

  // 3. DEFINE O LINK DO GOOGLE MAPS
  const googleMapsUrl = 'https://maps.app.goo.gl/dgpghYqDmS9gbkHH9'; //

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Secção do Título */}
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

        {/* Secção Principal (Formulário e Infos) */}
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
                {/* Loop para exibir as infos atualizadas */}
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

                {/* 4. ATUALIZA A SECÇÃO DO MAPA */}
                <div className="mt-12 rounded-md bg-muted/30 p-8 text-center border border-border hover:shadow-md transition-shadow">
                  {/* Adiciona um Link à volta do ícone e do texto */}
                  <a 
                    href={googleMapsUrl} 
                    target="_blank" // Abre em nova aba
                    rel="noopener noreferrer" // Boas práticas de segurança
                    className="group" // Para estilização hover no link inteiro
                    data-testid="link-google-maps"
                  >
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
      <Footer />
    </div>
  );
}