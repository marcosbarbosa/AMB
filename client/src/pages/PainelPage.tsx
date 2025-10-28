/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:14
 * Versão: 1.1 (Refatoração de Terminologia)
 *
 * Descrição: Esqueleto da página do Painel do Associado (/painel).
 * ATUALIZADO para usar a terminologia "Associado".
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

export default function PainelPage() {
  // 1. O AuthContext ainda usa 'atleta' internamente, mas a UI usará 'Associado'
  const { isAuthenticated, atleta } = useAuth(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Associado não autenticado. Redirecionando para /login..."); // Log atualizado
      navigate('/login'); 
    }
  }, [isAuthenticated, navigate]); 

  // Mostra "A carregar..." se não autenticado ou dados não carregados
  if (!isAuthenticated || !atleta) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">A carregar dados do associado...</p> {/* Texto atualizado */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             {/* 2. ATUALIZA O TÍTULO */}
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Painel do Associado 
             </h1>
             {/* 3. ATUALIZA A SAUDAÇÃO */}
             <p className="text-xl text-muted-foreground mb-8">
               Bem-vindo(a), {atleta.nome_completo}! 
             </p>
           </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Informações do Cadastro
            </h2>
            {/* 4. Os dados ('atleta.') vêm do backend/AuthContext, mas os labels podem mudar se necessário */}
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
              <p><strong>Permissão:</strong> {atleta.role}</p> {/* Mantém 'role' técnico */}

              {/* TODO: Adicionar botão para Editar Perfil */}
              {/* TODO: Listar Eventos Inscritos */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}