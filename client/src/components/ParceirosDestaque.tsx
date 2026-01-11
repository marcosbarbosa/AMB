/*
 * ==========================================================
 * COMPONENTE: ParceirosDestaque.tsx
 * Versão: 3.0 (Correção de Imagens + Hover de Banner Inteligente)
 * Descrição: Exibe os parceiros Ouro na Home com logos corrigidas
 * e efeito de hover que mostra o banner da campanha.
 * ==========================================================
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, ZoomIn, X, ImageIcon } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const API_PARCEIROS = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php'; // Usando a mesma API otimizada da Home
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

interface ParceiroOuro {
  id: number;
  nome_parceiro: string;
  url_logo: string | null;
  url_banner: string | null;
  whatsapp_contato: string | null;
  partner_tier: string;
  banner_fit_mode?: 'cover' | 'contain';
  banner_fit_mobile?: 'cover' | 'contain';
  banner_status?: string;
}

export function ParceirosDestaque() {
  const [parceiros, setParceiros] = useState<ParceiroOuro[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const res = await axios.get(`${API_PARCEIROS}?t=${Date.now()}`);
        if (res.data.status === 'sucesso' && res.data.parceiros) {
          // Filtra apenas Ouro Ativos com Banner Aprovado (Opcional: se quiser mostrar mesmo sem banner, remova a condição p.banner_status)
          const ouros = res.data.parceiros.filter((p: any) => 
            p.partner_tier === 'ouro' && p.banner_status === 'aprovado'
          );
          setParceiros(ouros);
        }
      } catch (error) {
        console.error("Erro ao carregar parceiros destaque:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParceiros();
  }, []);

  // Função Robusta de URL (Igual à da Page principal)
  const getImageUrl = (url: string | null, type: 'logo' | 'banner' = 'logo') => {
    if (!url || url === 'NULL') return null;
    let clean = url.replace(/['"]/g, '').trim();
    if (clean.startsWith('http')) return clean;
    if (clean.startsWith('/')) return `${DOMAIN_URL}${clean}`;

    // Fallback inteligente para caminhos relativos antigos
    const folder = type === 'logo' ? 'logos_parceiros' : 'banners_campanhas';
    return `${DOMAIN_URL}/uploads/${folder}/${clean}`;
  };

  const zapLink = (num: string | null) => {
    if (!num) return '#';
    const clean = num.replace(/\D/g, '');
    return `https://api.whatsapp.com/send?phone=55${clean}&text=Olá! Vi sua marca no Portal AMB.`;
  };

  if (loading) return null; // Ou um skeleton loader se preferir
  if (parceiros.length === 0) return null;

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-wider text-slate-800">Parcerias de Ouro</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
          {parceiros.map((p) => {
            const logoUrl = getImageUrl(p.url_logo, 'logo');
            const bannerUrl = getImageUrl(p.url_banner, 'banner');

            // Detecta mobile simples para decisão de renderização inicial
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const fitMode = isMobile ? (p.banner_fit_mobile || 'cover') : (p.banner_fit_mode || 'cover');

            return (
              <Card 
                key={p.id} 
                className="group relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 h-48 flex items-center justify-center bg-white cursor-pointer"
                onClick={() => p.whatsapp_contato && window.open(zapLink(p.whatsapp_contato), '_blank')}
              >
                <CardContent className="p-4 w-full h-full flex items-center justify-center relative">

                  {/* CAMADA 1: LOGO (Visível por padrão) */}
                  <div className="absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-300 group-hover:opacity-0">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={p.nome_parceiro} 
                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                        onError={(e) => {
                           // Se a imagem falhar, esconde ela e mostra o texto
                           (e.target as HTMLImageElement).style.display = 'none';
                           (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}

                    {/* Fallback Textual (Escondido por padrão, aparece se não tiver logo ou se ela quebrar) */}
                    <div className={`hidden flex-col items-center justify-center text-slate-300 ${!logoUrl ? 'flex' : ''}`}>
                       <ImageIcon className="h-8 w-8 mb-1" />
                       <span className="text-[10px] text-center font-bold uppercase">{p.nome_parceiro}</span>
                    </div>
                  </div>

                  {/* CAMADA 2: BANNER (Aparece no Hover) */}
                  {bannerUrl && (
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center overflow-hidden">

                      {/* Efeito Blur Backdrop (Apenas para modo Contain) */}
                      {fitMode === 'contain' && (
                        <div 
                           className="absolute inset-0 bg-cover bg-center blur-md opacity-50 scale-110"
                           style={{ backgroundImage: `url(${bannerUrl})` }}
                        />
                      )}

                      {/* Imagem Principal do Banner */}
                      <img 
                        src={bannerUrl} 
                        alt="Campanha" 
                        className={`relative z-10 w-full h-full transition-transform duration-700 group-hover:scale-105 ${fitMode === 'contain' ? 'object-contain' : 'object-cover'}`}
                      />

                      {/* Botão de Zoom na Campanha */}
                      <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setImagemZoom(bannerUrl);
                         }}
                         className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 text-white rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                         title="Ver Banner Completo"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </button>

                      {/* Overlay CTA WhatsApp */}
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center z-20">
                         <span className="text-[10px] text-white font-bold flex items-center gap-1">
                           <MessageSquare className="h-3 w-3 text-green-400" /> Falar Agora
                         </span>
                      </div>
                    </div>
                  )}

                  {/* Badge Ouro Flutuante (Sempre visível no canto, mas com destaque no hover) */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <span className="bg-yellow-500 text-[8px] font-bold px-1.5 py-0.5 rounded text-black border border-yellow-300 shadow-sm">OURO</span>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL ZOOM GLOBAL */}
      <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0 flex justify-center items-center outline-none ring-0">
            <div className="relative group">
                <button 
                    onClick={() => setImagemZoom(null)}
                    className="absolute -top-12 right-0 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors z-50"
                >
                <X className="h-6 w-6"/>
                </button>
                {imagemZoom && <img src={imagemZoom} className="max-h-[85vh] max-w-[95vw] rounded-xl shadow-2xl bg-white object-contain" alt="Zoom" />}
            </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}