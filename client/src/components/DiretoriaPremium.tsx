/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: DiretoriaPremium.tsx
 * CAMINHO: client/src/components/DiretoriaPremium.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Galeria da Diretoria (Correção de Imagens High-End)
 * VERSÃO: 6.0 Prime (Robust Image Handling)
 * ==========================================================
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Quote, Users, Loader2 } from 'lucide-react'; 

// Configuração da API
const API_URL = 'https://www.ambamazonas.com.br/api/get_diretoria.php';
// Garante que a URL base termina com barra
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
        // Adiciona timestamp para evitar cache antigo do navegador
        const res = await axios.get(`${API_URL}?t=${new Date().getTime()}`);
        if (res.data.status === 'sucesso') {
          setMembros(res.data.dados || []);
        }
      } catch (error) {
        console.error("Erro ao carregar diretoria", error);
      } finally {
        // Pequeno delay artificial para garantir a suavidade do Skeleton
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  // --- LÓGICA ROBUSTA DE IMAGEM ---
  const getImageUrl = (dbUrl: string | null) => {
    if (!dbUrl || dbUrl === 'NULL' || dbUrl === '') return null;

    // Remove aspas e espaços
    let cleanUrl = dbUrl.replace(/['"]/g, '').trim();

    // Se já for uma URL completa (http), usa ela
    if (cleanUrl.startsWith('http')) return cleanUrl;

    // Estratégia "Filename Only": Pega tudo depois da última barra
    // Isso resolve problemas de caminhos relativos variados (../assets, assets/, etc)
    const filename = cleanUrl.split('/').pop();

    // Retorna a URL absoluta correta
    return `${BASE_IMG_URL}${filename}`;
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
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">
            Liderança & Governança
          </h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">
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
                        <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-100 flex items-center justify-center">
                           {photoUrl ? (
                             <img 
                               src={photoUrl} 
                               alt={diretor.nome} 
                               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                               onError={(e) => {
                                   // Fallback se a imagem falhar ao carregar (404)
                                   e.currentTarget.style.display = 'none';
                                   e.currentTarget.parentElement?.classList.remove('overflow-hidden'); // Permite ver o ícone
                                   const icon = document.createElement('div');
                                   icon.innerHTML = '<svg class="w-12 h-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
                                   e.currentTarget.parentElement?.appendChild(icon);
                               }}
                             />
                           ) : (
                             <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                               <Users className="h-12 w-12" />
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
                    <p className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-4">
                      {diretor.cargo}
                    </p>

                    {/* Divisor Decorativo */}
                    <div className="w-10 h-1 bg-slate-100 rounded-full mb-6 group-hover:w-20 group-hover:bg-blue-200 transition-all duration-500"></div>

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
// linha 165