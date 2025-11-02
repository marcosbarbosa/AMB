/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 20:30
 * Versão: 1.0
 *
 * Descrição: Página placeholder para a Rede de Parceiros (/parceiros).
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function ParceirosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Rede de Parceiros AMB
             </h1>
             <p className="text-xl text-muted-foreground">
               Benefícios e descontos exclusivos para associados.
             </p>
           </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Nossos Parceiros
            </h2>
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
              <p className="text-muted-foreground">
                (Em breve, a lista de dentistas, clínicos gerais, personais trainers, 
                contadores, etc., cadastrados pelo admin, será exibida aqui.)
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}