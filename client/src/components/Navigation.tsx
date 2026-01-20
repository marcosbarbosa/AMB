// Nome: Navigation.tsx
// Caminho: client/src/components/Navigation.tsx
// Data: 2026-01-20
// Hora: 23:58 (America/Sao_Paulo)
// Função: Navbar Master (Mídias Scaled + Submenus + Mobile + Role Detection)
// Versão: v46.0 Golden Recovery
// Alteração: Restauração de submenus, menu mobile, simulador de view e logic de SuperUser.

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, ChevronDown, Settings, Newspaper, 
  Home, Facebook, Instagram, Youtube, Info, Mail, Trophy, Building2, Crown,
  Smartphone, Monitor, ExternalLink, ShieldCheck, UserCog, UserPlus, Fingerprint, 
  User as UserIcon, LogOut
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/context/AuthContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import ambLogo from '../assets/logo-amb.png';
import fbbmLogo from '../assets/fbbm-icone.jpg'; 

export function Navigation() {
  const { isAuthenticated, atleta, user, logout } = useAuth(); 
  const { menuConfig, isLoading } = useSiteConfig(); 
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);

  const currentUser = atleta || user;
  const firstName = currentUser?.nome_completo ? currentUser.nome_completo.split(' ')[0] : 'Associado';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica de Simulação Mobile (Restaurada)
  useEffect(() => {
    if (isMobileMode) {
      document.body.classList.add('mobile-sim');
      document.body.style.maxWidth = '400px';
      document.body.style.margin = '0 auto';
      document.body.style.boxShadow = '0 0 50px rgba(0,0,0,0.5)';
    } else {
      document.body.classList.remove('mobile-sim');
      document.body.style.maxWidth = '';
      document.body.style.margin = '';
      document.body.style.boxShadow = '';
    }
  }, [isMobileMode]);

  const safeMenu = menuConfig || {};
  const socialUrls = { 
    facebook: "https://facebook.com/ambamazonas", 
    instagram: "https://instagram.com/ambamazonas", 
    youtube: "https://youtube.com/ambamazonas" 
  };

  const navItems = [
    { key: 'inicio', label: 'Início', href: '/', icon: Home },
    { key: 'eleicoes', label: 'Eleições 2026', href: '/eleicoes', icon: Fingerprint },
    { 
      key: 'institucional', label: 'Institucional', icon: Info,
      submenu: [
        { key: 'sobre', label: 'Quem Somos', href: '/sobre' },
        { key: 'historico', label: 'Histórico', href: '/secretaria-digital' }, 
        { key: 'diretoria', label: 'Diretoria', href: '/diretoria' },
        { key: 'transparencia', label: 'Secretaria Digital', href: '/secretaria-digital' },
        { key: 'bi', label: 'Inteligência (BI)', href: '/inteligencia' },
      ]
    },
    { key: 'noticias', label: 'Notícias', href: '/noticias', icon: Newspaper },
    { key: 'parceiros', label: 'Parceiros', href: '/parceiros', icon: Building2 },
    { key: 'eventos', label: 'Eventos', href: '/eventos', icon: Trophy },
    { key: 'contato', label: 'Contato', href: '/contato', icon: Mail },
  ];

  const isVisible = (key: string) => {
      if (Object.keys(safeMenu).length === 0) return true;
      return safeMenu[key] !== false;
  };

  const filteredNav = navItems.filter(item => isVisible(item.key));
  const isSuperUser = (String(currentUser?.is_superuser) === '1') || (currentUser?.is_superuser === true);

  return (
    <TooltipProvider delayDuration={100}>
      {/* Top Bar Dark - Com Simulador Mobile View Restaurado */}
      <div className="bg-[#0f172a] text-white py-2 px-4 relative z-[60] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-10">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileMode(!isMobileMode)} className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${isMobileMode ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                  {isMobileMode ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                  {isMobileMode ? 'Mobile View' : 'Web View'}
                </button>
                <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                <a href="https://www.fbbm.com.br/" target="_blank" rel="noreferrer" className="flex items-center gap-2 group">
                    <img src={fbbmLogo} alt="FBBM" className="h-6 w-auto rounded-sm grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-[9px] font-bold text-slate-400 group-hover:text-white uppercase hidden sm:inline">Filiada à FBBM</span>
                </a>
            </div>

            <div className="flex items-center gap-5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href={socialUrls.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-transform hover:scale-110">
                            <Facebook className="h-4 w-4" />
                        </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-blue-600 text-white border-none font-bold text-xs">@ambamazonas</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href={socialUrls.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#E1306C] transition-transform hover:scale-110">
                            <Instagram className="h-4 w-4" />
                        </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-pink-600 text-white border-none font-bold text-xs">@ambamazonas</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href={socialUrls.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#FF0000] transition-transform hover:scale-110">
                            <Youtube className="h-4 w-4" />
                        </a>
                    </TooltipTrigger>
                    <TooltipContent className="bg-red-600 text-white border-none font-bold text-xs">AMB Amazonas</TooltipContent>
                </Tooltip>
            </div>
        </div>
      </div>

      {/* Main Navbar com Submenus Restaurados */}
      <div className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-1 shadow-md' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-slate-100 px-6 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={ambLogo} alt="AMB" className="h-10 w-auto transition-transform group-hover:scale-105" />
                <div className="hidden sm:block leading-none">
                  <span className="block text-sm font-black text-slate-900 uppercase">AMB</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Amazonas</span>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {isLoading ? (
                   <div className="flex gap-2"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div></div>
                ) : (
                   filteredNav.map((item) => (
                        <div key={item.key} className="relative group">
                        {item.submenu ? (
                            <button className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-blue-600 rounded-full transition-colors uppercase tracking-tight">
                                {item.label} <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                            </button>
                        ) : (
                            <Link 
                                to={item.href || '#'} 
                                className={`px-4 py-2 text-xs font-bold rounded-full transition-all uppercase tracking-tight flex items-center gap-2
                                    ${location.pathname === item.href 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : item.key === 'eleicoes' ? 'text-red-600 bg-red-50 hover:bg-red-100 animate-pulse' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
                            >
                                {item.key === 'eleicoes' && <Fingerprint className="h-3 w-3" />}
                                {item.label}
                            </Link>
                        )}
                        {item.submenu && (
                            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[220px]">
                                    {item.submenu.filter(sub => isVisible(sub.key)).map(sub => (
                                       <Link key={sub.key} to={sub.href} className="block px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">{sub.label}</Link>
                                    ))}
                                </div>
                            </div>
                        )}
                        </div>
                   ))
                )}
              </nav>

              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-4 h-10 rounded-full hover:bg-slate-100 border border-slate-200/50">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 overflow-hidden">
                                    {currentUser?.foto ? <img src={currentUser.foto} alt="User" className="w-full h-full object-cover" /> : <UserIcon size={16} />}
                                </div>
                                <div className="flex flex-col items-start text-xs leading-tight">
                                    <span className="font-bold text-slate-700">Olá, {firstName}</span>
                                    <span className="text-slate-400 font-medium capitalize text-[9px]">{currentUser?.role || 'Atleta'}</span>
                                </div>
                                <ChevronDown size={14} className="text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {currentUser?.role === 'admin' && (
                                <Link to="/admin/painel">
                                    <DropdownMenuItem className={isSuperUser ? "text-purple-600 font-bold" : ""}>
                                        {isSuperUser ? <Crown className="mr-2 h-4 w-4" /> : <Settings className="mr-2 h-4 w-4" />}
                                        Painel Admin {isSuperUser && 'Super'}
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            <Link to="/painel"><DropdownMenuItem><UserIcon className="mr-2 h-4 w-4" /> Área do Associado</DropdownMenuItem></Link>
                            <Link to="/editar-perfil"><DropdownMenuItem><UserCog className="mr-2 h-4 w-4" /> Editar Perfil</DropdownMenuItem></Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-red-600 font-bold focus:text-red-600"><LogOut className="mr-2 h-4 w-4" /> Sair</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
                ) : (
                  <Link to="/login"><Button className="bg-slate-900 text-white rounded-full px-6 text-[10px] uppercase font-black">Entrar</Button></Link>
                )}

                {/* Menu Hamburguer Mobile (Restaurado) */}
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                        <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"><Menu className="h-6 w-6" /></button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                        <div className="flex flex-col gap-6 mt-10">
                            {filteredNav.map(item => (
                                <div key={item.key} className="space-y-3">
                                    <div className="font-black text-slate-900 uppercase text-sm tracking-widest border-b pb-2">{item.label}</div>
                                    {item.submenu ? (
                                        <div className="flex flex-col gap-2 pl-4">
                                            {item.submenu.map(sub => (
                                                <Link key={sub.key} to={sub.href} className="text-sm font-bold text-slate-500 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>{sub.label}</Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <Link to={item.href || '#'} className="text-sm font-bold text-slate-500 hover:text-blue-600 block pl-4" onClick={() => setIsMenuOpen(false)}>Acessar {item.label}</Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
              </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
// linha 248 Navigation.tsx