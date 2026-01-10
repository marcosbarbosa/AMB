/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - Navigation
 * ==========================================================
 *
 * Versão: 5.5 (Inclusão do Link Diretoria no Menu Principal)
 *
 * Descrição: Cabeçalho de navegação global. 
 * MANTIDO: Lógica do objeto 'atleta' para Cadeado e Painel.
 * ADICIONADO: Link para a página pública da Diretoria.
 *
 * ==========================================================
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, LogOut, LayoutDashboard, Lock, 
  LogIn, UserPlus, ShieldCheck 
} from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ambLogo from '../assets/logo-amb.png'; 

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, atleta, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Itens de navegação comuns (Públicos)
  const navLinks = [
    { label: 'Início', href: '/' },
    { label: 'Diretoria', href: '/diretoria' }, // Novo link adicionado
    { label: 'Parceiros', href: '/parceiros' },
    { label: 'Contato', href: '/contato' },
  ];

  // Fallback para o nome do associado no menu
  const nomeExibicao = atleta?.nome_completo?.split(' ')[0] || "Associado";

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 md:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO AMB AMAZONAS */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src={ambLogo} alt="AMB Amazonas" className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
          <div className="flex flex-col leading-none">
            <span className="text-lg md:text-xl font-bold text-slate-800 italic uppercase tracking-tighter">AMB Portal</span>
            <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Amazonas</span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className={`text-sm font-bold uppercase tracking-tight transition-colors ${
                  location.pathname === link.href ? 'text-orange-600' : 'text-slate-600 hover:text-orange-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {isAuthenticated && atleta ? (
            <div className="flex items-center gap-4 ml-4 pl-6 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Olá, <span className="text-slate-900">{nomeExibicao}</span>
              </span>

              {/* CADEADO: Acesso Admin */}
              {(atleta.role === 'admin' || atleta.nivel === 'admin') && (
                <Link to="/admin/painel" title="Painel Administrativo">
                  <Button variant="ghost" size="icon" className="text-yellow-600 border border-yellow-100 bg-yellow-50/50 shadow-sm">
                    <Lock size={18} />
                  </Button>
                </Link>
              )}

              {/* BOTÃO MEU PAINEL */}
              <Link to="/painel">
                <Button variant="outline" className="text-xs font-black gap-2 h-9 px-4 italic border-slate-200 uppercase">
                  <LayoutDashboard size={16} /> Meu Painel
                </Button>
              </Link>

              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:bg-red-50">
                <LogOut size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600 text-xs font-black uppercase tracking-widest gap-2">
                  <LogIn size={16} /> Entrar
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-black text-xs h-9 px-6 rounded-full shadow-lg shadow-orange-600/20 uppercase italic">
                  Cadastre-se
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-black italic uppercase text-slate-800 border-b border-slate-50 pb-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {isAuthenticated ? (
              <Link to="/painel" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-slate-900 font-bold uppercase italic">Ir para o Meu Painel</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-bold uppercase italic">Aceder ao Portal</Button>
                </Link>
                <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-orange-600 font-bold uppercase italic">Fazer Recadastro</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}