/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:05
 * Versão: 1.1 (Refatoração de Terminologia)
 *
 * Descrição: Página de Cadastro de Associado (/cadastro).
 * ATUALIZADO para usar a terminologia "Associado".
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CadastroForm } from '@/components/CadastroForm'; 

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              {/* 1. ATUALIZA O TÍTULO */}
              <h1 className="text-4xl font-semibold font-accent text-foreground mb-4">
                Cadastro de Associado 
              </h1>
              {/* 2. ATUALIZA O SUBTÍTULO */}
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Preencha a ficha abaixo para se associar. O seu cadastro 
                ficará "pendente" até a aprovação da administração.
              </p>
            </div>
            <CadastroForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}