/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 10 de Janeiro de 2026
 * Versão: 3.0 (Arquitetura Separada)
 * Tarefa: 305 - Refatoração de UI/UX
 *
 * Descrição: Painel Administrativo Principal (/admin/painel).
 * ATUALIZADO: Separação dos módulos de "Gestão de Diretoria" e "BI".
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
// 1. ADICIONADO: Ícone 'Briefcase' para a gestão administrativa
import { Loader2, Users, Handshake, CalendarDays, Newspaper, BarChart3, Edit3, Shirt, Briefcase } from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; 
import { toast } from '@/hooks/use-toast';

export default function AdminPainelPage() {
  const { isAuthenticated, atleta, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 

  // Efeito de Segurança (Mantido)
  useEffect(() => {
    if (isAuthLoading) return; 

    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

  // Estado de Carregamento
  if (isAuthLoading || !atleta) {
     return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar painel...</p>
      </div>
    );
  }

  if (atleta.role !== 'admin') {
     return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Lista de Módulos de Gestão (Refatorada para Separação de Conceitos)
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
      title: "Gestão de Eventos",
      description: "Criar, editar e apagar campeonatos.",
      icon: CalendarDays,
      link: "/admin/eventos", 
      testid: "admin-link-eventos"
    },
    // --- NOVO: MÓDULO OPERACIONAL (CADASTRO) ---
    {
      title: "Gestão da Diretoria",
      description: "Cadastrar membros, cargos e gerir mandatos.",
      icon: Briefcase, 
      link: "/admin/diretoria-gestao", // Rota para a página de gestão
      testid: "admin-link-diretoria-gestao"
    },
    // --- NOVO: MÓDULO ESTRATÉGICO (BI) ---
    {
      title: "Inteligência (BI)",
      description: "Estatísticas, KPIs e gráficos de crescimento.",
      icon: BarChart3,
      link: "/admin/diretoria", // Rota para a página de gráficos
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
      title: "Gerir Categorias",
      description: "Adicionar ou modificar categorias de idade.",
      icon: Edit3,
      link: "/admin/categorias", 
      testid: "admin-link-categorias"
    },
    {
      title: "Gestão de Times",
      description: "Criar, editar e gerir as equipas do campeonato.",
      icon: Shirt, 
      link: "/admin/times", 
      testid: "admin-link-times"
    },
  ];

  // Renderização
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        {/* Secção Título */}
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Painel de Administração
             </h1>
             <p className="text-xl text-muted-foreground mb-8">
               Bem-vindo(a) Admin, {atleta.nome_completo.split(' ')[0]}!
             </p>
           </div>
        </section>

        {/* Secção Menu (Dashboard) */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Módulos de Gestão
            </h2>

            {/* Grid com os links para os módulos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminModules.map((mod) => (
                <Link to={mod.link} key={mod.title} data-testid={mod.testid}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <mod.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{mod.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{mod.description}</CardDescription>
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