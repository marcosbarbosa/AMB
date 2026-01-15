/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: client/src/pages/Home.tsx
 * VERSÃO: 12.0 Prime (Fusion: Games + FBBM + Clean Partners)
 * ==========================================================
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

// COMPONENTES PRINCIPAIS
import { HeroBanner } from '@/components/HeroBanner'; // Banner com Setas e Parceiros
import { ParceirosCarrossel } from '@/components/ParceirosCarrossel'; // Versão Limpa (Logo -> Modal)
import { About } from '@/components/About'; // Seção Sobre

// UI & Icons
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CalendarDays, Trophy, MapPin, Newspaper, ArrowRight, 
  Facebook, Instagram, Send, Youtube, Loader2 
} from 'lucide-react';

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

// --- MOCK BLOG (Placeholder até o módulo estar 100%) ---
function BlogCarousel() {
  const posts = [
      { id: 1, titulo: "AMB Inicia Temporada 2026", data: "10 JAN 2026", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600", resumo: "Confira o calendário completo." },
      { id: 2, titulo: "Assembleia Geral Extraordinária", data: "05 JAN 2026", img: "https://images.unsplash.com/photo-1577471488278-161db3865c57?auto=format&fit=crop&q=80&w=600", resumo: "Novas diretrizes aprovadas." },
      { id: 3, titulo: "AMB no Brasileiro Master", data: "20 DEZ 2025", img: "https://images.unsplash.com/photo-1519861531473-920026393112?auto=format&fit=crop&q=80&w=600", resumo: "Nossos atletas brilharam." },
  ];
  return (
      <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
              <Card key={post.id} className="group cursor-pointer hover:shadow-xl transition-all border-none shadow-md overflow-hidden bg-white">
                  <div className="h-48 overflow-hidden relative">
                      <img src={post.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.titulo} />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow">{post.data}</div>
                  </div>
                  <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-slate-800 leading-tight mb-2 group-hover:text-blue-600 line-clamp-2">{post.titulo}</h3>
                      <p className="text-slate-500 text-sm line-clamp-2">{post.resumo}</p>
                      <div className="mt-4 flex items-center text-blue-600 text-xs font-bold uppercase tracking-wide">
                          Ler Mais <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>
  );
}

export default function Home() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loadingJogos, setLoadingJogos] = useState(true);

  // Scroll Suave
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [hash]);

  // Busca Jogos (Se houver)
  useEffect(() => {
    const fetchJogos = async () => {
      try {
        const res = await axios.get(`${API_JOGOS}?t=${Date.now()}`);
        if (res.data.status === 'sucesso' && Array.isArray(res.data.dados)) {
          setJogos(res.data.dados);
        }
      } catch (error) {
        console.warn("API de Jogos indisponível no momento.");
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />

      <main className="pt-20">

        {/* --- 1. HERO BANNER (Institucional + Parceiros Ouro) --- */}
        <HeroBanner />

        {/* --- 2. JOGOS EM DESTAQUE (Lógica Original Mantida) --- */}
        {!loadingJogos && jogos.length > 0 && (
          <section className="py-16 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <Trophy className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Jogos da Rodada</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jogos.map((jogo) => (
                  <Card key={jogo.id} className="overflow-hidden bg-white shadow-sm border border-slate-200 hover:shadow-lg transition-all group">
                    <CardContent className="p-0">
                      <div className="bg-slate-900 text-white p-3 text-xs font-bold uppercase flex justify-between px-6 tracking-wider">
                          <div className="flex items-center gap-2"><CalendarDays className="h-3 w-3 text-blue-400" /> {formatData(jogo.data_jogo)} • {jogo.hora_jogo?.slice(0, 5)}</div>
                          <div className="text-slate-300">{jogo.local}</div>
                      </div>
                      <div className="p-6 flex items-center justify-between">
                          <div className="flex flex-col items-center flex-1">
                             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center p-2 border mb-2 group-hover:scale-110 transition-transform">
                                {jogo.logo_a ? <img src={`https://www.ambamazonas.com.br/uploads/logos_times/${jogo.logo_a}`} className="w-full h-full object-contain"/> : <span className="text-2xl font-black text-slate-300">{jogo.time_a[0]}</span>}
                             </div>
                             <span className="font-bold text-slate-800 text-sm text-center leading-tight">{jogo.time_a}</span>
                          </div>
                          <div className="flex flex-col items-center px-4">
                             <div className="text-3xl font-black text-slate-900 tracking-tighter">{jogo.status === 'finalizado' ? `${jogo.placar_a} - ${jogo.placar_b}` : 'VS'}</div>
                             <div className="mt-1 text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{jogo.status}</div>
                          </div>
                          <div className="flex flex-col items-center flex-1">
                             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center p-2 border mb-2 group-hover:scale-110 transition-transform">
                                {jogo.logo_b ? <img src={`https://www.ambamazonas.com.br/uploads/logos_times/${jogo.logo_b}`} className="w-full h-full object-contain"/> : <span className="text-2xl font-black text-slate-300">{jogo.time_b[0]}</span>}
                             </div>
                             <span className="font-bold text-slate-800 text-sm text-center leading-tight">{jogo.time_b}</span>
                          </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* --- 3. PARCEIROS (Carrossel Limpo) --- */}
        <section className="bg-white pt-12 pb-6 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Nossos Parceiros</h3>
                </div>
                <ParceirosCarrossel />
                <div className="text-center mt-6">
                    <Button variant="link" onClick={() => navigate('/parceiros')} className="text-slate-400 hover:text-blue-600 text-xs font-bold uppercase tracking-widest">Ver lista completa</Button>
                </div>
            </div>
        </section>

        {/* --- 4. INSTITUCIONAL (Sobre a AMB) --- */}
        <About />

        {/* --- 5. BLOG / NOTÍCIAS --- */}
        <section id="blog" className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3"><Newspaper className="h-8 w-8 text-blue-600"/> Notícias</h2>
                        <p className="text-slate-500 mt-2">Acompanhe tudo o que acontece nas quadras.</p>
                    </div>
                    <Button variant="ghost" className="text-blue-600 font-bold hidden md:flex">Ver Mais <ArrowRight className="ml-2 h-4 w-4"/></Button>
                </div>
                <BlogCarousel />
            </div>
        </section>

        {/* --- 6. REDES SOCIAIS --- */}
        <section className="py-20 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-black mb-10 tracking-tight">Siga @amb_amazonas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="group relative aspect-square bg-slate-800 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-blue-500/20 transition-all" onClick={() => window.open('https://instagram.com', '_blank')}>
                            <img src={`https://source.unsplash.com/random/400x400?basketball,team&sig=${i}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"><Instagram className="h-10 w-10 text-white drop-shadow-lg" /></div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button className="bg-[#1877F2] hover:bg-[#166fe5] w-40 font-bold"><Facebook className="mr-2 h-4 w-4"/> Facebook</Button>
                    <Button className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 w-40 border-none font-bold"><Instagram className="mr-2 h-4 w-4"/> Instagram</Button>
                    <Button className="bg-[#FF0000] hover:bg-[#D90000] w-40 font-bold"><Youtube className="mr-2 h-4 w-4"/> YouTube</Button>
                </div>
            </div>
        </section>

        {/* --- 7. CONTATO --- */}
        <section id="contato" className="py-24 bg-blue-700 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/basketball.png')]"></div>
            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase">Fale Conosco</h2>
                        <p className="text-slate-500 mt-2">Dúvidas, sugestões ou interesse em parcerias?</p>
                    </div>
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Mensagem enviada (Simulação)"); }}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Nome</label><Input placeholder="Seu nome completo" className="bg-slate-50 border-slate-200 h-12" /></div>
                            <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Email</label><Input type="email" placeholder="seu@email.com" className="bg-slate-50 border-slate-200 h-12" /></div>
                        </div>
                        <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Assunto</label><Input placeholder="Sobre o que você quer falar?" className="bg-slate-50 border-slate-200 h-12" /></div>
                        <div className="space-y-2"><label className="text-xs font-bold text-slate-500 uppercase">Mensagem</label><Textarea rows={5} placeholder="Digite sua mensagem aqui..." className="bg-slate-50 border-slate-200 resize-none" /></div>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-4 w-full md:w-fit">
                            <Checkbox id="robot" className="h-6 w-6 border-slate-400" />
                            <label htmlFor="robot" className="text-sm text-slate-600 select-none cursor-pointer">Não sou um robô</label>
                            <div className="ml-auto md:ml-4 flex flex-col items-center"><img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" className="h-8 w-8 opacity-50" /><span className="text-[8px] text-slate-400">reCAPTCHA</span></div>
                        </div>
                        <Button className="w-full h-14 text-lg font-black bg-slate-900 hover:bg-black text-white shadow-xl transition-transform hover:scale-[1.01] uppercase tracking-wide">Enviar Mensagem <Send className="ml-2 h-5 w-5"/></Button>
                    </form>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}