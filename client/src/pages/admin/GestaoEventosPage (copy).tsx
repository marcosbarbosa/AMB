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
 * Versão: 1.0
 * Tarefa: 264 (Módulo 27 - Refatoração)
 *
 * Descrição: Esqueleto da página dedicada à Gestão de Eventos.
 * (/admin/eventos).
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { Loader2, ArrowLeft } from 'lucide-react'; 
import { toast } from '@/hooks/use-toast';

export default function GestaoEventosPage() {
  const { isAuthenticated, atleta, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 

  // Efeito de Segurança (Verifica se é Admin)
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (isAuthenticated && atleta?.role !== 'admin')) {
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
    }
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast]); 

  if (isAuthLoading || !atleta || atleta.role !== 'admin') {
     return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  // Renderização
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Link para Voltar */}
            <div className="mb-8">
              <Link 
                to="/admin/painel" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Painel de Administração
              </Link>
            </div>

            <h1 className="text-3xl font-semibold font-accent text-foreground mb-6">
              Gestão de Eventos
            </h1>

            {/* Placeholder */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <p className="text-muted-foreground">
                (O CRUD de eventos será movido e expandido para esta página no Módulo 29.)
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}