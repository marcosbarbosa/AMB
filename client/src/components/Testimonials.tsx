import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Ana Silva',
      role: 'CEO, TechCorp',
      content: 'O AMB Portal transformou completamente nossa operação. A consultoria estratégica foi fundamental para nosso crescimento de 40% no último ano.',
      initials: 'AS',
    },
    {
      name: 'Carlos Mendes',
      role: 'Diretor, GlobalServ',
      content: 'Profissionalismo e excelência definem o trabalho do AMB Portal. Superaram nossas expectativas em todos os aspectos do projeto.',
      initials: 'CM',
    },
    {
      name: 'Mariana Costa',
      role: 'Gestora, InovaSolutions',
      content: 'A expertise da equipe AMB Portal em transformação digital nos ajudou a modernizar processos e aumentar significativamente nossa produtividade.',
      initials: 'MC',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-4"
            data-testid="text-testimonials-title"
          >
            O Que Nossos Clientes Dizem
          </h2>
          <p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            data-testid="text-testimonials-subtitle"
          >
            Depoimentos de organizações que confiaram em nossas soluções
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="border-card-border"
              data-testid={`card-testimonial-${index}`}
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
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
                      {testimonial.role}
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
