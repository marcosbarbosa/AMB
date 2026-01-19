// Nome: Navigation.tsx
// Caminho: client/src/components/Navigation.tsx
// Data: 2026-01-20
// Hora: 21:00
// Função: Navbar com Link Direto para Eleições 2026
// Versão: v42.0 Live Link

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, ChevronDown, Settings, Newspaper, 
  Home, Facebook, Instagram, Youtube, Info, Mail, Trophy, Building2, Crown,
  Smartphone, Monitor, ExternalLink, ShieldCheck, UserCog, UserPlus, Fingerprint
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from "@/components/ui/tooltip";
import { useAuth } from '@/context/AuthContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import ambLogo from '../assets/logo-amb.png';
import fbbmLogo from '../assets/fbbm-icone.jpg'; 

export function Navigation() {
  const { isAuthenticated, atleta, logout } = useAuth();
  const { config, menuConfig, isLoading } = useSiteConfig(); 
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMode) {
      document.body.classList.add('mobile-sim');
      document.body.style.maxWidth = '400px';
      document.body.style.margin = '0 auto';
      document.body.style.borderLeft = '10px solid #1e293b';
      document.body.style.borderRight = '10px solid #1e293b';
      document.body.style.minHeight = '100vh';
      document.body.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';
    } else {
      document.body.classList.remove('mobile-sim');
      document.body.style.maxWidth = '';
      document.body.style.margin = '';
      document.body.style.border = '';
      document.body.style.boxShadow = '';
    }
  }, [isMobileMode]);

  const safeMenu = menuConfig || {};

  const socialUrls = {
      facebook: "https://facebook.com/ambamazonas",
      instagram: "https://instagram.com/ambamazonas",
      youtube: "https://youtube.com/ambamazonas"
  };

  // --- LISTA DE LINKS (AQUI ESTÁ O BOTÃO) ---
  const navItems = [
    { key: 'inicio', label: 'Início', href: '/', icon: Home },

    // LINK ATIVO E CLICÁVEL:
    { key: 'eleicoes', label: 'Eleições 2026', href: '/eleicoes', icon: Fingerprint },

    { 
      key: 'institucional', 
      label: 'Institucional', 
      icon: Info,
      submenu: [
        { key: 'sobre', label: 'Quem Somos', href: '/sobre' },
        { key: 'historico', label: 'Histórico', href: '/secretaria-digital' }, 
        { key: 'diretoria', label: 'Diretoria', href: '/diretoria' },
        { key: 'transparencia', label: 'Secretaria Digital', href: '/secretaria-digital', description: 'Transparência, regulamentos e atas.' },
        { key: 'bi', label: 'Inteligência (BI)', href: '/inteligencia' },
      ]
    },
    { key: 'noticias', label: 'Notícias', href: '/noticias', icon: Newspaper },
    { key: 'parceiros', label: 'Parceiros', href: '/parceiros', icon: Building2 },
    { key: 'eventos', label: 'Eventos', href: '/eventos', icon: Trophy },
    { key: 'contato', label: 'Contato', href: '/contato', icon: Mail },
  ];

  // Verifica se o item deve aparecer (baseado no Painel Admin)
  const isVisible = (key: string) => {
      if (Object.keys(safeMenu).length === 0) return true; // Mostra tudo se config falhar
      return safeMenu[key] !== false; // Padrão é mostrar, exceto se false
  };

  const filteredNav = navItems.filter(item => isVisible(item.key));

  const isSuperUser = (String(atleta?.id) === '10') || (String(atleta?.is_superuser) === '1') || (atleta?.is_superuser === true);

  const roleConfig = isSuperUser ? {
      label: "Painel Super Usuário",
      icon: Crown,
      style: "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200",
      tooltipClass: "bg-purple-900 text-white border-purple-900"
  } : {
      label: "Painel Administrativo",
      icon: Settings,
      style: "text-slate-600 hover:text-blue-600 hover:bg-blue-50 border-transparent",
      tooltipClass: "bg-slate-900 text-white border-slate-900"
  };

  return (
    <>
      <div className="bg-[#0f172a] text-white py-2 px-4 relative z-[60] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
            <div className="flex items-center">
                <button onClick={() => setIsMobileMode(!isMobileMode)} className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${isMobileMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  {isMobileMode ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                  {isMobileMode ? 'Mobile View' : 'Web View'}
                </button>
            </div>
            <div className="flex items-center gap-6">
                <a href="https://www.fbbm.com.br/" target="_blank" rel="noreferrer" className="flex items-center gap-2 group" title="Federação Brasileira de Basquetebol Master">
                    <img src={fbbmLogo} alt="FBBM" className="h-5 w-auto rounded-sm grayscale group-hover:grayscale-0 transition-all duration-300" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">Filiada à FBBM</span>
                    <ExternalLink className="h-2 w-2 text-slate-500 group-hover:text-white" />
                </a>
                <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                <div className="flex items-center gap-4">
                    <a href={socialUrls.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-all transform hover:scale-125"><Facebook className="h-4 w-4" /></a>
                    <a href={socialUrls.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#E1306C] transition-all transform hover:scale-125"><Instagram className="h-4 w-4" /></a>
                    <a href={socialUrls.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#FF0000] transition-all transform hover:scale-125"><Youtube className="h-4 w-4" /></a>
                </div>
            </div>
            <div className="hidden md:block"><span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest italic">Manaus - AM</span></div>
        </div>
      </div>

      <div className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-1 shadow-md' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-slate-100 px-6 h-16 flex items-center justify-between transition-all">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={ambLogo} alt="AMB" className="h-10 w-auto transition-transform group-hover:scale-105" />
                <div className="hidden sm:block leading-none">
                  <span className="block text-sm font-black text-slate-900 uppercase">AMB</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-blue-600 transition-colors">Amazonas</span>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {isLoading ? (
                   <div className="flex gap-2"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div><div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div></div>
                ) : (
                   filteredNav.map((item) => {
                     let visibleSubmenu = [];
                     if (item.submenu) {
                        visibleSubmenu = item.submenu.filter(sub => isVisible(sub.key));
                     }

                     // ESTILO ESPECIAL PARA ELEIÇÕES
                     const isElection = item.key === 'eleicoes';

                     return (
                        <div key={item.key} className="relative group">
                        {item.submenu ? (
                            <button className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-blue-600 rounded-full transition-colors uppercase tracking-tight">{item.label} <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" /></button>
                        ) : (
                            <Link 
                                to={item.href!} 
                                className={`px-4 py-2 text-xs font-bold rounded-full transition-all uppercase tracking-tight flex items-center gap-2
                                    ${location.pathname === item.href 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : isElection
                                            ? 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-800 animate-pulse' // Destaque Visual
                                            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                                    }`}
                            >
                                {isElection && <Fingerprint className="h-3 w-3" />}
                                {item.label}
                            </Link>
                        )}
                        {item.submenu && visibleSubmenu.length > 0 && (
                            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[240px]">
                                {visibleSubmenu.map(sub => (
                                   <Link key={sub.key} to={sub.href} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">{sub.label}</Link>
                                ))}
                            </div>
                            </div>
                        )}
                        </div>
                     );
                   })
                )}
              </nav>

              <div className="flex items-center gap-3">
                {!isAuthenticated && isVisible('cadastro') && (
                    <Link to="/cadastro" className="hidden md:flex">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-black rounded-full px-5 transition-all shadow-lg hover:shadow-yellow-500/30 uppercase text-[10px] tracking-wide flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                            <UserPlus className="h-3 w-3" />
                            Seja Associado
                        </Button>
                    </Link>
                )}

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                     {atleta?.role === 'admin' && (
                       <TooltipProvider>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <Link to="/admin/painel">
                               <Button variant="ghost" size="icon" className={`rounded-full border transition-all ${roleConfig.style}`}>
                                 <roleConfig.icon className="h-5 w-5" />
                               </Button>
                             </Link>
                           </TooltipTrigger>
                           <TooltipContent side="bottom" className={`${roleConfig.tooltipClass} font-bold shadow-xl border-none p-3`}>
                             <div className="flex items-center gap-2">
                                {isSuperUser ? <ShieldCheck className="h-4 w-4 text-yellow-300" /> : <UserCog className="h-4 w-4" />}
                                <span>{roleConfig.label}</span>
                             </div>
                           </TooltipContent>
                         </Tooltip>
                       </TooltipProvider>
                     )}
                     <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:bg-red-50 font-black rounded-full uppercase text-xs tracking-tighter">Sair</Button>
                  </div>
                ) : (
                  <Link to="/login"><Button className="bg-slate-900 hover:bg-blue-600 text-white font-black rounded-full px-6 transition-all shadow-lg uppercase text-xs hover:shadow-blue-500/30">Entrar</Button></Link>
                )}
                <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu className="h-6 w-6" /></button>
              </div>
          </div>
        </div>

        {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 p-4 border-t overflow-y-auto">
                {!isAuthenticated && isVisible('cadastro') && (
                    <div className="mb-6 p-2">
                        <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full bg-yellow-500 text-yellow-950 font-black h-12 text-sm uppercase">
                                <UserPlus className="mr-2 h-4 w-4" /> Quero me Associar
                            </Button>
                        </Link>
                    </div>
                )}
                {filteredNav.map((item) => {
                    const visibleSubmenu = item.submenu ? item.submenu.filter(sub => isVisible(sub.key)) : [];
                    return (
                        <div key={item.key} className="py-2 border-b">
                            <span className="font-bold text-slate-900 block mb-2">{item.label}</span>
                            {item.submenu ? (
                                <div className="pl-4 space-y-2">
                                    {visibleSubmenu.map(sub => (
                                        <Link key={sub.key} to={sub.href} className="block text-sm text-slate-600 py-1" onClick={() => setIsMenuOpen(false)}>{sub.label}</Link>
                                    ))}
                                </div>
                            ) : (
                                <Link to={item.href!} className="block text-sm text-blue-600" onClick={() => setIsMenuOpen(false)}>Acessar</Link>
                            )}
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </>
  );
}
// linha 245 Navigation.tsx