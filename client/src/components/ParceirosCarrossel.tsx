/*
 * ==========================================================
 * Componente: ParceirosCarrossel.tsx
 * Versão: 6.0 (Logos Corrigidas + Hover Banner Premium)
 * ==========================================================
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageSquare, ZoomIn, X, ImageIcon, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

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
  banner_fit_mobile?: 'cover' | 'contain';
}

export function ParceirosCarrossel() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
        setIsLoading(false);
      }
    };
    fetchParceiros();
  }, []);

  // Helper para corrigir URLs (Crucial para as logos aparecerem)
  const getImageUrl = (url: string | null, type: 'logo' | 'banner' = 'logo') => {
    if (!url || url === 'NULL') return null;
    let clean = url.replace(/['"]/g, '').trim();
    if (clean.startsWith('http')) return clean;
    if (clean.startsWith('/')) return `${DOMAIN_URL}${clean}`;
    const folder = type === 'logo' ? 'logos_parceiros' : 'banners_campanhas';
    return `${DOMAIN_URL}/uploads/${folder}/${clean}`;
  };

  const zapLink = (num: string | null) => {
    if (!num) return '#';
    const clean = num.replace(/\D/g, ''); 
    return `https://api.whatsapp.com/send/?phone=55${clean}&text=Olá! Vi sua marca no Portal AMB!`;
  };

  if (isLoading || parceiros.length === 0) return null;

  return (
    <section className="bg-white py-12 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center text-slate-900">
        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider inline-flex items-center gap-2">
          Parcerias de Ouro
        </h3>
        <div className="h-1 w-16 bg-yellow-500 mx-auto mt-2 rounded-full opacity-80"></div>
      </div>

      <div className="relative w-full flex overflow-x-auto pb-8 gap-6 px-4 justify-start md:justify-center no-scrollbar snap-x py-2">
        {parceiros.map((parceiro) => {
          const logoUrl = getImageUrl(parceiro.url_logo, 'logo');
          const bannerUrl = getImageUrl(parceiro.url_banner, 'banner');
          const isHovered = hoveredId === parceiro.id;

          // Lógica responsiva
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          const fitMode = isMobile ? (parceiro.banner_fit_mobile || 'cover') : (parceiro.banner_fit_mode || 'cover');

          return (
            <div 
              key={parceiro.id}
              className="group relative flex-shrink-0 snap-center bg-white border border-slate-200 rounded-xl w-64 h-40 flex items-center justify-center transition-all duration-500 hover:border-yellow-400 hover:shadow-2xl shadow-sm cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredId(parceiro.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                  if (bannerUrl) setImagemZoom(bannerUrl);
                  else if (parceiro.whatsapp_contato) window.open(zapLink(parceiro.whatsapp_contato), '_blank');
              }}
            >

              {/* === CAMADA 1: LOGO (Visível por padrão) === */}
              <div className={`absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-300 ${isHovered && bannerUrl ? 'opacity-0' : 'opacity-100'}`}>
                {logoUrl ? (
                  <img 
                    src={logoUrl}
                    alt={parceiro.nome_parceiro}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}

                {/* Fallback Texto (Só aparece se não tiver logo ou ela quebrar) */}
                <div className={`hidden flex-col items-center text-slate-300 ${!logoUrl ? 'flex' : ''}`}>
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs font-bold uppercase text-center">{parceiro.nome_parceiro}</span>
                </div>
              </div>

              {/* === CAMADA 2: BANNER (Aparece no Hover se existir) === */}
              {bannerUrl && (
                <div className={`absolute inset-0 bg-black transition-opacity duration-500 flex items-center justify-center overflow-hidden ${isHovered ? 'opacity-100' : 'opacity-0'}`}>

                   {/* Blur Backdrop (Se Contain) */}
                   {fitMode === 'contain' && (
                        <div className="absolute inset-0 bg-cover bg-center blur-md opacity-60 scale-110" style={{ backgroundImage: `url(${bannerUrl})` }} />
                   )}

                   <img 
                      src={bannerUrl}
                      className={`relative z-10 w-full h-full transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'} ${fitMode === 'contain' ? 'object-contain' : 'object-cover'}`}
                      alt="Campanha"
                   />

                   {/* Ícone Zoom */}
                   <div className="absolute top-2 right-2 p-1.5 bg-black/40 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      <Maximize2 className="w-4 h-4" />
                   </div>

                   {/* Overlay CTA */}
                   <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center z-20">
                      <span className="text-[10px] text-white font-bold flex items-center gap-1 uppercase tracking-wide">
                        Ver Campanha
                      </span>
                   </div>
                </div>
              )}

              {/* Badge Ouro */}
              <div className="absolute top-2 left-2 z-20">
                 <Badge className="bg-yellow-500 text-black text-[9px] h-5 border-none shadow-md">OURO</Badge>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Zoom */}
      <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0 flex justify-center items-center outline-none ring-0">
            <div className="relative group">
                <button onClick={() => setImagemZoom(null)} className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-50">
                    <X className="h-6 w-6"/>
                </button>
                {imagemZoom && (
                    <img 
                        src={imagemZoom} 
                        className="max-h-[85vh] max-w-[95vw] rounded-xl shadow-2xl bg-white object-contain cursor-zoom-out" 
                        alt="Zoom" 
                        onClick={() => setImagemZoom(null)}
                    />
                )}
            </div>
        </DialogContent>
      </Dialog>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}