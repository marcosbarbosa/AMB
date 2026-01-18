/*
// Nome: AdminPainelPage.tsx
// Caminho: client/src/pages/admin/AdminPainelPage.tsx
// Data: 2026-01-17
// Hora: 20:55 (America/Sao_Paulo)
// Função: Dashboard Administrativo com Configuração Centralizada
// Versão: v12.0 Prime
// Alteração: Módulo de Configurações assumindo lugar de destaque; BI movido para público.
*/

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { 
  Loader2, Users, Newspaper, CalendarDays, Settings, 
  Layout, FileText
} from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; 

export default function AdminPainelPage() {
  const { isAuthenticated, atleta, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || atleta?.role !== 'admin') { navigate('/'); }
  }, [isAuthenticated, atleta, isAuthLoading, navigate]);

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-10 w-10" /></div>;

  const adminModules = [
    {
      title: 'Associados',
      icon: Users,
      description: 'Gestão de atletas, CPFs, finanças e migração XLSX.',
      link: '/admin/associados',
    },
    {
      title: 'Configurações do Portal',
      icon: Settings,
      description: 'Gerencie Redes Sociais, WhatsApp, E-mail e Endereço Oficial.',
      link: '/admin/configuracoes',
    },
    {
      title: 'Notícias',
      icon: Newspaper,
      description: 'Publique novidades, avisos e editais informativos.',
      link: '/admin/noticias',
    },
    {
      title: 'Eventos & Jogos',
      icon: CalendarDays,
      description: 'Gerencie o calendário esportivo e placares.',
      link: '/admin/eventos',
    },
    {
      title: 'Transparência',
      icon: FileText,
      description: 'Documentos Oficiais, Editais e Atas da Associação.',
      link: '/admin/transparencia',
    },
    {
      title: 'Banners',
      icon: Layout,
      description: 'Gerenciar imagens do topo e artes de publicidade.',
      link: '/admin/banners',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-32 pb-16">
        <section className="max-w-7xl mx-auto px-4">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Painel Administrativo</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Acesso de Gestor: {atleta?.nome_completo}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((mod) => (
              <Link to={mod.link} key={mod.title}>
                <Card className="h-full hover:shadow-2xl hover:-translate-y-1 hover:border-blue-600 transition-all duration-300 group rounded-[32px] border-slate-200">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                    <div className="p-4 rounded-2xl bg-slate-900 text-white group-hover:bg-blue-600 transition-colors shadow-lg">
                      <mod.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold uppercase tracking-tight">{mod.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm font-semibold text-slate-500 leading-relaxed">{mod.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
// linha 105 AdminPainelPage.tsx