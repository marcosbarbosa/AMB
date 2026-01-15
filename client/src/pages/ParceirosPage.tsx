/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: ParceirosPage.tsx
 * CAMINHO: client/src/pages/ParceirosPage.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Vitrine Pública de Parceiros (Visual Prime & Dados Reais)
 * VERSÃO: 7.0 Prime (Fixed Data Binding)
 * ==========================================================
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Loader2, Star, ShieldCheck, Phone, Globe, Handshake, AlertCircle, ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://www.ambamazonas.com.br/api/listar_parceiros_homepage.php';
const DOMAIN_URL = 'https://www.ambamazonas.com.br';

interface Parceiro {
  id: number;
  nome_parceiro: string;
  categoria: string;
  descricao_beneficio: string;
  url_logo: string | null;
  url_banner: string | null;
  partner_tier: 'ouro' | 'prata' | 'bronze' | 'pendente';
  whatsapp_contato: string | null;
  link_site: string | null;
  endereco?: string | null;
}

export default function ParceirosPage() {
  const navigate = useNavigate();
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [erroApi, setErroApi] = useState<string | null>(null);

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const res = await axios.get(`${API_URL}?t=${Date.now()}`);

        if (res.data.status === 'sucesso') {
          // O backend retorna { parceiros: [...] }
          const lista = Array.isArray(res.data.parceiros) ? res.data.parceiros : [];
          setParceiros(lista);
        } else {
          console.warn("API retornou status diferente de sucesso:", res.data);
          // Se não houver erro fatal, apenas lista vazia
          setParceiros([]);
        }
      } catch (error) {
        console.error("Erro crítico API Parceiros:", error);
        setErroApi("Não foi possível carregar a lista de parceiros. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };
    fetchParceiros();
  }, []);

  const getImageUrl = (url: string | null) => {
    if (!url || url === 'NULL' || url === '') return null;
    // Se já vier completo do backend (correção aplicada no PHP), usa direto
    if (url.startsWith('http') || url.startsWith('/uploads')) {
        return url.startsWith('http') ? url : `${DOMAIN_URL}${url}`;
    }
    // Fallback antigo
    return `${DOMAIN_URL}/uploads/logos_parceiros/${url}`;
  };

  const zapLink = (num: string | null) => {
    if (!num) return '#';
    const clean = num.replace(/\D/g, ''); 
    return `https://api.whatsapp.com/send/?phone=55${clean}&text=Olá! Sou associado da AMB e gostaria de saber mais sobre o benefício.`;
  };

  const filtrados = parceiros.filter(p => 
    p.nome_parceiro.toLowerCase().includes(busca.toLowerCase()) ||
    (p.categoria && p.categoria.toLowerCase().includes(busca.toLowerCase())) ||
    (p.descricao_beneficio && p.descricao_beneficio.toLowerCase().includes(busca.toLowerCase()))
  );

  const vips = filtrados.filter(p => p.partner_tier === 'ouro' || p.partner_tier === 'prata');
  const standard = filtrados.filter(p => p.partner_tier === 'bronze' || p.partner_tier === 'pendente');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        {/* CABEÇALHO */}
        <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700 bg-blue-50">
              Clube de Vantagens
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
              Parceiros & Convênios
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                Empresas que apoiam o basquete master e oferecem benefícios exclusivos para nossos associados.
            </p>

            <div className="mt-8 flex justify-center">
                <Button 
                    onClick={() => navigate('/seja-parceiro')} 
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold"
                >
                    <Handshake className="mr-2 h-4 w-4"/> Quero cadastrar minha empresa
                </Button>
            </div>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="max-w-md mx-auto mb-16 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
                placeholder="Buscar por empresa, categoria ou serviço..." 
                className="pl-10 h-12 rounded-full shadow-sm border-slate-200 focus:ring-2 focus:ring-blue-500 text-lg"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />
        </div>

        {loading ? (
            <div className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500"/></div>
        ) : (
            <>
                {erroApi && (
                    <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5"/>
                        <span className="text-sm font-medium">{erroApi}</span>
                    </div>
                )}

                {/* --- SEÇÃO VIP (OURO E PRATA) --- */}
                {vips.length > 0 && (
                    <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500"/> Destaques Premium
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {vips.map(parceiro => {
                                const banner = getImageUrl(parceiro.url_banner);
                                const logo = getImageUrl(parceiro.url_logo);
                                const isOuro = parceiro.partner_tier === 'ouro';

                                return (
                                    <Card key={parceiro.id} className={`overflow-hidden border-0 shadow-lg group hover:shadow-2xl transition-all duration-300 ${isOuro ? 'ring-1 ring-yellow-400/50' : ''}`}>
                                        {/* Área do Banner/Capa */}
                                        <div className="h-56 bg-slate-100 relative overflow-hidden">
                                            {banner ? (
                                                <img src={banner} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner Parceiro" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                                                    <span className="text-slate-400 font-bold text-2xl opacity-20 uppercase">{parceiro.nome_parceiro}</span>
                                                </div>
                                            )}
                                            {/* Badge de Nível */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <Badge className={`${isOuro ? 'bg-yellow-500 text-black' : 'bg-slate-200 text-slate-700'} border-none shadow-md uppercase font-bold text-[10px] tracking-wider`}>
                                                    {parceiro.partner_tier}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="relative pt-12 pb-6 px-8">
                                            {/* Logo Flutuante */}
                                            <div className="absolute -top-10 left-8 w-20 h-20 bg-white rounded-xl shadow-md border p-1 flex items-center justify-center overflow-hidden z-10">
                                                {logo ? <img src={logo} className="max-w-full max-h-full object-contain" alt="Logo" /> : <span className="font-bold text-2xl text-slate-300">{parceiro.nome_parceiro[0]}</span>}
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{parceiro.nome_parceiro}</h3>
                                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mt-1">{parceiro.categoria}</p>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
                                                <p className="text-slate-700 font-medium text-sm line-clamp-3">
                                                    {parceiro.descricao_beneficio}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {parceiro.whatsapp_contato && (
                                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold h-10" onClick={() => window.open(zapLink(parceiro.whatsapp_contato), '_blank')}>
                                                        <Phone className="mr-2 h-4 w-4"/> WhatsApp
                                                    </Button>
                                                )}
                                                {parceiro.link_site && (
                                                    <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:text-blue-600 h-10" onClick={() => window.open(parceiro.link_site!, '_blank')}>
                                                        <Globe className="mr-2 h-4 w-4"/> Site Oficial
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- SEÇÃO STANDARD (BRONZE) --- */}
                {standard.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                            <ShieldCheck className="h-5 w-5 text-slate-400"/> Parceiros Credenciados
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {standard.map(parceiro => {
                                const logo = getImageUrl(parceiro.url_logo);
                                return (
                                    <div key={parceiro.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-4 group cursor-default">
                                        <div className="h-14 w-14 bg-slate-50 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                            {logo ? <img src={logo} className="w-full h-full object-contain p-1" alt="Logo" /> : <span className="font-bold text-slate-300 text-xl">{parceiro.nome_parceiro[0]}</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 text-base truncate mb-0.5">{parceiro.nome_parceiro}</h4>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mb-2">{parceiro.categoria}</p>

                                            <div className="bg-green-50 px-2 py-1 rounded inline-block">
                                                <p className="text-xs text-green-700 font-medium truncate max-w-[200px]">{parceiro.descricao_beneficio}</p>
                                            </div>
                                        </div>

                                        {parceiro.whatsapp_contato && (
                                            <button 
                                                className="h-9 w-9 bg-slate-50 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-full flex items-center justify-center transition-colors"
                                                onClick={() => window.open(zapLink(parceiro.whatsapp_contato), '_blank')}
                                                title="Entrar em contato"
                                            >
                                                <Phone className="h-4 w-4"/>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {filtrados.length === 0 && !erroApi && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                        <Search className="h-12 w-12 text-slate-200 mx-auto mb-4"/>
                        <h3 className="text-lg font-bold text-slate-600">Nenhum parceiro encontrado</h3>
                        <p className="text-slate-400 text-sm">Tente buscar por outro termo ou categoria.</p>
                    </div>
                )}
            </>
        )}

      </main>
      <Footer />
    </div>
  );
}