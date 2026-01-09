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
 * Versão: 4.1 (Restauro de Lógica Atleta/Admin)
 * CORREÇÃO: Utiliza o objeto 'atleta' conforme o front-end antigo.
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Lock, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import ambLogo from '../assets/logo-amb.png'; 

export function Navigation() {
  // 1. FALHA CORRIGIDA: Voltamos a usar 'atleta' em vez de 'user'
  const { atleta, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm">
      <Link to="/" className="flex items-center gap-3">
        <img src={ambLogo} alt="AMB" className="h-10 w-auto object-contain" />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-slate-800 leading-none italic">AMB Portal</span>
          <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Amazonas</span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {/* 2. Lógica de Acesso Restaurada */}
        {isAuthenticated && atleta ? (
          <>
            <span className="hidden md:block text-xs font-bold text-slate-500 uppercase">
              Olá, {atleta.nome_completo.split(' ')[0]}
            </span>

            {/* CADEADO: Reativado para role 'admin' */}
            {atleta.role === 'admin' && (
              <Link to="/admin/painel">
                <Button variant="ghost" size="icon" className="text-yellow-600 border border-yellow-100 hover:bg-yellow-50 shadow-sm" title="Acesso Admin">
                  <Lock size={18} />
                </Button>
              </Link>
            )}

            {/* BOTÃO MEU PAINEL: Reativado */}
            <Link to="/painel">
              <Button variant="outline" className="text-xs font-bold gap-2 h-9 px-4">
                <LayoutDashboard size={16} /> MEU PAINEL
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={() => logout()} className="text-red-500">
              <LogOut size={20} />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/cadastro">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs h-9 px-4 rounded-full">CADASTRE-SE</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="text-slate-600 text-xs font-bold h-9">ENTRAR</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;