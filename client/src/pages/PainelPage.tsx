/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 17:30
 * Versão: 1.0
 *
 * Descrição: Esqueleto da página do Painel do Atleta (/painel).
 * Esta página será o dashboard do utilizador logado.
 * Inclui uma verificação básica de autenticação.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; // Importa o nosso "cérebro"
import { useEffect } from 'react';
// Importa o 'useNavigate' para redirecionamento
import { useNavigate } from 'react-router-dom'; 

export default function PainelPage() {
  // 1. Lê o estado do "cérebro"
  const { isAuthenticated, atleta } = useAuth();
  const navigate = useNavigate(); // Hook para redirecionar

  // 2. Efeito: Verifica se o utilizador está logado QUANDO a página carrega
  useEffect(() => {
    // Se NÃO estiver autenticado, redireciona para a página de Login
    if (!isAuthenticated) {
      console.log("Utilizador não autenticado. Redirecionando para /login...");
      navigate('/login'); 
    }
  }, [isAuthenticated, navigate]); // Dependências: re-executa se mudar

  // 3. Se ainda não carregou os dados ou está a redirecionar, mostra "A carregar..."
  if (!isAuthenticated || !atleta) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">A carregar dados do atleta...</p>
      </div>
    );
  }

  // 4. Se chegou aqui, o utilizador ESTÁ logado. Mostra o conteúdo.
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> {/* pt-16 é para dar espaço para o Header fixo */}
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Painel do Atleta
             </h1>
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
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-4">
              <p><strong>Nome:</strong> {atleta.nome_completo}</p>
              <p><strong>Email:</strong> {atleta.email}</p>
              <p><strong>Status do Cadastro:</strong> 
                <span className={`font-medium ${
                  atleta.status_cadastro === 'aprovado' ? 'text-green-600' :
                  atleta.status_cadastro === 'rejeitado' ? 'text-red-600' :
                  'text-yellow-600' // pendente
                }`}>
                  {atleta.status_cadastro.toUpperCase()}
                </span>
              </p>
              <p><strong>Categoria Atual (calculada):</strong> {atleta.categoria_atual || 'Não definida'}</p>
              <p><strong>Permissão:</strong> {atleta.role}</p>

              {/* TODO: Adicionar botão para Editar Perfil (RF-ATL-004) */}
              {/* TODO: Listar Eventos Inscritos */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}