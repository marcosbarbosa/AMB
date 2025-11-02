/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 20:30
 * Versão: 1.4 (Adiciona Link Parceiros)
 *
 * Descrição: Cabeçalho principal de navegação.
 * ATUALIZADO para incluir o novo link "Parceiros".
 *
 * ==========================================================
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Edit3, LogOut, LayoutDashboard } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ambLogo from '@/assets/logo-amb.png'; 

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, atleta, logout } = useAuth();

  // 1. ADICIONA O LINK "PARCEIROS"
  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/#sobre' },
    { label: 'Parceiros', href: '/parceiros' }, // <-- NOVO LINK
    { label: 'Contato', href: '/contato' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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

  const handleLogout = () => {
    logout(); 
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (Mantido) */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img 
              src={ambLogo} 
              alt="Logótipo AMB Amazonas Basquete Master" 
              className="h-10 w-auto" 
              data-testid="logo-amb"
            />
            <span className="hidden sm:inline text-xl font-bold font-accent bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AMB Portal
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Navegação principal (Desktop - Atualizada) */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <span
                    onClick={(e: any) => item.href.startsWith('/#') ? scrollToSection(e, item.href) : setIsMenuOpen(false)} // Ajuste no onClick
                    data-testid={`link-nav-${item.label.toLowerCase()}`}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer inline-block ${
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

            {/* Botões de Ação (Mantidos) */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && atleta ? (
                <>
                  <span className="text-sm text-muted-foreground hidden lg:inline">
                    Olá, {atleta.nome_completo.split(' ')[0]} 
                  </span>
                  <Button variant="outline" asChild size="sm"> 
                    <Link to="/painel">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Meu Painel
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                    <LogOut className="h-5 w-5 text-destructive hover:text-destructive/80" /> 
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild size="sm"> 
                    <Link to="/login">
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button variant="default" asChild size="sm"> 
                    <Link to="/cadastro">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Cadastro
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Botão do Menu Mobile (Mantido) */}
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

      {/* Menu Mobile (Atualizado) */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border" data-testid="mobile-menu">
          <div className="px-4 pt-4 pb-6 space-y-2"> 
            {/* Links de Navegação Mobile (Atualizados) */}
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <span
                  onClick={(e: any) => {
                    if(item.href.startsWith('/#')) scrollToSection(e, item.href);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                    location.pathname === item.href || (item.href.startsWith('/#') && location.pathname === '/')
                      ? 'text-foreground bg-accent'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}

            <hr className="border-border my-4" />

            {/* Links de Ação Mobile (Mantidos) */}
            {isAuthenticated && atleta ? (
              <>
                <div className="px-4 py-2 text-sm text-foreground">
                  Logado como: <span className="font-medium">{atleta.nome_completo}</span>
                </div>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/painel" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Meu Painel
                  </Link>
                </Button>
                <Button variant="destructive" className="w-full justify-start mt-2" onClick={handleLogout}> 
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair (Logout)
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button variant="default" className="w-full justify-start mt-2" asChild> 
                  <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Cadastro
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}