import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    empresa: [
      { label: 'Sobre Nós', href: '#sobre', section: 'sobre' },
    ],
    suporte: [
      { label: 'Contato', href: '/contato', section: null },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'contato@ambportal.com.br', testId: 'contact-email' },
    { icon: Phone, text: '(92) 99999-9999', testId: 'contact-phone' },
    { icon: MapPin, text: 'Manaus, Amazonas - Brasil', testId: 'contact-address' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
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
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  asChild
                  data-testid={`button-social-${social.label.toLowerCase()}`}
                >
                  <a 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              A Associação
            </h4>
            <ul className="space-y-3">
              {quickLinks.empresa.map((link, index) => (
                <li key={index}>
                  {link.section ? (
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.section!)}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-sm"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-block text-sm" data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Suporte
            </h4>
            <ul className="space-y-3">
              {quickLinks.suporte.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-block text-sm" data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Contato
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-3">
                  <info.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span 
                    className="text-muted-foreground text-sm" 
                    data-testid={info.testId}
                  >
                    {info.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} AMB - Amazonas Basquete Master. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
