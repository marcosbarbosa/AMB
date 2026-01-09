/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 * Versão: 3.6 (Correção Final de Sintaxe e Importações)
 * ==========================================================
 */
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

// Importações de componentes de conteúdo
import PlacarDestaque from "@/components/PlacarDestaque";
import ParceirosDestaque from "@/components/ParceirosDestaque";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        {/* Banner Simples (Caso o BannerHero falte) */}
        <section className="bg-slate-900 py-20 px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase">AMB Amazonas</h1>
          <p className="mt-4 text-orange-500 font-bold tracking-widest">A ELITE DO BASQUETE MASTER</p>
        </section>

        <section className="py-12 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                {/* LINHA 53 CORRIGIDA: Fechamento da tag */}
                <Trophy className="text-orange-600" size={28} />
                <h2 className="text-2xl font-black text-slate-900 italic uppercase">Resultados</h2>
              </div>
              <Link to="/eventos" className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1">
                VER TABELA <ArrowRight size={16} />
              </Link>
            </div>
            <PlacarDestaque />
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase italic">
            Recadastro <span className="text-orange-600">Temporada 2026</span>
          </h2>
          <Link to="/cadastro">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-black px-8 py-6 rounded-xl shadow-lg">
              REALIZAR RECADASTRO AGORA
            </Button>
          </Link>
        </section>

        <section className="py-16 bg-white border-t border-slate-50 text-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-10">Parceiros Estratégicos</h3>
          <ParceirosDestaque />
        </section>
      </main>
    </div>
  );
}