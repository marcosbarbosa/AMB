/*
 * ==========================================================
 * PÁGINA: SobrePage.tsx
 * Descrição: Página institucional completa (História + Estatuto + Diretoria)
 * ==========================================================
 */

import { useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { DiretoriaPremium } from '@/components/DiretoriaPremium';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, Trophy, Globe, Target } from 'lucide-react';

export default function SobrePage() {

  // Rola para o topo ao abrir a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const estatutoUrl = "https://www.ambamazonas.com.br/uploads/docs-oficiais/NOVOESTATUTOAMB-AM.pdf";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      <main className="flex-grow pt-16">

        {/* --- HERO SECTION --- */}
        <section className="relative bg-slate-900 py-20 lg:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge variant="outline" className="mb-6 text-yellow-400 border-yellow-500/50 px-4 py-1 tracking-widest uppercase text-xs font-bold bg-yellow-500/10 backdrop-blur-sm">
              Institucional
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Nossa Trajetória de <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Paixão pelo Basquete</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Desde 2004, a AMB Amazonas trabalha para manter viva a chama do esporte, promovendo saúde, competição e amizade entre gerações.
            </p>
          </div>
        </section>

        {/* --- CONTEÚDO HISTÓRICO --- */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-12">

              {/* Coluna Principal (Texto) */}
              <div className="lg:col-span-8 space-y-8">
                <div className="prose prose-lg text-slate-600 max-w-none">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-blue-600" /> A Fundação
                  </h3>
                  <p>
                    A <strong>Associação Master de Basquetebol do Amazonas (AMB)</strong> foi fundada em 20 de outubro de 2004, na cidade de Manaus. Nascemos do desejo de ex-atletas e entusiastas de não apenas relembrar o passado, mas de continuar escrevendo a história do basquete amazonense.
                  </p>
                  <p>
                    Como entidade civil de direito privado e sem fins lucrativos, nossa missão sempre foi clara: difundir e incentivar a prática do Basquetebol na categoria master, atendendo atletas a partir dos 30 anos de idade.
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-12">
                    <Globe className="h-6 w-6 text-blue-600" /> Afiliações e Reconhecimento
                  </h3>
                  <p>
                    A AMB orgulha-se de ser filiada à <strong>FBBM (Federação Brasileira de Basquetebol Master)</strong> e, por extensão, à <strong>FIMBA (International Maxibasketball Federation)</strong>. Isso nos conecta a uma rede global de atletas e permite que o Amazonas seja representado em competições nacionais e mundiais.
                  </p>
                  <p>
                    Somos reconhecidos como entidade de administração do desporto, integrando o Sistema Nacional do Desporto conforme a legislação vigente.
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mt-12">
                    <Target className="h-6 w-6 text-blue-600" /> Nossos Objetivos
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Promover o intercâmbio social e esportivo entre os associados.</li>
                    <li>Organizar campeonatos estaduais de alto nível técnico.</li>
                    <li>Incentivar hábitos saudáveis e a longevidade através do esporte.</li>
                    <li>Representar o Amazonas com excelência em torneios fora do estado.</li>
                  </ul>
                </div>
              </div>

              {/* Coluna Lateral (Estatuto e Destaques) */}
              <div className="lg:col-span-4 space-y-8">

                {/* Card Estatuto */}
                <Card className="bg-blue-50 border-blue-100 shadow-lg sticky top-24">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                      <FileText className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Estatuto Social</h3>
                    <p className="text-sm text-slate-600 mb-6">
                      Transparência é nosso compromisso. Acesse o documento oficial que rege nossa associação.
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => window.open(estatutoUrl, '_blank')}>
                        <FileText className="mr-2 h-4 w-4" /> Ler Online
                      </Button>
                      <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-100" onClick={() => window.open(estatutoUrl, '_blank')}>
                        <Download className="mr-2 h-4 w-4" /> Baixar PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Card Conquistas (Decorativo) */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                   <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Trophy className="h-5 w-5 text-yellow-500" /> Legado
                   </h4>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Fundação</span>
                        <span className="font-bold text-slate-900">2004</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Sede</span>
                        <span className="font-bold text-slate-900">Manaus - AM</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Categoria</span>
                        <span className="font-bold text-slate-900">Master (30+)</span>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* --- DIRETORIA (Reutilizando Componente) --- */}
        <div className="border-t border-slate-200">
           <DiretoriaPremium />
        </div>

      </main>
      <Footer />
    </div>
  );
}