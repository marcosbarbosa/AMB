import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      { label: 'Serviços', href: '#servicos', section: 'servicos' },
      { label: 'Casos de Sucesso', href: '/', section: null },
    ],
    suporte: [
      { label: 'Contato', href: '/contato', section: null },
      { label: 'FAQ', href: '/', section: null },
      { label: 'Suporte', href: '/', section: null },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <h3 className="text-2xl font-bold font-accent text-foreground mb-4">
              AMB Portal
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Soluções institucionais profissionais para o crescimento 
              sustentável da sua organização.
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
              Empresa
            </h4>
            <ul className="space-y-3">
              {quickLinks.empresa.map((link, index) => (
                <li key={index}>
                  {link.section ? (
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.section!)}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>
                      <span
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-block"
                        data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                      </span>
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
                  {link.section ? (
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.section!)}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      data-testid={`link-footer-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>
                      <span
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-block"
                        data-testid={`link-footer-${link.label.toLowerCase()}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Newsletter
            </h4>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Receba novidades e insights sobre gestão institucional.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Seu email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit"
                data-testid="button-newsletter-submit"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} AMB Portal. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
