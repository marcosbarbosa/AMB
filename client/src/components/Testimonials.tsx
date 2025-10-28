/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 20:23
 * Versão: 1.1 (Atualizado com tema AMB)
 *
 * Descrição: Componente de Depoimentos da página inicial.
 * ATUALIZADO para usar textos e nomes relevantes à AMB e ao
 * basquete master.
 *
 * ==========================================================
 */
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Testimonials() {
  // 1. ATUALIZA O ARRAY COM OS DEPOIMENTOS TEMÁTICOS
  const testimonials = [
    {
      name: 'Antônio Alves', //
      role: 'Associado Categoria 45+', // Adaptado de
      content: 'Voltar a jogar depois de anos parecia um sonho distante, mas a AMB me acolheu de braços abertos. Reencontrei velhos amigos, fiz novas amizades e redescobri a paixão pelo basquete. É mais que um time, é uma família!', //
      initials: 'AA', //
    },
    {
      name: 'Ricardo Costa', //
      role: 'Capitão da Equipe 50+', // Adaptado de
      content: 'A organização dos campeonatos e eventos da AMB é de primeira linha. O nível de jogo é excelente, mas o mais importante é o clima de respeito e camaradagem dentro e fora de quadra. Aqui, a competição é saudável!', //
      initials: 'RC', //
    },
    {
      name: 'Fernanda Souza', //
      role: 'Associada Categoria 35+ (Feminino)', // Adaptado de
      content: 'Entrei na AMB buscando atividade física e qualidade de vida. Encontrei muito mais: um ambiente acolhedor, incentivo constante e a alegria de competir novamente. O basquete master transformou minha rotina!', //
      initials: 'FS', //
    },
  ];

  return (
    // Mantém o estilo da IA, talvez ajustando o fundo se necessário
    <section className="py-20 lg:py-24 bg-card"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-4"
            data-testid="text-testimonials-title"
          >
            {/* 2. ATUALIZA O TÍTULO PRINCIPAL */}
            A Voz da Quadra: O Que Nossos Associados Dizem 
          </h2>
          <p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            data-testid="text-testimonials-subtitle"
          >
            {/* 3. ATUALIZA O SUBTÍTULO */}
            Experiências de quem vive o basquete master na família AMB.
          </p>
        </div>

        {/* 4. O loop e a estrutura dos Cards continuam os mesmos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-card-border hover:shadow-lg transition-shadow duration-300" // Adicionei um efeito hover
              data-testid={`card-testimonial-${index}`}
            >
              <CardContent className="p-6 flex flex-col h-full"> {/* Garante altura igual */}
                <Quote className="h-8 w-8 text-primary/30 mb-4 flex-shrink-0" />
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow"> {/* Ocupa espaço */}
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3 mt-auto flex-shrink-0"> {/* Empurra para baixo */}
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} {/* Agora mostra a categoria/função */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}