/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 22:49
 * Versão: 1.6 (Remove Newsletter)
 *
 * Descrição: Componente do Rodapé principal do site.
 * ATUALIZADO para remover completamente a secção de
 * assinatura de Newsletter.
 *
 * ==========================================================
 */
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input'; // Input não é mais necessário aqui

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const quickLinks = {
    associacao: [ 
      { label: 'Sobre Nós', href: '/#sobre', section: 'sobre' }, 
      { label: 'Contato', href: '/contato', section: null }, 
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/souambmasterdobasquete/', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/souAMBmasterdobasquete/', label: 'Facebook' },
    { icon: Youtube, href: 'https://www.youtube.com/@souAMBmasterdobasquete', label: 'YouTube' },
  ];

  const whatsappUrl = 'https://wa.me/5592992521345';
  const googleMapsContatoUrl = 'https://maps.app.goo.gl/dgpghYqDmS9gbkHH9'; 

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* 1. AJUSTA O GRID PARA 3 COLUNAS EM TELAS GRANDES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"> 
          {/* Coluna 1: Logo, Descrição, Sociais (Mantida) */}
          <div>
            <h3 className="text-2xl font-bold font-accent text-foreground mb-4">
              AMB Portal
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
              Incentivando a prática e a paixão pelo basquete master no Amazonas. 
              Unindo atletas, promovendo saúde e competição saudável.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <Button key={index} variant="ghost" size="icon" className="h-9 w-9" asChild data-testid={`button-social-${social.label.toLowerCase()}`}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="text-muted-foreground hover:text-primary">
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Coluna 2: Links "A Associação" (Mantida) */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              A Associação
            </h4>
            <ul className="space-y-3">
              {quickLinks.associacao.map((link, index) => (
                <li key={index}>
                  {link.section ? (
                    <a href={link.href} onClick={(e) => scrollToSection(e, link.section!)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm" data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href}>
                      <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-block text-sm" data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                        {link.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Contato Direto (Mantida) */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Contato
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contato.ambamazonas@gmail.com" className="hover:text-foreground transition-colors">
                  contato.ambamazonas@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" data-testid="link-whatsapp">
                  (92) 99252-1345 
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-1" /> 
                <a href={googleMapsContatoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors" data-testid="link-maps-contato-footer">
                  Manaus, Amazonas - Brasil
                </a>
              </div>
            </div>
          </div>

          {/* 4. COLUNA 4 (NEWSLETTER): REMOVIDA */}

        </div>

        {/* Linha Inferior: Copyright e Links (Mantida) */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Associação Master de Basquetebol do Amazonas (AMB). Todos os direitos reservados. <br className="sm:hidden"/> Desenvolvido por Marcos Barbosa @mbelitecoach.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}