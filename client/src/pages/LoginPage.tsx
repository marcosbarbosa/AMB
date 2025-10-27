/* client/src/pages/LoginPage.tsx (MODIFICADO) */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { LoginForm } from '@/components/LoginForm'; // 1. Importa o nosso novo formulário

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-semibold font-accent text-foreground mb-4">
                Login do Atleta
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Acesse sua conta para atualizar seus dados e ver os eventos.
              </p>
            </div>

            {/* 2. Renderiza o formulário aqui */}
            <LoginForm />

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}