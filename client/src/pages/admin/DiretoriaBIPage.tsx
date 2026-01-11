/*
 * ==========================================================
 * MÓDULO: DiretoriaBIPage.tsx (LIMPO)
 * Descrição: Apenas Gráficos e Inteligência. 
 * Sem botões de cadastro poluindo a tela.
 * ==========================================================
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation'; 
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Handshake, TrendingUp, Download, ArrowLeft, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const API_BI_URL = 'https://www.ambamazonas.com.br/api/get_bi_stats.php';
const COLORS = ['#ea580c', '#1e293b', '#64748b', '#94a3b8'];

export default function DiretoriaBIPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await axios.get(API_BI_URL);
        if (response.data.status === 'sucesso') setStats(response.data);
      } catch (error) {
        console.error("Erro BI:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando Inteligência...</div>;

  const dataLinha = stats?.grafico_linha || [];
  const dataPizza = stats?.grafico_pizza || [];
  const kpis = stats?.kpis || { total_atletas: 0, novos_ano: 0, total_parceiros: 0, pendentes: 0 };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/admin/painel" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao Painel
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
               <BarChart3 className="h-8 w-8 text-primary"/> Inteligência & BI
            </h1>
            <p className="text-muted-foreground">Indicadores estratégicos e crescimento da associação.</p>
          </div>
          <Button variant="outline" className="bg-white text-orange-600 border-orange-200 hover:bg-orange-50">
            <Download className="mr-2 h-4 w-4" /> Exportar Relatório PDF
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard title="TOTAL DE ATLETAS" value={kpis.total_atletas} icon={<Users className="h-6 w-6 text-orange-600" />} trend="Base Total" bgIcon="bg-orange-100" />
          <KpiCard title="NOVOS (2026)" value={kpis.novos_ano} icon={<UserPlus className="h-6 w-6 text-blue-600" />} subtext={`Aguardando: ${kpis.pendentes}`} bgIcon="bg-blue-100" />
          <KpiCard title="PARCEIROS" value={kpis.total_parceiros} icon={<Handshake className="h-6 w-6 text-green-600" />} subtext="Rede Ativa" bgIcon="bg-green-100" />
          <KpiCard title="ENGAJAMENTO" value="78%" icon={<TrendingUp className="h-6 w-6 text-purple-600" />} trend="Crescimento Constante" bgIcon="bg-purple-100" />
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader><CardTitle>Crescimento de Associados (2026)</CardTitle></CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataLinha} margin={{top:10, right:30, left:0, bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill:'#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill:'#64748b'}} />
                  <Tooltip contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Line type="monotone" dataKey="quantidade" stroke="#ea580c" strokeWidth={3} dot={{r:4, fill:'#ea580c'}} activeDot={{r:6}} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader><CardTitle>Categorias (Idade)</CardTitle></CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataPizza} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="valor">
                    {dataPizza.map((entry:any, index:number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function KpiCard({ title, value, icon, trend, subtext, bgIcon }: any) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{value}</h3>
            {trend && <p className="text-xs font-medium text-green-600">{trend}</p>}
            {subtext && <p className="text-xs font-medium text-blue-600">{subtext}</p>}
          </div>
          <div className={`p-3 rounded-xl ${bgIcon}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}