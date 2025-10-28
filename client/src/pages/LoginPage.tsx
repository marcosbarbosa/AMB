/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:12
 * Versão: 1.1 (Refatoração de Terminologia)
 *
 * Descrição: Página de Login do Associado (/login).
 * ATUALIZADO para usar a terminologia "Associado".
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { LoginForm } from '@/components/LoginForm'; 

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              {/* 1. ATUALIZA O TÍTULO */}
              <h1 className="text-4xl font-semibold font-accent text-foreground mb-4">
                Login do Associado 
              </h1>
              {/* 2. ATUALIZA O SUBTÍTULO */}
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Acesse sua conta para atualizar seus dados e ver os eventos.
              </p>
            </div>
            <LoginForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}