/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 19:15
 * Versão: 1.2 (Atualizado com texto do Estatuto AMB)
 *
 * Descrição: Componente "Sobre Nós" da página inicial.
 * ATUALIZADO para usar o texto oficial da AMB, derivado do estatuto.
 *
 * ==========================================================
 */
// 1. Mantém ícones relevantes
import { Users, Trophy, HeartHandshake, MapPin } from 'lucide-react'; 
// import ambBasqueteImage from '@/assets/imagem-basquete-amb.jpg'; // TODO: Adicionar imagem AMB

export function About() {
  // 2. Adapta os "destaques" com base nos objetivos do estatuto
  const destaquesAMB = [
    {
      icon: HeartHandshake, // Ícone de Comunidade/Desenvolvimento
      title: 'Desenvolvimento e Integração',
      description: 'Proporcionamos atividades esportivas, sociais e culturais, visando o desenvolvimento integral dos associados e o retorno de antigos jogadores.',
    },
    {
      icon: Trophy, // Ícone de Troféu/Competição
      title: 'Competição e Afiliação',
      description: 'Organizamos eventos e incentivamos a participação em competições regionais, nacionais e internacionais, filiando-nos a entidades do Sistema Nacional do Desporto.',
    },
    {
      icon: Users, // Ícone de Pessoas/Master
      title: 'Foco na Categoria Master',
      description: 'Difundimos e incentivamos a prática do Basquetebol Master (30+ anos, masculino e feminino), promovendo o espírito associativo nesta categoria.',
    },
  ];

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
            {/* 3. SUBSTITUI O TEXTO ANTERIOR PELO TEXTO ADAPTADO DO ESTATUTO */}
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
            {/* TODO: Adicionar botão "Ver Estatuto Completo"? */}
          </div>

          {/* Coluna da Imagem */}
          <div className="relative">
            {/* 4. Mantém o Placeholder por agora */}
            <div className="rounded-md w-full h-96 bg-muted flex items-center justify-center shadow-lg border border-border">
               <MapPin className="h-16 w-16 text-muted-foreground" />
               <p className="absolute bottom-4 text-muted-foreground text-sm">Sede da AMB - Manaus/AM</p>
            </div>
             {/* Se tiver a imagem real, use:
             <img 
               src={ambBasqueteImage} 
               alt="Equipe de Basquete Master AMB" 
               className="rounded-md w-full h-auto shadow-lg"
               data-testid="img-about-amb"
             /> 
             */}
          </div>
        </div>

        {/* 5. Renderiza os destaques adaptados */}
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