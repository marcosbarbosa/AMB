// Nome: Navigation.tsx
// Caminho: client/src/components/Navigation.tsx
// Data: 2026-01-18
// Hora: 21:10 (America/Sao_Paulo)
// Função: Navbar Mestra
// Versão: v33.0 Submenu Filtered
// Alteração: Filtragem de visibilidade aplicada também aos itens do submenu. Chaves alinhadas ao DB.

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, ChevronDown, Settings, Newspaper, 
  Home, Facebook, Instagram, Youtube, Info, Mail, Trophy, Building2, Crown,
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

  // Simulação Mobile
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

  const safeConfig = config || { social: {} };
  // Usa menuConfig do contexto (carregado de get_menu_config.php)
  const safeMenu = menuConfig || {};

  const socialLinks = {
      facebook: safeConfig.social?.facebook || safeConfig.social?.facebook_url || "",
      instagram: safeConfig.social?.instagram || safeConfig.social?.instagram_url || "",
      youtube: safeConfig.social?.youtube || safeConfig.social?.youtube_url || ""
  };

  // Estrutura de Navegação Oficial
  // NOTA: As chaves 'key' devem bater com a tabela config_menu
  const navItems = [
    { key: 'inicio', label: 'Início', href: '/', icon: Home },
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

  // Filtro Pai
  const filteredNav = navItems.filter(item => safeMenu[item.key] !== false);
  const isSuperUser = atleta?.is_superuser == 1 || atleta?.is_superuser === true;

  const adminBtnClass = isSuperUser 
    ? "text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-700 border border-purple-200"
    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50";

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
                <a href="https://www.fbbm.com.br/" target="_blank" rel="noreferrer" className="flex items-center gap-2 group border-r border-white/10 pr-6" title="Federação Brasileira de Basquetebol Master">
                    <img src={fbbmLogo} alt="FBBM" className="h-5 w-auto rounded-sm grayscale group-hover:grayscale-0 transition-all duration-300" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">Filiada à FBBM</span>
                    <ExternalLink className="h-2 w-2 text-slate-500 group-hover:text-white" />
                </a>
                <div className="flex items-center gap-5">
                    {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-all transform hover:scale-125"><Facebook className="h-4 w-4" /></a>}
                    {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#E1306C] transition-all transform hover:scale-125"><Instagram className="h-4 w-4" /></a>}
                    {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#FF0000] transition-all transform hover:scale-125"><Youtube className="h-4 w-4" /></a>}
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
                     // Lógica de Filtro para Submenu
                     let visibleSubmenu = [];
                     if (item.submenu) {
                       visibleSubmenu = item.submenu.filter(sub => safeMenu[sub.key] !== false);
                       // Se todos os subitens estiverem ocultos, não renderiza o pai? 
                       // Opção de design: Mantém o pai se ele estiver ativo, mas sem dropdown se vazio.
                     }

                     return (
                        <div key={item.key} className="relative group">
                        {item.submenu ? (
                            <button className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-blue-600 rounded-full transition-colors uppercase tracking-tight">
                                {item.label} <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                            </button>
                        ) : (
                            <Link to={item.href!} className={`px-4 py-2 text-xs font-bold rounded-full transition-all uppercase tracking-tight ${location.pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}>{item.label}</Link>
                        )}

                        {/* Dropdown com itens filtrados */}
                        {item.submenu && visibleSubmenu.length > 0 && (
                            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[240px]">
                                {visibleSubmenu.map(sub => {
                                if (sub.key === 'transparencia' && sub.description) {
                                    return <TooltipProvider key={sub.key}><Tooltip><TooltipTrigger asChild><Link to={sub.href} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">{sub.label}</Link></TooltipTrigger><TooltipContent side="right" className="bg-slate-900 text-white border-none shadow-xl"><p className="font-medium text-[10px] max-w-[180px] leading-tight">{sub.description}</p></TooltipContent></Tooltip></TooltipProvider>
                                }
                                return <Link key={sub.key} to={sub.href} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">{sub.label}</Link>
                                })}
                            </div>
                            </div>
                        )}
                        </div>
                     );
                   })
                )}
              </nav>

              <div className="flex items-center gap-2">
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
                           <TooltipContent side="bottom" className={isSuperUser ? "bg-purple-600 text-white border-purple-700" : "bg-slate-900 text-white border-slate-900"}>
                             <p className="font-bold text-xs">{isSuperUser ? "Painel do Super Usuário" : "Painel Administrativo"}</p>
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

        {/* Mobile Menu também filtrado */}
        {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 p-4 border-t overflow-y-auto">
                {filteredNav.map((item) => {
                    const visibleSubmenu = item.submenu ? item.submenu.filter(sub => safeMenu[sub.key] !== false) : [];
                    return (
                        <div key={item.key} className="py-2 border-b">
                            <span className="font-bold text-slate-900 block mb-2">{item.label}</span>
                            {item.submenu ? (
                                <div className="pl-4 space-y-2">
                                    {visibleSubmenu.map(sub => (
                                        <Link key={sub.key} to={sub.href} className="block text-sm text-slate-600 py-1" onClick={() => setIsMenuOpen(false)}>
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link to={item.href!} className="block text-sm text-blue-600" onClick={() => setIsMenuOpen(false)}>
                                    Acessar
                                </Link>
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
// linha 256 Navigation.tsx