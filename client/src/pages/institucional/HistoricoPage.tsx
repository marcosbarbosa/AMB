import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Users, Star } from "lucide-react";

const marcos = [
  {
    ano: "2015",
    titulo: "Fundação da AMB",
    descricao: "Criação oficial da Associação Amazonense Master de Basquetebol, reunindo atletas veteranos apaixonados pelo esporte.",
    icone: Star,
  },
  {
    ano: "2016",
    titulo: "Primeiro Campeonato",
    descricao: "Realização do primeiro Campeonato Amazonense Master de Basquetebol com participação de 8 equipes.",
    icone: Trophy,
  },
  {
    ano: "2018",
    titulo: "Expansão Regional",
    descricao: "Ampliação das atividades com participação em competições regionais e intercâmbio com associações de outros estados.",
    icone: Users,
  },
  {
    ano: "2020",
    titulo: "Adaptação Digital",
    descricao: "Implementação de sistemas digitais para gestão de associados e eventos durante o período de pandemia.",
    icone: Calendar,
  },
  {
    ano: "2022",
    titulo: "Reconhecimento FBBM",
    descricao: "Filiação oficial à Federação Brasileira de Basketball Master (FBBM), consolidando a representatividade estadual.",
    icone: Trophy,
  },
  {
    ano: "2024",
    titulo: "Nova Era Digital",
    descricao: "Lançamento do novo portal institucional com área do associado, sistema de eleições e transparência.",
    icone: Star,
  },
];

export default function HistoricoPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossa História</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Conheça a trajetória da Associação Amazonense Master de Basquetebol
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-border" />
              
              <div className="space-y-12">
                {marcos.map((marco, index) => {
                  const Icon = marco.icone;
                  const isLeft = index % 2 === 0;
                  
                  return (
                    <div
                      key={marco.ano}
                      className={`relative flex items-center ${
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-10">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>

                      <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"} pl-12 md:pl-0`}>
                        <Card className="hover-elevate">
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{marco.ano}</Badge>
                            </div>
                            <CardTitle className="text-lg">{marco.titulo}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">{marco.descricao}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Nosso Legado</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">9+</div>
                <p className="text-muted-foreground text-sm">Anos de História</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">200+</div>
                <p className="text-muted-foreground text-sm">Associados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground text-sm">Eventos Realizados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <p className="text-muted-foreground text-sm">Equipes Ativas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
