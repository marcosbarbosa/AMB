import { Target, Eye, Award } from 'lucide-react';
import aboutImage from '@assets/generated_images/About_section_office_space_b80c1f58.png';

export function About() {
  const values = [
    {
      icon: Target,
      title: 'Nossa Missão',
      description: 'Entregar soluções institucionais de excelência que impulsionam o crescimento e a transformação das organizações que atendemos.',
    },
    {
      icon: Eye,
      title: 'Nossa Visão',
      description: 'Ser referência nacional em soluções institucionais, reconhecidos pela qualidade, inovação e compromisso com resultados sustentáveis.',
    },
    {
      icon: Award,
      title: 'Nossos Valores',
      description: 'Integridade, excelência, inovação e compromisso com o sucesso de nossos clientes guiam cada decisão e ação.',
    },
  ];

  return (
    <section id="sobre" className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 
              className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-6"
              data-testid="text-about-title"
            >
              Quem Somos
            </h2>
            <p 
              className="text-lg text-muted-foreground leading-relaxed mb-8"
              data-testid="text-about-description"
            >
              O AMB Portal é uma organização dedicada a fornecer soluções institucionais 
              de alta qualidade para empresas que buscam excelência operacional e crescimento 
              sustentável. Com anos de experiência no mercado, nossa equipe de especialistas 
              trabalha incansavelmente para entregar resultados que superam expectativas.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Acreditamos que cada organização tem um potencial único, e nossa missão é 
              desbloquear esse potencial através de estratégias personalizadas, 
              tecnologia de ponta e um compromisso inabalável com a excelência.
            </p>
          </div>

          <div className="relative">
            <img 
              src={aboutImage} 
              alt="Escritório moderno AMB Portal" 
              className="rounded-md w-full h-auto shadow-lg"
              data-testid="img-about"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="text-center p-6"
              data-testid={`card-value-${index}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-md bg-primary/10 text-primary mb-4">
                <value.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
