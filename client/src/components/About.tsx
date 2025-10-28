/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 22:18
 * Versão: 1.3 (Adicionado Link do Mapa)
 *
 * Descrição: Componente "Sobre Nós" da página inicial.
 * ATUALIZADO para adicionar um link do Google Maps ao
 * placeholder da imagem.
 *
 * ==========================================================
 */
import { Users, Trophy, HeartHandshake, MapPin } from 'lucide-react'; 
// import ambBasqueteImage from '@/assets/imagem-basquete-amb.jpg'; // TODO: Adicionar imagem AMB

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

  // 1. DEFINE O LINK DO GOOGLE MAPS PARA A IMAGEM
  const googleMapsUrl = 'https://maps.app.goo.gl/frXkwoWpxBpaSHSx8'; //

  return (
    <section id="sobre" className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Coluna de Texto */}
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
              A <strong>Associação Master de Baquetebol do Amazonas (AMB)</strong> é uma entidade civil sem fins lucrativos, fundada em 20 de outubro de 2004 na cidade de Manaus. Temos como finalidade difundir e incentivar a prática do Basquetebol na categoria master (atletas a partir de 30 anos).
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Buscamos proporcionar aos nossos associados atividades esportivas, sociais e culturais que visam o desenvolvimento físico, cognitivo, emocional e sociocultural, promovendo a integração e o retorno de antigos jogadores à modalidade.
            </p>
             <p className="text-lg text-muted-foreground leading-relaxed">
              Como entidade afiliada à FBBM e, por consequência, à FIMBA, organizamos eventos, promovemos intercâmbios e incentivamos a participação em competições em todos os níveis.
            </p>
          </div>

          {/* Coluna da Imagem (Agora com Link) */}
          <div className="relative">
            {/* 2. ADICIONA O LINK `<a>` ENVOLVENDO O PLACEHOLDER */}
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group" // Adiciona 'group' para hover
              data-testid="link-maps-about"
            >
              <div className="rounded-md w-full h-96 bg-muted flex items-center justify-center shadow-lg border border-border group-hover:border-primary group-hover:shadow-xl transition-all duration-300"> {/* Efeito hover */}
                 <MapPin className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors" />
                 <p className="absolute bottom-4 text-muted-foreground text-sm group-hover:text-primary transition-colors">
                   Sede da AMB - Manaus/AM (Clique para ver no mapa) {/* */}
                 </p>
              </div>
            </a>
             {/* Se tiver a imagem real, envolva o <img> com o <a> */}
          </div>
        </div>

        {/* Secção de Destaques (Mantida) */}
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
  );
}