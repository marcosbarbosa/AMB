/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 2 de novembro de 2025
 * Hora: 00:05
 * Versão: 1.1 (Constrói o Mural de Parceiros)
 *
 * Descrição: Página "Mural de Parceiros" (/parceiros).
 * Busca e exibe TODOS os parceiros (Ouro, Prata, Bronze)
 * do endpoint api/listar_parceiros.php.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card'; // Usaremos o card
import { Phone, Globe, Loader2, MapPin, Award, Shield, Gem } from 'lucide-react'; // Ícones
import { useState, useEffect } from 'react';
import axios from 'axios';

// URL da nossa API (o endpoint que lista TODOS os parceiros)
const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros.php';

// Interface para os dados do Parceiro (completa)
interface Parceiro {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  telefone_contato: string | null;
  whatsapp_contato: string | null;
  url_logo: string | null;
  endereco: string | null;
  link_site: string | null;
  partner_tier: 'ouro' | 'prata' | 'bronze'; // Ouro, Prata e Bronze
}

// Helper para obter o ícone do Nível
const NivelIcone = ({ tier }: { tier: string }) => {
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

export default function ParceirosPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Efeito: Busca TODOS os parceiros ao carregar
  useEffect(() => {
    const fetchTodosParceiros = async () => {
      setIsLoading(true);
      setErro(null);
      try {
        const response = await axios.get(API_URL); // GET para listar_parceiros.php
        if (response.data.status === 'sucesso') {
          setParceiros(response.data.parceiros);
        } else {
          throw new Error(response.data.mensagem || 'Erro ao buscar parceiros');
        }
      } catch (error) {
        console.error("Erro ao buscar todos os parceiros:", error);
        setErro('Não foi possível carregar a rede de parceiros.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodosParceiros();
  }, []); // Executa apenas uma vez

  // TODO (Tarefa Futura): Implementar lógica de busca/filtro
  // const [filtro, setFiltro] = useState('');
  // const parceirosFiltrados = parceiros.filter(p => 
  //   p.nome_parceiro.toLowerCase().includes(filtro.toLowerCase()) ||
  //   p.categoria.toLowerCase().includes(filtro.toLowerCase()) ||
  //   p.descricao_beneficio.toLowerCase().includes(filtro.toLowerCase())
  // );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        {/* Secção Título */}
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Rede de Parceiros AMB
             </h1>
             <p className="text-xl text-muted-foreground">
               Benefícios e descontos exclusivos para associados.
             </p>
           </div>
        </section>

        {/* Secção Mural de Parceiros */}
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-semibold text-foreground">
                Todos os Parceiros ({parceiros.length})
              </h2>
              {/* TODO (Tarefa Futura): Adicionar Input de Busca aqui */}
              {/* <Input 
                  placeholder="Buscar por nome, categoria ou benefício..." 
                  className="max-w-sm"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
              /> */}
            </div>

            {/* Grid de Parceiros */}
            {isLoading && (
              <div className="flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                A carregar parceiros...
              </div>
            )}
            {erro && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
                {erro}
              </div>
            )}
            {!isLoading && !erro && parceiros.length === 0 && (
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
                <p className="text-muted-foreground">
                  Nenhum parceiro cadastrado no momento.
                </p>
              </div>
            )}

            {!isLoading && !erro && parceiros.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Usamos 'parceiros' (todos) aqui, não 'parceirosFiltrados' ainda */}
                {parceiros.map((parceiro) => (
                  <Card 
                    key={parceiro.id} 
                    className="border-card-border hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    data-testid={`parceiro-card-${parceiro.id}`}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Logo (se existir) */}
                      {parceiro.url_logo && (
                        <div className="w-full h-40 bg-muted rounded-md mb-4 flex items-center justify-center overflow-hidden">
                          <img src={parceiro.url_logo} alt={parceiro.nome_parceiro} className="h-full w-full object-contain p-4" />
                        </div>
                      )}

                      {/* Nível (Ouro, Prata, Bronze) */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-primary">{parceiro.categoria}</span>
                        <NivelIcone tier={parceiro.partner_tier} />
                      </div>

                      {/* Detalhes */}
                      <h3 className="text-xl font-semibold text-foreground mb-3">{parceiro.nome_parceiro}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                        {parceiro.descricao_beneficio}
                      </p>

                      {/* Endereço (se existir) */}
                      {parceiro.endereco && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <span>{parceiro.endereco}</span>
                        </div>
                      )}

                      {/* Contactos */}
                      <div className="flex items-center gap-4 mt-auto text-sm text-muted-foreground border-t border-border pt-4">
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
                        {/* TODO: Link para WhatsApp se existir */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}