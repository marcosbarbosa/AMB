/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - Business Intelligence (BI)
 * ==========================================================
 * Versão: 1.0 (Módulo de Estatísticas da Diretoria)
 * Descrição: Dashboard visual com KPIs e gráficos de crescimento.
 * ==========================================================
 */

import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie 
} from "recharts";
import { 
  Users, UserPlus, Handshake, TrendingUp, 
  ArrowUpRight, Download, Calendar 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// MOCK DATA: Dados simulados para visualização (No futuro, virão da sua API PHP)
const dadosCrescimento = [
  { mes: "Jan", atletas: 45 },
  { mes: "Fev", atletas: 52 },
  { mes: "Mar", atletas: 48 },
  { mes: "Abr", atletas: 61 },
  { mes: "Mai", atletas: 85 },
  { mes: "Jun", atletas: 110 },
  { mes: "Jul", atletas: 145 },
  { mes: "Ago", atletas: 190 },
];

const dadosCategorias = [
  { name: "Master 30+", value: 400, color: "#ea580c" }, // Orange-600
  { name: "Master 40+", value: 300, color: "#1e293b" }, // Slate-800
  { name: "Master 50+", value: 200, color: "#64748b" }, // Slate-500
  { name: "Master 60+", value: 100, color: "#94a3b8" }, // Slate-400
];

export default function GestaoDiretoriaPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <main className="max-w-7xl mx-auto py-10 px-6">

        {/* HEADER DA PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic uppercase">Diretoria & BI</h1>
            <p className="text-slate-500 font-medium">Indicadores de desempenho e crescimento da associação.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar size={16} /> Período: 2026
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
              <Download size={16} /> Exportar Relatório
            </Button>
          </div>
        </div>

        {/* DASHBOARD CARDS (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total de Atletas</p>
                  <h3 className="text-3xl font-black text-slate-900">545</h3>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                  <Users size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-green-600">
                <ArrowUpRight size={14} className="mr-1" /> +12% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Novos (2026)</p>
                  <h3 className="text-3xl font-black text-slate-900">82</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                  <UserPlus size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-blue-600">
                Aguardando aprovação: 14
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Parceiros Ativos</p>
                  <h3 className="text-3xl font-black text-slate-900">24</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-xl text-green-600">
                  <Handshake size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-slate-500 uppercase">
                Conversão de Benefícios: 65%
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Engajamento</p>
                  <h3 className="text-3xl font-black text-slate-900">78%</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-purple-600 uppercase italic">
                Crescimento Constante
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GRÁFICOS PRINCIPAIS */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Crescimento Mensal (Linha) */}
          <Card className="lg:col-span-2 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold italic uppercase">Crescimento de Associados</CardTitle>
              <CardDescription>Evolução do número de atletas ativos ao longo do ano.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosCrescimento}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="atletas" 
                      stroke="#ea580c" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Categoria (Pizza) */}
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold italic uppercase">Categorias</CardTitle>
              <CardDescription>Distribuição de atletas por idade.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosCategorias}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dadosCategorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {dadosCategorias.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="font-medium text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}