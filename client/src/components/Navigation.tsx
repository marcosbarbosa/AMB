/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: client/src/components/Navigation.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Navbar Prime (Tipografia Heavy & Uppercase)
 * VERSÃO: 12.0 Prime
 * ==========================================================
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, LogOut, Lock, ChevronDown, 
  Building2, Trophy, Newspaper, Mail, Home, LayoutDashboard 
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ambLogo from '../assets/logo-amb.png'; 

interface SubItem {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href?: string;
  icon?: any;
  submenu?: SubItem[];
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const location = useLocation();
  const { isAuthenticated, atleta, logout } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navStructure: MenuItem[] = [
    { label: 'INÍCIO', href: '/', icon: Home },
    { 
      label: 'INSTITUCIONAL', 
      icon: Building2,
      submenu: [
        { label: 'Sobre a AMB', href: '/sobre' },
        { label: 'Estatuto & Regulamento', href: '/sobre' },
        { label: 'Transparência', href: '/transparencia' },
        { label: 'Parceiros', href: '/parceiros' },
        { label: 'Quero ser Associado', href: '/cadastro' }
      ]
    },
    { 
      label: 'CAMPEONATOS', 
      icon: Trophy,
      submenu: [
        { label: 'Eventos & Inscrições', href: '/eventos' },
        // { label: 'Tabela de Jogos', href: '/tabela' },
      ]
    },
    { label: 'BLOG', href: '/#blog', icon: Newspaper },
    { label: 'CONTATO', href: '/#contato', icon: Mail },
  ];

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
    if (href.startsWith('/#')) {
        const element = document.getElementById(href.replace('/#', ''));
        element?.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo(0, 0);
    }
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleLogout = () => {
    logout(); 
    setIsMenuOpen(false);
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm h-20 transition-all duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity z-50" onClick={() => window.scrollTo(0,0)}>
            <img src={ambLogo} alt="AMB Amazonas" className="h-12 w-auto drop-shadow-sm" />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-black text-slate-900 tracking-tighter">AMB<span className="text-blue-600">PORTAL</span></span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden sm:block">Amazonas</span>
            </div>
          </Link>

          {/* DESKTOP MENU - FONTE PRIME (BLACK & UPPERCASE) */}
          <div className="hidden lg:flex items-center gap-2">
            {navStructure.map((item) => (
              <div key={item.label} className="relative group">
                {item.submenu ? (
                  <>
                    <button 
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-black uppercase tracking-tight transition-colors ${
                        activeDropdown === item.label ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 stroke-[3px] transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 w-60 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
                          {item.submenu.map((sub) => (
                            <Link 
                              key={sub.label} 
                              to={sub.href}
                              onClick={() => handleLinkClick(sub.href)}
                              className="block px-5 py-3 text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-slate-50 border-l-4 border-transparent hover:border-blue-600 transition-all uppercase tracking-wide"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                      to={item.href!}
                      onClick={() => handleLinkClick(item.href!)}
                      className={`px-3 py-2 rounded-md text-sm font-black uppercase tracking-tight transition-colors ${
                      location.pathname === item.href 
                      ? 'text-blue-700 bg-blue-50' 
                      : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
                      }`}
                  >
                      {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* BOTÕES DE ACESSO */}
          <div className="flex items-center gap-3">
            {isAuthenticated && atleta ? (
              <div className="flex items-center gap-2 bg-slate-50 pl-2 pr-1 py-1 rounded-full border border-slate-200">
                <span className="text-xs font-black text-slate-700 hidden xl:inline mr-2 uppercase tracking-wide">
                  {atleta?.nome_completo?.split(' ')[0]}
                </span>
                {atleta.role === 'admin' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-yellow-600 hover:bg-yellow-100" asChild>
                    <Link to="/admin/painel"><Lock className="h-4 w-4" /></Link>
                  </Button>
                )}
                <Button variant="default" size="sm" className="h-8 rounded-full bg-slate-900 text-white hover:bg-black px-4 font-bold uppercase tracking-wide text-xs" asChild>
                  <Link to="/painel">Painel</Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> 
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild size="sm" className="hidden md:inline-flex text-slate-600 hover:text-blue-700 font-black uppercase tracking-wide text-xs"> 
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wide shadow-md shadow-blue-200 text-xs h-9 px-5 rounded-full transition-transform hover:scale-105"> 
                  <Link to="/cadastro">Associar-se</Link>
                </Button>
              </div>
            )}
            <Button variant="ghost" size="icon" className="lg:hidden ml-1 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 overflow-y-auto animate-in slide-in-from-right-10 duration-200 border-t border-slate-100">
          <div className="p-4 space-y-2 pb-20">
            {navStructure.map((item) => (
              <div key={item.label} className="border-b border-slate-50 last:border-0">
                {item.submenu ? (
                  <div className="py-1">
                    <button onClick={() => toggleDropdown(item.label)} className={`w-full flex items-center justify-between px-4 py-4 rounded-lg text-base font-black uppercase tracking-tight transition-colors ${activeDropdown === item.label ? 'bg-blue-50 text-blue-700' : 'text-slate-800'}`}>
                      <span className="flex items-center gap-3">{item.icon && <item.icon className="h-5 w-5 opacity-70"/>}{item.label}</span>
                      <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="ml-4 pl-4 border-l-2 border-blue-100 space-y-1 mt-1 bg-slate-50/50 rounded-lg">
                        {item.submenu.map(sub => (
                          <Link key={sub.label} to={sub.href} onClick={() => handleLinkClick(sub.href)} className="block px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-blue-700">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-1">
                    <button onClick={() => handleLinkClick(item.href!)} className="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-base font-black uppercase tracking-tight text-slate-800 hover:bg-slate-50">
                        {item.icon && <item.icon className="h-5 w-5 opacity-70"/>}{item.label}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}