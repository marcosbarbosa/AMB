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
import { Users, Handshake, Shield, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function AdminPainelPage() {
  const { atleta } = useAuth(); // Usando atleta conforme front antigo

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <main className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 uppercase italic">Administração</h1>
          <p className="text-slate-500 font-medium">Bem-vindo, {atleta?.nome_completo || "Admin"}.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/associados">
            <Card className="hover:scale-105 transition-transform bg-white shadow-lg">
              <CardHeader>
                <Users className="text-blue-600 mb-2" />
                <CardTitle className="text-lg">Associados</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          {/* Outros cards... */}
        </div>
      </main>
    </div>
  );
}