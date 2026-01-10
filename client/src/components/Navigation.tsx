/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 10 de janeiro de 2026
 * Hora: 17:05
 * Versão: 7.0
 * Tarefa: 352
 *
 * Descrição: Componente de Navegação Elite.
 * ATUALIZAÇÃO: Estilo tipográfico Master e links corrigidos.
 *
 * ==========================================================
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Lock } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import ambLogo from '../assets/logo-amb.png'; 

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, atleta, logout } = useAuth();

  const navLinks = [
    { label: 'Início', href: '/' },
    { label: 'Diretoria', href: '/diretoria' },
    { label: 'Parceiros', href: '/parceiros' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 md:px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        <Link to="/" className="flex items-center gap-3">
          <img src={ambLogo} alt="AMB" className="h-10 md:h-12 w-auto" />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">AMB Portal</span>
            <span className="text-[10px] text-orange-600 font-black uppercase tracking-widest">Amazonas</span>
          </div>
        </Link>

        {/* MENU DESKTOP ELITE MASTER */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                to={link.href} 
                className={`text-sm font-black uppercase italic tracking-tighter transition-all hover:scale-105 ${
                  location.pathname === link.href ? 'text-orange-600 border-b-2 border-orange-600 pb-1' : 'text-slate-900 hover:text-orange-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Olá, {atleta?.nome_completo?.split(' ')[0]}</span>
               <Link to="/admin/painel">
                  <Button variant="ghost" size="icon" className="text-yellow-600 bg-yellow-50 hover:bg-yellow-100 shadow-sm rounded-lg"><Lock size={18} /></Button>
               </Link>
               <Link to="/painel">
                  <Button variant="outline" className="text-[11px] font-black italic uppercase tracking-widest border-slate-200">Painel</Button>
               </Link>
               <Button variant="ghost" size="icon" onClick={() => logout()} className="text-red-500 hover:bg-red-50"><LogOut size={20} /></Button>
            </div>
          )}
        </div>

        <button className="lg:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
}