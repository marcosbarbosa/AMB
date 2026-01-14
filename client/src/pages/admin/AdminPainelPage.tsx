    /*
     * ==========================================================
     * PROJETO: Portal AMB Amazonas (Basquete Master)
     * STATUS: Versão Estável 6.5 - "Momento Sublime"
     * DATA: 12 de Janeiro de 2026
     * ARQUIVO: AdminPainelPage.tsx
     * CAMINHO: client/src/pages/admin/AdminPainelPage.tsx
     * FUNÇÃO: Dashboard Central com Módulo de Transparência.
     * ==========================================================
     */

    import { Navigation } from '@/components/Navigation';
    import { Footer } from '@/components/Footer';
    import { useAuth } from '@/context/AuthContext'; 
    import { useEffect } from 'react'; 
    import { useNavigate, Link } from 'react-router-dom'; 
    import { 
      Loader2, Users, Handshake, CalendarDays, Newspaper, BarChart3, 
      Shirt, Briefcase, Layout, FileText 
    } from 'lucide-react'; 
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; 
    import { toast } from '@/hooks/use-toast';

    export default function AdminPainelPage() {
      const { isAuthenticated, atleta, isLoading: isAuthLoading } = useAuth(); 
      const navigate = useNavigate(); 

      // Efeito de Segurança para garantir acesso apenas a administradores
      useEffect(() => {
        if (isAuthLoading) return; 

        if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
          toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
          navigate('/'); 
        }
      }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

      // Estado de Carregamento inicial da autenticação
      if (isAuthLoading || !atleta) {
         return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">A carregar painel...</p>
          </div>
        );
      }

      // Lista de Módulos de Gestão atualizada com Transparência
      const adminModules = [
        {
          title: "Gestão de Associados",
          description: "Aprovar, rejeitar e ver novos cadastros.",
          icon: Users,
          link: "/admin/associados", 
          testid: "admin-link-associados"
        },
        {
          title: "Gestão de Parceiros",
          description: "Gerir níveis (Ouro, Prata) e status de parcerias.",
          icon: Handshake,
          link: "/admin/parceiros", 
          testid: "admin-link-parceiros"
        },
        {
          title: "Banners da Home",
          description: "Gerenciar campanhas rotativas e avisos institucionais.",
          icon: Layout,
          link: "/admin/banners", 
          testid: "admin-link-banners"
        },
        // --- NOVO MÓDULO: PRESTAÇÃO DE CONTAS ---
        {
          title: "Prestação de Contas",
          description: "Enviar balancetes e documentos oficiais (PDF).",
          icon: FileText,
          link: "/admin/transparencia", 
          testid: "admin-link-transparencia"
        },
        {
          title: "Gestão de Eventos",
          description: "Criar, editar e apagar campeonatos.",
          icon: CalendarDays,
          link: "/admin/eventos", 
          testid: "admin-link-eventos"
        },
        {
          title: "Gestão da Diretoria",
          description: "Cadastrar membros, cargos e gerir mandatos.",
          icon: Briefcase, 
          link: "/admin/diretoria-gestao", 
          testid: "admin-link-diretoria-gestao"
        },
        {
          title: "Inteligência (BI)",
          description: "Estatísticas, KPIs e gráficos de crescimento.",
          icon: BarChart3,
          link: "/admin/diretoria", 
          testid: "admin-link-bi"
        },
        {
          title: "Posts e Newsletters",
          description: "Lançar posts de jogos e newsletters semanais.",
          icon: Newspaper,
          link: "/admin/posts-news", 
          testid: "admin-link-posts-news"
        },
        {
          title: "Gestão de Times",
          description: "Criar, editar e gerir as equipas do campeonato.",
          icon: Shirt, 
          link: "/admin/times", 
          testid: "admin-link-times"
        },
      ];

      return (
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="pt-16"> 
            <section className="py-16 lg:py-20 bg-card">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
                   Painel de Administração
                 </h1>
                 <p className="text-xl text-muted-foreground mb-8">
                   {/* Proteção contra split de undefined aplicada conforme Navigation.tsx */}
                   Bem-vindo(a) Admin, {atleta?.nome_completo ? atleta.nome_completo.split(' ')[0] : 'ELITE'}!
                 </p>
               </div>
            </section>

            <section className="py-16 lg:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6 uppercase tracking-tight">
                  Módulos de Gestão
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminModules.map((mod) => (
                    <Link to={mod.link} key={mod.title} data-testid={mod.testid}>
                      <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer group rounded-[24px]">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                          <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                            <mod.icon className="h-6 w-6" />
                          </div>
                          <CardTitle className="text-xl font-bold">{mod.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base text-muted-foreground">{mod.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      );
    }