import { Briefcase, Users, TrendingUp, Settings, Shield, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function Services() {
  const services = [
    {
      icon: Briefcase,
      title: 'Consultoria Estratégica',
      description: 'Desenvolvemos estratégias personalizadas para impulsionar o crescimento e a competitividade da sua organização no mercado.',
    },
    {
      icon: Users,
      title: 'Gestão de Recursos',
      description: 'Otimizamos a gestão de recursos humanos e materiais para maximizar a eficiência operacional e reduzir custos.',
    },
    {
      icon: TrendingUp,
      title: 'Análise de Performance',
      description: 'Análises detalhadas e indicadores precisos para embasar decisões estratégicas e monitorar resultados.',
    },
    {
      icon: Settings,
      title: 'Processos e Automação',
      description: 'Implementamos processos eficientes e soluções de automação para aumentar produtividade e qualidade.',
    },
    {
      icon: Shield,
      title: 'Compliance e Governança',
      description: 'Garantimos conformidade regulatória e boas práticas de governança corporativa em todas as operações.',
    },
    {
      icon: Zap,
      title: 'Transformação Digital',
      description: 'Conduzimos sua organização na jornada de transformação digital com tecnologia e inovação.',
    },
  ];

  return (
    <section id="servicos" className="py-20 lg:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-4"
            data-testid="text-services-title"
          >
            Nossos Serviços
          </h2>
          <p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            data-testid="text-services-subtitle"
          >
            Soluções completas e integradas para atender todas as necessidades 
            da sua organização com qualidade e eficiência.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="border-card-border hover-elevate transition-all duration-300 hover:-translate-y-1"
              data-testid={`card-service-${index}`}
            >
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-4">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
