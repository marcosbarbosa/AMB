/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 28 de outubro de 2025
 * Hora: 11:14
 * Versão: 1.2 (Adiciona Botão Editar)
 *
 * Descrição: Esqueleto da página do Painel do Associado (/painel).
 * ATUALIZADO para incluir um botão que leva à página de edição.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; // 1. Importa o Button
import { Edit } from 'lucide-react'; // Ícone para o botão

export default function PainelPage() {
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
        <p className="text-muted-foreground">A carregar dados do associado...</p> 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Painel do Associado 
             </h1>
             <p className="text-xl text-muted-foreground mb-8">
               Bem-vindo(a), {atleta.nome_completo}! 
             </p>
           </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6"> {/* Container para título e botão */}
              <h2 className="text-2xl font-semibold text-foreground">
                Informações do Cadastro
              </h2>
              {/* 2. ADICIONA O BOTÃO DE EDITAR PERFIL */}
              <Button variant="outline" asChild>
                <Link to="/painel/editar">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Link>
              </Button>
            </div>

            {/* Informações (mantidas) */}
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-4">
              <p><strong>Nome:</strong> {atleta.nome_completo}</p>
              <p><strong>Email:</strong> {atleta.email}</p>
              <p><strong>Status do Cadastro:</strong> 
                <span className={`font-medium ${
                  atleta.status_cadastro === 'aprovado' ? 'text-green-600' :
                  atleta.status_cadastro === 'rejeitado' ? 'text-red-600' :
                  'text-yellow-600' 
                }`}>
                  {atleta.status_cadastro.toUpperCase()}
                </span>
              </p>
              <p><strong>Categoria Atual (calculada):</strong> {atleta.categoria_atual || 'Não definida'}</p>
              <p><strong>Permissão:</strong> {atleta.role}</p> 
            </div>
             {/* TODO: Listar Eventos Inscritos */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}