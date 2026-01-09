/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 9 de janeiro de 2026
 * Hora: 15:10
 * Versão: 1.3 (Sincronização com API e Export Default)
 *
 * Descrição: Componente "Parceiros em Destaque".
 * ATUALIZADO: Adicionado export default para evitar erro no Vite.
 * CORRIGIDO: Tipagem para suportar níveis Ouro, Prata e Bronze.
 *
 * ==========================================================
 */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Globe, Loader2, Award, Shield, Gem } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';

// Interface atualizada para evitar erros de TypeScript com 'bronze'
interface ParceiroDestaque {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  telefone_contato: string | null;
  url_logo: string | null;
  link_site: string | null;
  partner_tier: 'ouro' | 'prata' | 'bronze'; 
}

// Helper de Ícone
export const NivelIcone = ({ tier }: { tier: string }) => {
  if (tier === 'ouro') {
    return <Award className="h-5 w-5 text-yellow-500" title="Parceiro Ouro" />;
  }
  if (tier === 'prata') {
    return <Shield className="h-5 w-5 text-gray-400" title="Parceiro Prata" />;
  }
  if (tier === 'bronze') {
    return <Gem className="h-5 w-5 text-orange-800" title="Parceiro Bronze" />;
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
      <section className="py-10 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-600" />
        <p className="text-sm text-slate-400 mt-2">Carregando parceiros AMB...</p>
      </section>
    );
  }

  if (erro || (parceirosOuro.length === 0 && parceirosPrata.length === 0)) { 
    return null; 
  }

  return (
    <div className="space-y-12">
      {/* SECÇÃO PARCEIROS OURO */}
      {parceirosOuro.length > 0 && (
        <section className="py-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 italic uppercase">
              Parceiros <span className="text-orange-600">Ouro</span>
            </h2>
            <div className="h-1 w-20 bg-orange-600 mx-auto mt-2"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parceirosOuro.map((parceiro) => (
              <Card key={parceiro.id} className="border-slate-100 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-full h-32 bg-slate-50 rounded-lg mb-4 flex items-center justify-center p-4">
                    {parceiro.url_logo ? (
                      <img src={parceiro.url_logo} alt={parceiro.nome_parceiro} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-xs text-slate-400 uppercase font-bold">Logo AMB</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-800 uppercase text-sm">{parceiro.nome_parceiro}</h3>
                    <NivelIcone tier={parceiro.partner_tier} /> 
                  </div>
                  <p className="text-xs text-slate-500 italic mb-4 flex-grow line-clamp-3">
                    "{parceiro.descricao_beneficio}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    {parceiro.telefone_contato && (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Phone size={12} /> {parceiro.telefone_contato}
                      </span>
                    )}
                    {parceiro.link_site && (
                       <a href={parceiro.link_site} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-orange-600 hover:underline flex items-center gap-1">
                         <Globe size={12} /> VISITAR SITE
                       </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* SECÇÃO PARCEIROS PRATA */}
      {parceirosPrata.length > 0 && (
        <section className="py-8 border-t border-slate-100">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {parceirosPrata.map((parceiro) => (
              <div key={parceiro.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
                 <div className="flex items-center gap-2">
                   <NivelIcone tier={parceiro.partner_tier} />
                   <span className="text-xs font-bold text-slate-700 uppercase">{parceiro.nome_parceiro}</span>
                 </div>
                 {parceiro.telefone_contato && <span className="text-[10px] text-slate-400">{parceiro.telefone_contato}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// OBRIGATÓRIO: Export default para o Vite encontrar o componente
export default ParceirosDestaque;