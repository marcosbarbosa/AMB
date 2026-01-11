/*
 * ==========================================================
 * COMPONENTE: DiretoriaPremium.tsx
 * Descrição: Exibição High-End da diretoria para o site público.
 * Estilo: Premium, Clean, Animações Suaves.
 * ==========================================================
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Linkedin, Mail, Quote } from 'lucide-react'; // Ícones decorativos
import { cn } from '@/lib/utils'; // Utilitário do Shadcn (ou use string normal se não tiver)

// Configuração da API
const API_URL = 'https://www.ambamazonas.com.br/api/get_diretoria.php';
const BASE_IMG_URL = 'https://www.ambamazonas.com.br/assets/diretoria-fotos/';

interface Diretor {
  id: number;
  nome: string;
  cargo: string;
  url_foto: string | null;
  inicio_gestao: string;
  fim_gestao: string;
}

export function DiretoriaPremium() {
  const [membros, setMembros] = useState<Diretor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Adiciona timestamp para evitar cache antigo
        const res = await axios.get(`${API_URL}?t=${new Date().getTime()}`);
        if (res.data.status === 'sucesso') {
          setMembros(res.data.dados || []);
        }
      } catch (error) {
        console.error("Erro ao carregar diretoria", error);
      } finally {
        // Pequeno delay artificial para mostrar o esqueleto chique
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  // Função para limpar URL da imagem
  const getImageUrl = (dbUrl: string | null) => {
    if (!dbUrl || dbUrl === 'NULL' || dbUrl === '') return null;
    let cleanUrl = dbUrl.replace(/['"]/g, '');
    if (cleanUrl.startsWith('http')) return cleanUrl;
    cleanUrl = cleanUrl.replace(/^(\.\.\/)+assets\/diretoria-fotos\//, '');
    return `${BASE_IMG_URL}${cleanUrl}`;
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
         <div className="absolute top-[20%] -left-[5%] w-[300px] h-[300px] bg-orange-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">
            Liderança & Governança
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-accent">
            Conheça Nossa Diretoria
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Profissionais dedicados que trabalham incansavelmente para fortalecer o basquete master no Amazonas, garantindo transparência e excelência.
          </p>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {loading ? (
            // SKELETON LOADING (Carregamento Premium)
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-[400px] animate-pulse flex flex-col items-center justify-center">
                 <div className="w-32 h-32 bg-slate-200 rounded-full mb-6"></div>
                 <div className="h-4 bg-slate-200 w-3/4 rounded mb-3"></div>
                 <div className="h-3 bg-slate-200 w-1/2 rounded"></div>
              </div>
            ))
          ) : (
            // CARD REAL
            membros.map((diretor) => {
              const photoUrl = getImageUrl(diretor.url_foto);
              const anoInicio = new Date(diretor.inicio_gestao).getFullYear();
              const anoFim = new Date(diretor.fim_gestao).getFullYear();

              return (
                <div key={diretor.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:-translate-y-2">

                  {/* Borda Gradiente Superior */}
                  <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-orange-400"></div>

                  <div className="p-8 flex flex-col items-center text-center">

                    {/* Container da Foto com Efeito de Anel */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-orange-400 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <div className="relative w-40 h-40 rounded-full p-1 bg-white border-2 border-slate-100 group-hover:border-transparent transition-colors duration-500">
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                           {photoUrl ? (
                             <img 
                               src={photoUrl} 
                               alt={diretor.nome} 
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                             />
                           ) : (
                             <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-300">
                               {diretor.nome.charAt(0)}
                             </div>
                           )}
                        </div>
                      </div>

                      {/* Badge de Gestão (Ano) */}
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border border-slate-100 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        {anoInicio} — {anoFim}
                      </div>
                    </div>

                    {/* Informações */}
                    <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                      {diretor.nome}
                    </h4>
                    <p className="text-sm font-medium text-orange-600 uppercase tracking-wide mb-4">
                      {diretor.cargo}
                    </p>

                    {/* Divisor Decorativo */}
                    <div className="w-10 h-1 bg-slate-100 rounded-full mb-6 group-hover:w-20 group-hover:bg-blue-200 transition-all duration-500"></div>

                    {/* Ícones de Contato (Decorativos ou Funcionais) */}
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                       <button className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                          <Linkedin className="w-4 h-4" />
                       </button>
                       <button className="p-2 rounded-full bg-slate-50 hover:bg-orange-50 text-slate-400 hover:text-orange-600 transition-colors">
                          <Mail className="w-4 h-4" />
                       </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}