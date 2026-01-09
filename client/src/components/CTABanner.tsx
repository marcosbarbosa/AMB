/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Versão: 2.0 (Foco em Recadastro e Filiação)
 *
 * Descrição: Banner de Chamada para Acção (CTA).
 * FOCADO em incentivar o recadastro anual dos associados.
 *
 * ==========================================================
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function CTABanner() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">

        {/* Elemento Decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase text-white leading-tight">
              Prepare-se para a Temporada <span className="text-orange-500">2026</span>
            </h2>
            <p className="text-lg text-slate-400">
              O recadastro anual é obrigatório para todos os atletas da AMB Amazonas. 
              Mantenha o seu vínculo ativo para participar nos torneios e eventos oficiais.
            </p>

            <ul className="space-y-3 text-slate-300 font-medium inline-block lg:block text-left">
              <li className="flex items-center gap-3">
                <CheckCircle className="text-orange-500 h-5 w-5" /> Inscrição em Torneios Oficiais
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-orange-500 h-5 w-5" /> Acesso ao Seguro Atleta
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-orange-500 h-5 w-5" /> Rede de Benefícios com Parceiros
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
            <Link to="/cadastro">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-black px-10 py-8 rounded-2xl shadow-xl shadow-orange-900/20 text-lg uppercase italic transition-all active:scale-95">
                Realizar Recadastro <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/contato">
              <Button variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800 px-10 py-8 rounded-2xl font-bold uppercase text-lg">
                Dúvidas? Fale Connosco
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}