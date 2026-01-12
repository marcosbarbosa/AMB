/*
 * ==========================================================
 * ARQUIVO: Navigation.tsx
 * DATA: 12 de Janeiro de 2026
 * HORA: 15:30
 * FUNÇÃO: Navbar com Proteção contra Erro 'split' de Undefined.
 * ==========================================================
 */
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Edit3, LogOut, LayoutDashboard, Lock, Handshake } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ambLogo from '../assets/logo-amb.png'; 

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, atleta, logout } = useAuth();

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/#sobre' },
    { label: 'Parceiros', href: '/parceiros' }, 
    { label: 'Contato', href: '/contato' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    if (href.startsWith('/#')) {
      if (location.pathname === '/') {
        e.preventDefault();
        const sectionId = href.substring(2);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout(); 
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href}>
                  <span
                    onClick={(e) => handleLinkClick(e, item.href)} 
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

            <div className="hidden md:block">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all" size="sm" asChild>
                    <Link to="/seja-parceiro">
                        <Handshake className="mr-2 h-4 w-4" />
                        Quero ser Parceiro
                    </Link>
                </Button>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && atleta ? (
                <div className="flex items-center gap-2">
                  {/* CORREÇÃO AQUI: Verificação opcional para evitar o erro fatal 'split' de undefined */}
                  <span className="text-sm text-muted-foreground hidden lg:inline">
                    Olá, {atleta?.nome_completo ? atleta.nome_completo.split(' ')[0] : 'Associado'} 
                  </span>

                  {atleta.role === 'admin' && (
                    <Button variant="ghost" size="icon" asChild title="Acesso Admin" data-testid="link-admin-panel">
                      <Link to="/admin/painel">
                        <Lock className="h-5 w-5 text-yellow-600 hover:text-yellow-700 transition-colors" />
                      </Link>
                    </Button>
                  )}

                  <Button variant="outline" asChild size="sm"> 
                    <Link to="/painel">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span className="hidden lg:inline">Meu Painel</span>
                    </Link>
                  </Button>

                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair" data-testid="button-logout">
                    <LogOut className="h-5 w-5 text-destructive hover:text-destructive/80" /> 
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" asChild size="sm"> 
                    <Link to="/login">
                      <User className="mr-2 h-4 w-4" />
                      <span className="hidden lg:inline">Login</span>
                    </Link>
                  </Button>
                  <Button variant="default" asChild size="sm"> 
                    <Link to="/cadastro">
                      <Edit3 className="mr-2 h-4 w-4" />
                      <span className="hidden lg:inline">Cadastro</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>

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

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border" data-testid="mobile-menu">
          <div className="px-4 pt-4 pb-6 space-y-2"> 
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <span
                  onClick={(e) => handleLinkClick(e, item.href)}
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

            <Link to="/seja-parceiro">
                <span 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-md text-base font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                >
                    <Handshake className="mr-2 h-5 w-5" />
                    Quero ser Parceiro
                </span>
            </Link>

            <hr className="border-border my-4" />

            {isAuthenticated && atleta ? (
              <>
                <div className="px-4 py-2 text-sm text-foreground">
                  Logado como: <span className="font-medium">{atleta.nome_completo}</span>
                </div>

                {atleta.role === 'admin' && (
                    <Button variant="ghost" className="w-full justify-start text-yellow-700" asChild>
                        <Link to="/admin/painel" onClick={() => setIsMenuOpen(false)}>
                            <Lock className="mr-2 h-4 w-4" />
                            Acesso Admin
                        </Link>
                    </Button>
                )}

                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/painel" onClick={() => setIsMenuOpen(false)}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Meu Painel
                  </Link>
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive" 
                  onClick={handleLogout}
                  data-testid="button-logout-mobile"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start" asChild>
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
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}