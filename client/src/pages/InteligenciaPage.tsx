/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: InteligenciaPage.tsx
 * CAMINHO: client/src/pages/InteligenciaPage.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Dashboard Público de Inteligência (BI) - Visualização de Dados
 * VERSÃO: 2.0 Prime
 * ==========================================================
 */

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Trophy, PieChart, Activity, CalendarDays } from 'lucide-react';

export default function InteligenciaPage() {
  // DADOS MOCK (Simulação visual para produção - Futuramente conectar API)
  const stats = [
    { label: "Atletas Federados", value: "1.240", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Jogos em 2025", value: "385", icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Crescimento Anual", value: "+18%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Média de Público", value: "450", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* CABEÇALHO */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="outline" className="mb-4 border-purple-200 text-purple-700 bg-purple-50 px-4 py-1 tracking-widest font-bold">
              BUSINESS INTELLIGENCE
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              AMB em Números
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
                Transparência e gestão baseada em dados. Acompanhe a evolução do basquete master amazonense através de indicadores em tempo real.
            </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, idx) => (
                <Card key={idx} className="border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* GRÁFICOS VISUAIS */}
        <div className="grid lg:grid-cols-3 gap-8">

            {/* Gráfico de Barras Simulado */}
            <Card className="lg:col-span-2 border-slate-200 shadow-lg overflow-hidden flex flex-col">
                <CardHeader className="border-b border-slate-100 bg-white py-5">
                    <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600"/> Performance por Categoria
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex-1 bg-slate-50/30 flex items-end justify-between gap-4 h-80">
                    {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                        <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group h-full flex items-end">
                            <div style={{ height: `${h}%` }} className="w-full bg-blue-600 rounded-t-lg opacity-90 group-hover:opacity-100 transition-all duration-500 relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Gráfico de Pizza Simulado */}
            <Card className="border-slate-200 shadow-lg overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-white py-5">
                    <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
                        <PieChart className="h-5 w-5 text-purple-600"/> Status Financeiro
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 h-80 flex flex-col items-center justify-center bg-slate-50/30 relative">
                    <div className="relative w-48 h-48">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                            <path className="text-green-500" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-slate-800">85%</span>
                            <span className="text-xs font-bold text-slate-400 uppercase">Adimplência</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="mt-12 text-center border-t border-slate-200 pt-8">
            <p className="text-xs text-slate-400 font-medium">© AMB Data Analytics • Dados atualizados em tempo real.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}