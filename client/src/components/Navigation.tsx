/*
// Nome: Navigation.tsx
// Caminho: client/src/components/Navigation.tsx
// Data: 2026-01-17
// Hora: 22:50 (America/Sao_Paulo)
// Função: Navbar Blindada (Safe Config Access)
// Versão: v13.0 Prime Stable
*/

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, Settings, Newspaper, 
  Home, Facebook, Instagram, Youtube, Info, BarChart3, Mail, Trophy, Building2
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import ambLogo from '../assets/logo-amb.png';

export function Navigation() {
  const { isAuthenticated, atleta, logout } = useAuth();
  const { config } = useSiteConfig();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- BLINDAGEM CONTRA CRASH ---
  // Se config for null/undefined, usa um objeto padrão seguro
  const safeConfig = config || { menu: {}, social: {} };

  const navItems = [
    { key: 'home', label: 'Início', href: '/', icon: Home },
    { 
      key: 'institucional', 
      label: 'Institucional', 
      icon: Info,
      submenu: [
        { key: 'sobre', label: 'Quem Somos', href: '/sobre' },
        { key: 'historico', label: 'Histórico', href: '/secretaria-digital' }, 
        { key: 'diretoria', label: 'Diretoria', href: '/diretoria' },
        { 
          key: 'secretaria_digital', 
          label: 'Secretaria Digital', 
          href: '/secretaria-digital',
          description: 'Transparência, regulamentos, históricos e balancetes.'
        },
        { key: 'bi_publico', label: 'Inteligência (BI)', href: '/inteligencia' },
      ]
    },
    { key: 'noticias', label: 'Notícias', href: '/noticias', icon: Newspaper },
    { key: 'parceiros', label: 'Parceiros', href: '/parceiros', icon: Building2 },
    { key: 'eventos', label: 'Eventos', href: '/eventos', icon: Trophy },
    { key: 'contato', label: 'Contato', href: '/contato', icon: Mail },
  ];

  // Optional Chaining (?.) previne o crash "Cannot read properties of undefined"
  const filteredNav = navItems.filter(item => safeConfig?.menu?.[item.key] !== false);

  const fbLink = safeConfig?.social?.facebook || '';
  const igLink = safeConfig?.social?.instagram || '';
  const ytLink = safeConfig?.social?.youtube || '';

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-100 px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={ambLogo} alt="AMB" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <span className="block text-sm font-black text-slate-900 leading-none">AMB</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Amazonas</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {filteredNav.map((item) => (
                <div key={item.key} className="relative group">
                  {item.submenu ? (
                    <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 rounded-full transition-colors uppercase">
                      {item.label} <ChevronDown className="h-3 w-3" />
                    </button>
                  ) : (
                    <Link to={item.href!} className={`px-4 py-2 text-sm font-bold rounded-full transition-all uppercase ${location.pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
                      {item.label}
                    </Link>
                  )}

                  {item.submenu && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[240px]">
                        {item.submenu.map(sub => {
                          if (sub.key === 'secretaria_digital' && sub.description) {
                            return (
                              <TooltipProvider key={sub.key}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link to={sub.href} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                                      {sub.label}
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="bg-slate-900 text-white border-none">
                                    <p className="font-medium text-xs">{sub.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          }
                          return (
                            <Link key={sub.key} to={sub.href} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                              {sub.key === 'bi_publico' && <BarChart3 className="h-4 w-4" />}
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-2 pr-4 border-r border-slate-100">
                {fbLink && <a href={fbLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"><Facebook className="h-4 w-4" /></a>}
                {igLink && <a href={igLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all"><Instagram className="h-4 w-4" /></a>}
                {ytLink && <a href={ytLink} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"><Youtube className="h-4 w-4" /></a>}
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                   {atleta?.role === 'admin' && (
                     <Link to="/admin/painel">
                       <Button variant="ghost" size="icon" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"><Settings className="h-5 w-5" /></Button>
                     </Link>
                   )}
                   <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:bg-red-50 font-black rounded-full uppercase text-xs">Sair</Button>
                </div>
              ) : (
                <Link to="/login"><Button className="bg-slate-900 hover:bg-blue-600 text-white font-black rounded-full px-6 transition-all shadow-lg uppercase text-xs">Entrar</Button></Link>
              )}

              <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
        </div>
      </div>

      {/* Menu Mobile Renderizado Corretamente */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 p-4 border-t overflow-y-auto">
             {filteredNav.map((item) => (
                <div key={item.key} className="py-2 border-b">
                   <span className="font-bold text-slate-900 block mb-2">{item.label}</span>
                   {item.submenu ? (
                     <div className="pl-4 space-y-2">
                        {item.submenu.map(sub => (
                           <Link key={sub.key} to={sub.href} className="block text-sm text-slate-600 py-1" onClick={() => setIsMenuOpen(false)}>{sub.label}</Link>
                        ))}
                     </div>
                   ) : (
                      <Link to={item.href!} className="block text-sm text-blue-600" onClick={() => setIsMenuOpen(false)}>Acessar</Link>
                   )}
                </div>
             ))}
        </div>
      )}
    </div>
  );
}
// linha 190 Navigation.tsx