// Nome: AdminPainelPage.tsx
// Caminho: client/src/pages/admin/AdminPainelPage.tsx
// Data: 2026-01-18
// Hora: 08:35 (America/Sao_Paulo)
// Função: Dashboard Admin com 9 Módulos Oficiais
// Versão: v15.0 Prime Dashboard
// Alteração: Reestruturação dos cards para refletir a nova arquitetura de gestão.

import { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { FerramentasModal } from '@/components/FerramentasModal'; 
import { 
  Loader2, Users, Newspaper, CalendarDays, Settings, 
  Layout, FileText, Handshake, BarChart3, Briefcase, Shirt
} from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; 

export default function AdminPainelPage() {
  const { isAuthenticated, atleta, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 

  // Estado para o Modal de Configurações
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || atleta?.role !== 'admin') { navigate('/'); }
  }, [isAuthenticated, atleta, isAuthLoading, navigate]);

  if (isAuthLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-10 w-10" /></div>;

  const adminModules = [
    {
      title: 'Gestão de Associados',
      icon: Users,
      description: 'Aprovar, rejeitar e ver novos cadastros.',
      link: '/admin/associados',
    },
    {
      title: 'Gestão de Parceiros',
      icon: Handshake,
      description: 'Gerir níveis (Ouro, Prata) e status de parcerias.',
      link: '/admin/parceiros',
    },
    {
      title: 'Banners da Home',
      icon: Layout,
      description: 'Gerenciar campanhas rotativas e avisos institucionais.',
      link: '/admin/banners',
    },
    {
      title: 'Secretaria Digital', // Antigo Prestação de Contas
      icon: FileText,
      description: 'Enviar balancetes, documentos oficiais e editais.',
      link: '/admin/transparencia',
    },
    {
      title: 'Gestão de Eventos',
      icon: CalendarDays,
      description: 'Criar campeonatos, agendar jogos e gerir times.',
      link: '/admin/eventos',
    },
    {
      title: 'Gestão da Diretoria',
      icon: Briefcase,
      description: 'Cadastrar membros, cargos e gerir mandatos.',
      link: '/admin/diretoria',
    },
    {
      title: 'Configurações do Portal',
      icon: Settings,
      description: 'Redes Sociais, WhatsApp, E-mail e Menus.',
      action: () => setIsConfigOpen(true), 
    },
    {
      title: 'Posts e Newsletters',
      icon: Newspaper,
      description: 'Lançar posts de jogos e newsletters semanais.',
      link: '/admin/noticias',
    },
    {
      title: 'Gestão de Times', // Redundante mas solicitado, aponta para Eventos
      icon: Shirt,
      description: 'Acesso rápido para cadastrar equipes.',
      link: '/admin/eventos', 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-32 pb-16">
        <section className="max-w-7xl mx-auto px-4">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Painel de Administração</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
              Bem-vindo(a) Admin, <span className="text-blue-600">{atleta?.nome_completo}</span>!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((mod) => (
              mod.action ? (
                <div key={mod.title} onClick={mod.action} className="cursor-pointer">
                    <Card className="h-full hover:shadow-xl hover:-translate-y-1 hover:border-blue-600 transition-all duration-300 group rounded-[24px] border-slate-200 bg-white">
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                        <div className="p-3 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <mod.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-lg font-bold uppercase tracking-tight text-slate-800">{mod.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-xs font-medium text-slate-500 leading-relaxed">{mod.description}</CardDescription>
                      </CardContent>
                    </Card>
                </div>
              ) : (
                <Link to={mod.link!} key={mod.title}>
                  <Card className="h-full hover:shadow-xl hover:-translate-y-1 hover:border-blue-600 transition-all duration-300 group rounded-[24px] border-slate-200 bg-white">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                      <div className="p-3 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <mod.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-bold uppercase tracking-tight text-slate-800">{mod.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs font-medium text-slate-500 leading-relaxed">{mod.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {/* Modal Integrado */}
      <FerramentasModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
      />
    </div>
  );
}
// linha 125 AdminPainelPage.tsx