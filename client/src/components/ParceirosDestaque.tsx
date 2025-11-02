/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 2 de novembro de 2025
 * Hora: 08:20
 * Versão: 1.2 (Refina UI dos Parceiros - Insight)
 * Tarefa: 256 (Módulo 28)
 *
 * Descrição: Componente "Parceiros em Destaque" para a Página Inicial.
 * ATUALIZADO para remover os títulos de secção ("Ouro", "Prata")
 * e adicionar o ícone de nível no card.
 *
 * ==========================================================
 */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Globe, Loader2, Award, Shield, Gem } from 'lucide-react'; // Importa Gem (Bronze)
import { Link } from 'react-router-dom';

const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';

interface ParceiroDestaque {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  telefone_contato: string | null;
  url_logo: string | null;
  link_site: string | null;
  partner_tier: 'ouro' | 'prata';
}

// (NOVO) Helper de Ícone (usado em ambos os componentes)
export const NivelIcone = ({ tier }: { tier: string }) => {
  if (tier === 'ouro') {
    return <Award className="h-5 w-5 text-yellow-500" title="Parceiro Ouro" />;
  }
  if (tier === 'prata') {
    return <Shield className="h-5 w-5 text-gray-400" title="Parceiro Prata" />;
  }
  if (tier === 'bronze') {
    return <Gem className="h-5 w-5 text-yellow-800" title="Parceiro Bronze" />;
  }
  return null;
};

export function ParceirosDestaque() {
  const [parceirosOuro, setParceirosOuro] = useState<ParceiroDestaque[]>([]);
  const [parceirosPrata, setParceirosPrata] = useState<ParceiroDestaque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchParceirosDestaque = async () => {
      setIsLoading(true);
      setErro(null);
      try {
        const response = await axios.get(API_URL);
        if (response.data.status === 'sucesso') {
          const parceiros: ParceiroDestaque[] = response.data.parceiros;
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
  }, []); 

  if (isLoading) {
    return (
      <section className="py-20 lg:py-24 bg-background text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
      </section>
    );
  }

  if (erro) { return null; } // Não mostra nada se der erro

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
            {/* 1. TÍTULO GENÉRICO (PODE SER REMOVIDO SE PREFERIR) */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold font-accent text-foreground leading-tight mb-4">
                Nossos Parceiros em Destaque
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Apoiadores que fortalecem nossa comunidade com benefícios premium.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parceirosOuro.map((parceiro) => (
                <Card 
                  key={parceiro.id} 
                  className="border-card-border hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  data-testid={`parceiro-ouro-${parceiro.id}`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Imagem/Logo (Mantido) */}
                    <div className="w-full h-40 bg-muted rounded-md mb-4 flex items-center justify-center">
                      {parceiro.url_logo ? (
                        <img src={parceiro.url_logo} alt={parceiro.nome_parceiro} className="h-full w-full object-contain p-4" />
                      ) : (
                        <span className="text-sm text-muted-foreground">Logo em breve</span>
                      )}
                    </div>
                    {/* Detalhes */}
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-semibold text-foreground">{parceiro.nome_parceiro}</h3>
                      {/* 2. ÍCONE DE NÍVEL AO LADO DO TÍTULO */}
                      <NivelIcone tier={parceiro.partner_tier} /> 
                    </div>
                    <p className="text-sm font-medium text-primary mb-3">{parceiro.categoria}</p>
                    <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                      "{parceiro.descricao_beneficio}"
                    </p>
                    {/* Contactos (Mantidos) */}
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
      {/* SECÇÃO PARCEIROS PRATA (Apenas Texto - DISCRETA)           */}
      {/* ========================================================== */}
      {parceirosPrata.length > 0 && (
        <section className="py-20 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* 3. TÍTULO E DESCRIÇÃO REMOVIDOS (Conforme solicitado) */}

            {/* Lista textual */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {parceirosPrata.map((parceiro) => (
                <div 
                  key={parceiro.id} 
                  className="border-b border-border pb-3"
                  data-testid={`parceiro-prata-${parceiro.id}`}
                >
                   {/* 4. ÍCONE DE NÍVEL AO LADO DO TÍTULO */}
                   <div className="flex items-center gap-2 mb-1">
                     <h3 className="text-lg font-semibold text-foreground">{parceiro.nome_parceiro}</h3>
                     <NivelIcone tier={parceiro.partner_tier} />
                   </div>
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