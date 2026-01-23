// Nome: AdminPainelPage.tsx
// Nro de linhas+ Caminho: 180 client/src/pages/admin/AdminPainelPage.tsx
// Data: 2026-01-22
// Hora: 22:45 (America/Sao_Paulo)
// Função: Dashboard Admin (Com Links para Módulos de Gestão Reais)
// Versão: v2.1 Gestão Real
// Alteração: Secretaria agora aponta para /admin/secretaria e inclusão de BI e Diretoria.

import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Users, Settings, FileText, TrendingUp, Shield, Crown, 
    BarChart3, UserCheck, Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPainelPage() {
  const { atleta } = useAuth();

  const adminModules = [
    {
      title: "Gestão de Associados",
      icon: Users,
      desc: "Base de dados, status financeiro e perfil.",
      link: "/admin/associados",
      color: "text-blue-600",
      bg: "bg-blue-50",
      status: "ativo"
    },
    {
      title: "Secretaria Digital (Gestão)",
      icon: FileText,
      desc: "Upload de editais, atas e balancetes.",
      link: "/admin/secretaria", // CORRIGIDO: Aponta para GestãoTransparencia.tsx
      color: "text-amber-600",
      bg: "bg-amber-50",
      status: "ativo"
    },
    {
      title: "Gestão da Diretoria",
      icon: Briefcase,
      desc: "Cadastrar membros, cargos e fotos.",
      link: "/admin/diretoria", // NOVO
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      status: "ativo"
    },
    {
      title: "Business Intelligence",
      icon: BarChart3,
      desc: "Estatísticas, gráficos e KPIs.",
      link: "/admin/bi", // NOVO
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      status: "novo"
    },
    {
      title: "Gestão de Eleições",
      icon: Crown,
      desc: "Chapas e votação.",
      link: "/admin/eleicoes",
      color: "text-purple-600",
      bg: "bg-purple-50",
      status: "ativo"
    },
    {
      title: "Configurações",
      icon: Settings,
      desc: "Avisos e parâmetros globais.",
      link: "/admin/configuracoes",
      color: "text-slate-600",
      bg: "bg-slate-50",
      status: "ativo"
    }
  ];

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'novo': return <Badge className="bg-purple-600 hover:bg-purple-700">NOVO</Badge>;
          case 'ativo': return <Badge variant="outline" className="text-green-600 border-green-200">ATIVO</Badge>;
          default: return null;
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navigation />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase flex items-center gap-3">
                    <Shield className="h-8 w-8 text-blue-700" />
                    Painel Administrativo
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    Gestão Centralizada AMB Amazonas.
                </p>
            </div>
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">
                Admin: <span className="text-blue-600">{atleta?.nome_completo}</span>
            </div>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((mod, i) => (
                <Card key={i} className="hover:shadow-lg transition-all duration-300 border-slate-200 group cursor-pointer flex flex-col h-full">
                    <Link to={mod.link} className="flex-grow flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2 justify-between">
                            <div className={`p-3 rounded-xl ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform`}>
                                <mod.icon className="h-6 w-6" />
                            </div>
                            {getStatusBadge(mod.status)}
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between pt-2">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-800 leading-tight mb-2">
                                    {mod.title}
                                </CardTitle>
                                <p className="text-slate-500 text-sm mb-4">{mod.desc}</p>
                            </div>
                            <Button variant="ghost" className="w-full justify-between text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors p-0 hover:bg-transparent">
                                Acessar Módulo <span className="text-xl">→</span>
                            </Button>
                        </CardContent>
                    </Link>
                </Card>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 180 client/src/pages/admin/AdminPainelPage.tsx