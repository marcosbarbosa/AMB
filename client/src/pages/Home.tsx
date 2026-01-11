/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Módulo: Home.tsx
 * Versão: 3.0 (Corrigido: Erro de String e Lógica de Ocultação)
 * Descrição:
 * - Busca jogos na API.
 * - Se não houver jogos, a secção desaparece (sem espaços em branco).
 * - Sintaxe JSX corrigida para evitar quebras de linha em strings.
 *
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

// Componentes de UI (Card e Ícones)
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, MapPin, Trophy } from 'lucide-react';

// API
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
  // 1. Scroll Suave para âncoras (ex: #sobre)
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [hash]);

  // 2. Busca de Jogos
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loadingJogos, setLoadingJogos] = useState(true);

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const res = await axios.get(`${API_JOGOS}?t=${new Date().getTime()}`);
        if (res.data.status === 'sucesso' && Array.isArray(res.data.dados)) {
          setJogos(res.data.dados);
        } else {
          setJogos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        setJogos([]); 
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

        {/* Banner Principal */}
        <CarouselHero /> 

        {/* --- SECÇÃO DE PLACAR (Só exibe se houver jogos) --- */}
        {!loadingJogos && jogos.length > 0 && (
          <section className="py-16 bg-slate-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
                  <Trophy className="h-8 w-8 text-primary" /> Jogos em Destaque
                </h2>
                <p className="text-slate-600 mt-2">Acompanhe as principais partidas e resultados.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {jogos.map((jogo) => (
                  <Card key={jogo.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-0">
                      {/* Topo do Card */}
                      <div className="bg-slate-900 text-white p-3 text-sm flex justify-between items-center px-6">
                         <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <span>{formatData(jogo.data_jogo)} • {jogo.hora_jogo?.slice(0, 5)}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="truncate max-w-[150px]">{jogo.local}</span>
                         </div>
                      </div>

                      {/* Times e Placar */}
                      <div className="p-6 flex items-center justify-between">
                         {/* Time A */}
                         <div className="flex flex-col items-center flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-slate-100 rounded-full flex items-center justify-center p-2 border border-slate-200">
                               {jogo.logo_a ? (
                                  <img src={`https://www.ambamazonas.com.br/uploads/logos_times/${jogo.logo_a}`} className="w-full h-full object-contain" alt={jogo.time_a} />
                               ) : (
                                  <span className="font-bold text-slate-400 text-xl">{jogo.time_a.charAt(0)}</span>
                               )}
                            </div>
                            <span className="font-bold text-slate-800 text-center text-sm sm:text-base leading-tight">{jogo.time_a}</span>
                         </div>

                         {/* Placar Central */}
                         <div className="flex flex-col items-center px-2 sm:px-4">
                            {jogo.status === 'finalizado' ? (
                               <div className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-4xl font-black text-slate-900 font-mono">
                                  <span>{jogo.placar_a}</span>
                                  <span className="text-slate-300 text-xl">-</span>
                                  <span>{jogo.placar_b}</span>
                               </div>
                            ) : (
                               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs shadow-inner">
                                  VS
                               </div>
                            )}

                            <span className={`mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                jogo.status === 'andamento' ? 'bg-green-100 text-green-700 animate-pulse' : 'bg-slate-100 text-slate-500'
                            }`}>
                               {jogo.status === 'finalizado' ? 'FIM' : jogo.status}
                            </span>
                         </div>

                         {/* Time B */}
                         <div className="flex flex-col items-center flex-1">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-slate-100 rounded-full flex items-center justify-center p-2 border border-slate-200">
                               {jogo.logo_b ? (
                                  <img src={`https://www.ambamazonas.com.br/uploads/logos_times/${jogo.logo_b}`} className="w-full h-full object-contain" alt={jogo.time_b} />
                               ) : (
                                  <span className="font-bold text-slate-400 text-xl">{jogo.time_b.charAt(0)}</span>
                               )}
                            </div>
                            <span className="font-bold text-slate-800 text-center text-sm sm:text-base leading-tight">{jogo.time_b}</span>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Parceiros */}
        <ParceirosCarrossel />

        {/* Quem Somos */}
        <About />

        {/* Outros Componentes */}
        <Stats />
        <CTABanner />
        <Testimonials />
        <ContactPreview />
      </main>
      <Footer />
    </div>
  );
}