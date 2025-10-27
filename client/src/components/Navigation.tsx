/*
 * ==========================================================
 * MÓDULO 10: Navigation.tsx (MODIFICADO)
 * Adiciona os links de Login e Cadastro
 * ==========================================================
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Edit3 } from 'lucide-react'; // 1. Importa novos ícones
import { Button } from '@/components/ui/button';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/#sobre' },
    { label: 'Serviços', href: '/#servicos' }, // Vamos manter isto por agora
    { label: 'Contato', href: '/contato' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // ... (Esta função continua idêntica)
    if (href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = href.substring(2);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <span className="flex items-center space-x-2 hover-elevate rounded-md px-3 py-2 -ml-3 cursor-pointer" data-testid="link-home">
              <span className="text-2xl font-bold font-accent bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                AMB Portal
              </span>
            </span>
          </Link>

          {/* 2. Este é o wrapper principal para todos os itens à direita (desktop) */}
          <div className="flex items-center gap-4">
            {/* 3. Navegação principal (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <span
                    onClick={(e: any) => scrollToSection(e, item.href)}
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate cursor-pointer inline-block ${
                      location.pathname === item.href || (item.href.startsWith('/#') && location.pathname === '/')
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* 4. NOVO BLOCO: Botões de Ação (Login/Cadastro) para Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/cadastro">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Cadastro
                </Link>
              </Button>
            </div>

            {/* 5. Botão do Menu Mobile (isto não mudou) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* 6. NOVO BLOCO: Menu Mobile (Modificado) */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border" data-testid="mobile-menu">
          <div className="px-4 py-6 space-y-2">
            {/* Links de Navegação Mobile */}
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <span
                  onClick={(e: any) => {
                    scrollToSection(e, item.href);
                    setIsMenuOpen(false);
                  }}
                  data-testid={`link-mobile-${item.label.toLowerCase()}`}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-colors hover-elevate cursor-pointer ${
                    location.pathname === item.href || (item.href.startsWith('/#') && location.pathname === '/')
                      ? 'text-foreground bg-accent'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Divisor */}
            <hr className="border-border my-4" />

            {/* Links de Ação Mobile (Login/Cadastro) */}
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button variant="default" className="w-full justify-start" asChild>
              <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Cadastro
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}