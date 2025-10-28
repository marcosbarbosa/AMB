/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 19:27
 * Versão: 1.1 (Atualizado com dados AMB)
 *
 * Descrição: Componente de Estatísticas da página inicial.
 * ATUALIZADO para usar os números e textos oficiais da AMB.
 *
 * ==========================================================
 */

export function Stats() {
  // 1. ATUALIZA O ARRAY COM OS DADOS DA AMB
  const stats = [
    { number: '300+', label: 'Associados Atendidos' }, //
    { number: '21+', label: 'Anos de Atuação' }, // (Usei 'Atuação' em vez de só 'Anos')
    { number: '250+', label: 'Competições Realizadas' }, //
    { number: '98%', label: 'Satisfação dos Associados' }, //
  ];

  return (
    <section className="py-20 lg:py-24 bg-card border-y border-border"> {/* Mudei o fundo e adicionei bordas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center"
              data-testid={`stat-${index}`}
            >
              {/* Mantém o estilo original da IA para os números */}
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider"> {/* Deixei o texto um pouco mais estilizado */}
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}