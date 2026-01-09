/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - Painel de Administração
 * ==========================================================
 * Versão: 2.7 (Limpeza de Navigation e Correção de Links)
 */
import React from "react";
import { Link } from "react-router-dom";
import { Users, Handshake, Shield, Trophy, LayoutDashboard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function AdminPainelPage() {
  const { atleta } = useAuth();

  const modulos = [
    {
      titulo: "Associados",
      descricao: "Gerir cadastros e aprovações.",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      link: "/admin/associados"
    },
    {
      titulo: "Parceiros",
      descricao: "Gerir patrocinadores e benefícios.",
      icon: <Handshake className="h-8 w-8 text-orange-600" />,
      link: "/admin/parceiros" 
    },
    {
      titulo: "Equipes",
      descricao: "Cadastrar times e logos oficiais.",
      icon: <Shield className="h-8 w-8 text-green-600" />,
      link: "/admin/times"
    },
    {
      titulo: "Competições",
      descricao: "Placares e gestão de jogos.",
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
            ADMINISTRAÇÃO
          </h1>
          <p className="text-slate-500 text-lg mt-2 font-medium">
            Bem-vindo, <span className="text-orange-600 font-bold">{atleta?.nome_completo || "Admin"}</span>.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modulos.map((modulo, index) => (
            <Link key={index} to={modulo.link}>
              <Card className="hover:scale-105 transition-all cursor-pointer border-none shadow-lg bg-white overflow-hidden group h-full">
                <div className="h-2 bg-orange-600 w-0 group-hover:w-full transition-all duration-300"></div>
                <CardHeader className="p-6">
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-orange-50 transition-colors">
                    {modulo.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">{modulo.titulo}</CardTitle>
                  <CardDescription className="mt-2">{modulo.descricao}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}