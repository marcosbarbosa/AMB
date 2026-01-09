/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Versão: 2.0 (Foco 100% Basquetebol Master)
 *
 * Descrição: Secção "Sobre a AMB". 
 * REMOVIDO: Textos de consultoria e negócios.
 * ADICIONADO: Missão e valores do Basquetebol Master no Amazonas.
 *
 * ==========================================================
 */

import { Trophy, Users, Heart } from 'lucide-react';

export function About() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <h2 className="text-4xl font-black italic uppercase text-slate-900 leading-tight">
              A Nossa <span className="text-orange-600">História</span> & Missão
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              A **AMB Amazonas** (Associação Master de Basquetebol do Amazonas) nasceu da paixão eterna pelo desporto. 
              Somos mais do que uma associação; somos uma comunidade dedicada a manter viva a chama do basquetebol para atletas que acreditam que o talento não tem prazo de validade.
            </p>
            <p className="text-slate-600">
              Promovemos a saúde através da prática desportiva competitiva e recreativa, fortalecendo laços de amizade entre ex-atletas e entusiastas do basquetebol master no nosso estado.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <Trophy className="h-8 w-8 text-orange-600" />
                <h4 className="font-bold text-slate-900 uppercase text-xs">Competição</h4>
                <p className="text-xs text-slate-500 italic">Torneios oficiais em diversas categorias.</p>
              </div>
              <div className="space-y-2">
                <Users className="h-8 w-8 text-orange-600" />
                <h4 className="font-bold text-slate-900 uppercase text-xs">Comunidade</h4>
                <p className="text-xs text-slate-500 italic">Integração entre veteranos e novas gerações.</p>
              </div>
              <div className="space-y-2">
                <Heart className="h-8 w-8 text-orange-600" />
                <h4 className="font-bold text-slate-900 uppercase text-xs">Saúde</h4>
                <p className="text-xs text-slate-500 italic">Promoção do bem-estar e qualidade de vida.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-50">
              {/* Imagem representativa da AMB */}
              <img 
                src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?auto=format&fit=crop&q=80" 
                alt="Basquetebol Master"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-orange-600 text-white p-8 rounded-2xl shadow-xl hidden md:block">
              <p className="text-4xl font-black italic">+500</p>
              <p className="text-xs font-bold uppercase tracking-widest">Associados Ativos</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}