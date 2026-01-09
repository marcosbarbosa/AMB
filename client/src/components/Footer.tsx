/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Hora: 14:15
 * Versão: 1.6 (Correção Dual Export)
 * Tarefa: 273
 *
 * Descrição: Componente de rodapé (Footer).
 * ATUALIZADO para oferecer export nomeado e default, resolvendo
 * conflitos de importação no Vite/React.
 *
 * ==========================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

// Export Nomeado para resolver o erro
export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6 px-6 border-t-4 border-orange-600">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <h3 className="text-orange-500 font-black text-xl italic uppercase font-serif">AMB Amazonas</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Associação Master de Basquetebol do Amazonas. 
            Valorizando o atleta veterano e a história do basquete nortista.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg border-b border-slate-700 pb-2 uppercase tracking-tighter">Navegação</h4>
          <ul className="text-slate-400 text-sm space-y-2">
            <li><Link to="/" className="hover:text-orange-500 transition-colors">Página Inicial</Link></li>
            <li><Link to="/cadastro" className="hover:text-orange-500 transition-colors">Recadastro de Atletas</Link></li>
            <li><Link to="/parceiros" className="hover:text-orange-500 transition-colors">Parceiros AMB</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg border-b border-slate-700 pb-2 uppercase tracking-tighter">Conecte-se</h4>
          <div className="flex flex-col gap-3 text-slate-400 text-sm">
            <span className="flex items-center gap-2"><Phone size={16} className="text-orange-500" /> (92) 9XXXX-XXXX</span>
            <span className="flex items-center gap-2"><Mail size={16} className="text-orange-500" /> diretoria@ambamazonas.com.br</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-800 text-center text-slate-500 text-[10px] uppercase">
        <p>© 2026 Portal AMB. Copyright (c) Marcos Barbosa @mbelitecoach. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

// Export Default para garantir compatibilidade total
export default Footer;