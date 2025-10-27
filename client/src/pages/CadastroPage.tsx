/* client/src/pages/CadastroPage.tsx (MODIFICADO) */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CadastroForm } from '@/components/CadastroForm'; // 1. Importa o nosso novo formulário

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-semibold font-accent text-foreground mb-4">
                Cadastro de Atleta
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Preencha a ficha abaixo para se associar. O seu cadastro 
                ficará "pendente" até a aprovação da administração.
              </p>
            </div>

            {/* 2. Renderiza o formulário aqui */}
            <CadastroForm />

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}