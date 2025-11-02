/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 21:15
 * Versão: 1.0
 *
 * Descrição: Componente "Parceiros em Destaque" para a Página Inicial.
 * Busca dados do endpoint 'listar_parceiros_homepage.php' e
 * renderiza secções separadas para "Ouro" (com cards) e "Prata" (texto).
 *
 * ==========================================================
 */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card'; // P/ estilo "A Voz da Quadra"
import { Phone, Globe, Loader2, Award, Shield } from 'lucide-react'; // Ícones
import { Link } from 'react-router-dom';

// URL da nossa API (backend)
const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';

// Interface para os dados do Parceiro (baseado no JSON do backend)
interface ParceiroDestaque {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  telefone_contato: string | null;
  url_logo: string | null;
  link_site: string | null;
  partner_tier: 'ouro' | 'prata'; // Só recebe ouro ou prata
}

export function ParceirosDestaque() {
  const [parceirosOuro, setParceirosOuro] = useState<ParceiroDestaque[]>([]);
  const [parceirosPrata, setParceirosPrata] = useState<ParceiroDestaque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Efeito: Busca os parceiros da homepage ao carregar
  useEffect(() => {
    const fetchParceirosDestaque = async () => {
      setIsLoading(true);
      setErro(null);
      try {
        const response = await axios.get(API_URL);
        if (response.data.status === 'sucesso') {
          const parceiros: ParceiroDestaque[] = response.data.parceiros;

          // Separa os parceiros por nível (Ouro / Prata)
          setParceirosOuro(parceiros.filter(p => p.partner_tier === 'ouro'));
          setParceirosPrata(parceiros.filter(p => p.partner_tier === 'prata'));

        } else {
          throw new Error(response.data.mensagem || 'Erro ao buscar parceiros');
        }
      } catch (error) {
        console.error("Erro ao buscar parceiros em destaque:", error);
        setErro('Não foi possível carregar a rede de parceiros.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParceirosDestaque();
  }, []); // Executa apenas uma vez

  // Se estiver a carregar ou der erro, não mostra nada
  if (isLoading) {
    return (
      <section className="py-20 lg:py-24 bg-background text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-muted-foreground mt-2">A carregar parceiros...</p>
      </section>
    );
  }

  if (erro) {
     return (
       <section className="py-20 lg:py-24 bg-card">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <p className="text-destructive">{erro}</p>
         </div>
       </section>
     );
  }

  // Se não houver parceiros Ouro NEM Prata, não renderiza nada
  if (parceirosOuro.length === 0 && parceirosPrata.length === 0) {
    return null; // Oculta a secção inteira
  }

  return (
    <>
      {/* ========================================================== */}
      {/* SECÇÃO PARCEIROS OURO (Com Imagens/Cards)                 */}
      {/* ========================================================== */}
      {parceirosOuro.length > 0 && (
        <section className="py-20 lg:py-24 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-4">
                Parceiros Ouro
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Nossos principais apoiadores, oferecendo benefícios premium aos associados.
              </p>
            </div>

            {/* Grid estilo "A Voz da Quadra" */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parceirosOuro.map((parceiro) => (
                <Card 
                  key={parceiro.id} 
                  className="border-card-border hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  data-testid={`parceiro-ouro-${parceiro.id}`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Imagem/Logo */}
                    <div className="w-full h-40 bg-muted rounded-md mb-4 flex items-center justify-center">
                      {parceiro.url_logo ? (
                        <img src={parceiro.url_logo} alt={parceiro.nome_parceiro} className="h-full w-full object-contain p-4" />
                      ) : (
                        <span className="text-sm text-muted-foreground">Logo em breve</span>
                      )}
                    </div>
                    {/* Detalhes */}
                    <h3 className="text-xl font-semibold text-foreground mb-1">{parceiro.nome_parceiro}</h3>
                    <p className="text-sm font-medium text-primary mb-3">{parceiro.categoria}</p>
                    <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                      "{parceiro.descricao_beneficio}"
                    </p>
                    {/* Contactos */}
                    <div className="flex items-center gap-4 mt-auto text-sm text-muted-foreground">
                      {parceiro.telefone_contato && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{parceiro.telefone_contato}</span>
                        </div>
                      )}
                      {parceiro.link_site && (
                         <a href={parceiro.link_site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                           <Globe className="h-4 w-4" />
                           <span>Site</span>
                         </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================== */}
      {/* SECÇÃO PARCEIROS PRATA (Apenas Texto)                    */}
      {/* ========================================================== */}
      {parceirosPrata.length > 0 && (
        <section className="py-20 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-4">
                Parceiros Prata
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Apoiadores que fortalecem nossa comunidade com descontos e serviços.
              </p>
            </div>

            {/* Lista textual */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {parceirosPrata.map((parceiro) => (
                <div 
                  key={parceiro.id} 
                  className="border-b border-border pb-3"
                  data-testid={`parceiro-prata-${parceiro.id}`}
                >
                   <h3 className="text-lg font-semibold text-foreground">{parceiro.nome_parceiro}</h3>
                   <p className="text-sm text-muted-foreground">{parceiro.telefone_contato || parceiro.categoria}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}