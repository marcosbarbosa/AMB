/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 10 de janeiro de 2026
 * Hora: 15:55
 * Versão: 2.1
 *
 * Descrição: Página Elite de Parceiros da AMB.
 * Lista os convênios e benefícios para os associados.
 *
 * ==========================================================
 */

import React from "react";
import { Handshake, ExternalLink, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ParceirosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION ELITE */}
      <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <Handshake size={300} className="text-white" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter">
            Rede de <span className="text-orange-600">Parceiros</span>
          </h1>
          <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto font-medium uppercase tracking-widest">
            Benefícios exclusivos e descontos reais para a elite do basquetebol master.
          </p>
        </div>
      </section>

      {/* CONTEÚDO VAZIO / GRID */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
          <ShieldCheck size={64} className="text-slate-200 mb-4" />
          <h2 className="text-2xl font-black italic uppercase text-slate-400">Nossos Parceiros (0)</h2>
          <p className="text-slate-400 font-medium">Estamos a carregar novos convênios para 2026.</p>
        </div>
      </section>
    </div>
  );
}