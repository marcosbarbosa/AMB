// Nome: Navigation.tsx
// Nro de linhas+ Caminho: 260 client/src/components/Navigation.tsx
// Data: 2026-01-22
// Hora: 20:55 (America/Sao_Paulo)
// Função: Navbar Master
// Versão: v54.0 Null Safety
// Alteração: Implementação de safeConfig para prevenir crash quando config ainda é null.

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, ChevronDown, Settings, Newspaper, 
  Home, Facebook, Instagram, Info, Mail, Trophy, Building2, Crown,
  ShieldCheck, UserCog, UserPlus, User as UserIcon, LogOut, Users, FileText
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { TooltipProvider } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from '@/context/AuthContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import ambLogo from '../assets/logo-amb.png';

export function Navigation() {
  const { isAuthenticated, atleta, logout } = useAuth();
  const { config } = useSiteConfig(); // Pode retornar null inicialmente
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- SAFE CONFIG (CORREÇÃO DO CRASH) ---
  // Se config for null (ainda carregando), usa valores padrão seguros
  const safeConfig = config || {
      eleicoes_ativas: false,
      social_instagram: '#',
      social_facebook: '#',
      whatsapp_number: ''
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'inicio', label: 'Início', href: '/', icon: Home },
    { 
      key: 'institucional', 
      label: 'Institucional', 
      icon: Building2,
      submenu: [
        { key: 'historico', label: 'Histórico', href: '/historico', icon: Info },
        { key: 'diretoria', label: 'Diretoria', href: '/diretoria', icon: Users },
        { key: 'secretaria', label: 'Secretaria Digital', href: '/secretaria', icon: FileText },
        { key: 'parceiros', label: 'Parceiros', href: '/parceiros', icon: Trophy },
      ]
    },
    { key: 'noticias', label: 'Notícias', href: '/noticias', icon: Newspaper },
    { key: 'eventos', label: 'Eventos', href: '/eventos', icon: Trophy },
    { key: 'contato', label: 'Contato', href: '/contato', icon: Mail },
  ];

  // Usa safeConfig em vez de config direto
  if (safeConfig.eleicoes_ativas) {
      navItems.push({ key: 'eleicoes', label: 'Eleições 2026', href: '/eleicoes', icon: Crown });
  }

  // Lógica Robusta para Admin/SuperUser
  const isSuperUser = String(atleta?.is_superuser) === '1' || atleta?.is_superuser === true || atleta?.is_superuser === 1;
  const isAdmin = atleta?.role === 'admin' || isSuperUser;

  return (
    <TooltipProvider>
      <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-4 border-b border-slate-100'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src={ambLogo} alt="AMB Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-[8px] text-white px-1 rounded-full font-bold">AM</div>
              </div>
              <div className="hidden lg:block leading-tight">
                <h1 className="font-black text-slate-800 text-lg tracking-tighter group-hover:text-blue-700 transition-colors">AMB</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Amazonas</p>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-50/50 p-1 rounded-full border border-slate-100">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href || (item.submenu && item.submenu.some(sub => location.pathname === sub.href));

                    if (item.submenu) {
                        return (
                            <DropdownMenu key={item.key}>
                                <DropdownMenuTrigger className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all outline-none ${isActive ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-white/50'}`}>
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="w-48 p-2">
                                    {item.submenu.map(sub => (
                                        <DropdownMenuItem key={sub.key} asChild>
                                            <Link to={sub.href} className="cursor-pointer font-semibold text-slate-600 focus:text-blue-700">
                                                {sub.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        );
                    }

                    return (
                        <Link 
                            key={item.key} 
                            to={item.href || '#'} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-blue-600 hover:bg-white/50'}`}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* ACTIONS RIGHT */}
            <div className="flex items-center gap-3">
              <div className="hidden xl:flex items-center gap-2 mr-4 border-r border-slate-200 pr-4">
                  {/* Usa safeConfig para evitar crash nos links sociais */}
                  <a href={safeConfig.social_instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors"><Instagram className="w-4 h-4" /></a>
                  <a href={safeConfig.social_facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors"><Facebook className="w-4 h-4" /></a>
              </div>

              {isAuthenticated ? (
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="rounded-full pl-2 pr-4 border border-slate-200 hover:bg-slate-50 flex items-center gap-3 h-10">
                              <div className="h-7 w-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 ring-2 ring-white">
                                  <UserIcon className="h-4 w-4" />
                              </div>
                              <ChevronDown className="h-3 w-3 text-slate-400" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Olá, {atleta?.nome_completo?.split(' ')[0]}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {isAdmin && (
                              <>
                                  <DropdownMenuItem asChild><Link to="/admin/painel"><ShieldCheck className="mr-2 h-4 w-4"/> Painel Admin</Link></DropdownMenuItem>
                                  <DropdownMenuItem asChild><Link to="/admin/associados"><Users className="mr-2 h-4 w-4"/> Associados</Link></DropdownMenuItem>
                                  <DropdownMenuItem asChild><Link to="/admin/configuracoes"><Settings className="mr-2 h-4 w-4"/> Configurações</Link></DropdownMenuItem>
                                  <DropdownMenuSeparator />
                              </>
                          )}
                          <DropdownMenuItem asChild><Link to="/painel"><UserCog className="mr-2 h-4 w-4"/> Área do Associado</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to="/editar-perfil"><UserPlus className="mr-2 h-4 w-4"/> Meus Dados</Link></DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer font-bold bg-red-50 hover:bg-red-100">
                              <LogOut className="mr-2 h-4 w-4"/> Sair
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                  <Button asChild className="rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-200/50">
                      <Link to="/login">ÁREA DO ASSOCIADO</Link>
                  </Button>
              )}

              {/* MOBILE MENU */}
              <div className="lg:hidden">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon"><Menu className="w-6 h-6 text-slate-700" /></Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                        <div className="flex flex-col gap-6 mt-10">
                            {navItems.map(item => (
                                <div key={item.key} className="space-y-3">
                                    <div className="font-black text-slate-900 uppercase text-sm tracking-widest border-b pb-2 flex items-center gap-2">
                                        <item.icon className="h-4 w-4 text-slate-400" /> {item.label}
                                    </div>
                                    {item.submenu ? (
                                        <div className="flex flex-col gap-2 pl-4 border-l-2 border-slate-100 ml-1">
                                            {item.submenu.map(sub => (
                                                <Link key={sub.key} to={sub.href} className="text-sm font-bold text-slate-500 hover:text-blue-600 py-1" onClick={() => setIsMenuOpen(false)}>
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <Link to={item.href || '#'} className="text-sm font-bold text-slate-500 hover:text-blue-600 block pl-4" onClick={() => setIsMenuOpen(false)}>
                                            Acessar {item.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
              </div> {/* Fim LG Hidden (Mobile) */}
            </div> {/* Fim Actions Right */}
          </div> {/* Fim Flex Between */}
        </div> {/* Fim Container */}
      </div> {/* Fim Fixed Top */}
    </TooltipProvider>
  );
}
// linha 260 client/src/components/Navigation.tsx