/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Hora: 17:20
 * Versão: 2.6 (Módulos de Gestão Administrativa)
 *
 * Descrição: Painel Principal de Administração.
 * Removidas as tags Navigation/Footer para evitar menu duplo.
 * Organizado para facilitar o acesso aos módulos de associados, 
 * parceiros, equipes e competições.
 *
 * ==========================================================
 */

import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Handshake, 
  Shield, 
  Trophy, 
  LayoutDashboard 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function AdminPainelPage() {
  const { user } = useAuth();

  const modulos = [
    {
      titulo: "Gestão de Associados",
      descricao: "Aprovar, rejeitar e ver novos cadastros.",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      link: "/admin/associados"
    },
    {
      titulo: "Gestão de Parceiros",
      descricao: "Gerir patrocinadores e níveis (Ouro/Prata).",
      icon: <Handshake className="h-8 w-8 text-orange-600" />,
      link: "/admin/parceiros" 
    },
    {
      titulo: "Gestão de Equipes",
      descricao: "Cadastrar clubes e logos oficiais.",
      icon: <Shield className="h-8 w-8 text-green-600" />,
      link: "/admin/times"
    },
    {
      titulo: "Gestão de Jogos",
      descricao: "Administrar placares e eventos.",
      icon: <Trophy className="h-8 w-8 text-yellow-600" />,
      link: "/admin/eventos"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <main className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4 uppercase italic">
            <LayoutDashboard size={40} className="text-orange-600" /> 
            Administração
          </h1>
          <p className="text-slate-500 text-lg mt-2 font-medium">
            Bem-vindo, <span className="text-orange-600 font-bold">{user?.nome || "Admin"}</span>.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modulos.map((modulo, index) => (
            <Link key={index} to={modulo.link}>
              <Card className="hover:scale-105 transition-transform cursor-pointer border-none shadow-lg bg-white overflow-hidden group h-full">
                <div className="h-2 bg-orange-600 w-0 group-hover:w-full transition-all duration-300"></div>
                <CardHeader className="p-6">
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-orange-50 transition-colors">
                    {modulo.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">{modulo.titulo}</CardTitle>
                  <CardDescription className="mt-2 font-medium">{modulo.descricao}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}