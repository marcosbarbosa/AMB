/*
 * ==========================================================
 * Componente: ParceirosCarrossel.tsx
 * Versão: 4.1 (Upgrade: Zoom + WhatsApp Independente)
 * ==========================================================
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, ZoomIn } from 'lucide-react';

const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';
const BASE_IMG_URL = 'https://www.ambamazonas.com.br';

interface Parceiro {
  id: number;
  nome_parceiro: string;
  url_logo: string | null;
  whatsapp_contato: string | null;
  partner_tier: 'ouro' | 'prata';
}

interface ParceirosCarrosselProps {
  onImageClick: (url: string) => void;
}

export function ParceirosCarrossel({ onImageClick }: ParceirosCarrosselProps) {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data.status === 'sucesso') {
          // Filtra apenas nível OURO
          const ouro = response.data.parceiros.filter((p: Parceiro) => p.partner_tier === 'ouro');
          setParceiros(ouro);
        }
      } catch (error) {
        console.error("Erro ao carregar parceiros", error);
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
    <section className="bg-white py-12 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center text-slate-900">
        <h3 className="text-xl md:text-2xl font-semibold uppercase tracking-wider">
          Parcerias de Ouro
        </h3>
      </div>

      <div className="relative w-full flex overflow-x-auto pb-6 gap-8 px-4 justify-start md:justify-center no-scrollbar snap-x">
        {parceiros.map((parceiro) => {
          const linkZap = gerarLinkWhatsapp(parceiro.whatsapp_contato);
          const fullImgUrl = parceiro.url_logo?.startsWith('http') 
            ? parceiro.url_logo 
            : `${BASE_IMG_URL}${parceiro.url_logo}`;
      
      {/* --- CARD PREMIUM OURO --- */}
          return (
            <div 
              key={parceiro.id}
              className="group relative flex-shrink-0 snap-center bg-white border border-slate-200 rounded-xl p-4 w-48 h-32 flex items-center justify-center transition-all duration-300 hover:border-yellow-400 hover:shadow-xl shadow-sm"
            >
              {/* Gatilho do Zoom na Imagem */}
              <div 
                className="w-full h-full flex items-center justify-center cursor-zoom-in relative"
                onClick={() => fullImgUrl && onImageClick(fullImgUrl)}
              >
                {parceiro.url_logo ? (
                  <img 
                    src={fullImgUrl}
                    alt={parceiro.nome_parceiro}
                    className="max-w-full max-h-full object-contain opacity-95 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                  />
                ) : (
                  <span className="text-slate-400 font-bold text-lg">{parceiro.nome_parceiro}</span>
                )}

                {/* Ícone de Lupa Prime (Visível apenas no Hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-white/90 p-2 rounded-full shadow-md border border-slate-100 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ZoomIn className="w-5 h-5 text-slate-700" />
                  </div>
                </div>
              </div>

              {/* --- ÍCONE WHATSAPP PRIME ESTILIZADO --- */}
              {linkZap && (
                <div className="absolute -top-2 -right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <a 
                    href={linkZap}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full shadow-[0_4px_12px_rgba(34,197,94,0.4)] border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    onClick={(e) => e.stopPropagation()} // Garante que o clique no Zap não dispare o Zoom da imagem
                    title="Falar no WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                  </a>
                </div>
              )}
            </div>

          );
        })}
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}