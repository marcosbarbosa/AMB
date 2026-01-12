/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 * Componente: About.tsx
 * Versão: 3.7 (Correção: URL do Mapa Padrão Google)
 * ==========================================================
 */

import { Users, Trophy, HeartHandshake, MapPin, ArrowRight } from 'lucide-react'; 
import { DiretoriaPremium } from '@/components/DiretoriaPremium'; 
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function About() {
  const destaquesAMB = [
    {
      icon: HeartHandshake, 
      title: 'Integração Social',
      description: 'Promovemos atividades que visam o desenvolvimento integral e o retorno de antigos jogadores às quadras.',
    },
    {
      icon: Trophy, 
      title: 'Espírito Competitivo',
      description: 'Incentivamos a participação em competições regionais e internacionais, filiados ao Sistema Nacional do Desporto.',
    },
    {
      icon: Users, 
      title: 'Categoria Master',
      description: 'Foco total na difusão do Basquetebol para atletas 30+, fortalecendo a amizade e a saúde.',
    },
  ];

  /* CONFIGURAÇÃO DE LINKS
     1. Mapa: R. Washington Luís, 111 - Dom Pedro
     2. Estatuto: PDF na pasta docs-oficiais
  */

  // Mapa (Link direto e seguro do Google Maps Embed)
  // Usando encodeURIComponent para garantir que espaços e acentos não quebrem o mapa
  const ENDERECO = "R. Washington Luís, 111 - Dom Pedro, Manaus - AM, 69040-210";
  const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(ENDERECO)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const MAP_EXTERNAL_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO)}`;

  // Estatuto (PDF)
  const ESTATUTO_URL = "https://www.ambamazonas.com.br/uploads/docs-oficiais/NOVOESTATUTOAMB-AM.pdf";

  return (
    <>
      <section id="sobre" className="py-20 lg:py-24 bg-slate-50 relative overflow-hidden">
        {/* Elemento Decorativo de Fundo */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-32 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* --- COLUNA DE TEXTO --- */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-3 py-1 text-xs uppercase tracking-wider font-bold">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse mr-2" />
                   Institucional
                </Badge>
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                A História da <br/>
                <span className="text-blue-700">AMB Amazonas</span>
              </h2>

              <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                <p>
                  A <strong>Associação Master de Basquetebol do Amazonas (AMB)</strong> é uma entidade civil sem fins lucrativos, fundada em 20 de outubro de 2004 em Manaus.
                </p>
                <p>
                  Nossa missão vai além das quadras: buscamos proporcionar saúde, bem-estar e o reencontro de amigos através do esporte, focando especialmente na categoria <strong>Master (30+)</strong>.
                </p>
                <p>
                  Como entidade afiliada à FBBM e FIMBA, levamos o nome do Amazonas para competições em todo o mundo.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">

                 {/* BOTÃO NOSSA HISTÓRIA (COMENTADO)
                 <Button className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-900/20 h-12 px-8 text-md">
                   Nossa História
                 </Button>
                 */}

                 {/* BOTÃO ESTATUTO */}
                 <Button 
                    variant="outline" 
                    className="border-slate-300 text-slate-700 hover:bg-white hover:text-blue-700 h-12 px-8 text-md"
                    onClick={() => window.open(ESTATUTO_URL, '_blank')}
                 >
                   Ver Estatuto <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </div>
            </div>

            {/* --- COLUNA DO MAPA (CORRIGIDA) --- */}
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-yellow-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

              <Card className="relative p-2 bg-white border-slate-200 shadow-2xl rounded-2xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">
                 <div className="relative w-full h-[450px] bg-slate-100 rounded-xl overflow-hidden">

                    {/* IFRAME GOOGLE MAPS */}
                    <iframe 
                      src={MAP_EMBED_URL}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                      title="Mapa Sede AMB"
                    ></iframe>

                    {/* Card Flutuante Sobre o Mapa */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">CCA Dom Pedro</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                                R. Washington Luís, 111 - Dom Pedro<br/>
                                Manaus - AM
                            </p>
                        </div>
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="ml-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50 shrink-0 text-xs" 
                            onClick={() => window.open(MAP_EXTERNAL_LINK, '_blank')}
                        >
                            Abrir
                        </Button>
                    </div>

                 </div>
              </Card>
            </div>
          </div>

          {/* --- DESTAQUES --- */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {destaquesAMB.map((destaque, index) => (
              <div 
                key={index} 
                className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <destaque.icon className="h-24 w-24 text-blue-600 transform rotate-12" />
                </div>

                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <destaque.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                  {destaque.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {destaque.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MANTIDO: GALERIA DA DIRETORIA --- */}
      <DiretoriaPremium />
    </>
  );
}