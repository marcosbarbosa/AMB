/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 10 de janeiro de 2026
 * Hora: 16:30
 * Versão: 2.2
 * Tarefa: 313
 *
 * Descrição: Dashboard Administrativo (Painel de Gestão).
 * ATUALIZAÇÃO: Links dos módulos vinculados às rotas do App.tsx.
 *
 * ==========================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import { Users, Handshake, Calendar, TrendingUp, FileText, Settings } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminPainelPage() {
  const modulos = [
    { title: "Gestão de Associados", desc: "Aprovar e ver novos cadastros.", icon: <Users />, link: "/admin/associados" },
    { title: "Gestão de Parceiros", desc: "Gerir convênios e níveis.", icon: <Handshake />, link: "/admin/parceiros" },
    { title: "Gestão de Eventos", desc: "Criar e editar campeonatos.", icon: <Calendar />, link: "/admin/eventos" },
    { title: "Diretoria e BI", desc: "Gerir membros e ver estatísticas.", icon: <TrendingUp />, link: "/admin/diretoria-stats" },
    { title: "Posts e Newsletters", desc: "Lançar placares e notícias.", icon: <FileText />, link: "/admin/posts" },
    { title: "Gerir Categorias", desc: "Modificar categorias de idade.", icon: <Settings />, link: "/admin/categorias" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Painel Administrativo</h1>
        <p className="text-slate-500 mb-10">Bem-vindo(a) à central de comando da AMB Amazonas.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((m) => (
            <Link key={m.link} to={m.link}>
              <Card className="hover:shadow-2xl transition-all cursor-pointer border-none group">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    {m.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black uppercase italic tracking-tighter">{m.title}</CardTitle>
                    <CardDescription>{m.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}