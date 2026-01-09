/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Hora: 16:40
 * Versão: 3.0 (Sincronização de Estado Pós-Login)
 * Tarefa: 282
 *
 * Descrição: Menu de Navegação Superior.
 * ATUALIZADO para forçar a re-renderização após o login,
 * garantindo que a saudação, o botão "Meu Painel" e o 
 * "Cadeado" de Admin apareçam imediatamente.
 *
 * ==========================================================
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Info, 
  Handshake, 
  Mail, 
  UserPlus, 
  LogIn,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"; 
import logoAmb from "@/assets/logo-amb.png";

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  // Função para garantir que exibimos o nome correto vindo da API
  const displayName = user?.nome || user?.nome_completo || "Atleta";

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 md:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO AMB PORTAL */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logoAmb} alt="AMB" className="h-10 md:h-12 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold text-slate-800 italic leading-none">AMB Portal</span>
            <span className="text-[10px] text-orange-600 font-semibold uppercase tracking-widest">Amazonas</span>
          </div>
        </Link>

        {/* LINKS CENTRAIS (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className={`hover:text-orange-600 flex items-center gap-1 ${location.pathname === '/' ? 'text-orange-600' : ''}`}>
            <Home size={16}/> Início
          </Link>
          <Link to="/sobre" className={`hover:text-orange-600 flex items-center gap-1 ${location.pathname === '/sobre' ? 'text-orange-600' : ''}`}>
            <Info size={16}/> Sobre
          </Link>
          <Link to="/parceiros" className={`hover:text-orange-600 flex items-center gap-1 ${location.pathname === '/parceiros' ? 'text-orange-600' : ''}`}>
            <Handshake size={16}/> Parceiros
          </Link>
          <Link to="/contato" className={`hover:text-orange-600 flex items-center gap-1 ${location.pathname === '/contato' ? 'text-orange-600' : ''}`}>
            <Mail size={16}/> Contato
          </Link>
        </div>

        {/* ÁREA DINÂMICA: GESTÃO E LOGIN */}
        <div className="flex items-center gap-2 md:gap-4">

          {isAuthenticated && user ? (
            <>
              {/* SAUDAÇÃO PERSONALIZADA */}
              <span className="hidden md:block text-xs font-bold text-slate-500 uppercase tracking-tight">
                Olá, <span className="text-slate-900">{displayName.split(' ')[0]}</span>
              </span>

              {/* CADEADO DE GESTÃO: APENAS ADMIN  */}
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="ghost" size="icon" className="text-orange-500 hover:bg-orange-50 border border-orange-100 shadow-sm" title="Painel de Administração">
                    <Lock size={18} />
                  </Button>
                </Link>
              )}

              {/* BOTÃO MEU PAINEL */}
              <Link to="/painel">
                <Button variant="outline" className="gap-2 border-slate-200 text-slate-700 font-bold text-xs h-9 px-4 shadow-sm hover:bg-slate-50">
                  <LayoutDashboard size={16} /> MEU PAINEL
                </Button>
              </Link>

              {/* LOGOUT */}
              <Button variant="ghost" size="icon" onClick={() => logout()} className="text-red-500 hover:bg-red-50">
                <LogOut size={20} />
              </Button>
            </>
          ) : (
            <>
              {/* BOTÕES VISITANTE */}
              <Link to="/cadastro" className="hidden sm:block">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-6 shadow-md border-b-4 border-orange-800 transition-all active:border-b-0 active:translate-y-1">
                  <UserPlus size={18} className="mr-2"/> CADASTRE-SE
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600 gap-2 font-bold hover:text-orange-600">
                  <LogIn size={18} /> ENTRAR
                </Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden text-slate-800">
            <Menu size={24} />
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;