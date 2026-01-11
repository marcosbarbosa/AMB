/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Componente: About.tsx
 * Versão: 2.0 (Texto Restaurado + Diretoria Premium)
 * Descrição: Secção completa "Quem Somos" com texto integral
 * e galeria de diretoria ao final.
 *
 * ==========================================================
 */
import { Users, Trophy, HeartHandshake, MapPin } from 'lucide-react'; 
import { DiretoriaPremium } from '@/components/DiretoriaPremium'; // Importação do componente premium

export function About() {
  const destaquesAMB = [
    {
      icon: HeartHandshake, 
      title: 'Desenvolvimento e Integração',
      description: 'Proporcionamos atividades esportivas, sociais e culturais, visando o desenvolvimento integral dos associados e o retorno de antigos jogadores.',
    },
    {
      icon: Trophy, 
      title: 'Competição e Afiliação',
      description: 'Organizamos eventos e incentivamos a participação em competições regionais, nacionais e internacionais, filiando-nos a entidades do Sistema Nacional do Desporto.',
    },
    {
      icon: Users, 
      title: 'Foco na Categoria Master',
      description: 'Difundimos e incentivamos a prática do Basquetebol Master (30+ anos, masculino e feminino), promovendo o espírito associativo nesta categoria.',
    },
  ];

  // Link para o Google Maps
  const googleMapsUrl = 'https://www.google.com/maps/place/Manaus,+AM'; 

  return (
    <>
      <section id="sobre" className="py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* --- COLUNA DE TEXTO (RESTAURADA) --- */}
            <div>
              <h2 
                className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-6"
                data-testid="text-about-title"
              >
                Quem Somos
              </h2>

              <p 
                className="text-lg text-muted-foreground leading-relaxed mb-6"
                data-testid="text-about-description"
              >
                A <strong>Associação Master de Basquetebol do Amazonas (AMB)</strong> é uma entidade civil sem fins lucrativos, fundada em 20 de outubro de 2004 na cidade de Manaus. Temos como finalidade difundir e incentivar a prática do Basquetebol na categoria master (atletas a partir de 30 anos).
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Buscamos proporcionar aos nossos associados atividades esportivas, sociais e culturais que visam o desenvolvimento físico, cognitivo, emocional e sociocultural, promovendo a integração e o retorno de antigos jogadores à modalidade.
              </p>

               <p className="text-lg text-muted-foreground leading-relaxed">
                Como entidade afiliada à FBBM e, por consequência, à FIMBA, organizamos eventos, promovemos intercâmbios e incentivamos a participação em competições em todos os níveis.
              </p>
            </div>

            {/* --- COLUNA DO MAPA --- */}
            <div className="relative">
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block group"
                data-testid="link-maps-about"
              >
                <div className="rounded-md w-full h-96 bg-muted flex items-center justify-center shadow-lg border border-border group-hover:border-primary group-hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                   {/* Dica visual de mapa */}
                   <div className="absolute inset-0 bg-slate-200 opacity-20 group-hover:opacity-10 transition-opacity"></div>

                   <div className="z-10 flex flex-col items-center">
                       <MapPin className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                       <p className="text-muted-foreground text-sm group-hover:text-primary transition-colors font-medium">
                         Sede da AMB - Manaus/AM <br/>(Clique para ver no mapa)
                       </p>
                   </div>
                </div>
              </a>
            </div>
          </div>

          {/* --- SECÇÃO DE DESTAQUES --- */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {destaquesAMB.map((destaque, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow"
                data-testid={`card-destaque-${index}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <destaque.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {destaque.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {destaque.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NOVA GALERIA PREMIUM DA DIRETORIA --- */}
      <DiretoriaPremium />
    </>
  );
}