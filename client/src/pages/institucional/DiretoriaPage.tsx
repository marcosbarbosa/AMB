// Nome: DiretoriaPage.tsx
// Nro de linhas+ Caminho: 110 client/src/pages/institucional/DiretoriaPage.tsx
// Data: 2026-01-22
// Hora: 22:50 (America/Sao_Paulo)
// Função: Exibição Pública da Diretoria (Conectada à API)
// Versão: v3.0 Real Data Integration
// Alteração: Substituição do Mock Data por consumo real da API get_diretoria.php.

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { User, Shield, Loader2 } from 'lucide-react';

const API_URL = 'https://www.ambamazonas.com.br/api/get_diretoria.php';
// Caminho correto para imagens enviadas pelo painel administrativo
const BASE_IMG_URL = 'https://www.ambamazonas.com.br/uploads/diretoria/';

interface Diretor {
  id: number;
  nome: string;
  cargo: string;
  url_foto: string | null;
  inicio_gestao: string;
  fim_gestao: string;
}

export default function DiretoriaPage() {
  const [membros, setMembros] = useState<Diretor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}?t=${new Date().getTime()}`);
        if (res.data.status === 'sucesso') {
          setMembros(res.data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar diretoria:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow pt-32 pb-16 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 uppercase mb-2">
                Diretoria Executiva
            </h1>
            <p className="text-slate-500 text-lg font-medium">Quem faz a AMB acontecer</p>
            <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>
        ) : membros.length === 0 ? (
            <div className="text-center text-slate-500 py-10">Nenhum membro cadastrado.</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {membros.map((d) => (
                    <Card key={d.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden group">
                        <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                        <CardContent className="p-8 text-center flex flex-col items-center">

                            {/* Foto Dinâmica do Banco */}
                            <div className="w-32 h-32 rounded-full mb-6 border-4 border-slate-100 shadow-inner bg-slate-50 group-hover:border-blue-100 transition-colors flex items-center justify-center overflow-hidden relative">
                                {d.url_foto ? (
                                    <img 
                                        src={`${BASE_IMG_URL}${d.url_foto}`} 
                                        alt={d.nome} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <User className={`fallback-icon h-14 w-14 text-slate-300 absolute ${d.url_foto ? 'hidden' : ''}`} />
                            </div>

                            <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase mb-4 flex items-center gap-1.5 tracking-wider">
                                <Shield className="h-3 w-3" /> Gestão {d.inicio_gestao ? new Date(d.inicio_gestao).getFullYear() : ''}
                            </div>

                            <h3 className="font-black text-slate-900 text-xl uppercase leading-tight mb-2">
                                {d.cargo}
                            </h3>
                            <p className="text-slate-500 font-medium text-lg">{d.nome}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
// linha 110 client/src/pages/institucional/DiretoriaPage.tsx