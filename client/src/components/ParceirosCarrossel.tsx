/*
 * ==========================================================
 * Componente: ParceirosCarrossel.tsx
 * Descrição: Faixa de parceiros Ouro com link direto para WhatsApp
 * ATUALIZADO: Tema Claro (Fundo Branco)
 * ==========================================================
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink } from 'lucide-react';

const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';
const BASE_IMG_URL = 'https://www.ambamazonas.com.br';

interface Parceiro {
  id: number;
  nome_parceiro: string;
  url_logo: string | null;
  whatsapp_contato: string | null;
  partner_tier: 'ouro' | 'prata';
}

export function ParceirosCarrossel() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data.status === 'sucesso') {
          // Filtra apenas os OURO
          const ouro = response.data.parceiros.filter((p: Parceiro) => p.partner_tier === 'ouro');
          setParceiros(ouro);
        }
      } catch (error) {
        console.error("Erro ao carregar parceiros carrossel", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParceiros();
  }, []);

  const gerarLinkWhatsapp = (numero: string | null) => {
    if (!numero) return null;
    const limpo = numero.replace(/\D/g, ''); 
    const final = limpo.length <= 11 ? `55${limpo}` : limpo;
    return `https://api.whatsapp.com/send/?phone=${final}&text=Olá, vi sua marca no Portal AMB!`;
  };

  if (isLoading || parceiros.length === 0) return null;

  return (
    // MUDANÇA 1: Fundo branco e borda inferior clara
    <section className="bg-white py-12 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        {/* MUDANÇA 2: Texto escuro para contrastar com o fundo branco */}
        <h3 className="text-xl md:text-2xl font-semibold text-slate-900 font-accent uppercase tracking-wider">
          Parcerias de Ouro
        </h3>
      </div>

      <div className="relative w-full flex overflow-x-auto pb-4 gap-8 px-4 justify-start md:justify-center no-scrollbar snap-x">
        {parceiros.map((parceiro) => {
          const linkZap = gerarLinkWhatsapp(parceiro.whatsapp_contato);

          return (
            <a 
              key={parceiro.id}
              href={linkZap || '#'}
              target="_blank"
              rel="noopener noreferrer"
              // MUDANÇA 3: Cartões brancos com borda cinza clara, efeito hover sutil
              className="group relative flex-shrink-0 snap-center bg-white border border-slate-200 rounded-lg p-4 w-48 h-32 flex items-center justify-center transition-all duration-300 hover:border-yellow-500 hover:bg-slate-50 hover:scale-105 cursor-pointer shadow-sm"
              title={`Falar com ${parceiro.nome_parceiro} no WhatsApp`}
            >
              {parceiro.url_logo ? (
                <img 
                  src={parceiro.url_logo.startsWith('http') ? parceiro.url_logo : `${BASE_IMG_URL}${parceiro.url_logo}`}
                  alt={parceiro.nome_parceiro}
                  // MUDANÇA 4: Ajuste da opacidade para ficar melhor no fundo branco
                  className="max-w-full max-h-full object-contain opacity-80 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                />
              ) : (
                <span className="text-slate-600 font-bold">{parceiro.nome_parceiro}</span>
              )}

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-4 h-4 text-yellow-500" />
              </div>
            </a>
          );
        })}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}