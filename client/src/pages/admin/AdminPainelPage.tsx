/*
// Nome: AdminPainelPage.tsx
// Caminho: client/src/pages/admin/AdminPainelPage.tsx
// Data: 2026-01-17
// Hora: 23:55 (America/Sao_Paulo)
// Função: Dashboard Admin (Tipografia Prime e Módulo Parceiros)
// Versão: v13.0 Prime
*/

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { 
  Loader2, Users, Newspaper, CalendarDays, Settings, 
  Layout, FileText, Handshake
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
      description: 'Gestão de atletas, CPFs e migração XLSX.',
      link: '/admin/associados',
    },
    {
      title: 'Gestão de Parceiros',
      icon: Handshake,
      description: 'Gerencie empresas conveniadas e descontos.',
      link: '/admin/parceiros', // Agora acessível
    },
    {
      title: 'Configurações do Portal',
      icon: Settings,
      description: 'Redes Sociais, WhatsApp, E-mail e Endereço.',
      link: '/admin/configuracoes',
    },
    {
      title: 'Notícias',
      icon: Newspaper,
      description: 'Publique novidades, avisos e editais.',
      link: '/admin/noticias',
    },
    {
      title: 'Eventos & Jogos',
      icon: CalendarDays,
      description: 'Gerencie o calendário e placares.',
      link: '/admin/eventos',
    },
    {
      title: 'Transparência',
      icon: FileText,
      description: 'Documentos Oficiais e Atas.',
      link: '/admin/transparencia',
    },
    {
      title: 'Banners',
      icon: Layout,
      description: 'Gerenciar imagens do topo.',
      link: '/admin/banners',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-32 pb-16">
        <section className="max-w-7xl mx-auto px-4">
          <div className="mb-10 text-center md:text-left">
            {/* Título mais elegante, menos "garrafal" */}
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2 uppercase">Painel Administrativo</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
              Gestor: <span className="text-blue-600">{atleta?.nome_completo}</span>
            </p>
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
// linha 110 AdminPainelPage.tsx