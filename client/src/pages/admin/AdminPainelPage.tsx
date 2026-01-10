/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 2 de novembro de 2025
 * Hora: 23:05
 * Versão: 2.3 (Adiciona Módulo de Times)
 * Tarefa: 266-B
 *
 * Descrição: Página principal do Painel de Admin (/admin/painel).
 * ATUALIZADO: Correção de link de parceiros e adição de botão de Times.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
// ADICIONEI "Shirt" AQUI NAS IMPORTAÇÕES PARA O ÍCONE DOS TIMES
import { Loader2, Users, Handshake, CalendarDays, Newspaper, BarChart3, Edit3, Shirt } from 'lucide-react'; 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; 
import { toast } from '@/hooks/use-toast';

export default function AdminPainelPage() {
  const { isAuthenticated, atleta, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 

  // Efeito de Segurança (Mantido)
  useEffect(() => {
    if (isAuthLoading) return; // Espera o "cérebro" carregar

    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

  // Estado de Carregamento (Mantido)
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

  // Lista de Módulos de Gestão (Atualizada)
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
      // CORRIGIDO: O link agora aponta para a rota certa de parceiros
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
    {
      title: "Diretoria e Contagem (BI)",
      description: "Gerir membros da diretoria e ver estatísticas de acesso (Módulos 31/32).",
      icon: BarChart3,
      link: "/admin/diretoria-stats", 
      testid: "admin-link-diretoria-stats"
    },
    {
      title: "Posts e Newsletters",
      description: "Lançar posts de jogos (Placar) e newsletters semanais (Módulo 29/30).",
      icon: Newspaper,
      link: "/admin/posts-news", 
      testid: "admin-link-posts-news"
    },
    {
      title: "Gerir Categorias",
      description: "Adicionar ou modificar categorias de idade (Ex: 60+).",
      icon: Edit3,
      link: "/admin/categorias", 
      testid: "admin-link-categorias"
    },
    // NOVO MÓDULO ADICIONADO AQUI
    {
      title: "Gestão de Times",
      description: "Criar, editar e gerir as equipas do campeonato.",
      icon: Shirt, // Ícone de camisa
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

            {/* Grid com os links para as novas páginas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminModules.map((mod) => (
                <Link to={mod.link} key={mod.title} data-testid={mod.testid}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300">
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