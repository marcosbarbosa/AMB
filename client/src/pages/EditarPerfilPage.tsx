/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 28 de outubro de 2025
 * Hora: 11:30
 * Versão: 1.1 (Integra Formulário)
 *
 * Descrição: Página de Edição de Perfil do Associado (/painel/editar).
 * ATUALIZADO para importar e renderizar o EditarPerfilForm.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { ArrowLeft } from 'lucide-react'; 

// 1. IMPORTA O NOVO FORMULÁRIO DE EDIÇÃO
import { EditarPerfilForm } from '@/components/EditarPerfilForm'; 

export default function EditarPerfilPage() {
  const { isAuthenticated, atleta } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); 
    }
  }, [isAuthenticated, navigate]); 

  if (!isAuthenticated || !atleta) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">A carregar...</p> 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"> 
            <Link 
              to="/painel" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Painel
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
                Editar Perfil
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Atualize suas informações de contato e dados pessoais. 
                <span className="block text-sm mt-2">(Email e CPF não podem ser alterados.)</span>
              </p>
            </div>

            {/* 2. RENDERIZA O FORMULÁRIO AQUI */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <EditarPerfilForm />
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}