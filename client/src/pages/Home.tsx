/*
 * ==========================================================
 * Módulo: Home.tsx
 * Versão: 4.1 (Corrigido: Sintaxe escape + Suporte a Zoom)
 * ==========================================================
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

// Componentes da Home
import { CarouselHero } from '@/components/CarouselHero'; 
import { ParceirosCarrossel } from '@/components/ParceirosCarrossel'; 
import { About } from '@/components/About';
import { Stats } from '@/components/Stats';
import { CTABanner } from '@/components/CTABanner';
import { Testimonials } from '@/components/Testimonials';
import { ContactPreview } from '@/components/ContactPreview';

// Componentes de UI
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Trophy, X } from 'lucide-react';

const API_JOGOS = 'https://www.ambamazonas.com.br/api/get_jogos_home.php'; 

interface Jogo {
  id: number;
  time_a: string;
  time_b: string;
  logo_a: string | null;
  logo_b: string | null;
  placar_a: string | null;
  placar_b: string | null;
  data_jogo: string;
  hora_jogo: string;
  local: string;
  status: 'agendado' | 'andamento' | 'finalizado';
}

export default function Home() {
  const { hash } = useLocation();
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loadingJogos, setLoadingJogos] = useState(true);
  const [imagemZoom, setImagemZoom] = useState<string | null>(null);

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [hash]);

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const res = await axios.get(`${API_JOGOS}?t=${new Date().getTime()}`);
        if (res.data.status === 'sucesso' && Array.isArray(res.data.dados)) {
          setJogos(res.data.dados);
        }
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      } finally {
        setLoadingJogos(false);
      }
    };
    fetchJogos();
  }, []);

  const formatData = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <CarouselHero /> 

        {!loadingJogos && jogos.length > 0 && (
          <section className="py-16 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
                  <Trophy className="h-8 w-8 text-primary" /> Jogos em Destaque
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {jogos.map((jogo) => (
                  <Card key={jogo.id} className="overflow-hidden bg-white shadow-sm border-slate-200">
                    <CardContent className="p-0">
                      <div className="bg-slate-900 text-white p-3 text-sm flex justify-between items-center px-6">
                         <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <span>{formatData(jogo.data_jogo)} • {jogo.hora_jogo?.slice(0, 5)}</span>
                         </div>
                      </div>
                      <div className="p-6 flex items-center justify-between">
                         <div className="flex flex-col items-center flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-slate-100 rounded-full flex items-center justify-center p-2 border border-slate-200">
                               {jogo.logo_a ? (
                                  <img src={`https://www.ambamazonas.com.br/uploads/logos_times/${jogo.logo_a}`} className="w-full h-full object-contain" alt={jogo.time_a} />
                               ) : ( <span className="font-bold text-slate-400 text-xl">{jogo.time_a.charAt(0)}</span> )}
                            </div>
                            <span className="font-bold text-slate-800 text-center text-sm">{jogo.time_a}</span>
                         </div>
                         <div className="flex flex-col items-center px-2">
                            <div className="text-2xl sm:text-4xl font-black text-slate-900 font-mono">
                               {jogo.status === 'finalizado' ? `${jogo.placar_a}-${jogo.placar_b}` : 'VS'}
                            </div>
                         </div>
                         <div className="flex flex-col items-center flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-slate-100 rounded-full flex items-center justify-center p-2 border border-slate-200">
                               {jogo.logo_b ? (
                                  <img src={`https://www.ambamazonas.com.br/uploads/logos_times/${jogo.logo_b}`} className="w-full h-full object-contain" alt={jogo.time_b} />
                               ) : ( <span className="font-bold text-slate-400 text-xl">{jogo.time_b.charAt(0)}</span> )}
                            </div>
                            <span className="font-bold text-slate-800 text-center text-sm">{jogo.time_b}</span>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Passa a função de zoom para o componente carrossel */}
        <ParceirosCarrossel onImageClick={(url: string) => setImagemZoom(url)} />

        <About />
        <Stats />
        <CTABanner />
        <Testimonials />
        <ContactPreview />
      </main>

      {/* MODAL DE ZOOM (LIGHTBOX) */}
      <Dialog open={!!imagemZoom} onOpenChange={() => setImagemZoom(null)}>
        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none flex justify-center items-center p-4 ring-0 focus:outline-none">
           <div className="relative">
             <Button variant="secondary" size="icon" className="absolute -top-12 right-0 rounded-full bg-white/20 text-white hover:bg-white/40 border-none" onClick={() => setImagemZoom(null)}><X className="h-6 w-6"/></Button>
             {imagemZoom && (
                <img 
                    src={imagemZoom} 
                    className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl bg-white object-contain cursor-pointer" 
                    alt="Zoom Parceiro" 
                    onClick={() => setImagemZoom(null)}
                />
             )}
           </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}