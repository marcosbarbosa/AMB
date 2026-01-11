/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 2 de novembro de 2025
 * Hora: 01:10
 * Versão: 1.2 (Implementa Busca/Filtro)
 * Tarefa: 251
 *
 * Descrição: Página "Mural de Parceiros" (/parceiros).
 * ATUALIZADO para incluir um campo de busca local (frontend)
 * que filtra os parceiros por nome, categoria ou descrição.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
// 1. (NOVO) Importa ícones e Input
import { Phone, Globe, Loader2, MapPin, Award, Shield, Gem, Search } from 'lucide-react'; 
import { useState, useEffect, useMemo } from 'react'; // 2. (NOVO) Importa useMemo
import axios from 'axios';
import { Input } from '@/components/ui/input'; // 3. (NOVO) Importa o Input

const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros.php';

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
  partner_tier: 'ouro' | 'prata' | 'bronze';
}

const NivelIcone = ({ tier }: { tier: string }) => {
  if (tier === 'ouro') return <Award className="h-5 w-5 text-yellow-500" title="Parceiro Ouro" />;
  if (tier === 'prata') return <Shield className="h-5 w-5 text-gray-400" title="Parceiro Prata" />;
  if (tier === 'bronze') return <Gem className="h-5 w-5 text-yellow-800" title="Parceiro Bronze" />;
  return null;
};

export default function ParceirosPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // 4. (NOVO) Estado para guardar o termo da busca
  const [filtro, setFiltro] = useState('');

  // Efeito: Busca TODOS os parceiros ao carregar (Mantido)
  useEffect(() => {
    const fetchTodosParceiros = async () => {
      setIsLoading(true);
      setErro(null);
      try {
        const response = await axios.get(API_URL);
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
  }, []); 

  // 5. (NOVO) Filtro: Filtra a lista 'parceiros' com base no 'filtro'
  // useMemo garante que o filtro só é re-executado se 'parceiros' or 'filtro' mudarem
  const parceirosFiltrados = useMemo(() => {
    const termoBusca = filtro.toLowerCase();
    if (!termoBusca) return parceiros; // Se a busca está vazia, retorna todos

    // Filtra por nome, categoria ou descrição
    return parceiros.filter(p => 
      p.nome_parceiro.toLowerCase().includes(termoBusca) ||
      p.categoria.toLowerCase().includes(termoBusca) ||
      p.descricao_beneficio.toLowerCase().includes(termoBusca)
    );
  }, [parceiros, filtro]); // Dependências


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        {/* Secção Título (Mantida) */}
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
            {/* 6. (NOVO) ÁREA DE BUSCA */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Nossos Parceiros ({parceirosFiltrados.length})
              </h2>
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome, categoria (ex: Saúde) ou benefício..." 
                  className="pl-10 h-11" // Adiciona espaço para o ícone
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)} // Atualiza o estado do filtro
                  data-testid="input-busca-parceiros"
                />
              </div>
            </div>

            {/* Grid de Parceiros */}
            {isLoading && (
              <div className="flex items-center justify-center text-muted-foreground">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" /> A carregar parceiros...
              </div>
            )}
            {erro && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
                {erro}
              </div>
            )}
            {!isLoading && !erro && parceiros.length === 0 && (
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
                <p className="text-muted-foreground">Nenhum parceiro cadastrado no momento.</p>
              </div>
            )}

            {/* 7. (NOVO) MENSAGEM DE "NENHUM RESULTADO" PARA A BUSCA */}
            {!isLoading && !erro && parceiros.length > 0 && parceirosFiltrados.length === 0 && (
               <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
                <p className="text-muted-foreground">
                  Nenhum parceiro encontrado para a busca: <strong>"{filtro}"</strong>
                </p>
              </div>
            )}

            {!isLoading && !erro && parceirosFiltrados.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 8. RENDERIZA A LISTA FILTRADA */}
                {parceirosFiltrados.map((parceiro) => (
                  <Card 
                    key={parceiro.id} 
                    className="border-card-border hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    data-testid={`parceiro-card-${parceiro.id}`}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      {parceiro.url_logo && (
                        <div className="w-full h-40 bg-muted rounded-md mb-4 flex items-center justify-center overflow-hidden">
                          
                          <img 
                            src={`https://www.ambamazonas.com.br${parceiro.url_logo}`} 
                            alt={parceiro.nome_parceiro} 
                            className="h-full w-full object-contain p-4" 
                          />
                          
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-primary">{parceiro.categoria}</span>
                        <NivelIcone tier={parceiro.partner_tier} />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{parceiro.nome_parceiro}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                        {parceiro.descricao_beneficio}
                      </p>
                      {parceiro.endereco && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <span>{parceiro.endereco}</span>
                        </div>
                      )}
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