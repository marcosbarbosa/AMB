/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: client/src/components/HeroBanner.tsx
 * FUNÇÃO: Banner Inteligente (Conecta na API para ver se tem evento)
 * VERSÃO: 1.0 Prime
 * ==========================================================
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';

export function HeroBanner() {
  const navigate = useNavigate();
  const [bannerAtivo, setBannerAtivo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        // Busca se existe algum evento rolando HOJE com imagem cadastrada
        const res = await axios.get('https://www.ambamazonas.com.br/api/get_banner_ativo.php');
        if (res.data.status === 'sucesso' && res.data.banner) {
          setBannerAtivo(res.data.banner);
        }
      } catch (error) {
        console.error("Erro ao carregar banner", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  // 1. BANNER DE EVENTO ATIVO (Prioridade)
  if (bannerAtivo) {
    return (
      <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden flex items-center justify-center bg-slate-900">
        {/* Imagem de Fundo Dinâmica */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`https://www.ambamazonas.com.br${bannerAtivo.url_imagem}`} 
            alt={bannerAtivo.nome_evento} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Conteúdo Sobreposto */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-yellow-500 text-black font-black uppercase tracking-wider text-xs md:text-sm px-4 py-1 hover:bg-yellow-400 border-none shadow-lg">
            Acontecendo Agora
          </Badge>
          <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg max-w-4xl mx-auto leading-tight">
            {bannerAtivo.nome_evento}
          </h1>
          <p className="text-slate-200 text-sm md:text-xl font-medium mb-8 uppercase tracking-widest bg-black/30 inline-block px-4 py-1 rounded-full backdrop-blur-sm">
            {bannerAtivo.genero} • {bannerAtivo.tipo}
          </p>
          <div>
            <Button 
                size="lg" 
                className="h-12 md:h-14 px-8 text-base md:text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/20"
                onClick={() => navigate('/campeonatos')}
            >
                Acompanhar Tabela <Trophy className="ml-2 h-5 w-5"/>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // 2. BANNER PADRÃO INSTITUCIONAL (Fallback se não tiver evento)
  return (
    <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden flex items-center bg-slate-900">
      {/* Imagem Padrão */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/80 z-10" />
        <img 
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale opacity-30" 
            alt="Basquete Fundo"
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
        <div className="space-y-6">
          <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 px-4 py-1 text-xs uppercase tracking-widest mx-auto md:mx-0">
            Associação Master de Basquete
          </Badge>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
            A GRANDEZA <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              NÃO TEM IDADE.
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-lg leading-relaxed mx-auto md:mx-0">
            Promovendo o esporte, a saúde e a amizade entre gerações do basquete amazonense desde 2004.
          </p>
          <div className="flex flex-col md:flex-row gap-4 pt-4 justify-center md:justify-start">
            <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold" onClick={() => navigate('/seja-parceiro')}>
              Seja Parceiro
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={() => navigate('/sobre')}>
              Conheça a AMB <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}