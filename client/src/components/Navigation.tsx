// Nome: Navigation.tsx
// Caminho: client/src/components/Navigation.tsx
// Data: 2026-01-16
// Hora: 08:45 (America/Sao_Paulo)
// Função: Navbar Principal com Secretaria Digital e Tooltips
// Versão: v24.0 Prime
// Alteração: Renomeação de menu Transparência -> Secretaria Digital e adição de Tooltip explicativo.

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, LogOut, Lock, ChevronDown, Settings,
  Building2, Trophy, Newspaper, Mail, Home, Vote,
  Facebook, Instagram, Youtube, Info
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"; // Assumindo existência do componente UI
import { useAuth } from '@/context/AuthContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { FerramentasModal } from '@/components/FerramentasModal';
import { useToast } from '@/hooks/use-toast';
import ambLogo from '../assets/logo-amb.png';
import fbbmIcon from '../assets/fbbm-icone.jpg'; 

interface SubItem {
  key: string;
  label: string;
  href: string;
  description?: string; // Adicionado para suporte a tooltip
}

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  icon?: any;
  submenu?: SubItem[];
  specialAction?: boolean;
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false); 
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const location = useLocation();
  const { isAuthenticated, atleta, logout } = useAuth();
  const { menuConfig, isLoading } = useSiteConfig();
  const { toast } = useToast();
  const navRef = useRef<HTMLDivElement>(null);

  const userRole = atleta?.role ? String(atleta.role).toLowerCase().trim() : '';
  const isAdmin = userRole === 'admin' || userRole === 'administrador' || userRole === 'master';

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

  // --- ESTRUTURA DO MENU ATUALIZADA ---
  const navStructure: MenuItem[] = [
    { key: 'inicio', label: 'Início', href: '/', icon: Home },
    { 
        key: 'eleicoes', 
        label: 'ELEIÇÕES 2026', 
        href: '#eleicoes', 
        icon: Vote, 
        specialAction: true 
    },
    { 
      key: 'institucional',
      label: 'Institucional', 
      icon: Building2,
      submenu: [
        { key: 'sobre', label: 'Sobre a AMB', href: '/sobre' },
        { key: 'estatuto', label: 'Estatuto Social', href: '/sobre' },
        // ALTERAÇÃO: Renomeado para Secretaria Digital com descrição
        { 
          key: 'transparencia', 
          label: 'Secretaria Digital', 
          href: '/transparencia',
          description: 'Acesse Estatutos, Regulamentos, Históricos e Balancetes.' 
        },
        { key: 'bi', label: 'Inteligência (BI)', href: '/bi' },
        { key: 'parceiros', label: 'Nossos Parceiros', href: '/parceiros' },
        { key: 'cadastro', label: 'Seja um Associado', href: '/cadastro' }
      ]
    },
    { 
      key: 'campeonatos',
      label: 'Campeonatos', 
      icon: Trophy,
      submenu: [
        { key: 'eventos', label: 'Eventos & Inscrições', href: '/eventos' },
      ]
    },
    { key: 'blog', label: 'Notícias', href: '/#blog', icon: Newspaper },
    { key: 'contato', label: 'Contato', href: '/#contato', icon: Mail },
  ];

  const filteredNav = navStructure.filter(item => {
      if (isLoading) return true;
      if (menuConfig[item.key] === false) return false;
      if (item.submenu) {
          // Mantém o submenu se o item pai estiver ativo, 
          // a filtragem interna dos filhos ocorre na renderização ou aqui se necessário.
          // Para simplificar e garantir performance, filtramos na renderização.
          return true;
      }
      return true;
  });

  const handleLinkClick = (href: string, isSpecial = false) => {
    setIsMenuOpen(false);
    setActiveDropdown(null);

    if (isSpecial || href === '#eleicoes') {
        toast({
            title: "Módulo Eleitoral",
            description: "O sistema de votação estará disponível conforme edital.",
            className: "bg-blue-900 text-white border-blue-800 font-bold"
        });
        return;
    }

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
    <TooltipProvider>
      <div ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex flex-col shadow-sm transition-all duration-300 font-sans">

        {/* --- TOP BAR (SOCIAIS & FBBM) --- */}
        <div className="bg-slate-950 text-white h-10 flex items-center justify-end px-4 sm:px-6 lg:px-8 text-xs font-bold tracking-wide z-50 border-b border-slate-800">
            <div className="flex items-center gap-6">

                <div className="flex items-center gap-4">
                    {/* LINK FBBM OFICIAL */}
                    <a 
                        href="https://www.fbbm.com.br/" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity border-r border-slate-700 pr-4 mr-2 group"
                        title="Federação Brasileira de Basquetebol Master"
                    >
                        <img 
                            src={fbbmIcon} 
                            alt="FBBM Brasil" 
                            className="h-6 w-auto object-contain group-hover:scale-110 transition-transform" 
                        />
                        <span className="hidden md:inline text-[10px] text-slate-300 group-hover:text-yellow-400 uppercase tracking-widest transition-colors">
                            Filiada à FBBM
                        </span>
                    </a>

                    {/* ÍCONES SOCIAIS */}
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition-colors transform hover:scale-110" title="Instagram">
                        <Instagram className="h-4 w-4" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors transform hover:scale-110" title="Facebook">
                        <Facebook className="h-4 w-4" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-500 transition-colors transform hover:scale-110" title="YouTube">
                        <Youtube className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </div>

        {/* --- NAVBAR PRINCIPAL --- */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full">
            <div className="flex items-center justify-between h-full">

                {/* LOGO AMB */}
                <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity z-50" onClick={() => window.scrollTo(0,0)}>
                <img src={ambLogo} alt="AMB Amazonas" className="h-12 w-auto drop-shadow-sm" />
                <div className="flex flex-col leading-tight">
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight">AMB<span className="text-blue-600">PORTAL</span></span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden sm:block">Amazonas</span>
                </div>
                </Link>

                {/* MENU DESKTOP */}
                <div className="hidden lg:flex items-center gap-1">
                {filteredNav.map((item) => (
                    <div key={item.label} className="relative group">
                    {item.submenu && item.submenu.length > 0 ? (
                        <>
                        <button 
                            onClick={() => toggleDropdown(item.label)}
                            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                            activeDropdown === item.label 
                                ? 'text-blue-700 bg-blue-50 ring-1 ring-blue-100' 
                                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                            }`}
                        >
                            {item.label}
                            <ChevronDown className={`h-4 w-4 stroke-[2.5px] transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === item.label && (
                            <div className="absolute top-full left-0 w-64 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5 p-1">
                                {item.submenu
                                .filter(sub => menuConfig[sub.key] !== false)
                                .map((sub) => {
                                  // Renderização condicional com Tooltip se houver descrição
                                  const LinkComponent = (
                                    <Link 
                                        to={sub.href}
                                        onClick={() => handleLinkClick(sub.href)}
                                        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <div className="flex flex-col">
                                          <span>{sub.label}</span>
                                          {/* Exibe descrição sutil mobile, tooltip no desktop */}
                                          {sub.description && (
                                            <span className="lg:hidden text-[10px] text-slate-400 font-normal leading-tight mt-0.5">{sub.description}</span>
                                          )}
                                        </div>
                                    </Link>
                                  );

                                  if (sub.description) {
                                    return (
                                      <Tooltip key={sub.label} delayDuration={300}>
                                        <TooltipTrigger asChild>
                                          {LinkComponent}
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-slate-900 text-white border-none text-xs max-w-[200px]">
                                          <p>{sub.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  }

                                  return <div key={sub.label}>{LinkComponent}</div>;
                                })}
                            </div>
                            </div>
                        )}
                        </>
                    ) : (
                        item.specialAction ? (
                            <button
                                onClick={() => handleLinkClick(item.href!, true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 text-blue-800 bg-blue-50 hover:bg-blue-100 hover:text-blue-900 border border-blue-200/50"
                            >
                                {item.icon && <item.icon className="h-4 w-4 stroke-[2.5px]" />}
                                {item.label}
                            </button>
                        ) : (
                            <Link 
                                to={item.href!}
                                onClick={() => handleLinkClick(item.href!)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                                location.pathname === item.href 
                                ? 'text-blue-700 bg-blue-50 ring-1 ring-blue-100' 
                                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                    </div>
                ))}
                </div>

                {/* ÁREA DO USUÁRIO / ADMIN */}
                <div className="flex items-center gap-3">
                {isAuthenticated && atleta ? (
                    <div className="flex items-center gap-2 bg-slate-50 pl-1 pr-1 py-1 rounded-full border border-slate-200">
                    {isAdmin && (
                        <>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-100 transition-colors" onClick={() => setIsToolsOpen(true)} title="Gerenciar Site">
                                <Settings className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-yellow-600 hover:bg-yellow-100 transition-colors" asChild title="Painel Administrativo">
                                <Link to="/admin/painel"><Lock className="h-5 w-5" /></Link>
                            </Button>
                        </>
                    )}
                    <span className="text-xs font-bold text-slate-700 hidden xl:inline ml-2 mr-2 uppercase tracking-wide">
                        {atleta?.nome_completo?.split(' ')[0]}
                    </span>
                    <Button variant="default" size="sm" className="h-8 rounded-full bg-slate-900 text-white hover:bg-black px-4 font-bold text-xs" asChild>
                        <Link to="/painel">Painel</Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> 
                    </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm" className="hidden md:inline-flex text-slate-600 hover:text-blue-700 font-bold text-sm"> 
                        <Link to="/login">Entrar</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-200 text-sm h-9 px-5 rounded-full transition-transform hover:scale-105"> 
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
        </div>

        {/* MOBILE DRAWER */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-32 bg-white z-40 overflow-y-auto animate-in slide-in-from-right-10 duration-200 border-t border-slate-100 shadow-xl">
            <div className="p-4 space-y-2 pb-20">
              {filteredNav.map((item) => (
                <div key={item.label} className="border-b border-slate-50 last:border-0">
                  {item.submenu && item.submenu.length > 0 ? (
                    <div className="py-1">
                      <button onClick={() => toggleDropdown(item.label)} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-bold transition-colors ${activeDropdown === item.label ? 'bg-blue-50 text-blue-700' : 'text-slate-700'}`}>
                        <span className="flex items-center gap-3">{item.icon && <item.icon className="h-5 w-5 opacity-70"/>}{item.label}</span>
                        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="ml-4 pl-4 border-l-2 border-blue-100 space-y-1 mt-1 bg-slate-50/50 rounded-lg">
                          {item.submenu
                             .filter(sub => menuConfig[sub.key] !== false)
                             .map(sub => (
                            <Link key={sub.label} to={sub.href} onClick={() => handleLinkClick(sub.href)} className="block px-4 py-3 rounded-md text-sm font-medium text-slate-600 hover:text-blue-700">
                              <div className="flex flex-col">
                                <span>{sub.label}</span>
                                {sub.description && (
                                  <span className="text-[10px] text-slate-400 font-normal">{sub.description}</span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-1">
                      {item.specialAction ? (
                          <button onClick={() => handleLinkClick(item.href!, true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-bold text-blue-800 bg-blue-50 border border-blue-100">
                              {item.icon && <item.icon className="h-5 w-5"/>}{item.label}
                          </button>
                      ) : (
                          <button onClick={() => handleLinkClick(item.href!)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-bold text-slate-700 hover:bg-slate-50">
                              {item.icon && <item.icon className="h-5 w-5 opacity-70"/>}{item.label}
                          </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FerramentasModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />
    </TooltipProvider>
  );
}
// linha 402