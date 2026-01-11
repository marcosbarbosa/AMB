/*
 * ==========================================================
 * Componente: Footer.tsx (Versão Final Corrigida)
 * Descrição: Rodapé com navegação inteligente cross-page.
 * ==========================================================
 */
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  // URL DO INSTAGRAM DO DESENVOLVEDOR
  const instagramDevUrl = 'https://www.instagram.com/mbelitecoach';
  const whatsappUrl = 'https://wa.me/5592992521345';
  const googleMapsContatoUrl = 'https://maps.app.goo.gl/dgpghYqDmS9gbkHH9'; 

  // FUNÇÃO DE NAVEGAÇÃO INTELIGENTE
  const handleNavigation = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault(); // Sempre previne o padrão para controlarmos a lógica

    if (location.pathname === '/') {
      // CENÁRIO 1: Já estamos na Home -> Apenas rola
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // CENÁRIO 2: Estamos noutra página -> Vai para Home com a âncora
      navigate(`/#${targetId}`);
    }
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/souambmasterdobasquete/', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/souAMBmasterdobasquete/', label: 'Facebook' },
    { icon: Youtube, href: 'https://www.youtube.com/@souAMBmasterdobasquete', label: 'YouTube' },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Coluna 1: Logo e Descrição */}
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
                <Button key={index} variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary" asChild>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Coluna 2: A Associação (Links Corrigidos) */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              A Associação
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/#sobre" 
                  onClick={(e) => handleNavigation(e, 'sobre')}
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm block"
                >
                  Sobre Nós
                </a>
              </li>
              <li>
                <Link to="/parceiros" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm block">
                  Parceiros
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm block">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/seja-parceiro" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm block font-medium">
                  Seja um Parceiro
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Contato
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="mailto:contato.ambamazonas@gmail.com" className="hover:text-foreground transition-colors">
                  contato.ambamazonas@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  (92) 99252-1345 
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary mt-1" /> 
                <a href={googleMapsContatoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Manaus, Amazonas - Brasil
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} Associação Master de Basquetebol do Amazonas (AMB).
              <br className="sm:hidden"/> 
              <span className="hidden sm:inline"> | </span>
              Desenvolvido por 
              <a 
                href={instagramDevUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors font-medium ml-1"
              >
                Marcos Barbosa @mbelitecoach
              </a>.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="cursor-not-allowed opacity-70">Privacidade</span>
              <span className="cursor-not-allowed opacity-70">Termos de Uso</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}