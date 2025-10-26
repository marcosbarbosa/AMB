export function Stats() {
  const stats = [
    { number: '100+', label: 'Clientes Atendidos' },
    { number: '15+', label: 'Anos de Experiência' },
    { number: '250+', label: 'Projetos Concluídos' },
    { number: '98%', label: 'Satisfação dos Clientes' },
  ];

  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
