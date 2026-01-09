/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - Navigation
 * ==========================================================
 * Versão: 5.1 (Proteção de Dados e Cadeado Admin)
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Lock, LogIn, UserPlus } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ambLogo from '../assets/logo-amb.png'; 

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, atleta, logout } = useAuth();

  // Fallback para o nome para evitar "OLÁ," vazio
  const nomeExibicao = atleta?.nome_completo?.split(' ')[0] || atleta?.nome?.split(' ')[0] || "Associado";

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 md:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        <Link to="/" className="flex items-center gap-3">
          <img src={ambLogo} alt="AMB" className="h-10 md:h-12 w-auto object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-lg md:text-xl font-bold text-slate-800 italic">AMB Portal</span>
            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Amazonas</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {isAuthenticated && atleta ? (
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                Olá, <span className="text-slate-900">{nomeExibicao}</span>
              </span>

              {/* Lógica do Cadeado Admin */}
              {(atleta.role === 'admin' || atleta.nivel === 'admin') && (
                <Link to="/admin/painel">
                  <Button variant="ghost" size="icon" className="text-yellow-600 border border-yellow-100 bg-yellow-50/50 shadow-sm" title="Admin">
                    <Lock size={18} />
                  </Button>
                </Link>
              )}

              <Link to="/painel">
                <Button variant="outline" className="text-xs font-bold gap-2 h-9 px-4">
                  <LayoutDashboard size={16} /> MEU PAINEL
                </Button>
              </Link>

              <Button variant="ghost" size="icon" onClick={() => logout()} className="text-red-500 hover:bg-red-50">
                <LogOut size={20} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login"><Button variant="ghost" className="text-slate-600 text-xs font-bold">ENTRAR</Button></Link>
              <Link to="/cadastro"><Button className="bg-orange-600 text-white font-bold text-xs h-9 px-6 rounded-full shadow-md">CADASTRE-SE</Button></Link>
            </div>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
}