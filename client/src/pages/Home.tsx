/*
 * ==========================================================
 * Versão: 4.1 (Limpeza de Componentes Globais)
 */
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, ArrowRight } from "lucide-react";
import ParceirosDestaque from "@/components/ParceirosDestaque";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="bg-slate-900 py-24 text-center text-white">
        <h1 className="text-5xl font-black italic uppercase">AMB Amazonas</h1>
        <p className="text-orange-500 font-bold mt-2">A ELITE DO BASQUETE MASTER</p>
      </section>

      <main className="flex-grow">
        <section className="py-12 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                {/* LINHA 53 CORRIGIDA: Trophy tag fechada */}
                <Trophy className="text-orange-600" size={28} />
                <h2 className="text-2xl font-black text-slate-900 italic uppercase">Resultados</h2>
              </div>
              <Link to="/eventos" className="text-orange-600 font-bold text-sm hover:underline">VER TABELA</Link>
            </div>
            <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
               Placar em atualização...
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase italic">Temporada <span className="text-orange-600">2026</span></h2>
          <Link to="/cadastro">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white font-black px-8 py-6 rounded-xl shadow-lg">FAZER RECADASTRO</Button>
          </Link>
        </section>

        <section className="py-16 bg-white border-t border-slate-50 text-center">
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-10">Parceiros</h3>
          <ParceirosDestaque />
        </section>
      </main>
    </div>
  );
}
