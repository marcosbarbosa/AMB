/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: ParceirosCarrossel.tsx
 * CAMINHO: client/src/components/ParceirosCarrossel.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Carrossel de Parceiros (Com Modal + WhatsApp Action)
 * VERSÃO: 8.0 Prime (WhatsApp Integrated)
 * ==========================================================
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Phone, X, ImageIcon, MessageCircle } from 'lucide-react'; // Adicionado MessageCircle
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

interface Parceiro {
  id: number;
  nome_parceiro: string;
  url_logo: string | null;
  url_banner: string | null;
  whatsapp_contato: string | null;
  partner_tier: string;
  banner_fit_mode?: 'cover' | 'contain';
}

export function ParceirosCarrossel() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Parceiro | null>(null);

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const response = await axios.get(`${API_URL}?t=${Date.now()}`);
        if (response.data.status === 'sucesso') {
          // Filtra apenas nível OURO
          const ouro = response.data.parceiros.filter((p: any) => p.partner_tier === 'ouro');
          setParceiros(ouro);
        }
      } catch (error) {
        console.error("Erro ao carregar parceiros", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParceiros();
  }, []);

  const getImageUrl = (url: string | null) => {
    if (!url || url === 'NULL') return null;
    let clean = url.replace(/['"]/g, '').trim();
    if (clean.startsWith('http')) return clean;
    // Remove barra inicial se houver duplicidade
    if (clean.startsWith('/')) clean = clean.substring(1);

    // Tenta identificar se é logo ou banner pelo contexto ou assume pasta padrão se não for http
    // O backend atual já deve estar mandando o caminho com /uploads/...
    return `${DOMAIN_URL}/${clean}`;
  };

  const zapLink = (num: string | null) => {
    if (!num) return '#';
    const clean = num.replace(/\D/g, ''); 
    return `https://api.whatsapp.com/send/?phone=55${clean}&text=Olá! Vi sua marca no Portal AMB e gostaria de mais informações.`;
  };

  if (loading || parceiros.length === 0) return null;

  return (
    <section className="bg-white py-4 overflow-hidden">

      {/* SEM TÍTULOS AQUI - LIMPO */}

      <div className="relative w-full flex overflow-x-auto pb-4 gap-6 px-4 justify-start md:justify-center no-scrollbar snap-x">
        {parceiros.map((parceiro) => {
          const logoUrl = getImageUrl(parceiro.url_logo);

          return (
            <div 
              key={parceiro.id}
              onClick={() => setSelectedPartner(parceiro)} 
              className="relative flex-shrink-0 snap-center bg-white border border-slate-200 rounded-xl w-40 h-28 md:w-48 md:h-32 flex items-center justify-center transition-all duration-300 hover:border-yellow-400 hover:shadow-lg cursor-pointer overflow-hidden group"
            >
              <div className="p-4 w-full h-full flex items-center justify-center">
                {logoUrl ? (
                  <img 
                    src={logoUrl}
                    alt={parceiro.nome_parceiro}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-300">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-[10px] text-center font-bold uppercase">{parceiro.nome_parceiro}</span>
                  </div>
                )}
              </div>

              {/* Badge Ouro */}
              <div className="absolute top-2 left-2">
                 <Badge className="bg-yellow-500 text-black text-[8px] h-4 px-1 py-0 border-none shadow-sm opacity-50 group-hover:opacity-100 transition-opacity">OURO</Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL (LIGHTBOX COM WHATSAPP) --- */}
      <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent 
            className="max-w-5xl bg-transparent border-none shadow-none p-0 flex justify-center items-center outline-none ring-0"
        >
            <div className="relative group w-full flex justify-center">

                {/* BOTÃO FECHAR (X) */}
                <button 
                    onClick={() => setSelectedPartner(null)}
                    className="absolute -top-12 right-0 md:-right-12 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-50 backdrop-blur-sm"
                >
                    <X className="h-6 w-6"/>
                </button>

                {selectedPartner && (
                    <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black max-h-[85vh] flex flex-col items-center">

                        {/* BANNER CLICÁVEL (Fecha ao clicar na imagem) */}
                        <img 
                            src={getImageUrl(selectedPartner.url_banner)} 
                            className="max-w-full max-h-[80vh] object-contain cursor-pointer" 
                            alt="Banner Promocional" 
                            onClick={() => setSelectedPartner(null)}
                        />

                        {/* --- BOTÃO WHATSAPP (AÇÃO DE CONVERSÃO) --- */}
                        {selectedPartner.whatsapp_contato && (
                            <div className="absolute bottom-8 z-50 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <Button 
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-500 text-white font-bold shadow-[0_0_20px_rgba(34,197,94,0.6)] border-2 border-white/20 rounded-full h-14 px-8 text-lg gap-3 transform hover:scale-105 transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Não fecha o modal
                                        window.open(zapLink(selectedPartner.whatsapp_contato), '_blank');
                                    }}
                                >
                                    <MessageCircle className="h-6 w-6 fill-white" />
                                    Falar no WhatsApp Agora
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DialogContent>
      </Dialog>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}