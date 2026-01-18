/*
// Nome: Navigation.tsx
// Caminho: client/src/components/Navigation.tsx
// Data: 2026-01-18
// Hora: 02:30 (America/Sao_Paulo)
// Função: Navbar com TopBar Social, Link FBBM e Simulador
// Versão: v18.0 Prime Fix
// Alteração: Correção dos ícones sociais, link fixo da FBBM e posicionamento.
*/

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, Settings, Newspaper, 
  Home, Facebook, Instagram, Youtube, Info, BarChart3, Mail, Trophy, Building2, Crown,
  Smartphone, Monitor, ExternalLink
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
  const { config } = useSiteConfig();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulação Mobile
  useEffect(() => {
    if (isMobileMode) {
      document.body.classList.add('simula-mobile');
      document.body.style.maxWidth = '400px';
      document.body.style.margin = '0 auto';
      document.body.style.borderLeft = '10px solid #333';
      document.body.style.borderRight = '10px solid #333';
      document.body.style.minHeight = '100vh';
    } else {
      document.body.classList.remove('simula-mobile');
      document.body.style.maxWidth = '';
      document.body.style.margin = '';
      document.body.style.border = '';
    }
  }, [isMobileMode]);

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

  const filteredNav = navItems.filter(item => safeConfig?.menu?.[item.key] !== false);
  const isSuperUser = atleta?.is_superuser == 1 || atleta?.is_superuser === true;

  const adminBtnClass = isSuperUser 
    ? "text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-700 border border-purple-200"
    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50";

  return (
    <>
      {/* --- TOP BAR (ICONES SOCIAIS & FBBM) --- */}
      <div className="bg-slate-900 text-white py-2.5 px-4 relative z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-end items-center gap-6 text-sm">

            {/* Link Oficial FBBM */}
            <a href="https://www.fbbm.com.br/" target="_blank" rel="noreferrer" className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity group" title="Federação Brasileira de Basquetebol Master">
                <img src={fbbmLogo} alt="FBBM" className="h-6 w-auto rounded-sm border border-slate-600 group-hover:border-white transition-colors" /> 
                <span className="hidden sm:inline text-xs font-bold text-slate-300 group-hover:text-white">Filiada à FBBM</span>
                <ExternalLink className="h-3 w-3 text-slate-500 group-hover:text-white" />
            </a>

            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

            {/* Ícones Sociais (Dados do Banco) */}
            <div className="flex items-center gap-4">
                {safeConfig?.social?.facebook && <a href={safeConfig.social.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors transform hover:scale-110"><Facebook className="h-4 w-4" /></a>}
                {safeConfig?.social?.instagram && <a href={safeConfig.social.instagram} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors transform hover:scale-110"><Instagram className="h-4 w-4" /></a>}
                {safeConfig?.social?.youtube && <a href={safeConfig.social.youtube} target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors transform hover:scale-110"><Youtube className="h-4 w-4" /></a>}
            </div>

            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

            {/* Botão Web/Mobile */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setIsMobileMode(!isMobileMode)} 
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all border ${isMobileMode ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/20' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                  >
                    {isMobileMode ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                    <span className="hidden sm:inline">{isMobileMode ? 'Visual Mobile' : 'Visual Web'}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-black text-white border-none">
                  <p className="text-xs">Alternar simulação de dispositivo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

        </div>
      </div>

      {/* --- MENU PRINCIPAL --- */}
      <div className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'py-2 shadow-md' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-100 px-6 h-16 flex items-center justify-between transition-all">

              <Link to="/" className="flex items-center gap-3 group">
                <img src={ambLogo} alt="AMB Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
                <div className="hidden sm:block">
                  <span className="block text-sm font-black text-slate-900 leading-none">AMB</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-blue-600 transition-colors">Amazonas</span>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {filteredNav.map((item) => (
                  <div key={item.key} className="relative group">
                    {item.submenu ? (
                      <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 rounded-full transition-colors uppercase tracking-tight">
                        {item.label} <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                      </button>
                    ) : (
                      <Link to={item.href!} className={`px-4 py-2 text-sm font-bold rounded-full transition-all uppercase tracking-tight ${location.pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>
                        {item.label}
                      </Link>
                    )}

                    {item.submenu && (
                      <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[240px]">
                          {item.submenu.map(sub => {
                             if (sub.key === 'secretaria_digital' && sub.description) {
                               return (
                                 <TooltipProvider key={sub.key}>
                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <Link to={sub.href} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                                         {sub.label}
                                       </Link>
                                     </TooltipTrigger>
                                     <TooltipContent side="right" className="bg-slate-900 text-white border-none shadow-xl">
                                       <p className="font-medium text-xs max-w-[200px]">{sub.description}</p>
                                     </TooltipContent>
                                   </Tooltip>
                                 </TooltipProvider>
                               )
                             }
                             return <Link key={sub.key} to={sub.href} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">{sub.label}</Link>
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                     {atleta?.role === 'admin' && (
                       <TooltipProvider>
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <Link to="/admin/painel">
                               <Button variant="ghost" size="icon" className={`rounded-full transition-all ${adminBtnClass}`}>
                                 {isSuperUser ? <Crown className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
                               </Button>
                             </Link>
                           </TooltipTrigger>
                           <TooltipContent side="bottom" className={isSuperUser ? "bg-purple-600 text-white border-purple-500" : "bg-slate-900 text-white border-slate-900"}>
                             <p className="font-bold text-xs">{isSuperUser ? "Super Usuário" : "Painel Administrativo"}</p>
                           </TooltipContent>
                         </Tooltip>
                       </TooltipProvider>
                     )}
                     <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:bg-red-50 font-black rounded-full uppercase text-xs tracking-tighter">Sair</Button>
                  </div>
                ) : (
                  <Link to="/login"><Button className="bg-slate-900 hover:bg-blue-600 text-white font-black rounded-full px-6 transition-all shadow-lg uppercase text-xs hover:shadow-blue-500/30">Entrar</Button></Link>
                )}

                <button className="lg:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 bg-white z-[60] p-4 overflow-y-auto animate-in slide-in-from-right duration-300">
             <div className="flex justify-end mb-4"><Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}><X className="h-6 w-6"/></Button></div>
             {filteredNav.map((item) => (
                <div key={item.key} className="py-3 border-b border-slate-100">
                   <span className="font-black text-slate-900 block mb-2 uppercase tracking-wide text-sm">{item.label}</span>
                   {item.submenu ? (
                     <div className="pl-4 space-y-2 border-l-2 border-slate-100 ml-1">
                        {item.submenu.map(sub => (
                           <Link key={sub.key} to={sub.href} className="block text-sm font-medium text-slate-600 py-1.5 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>{sub.label}</Link>
                        ))}
                     </div>
                   ) : (
                      <Link to={item.href!} className="block text-sm font-bold text-blue-600 hover:underline" onClick={() => setIsMenuOpen(false)}>Acessar Página</Link>
                   )}
                </div>
             ))}
        </div>
      )}
    </>
  );
}
// linha 220 Navigation.tsx