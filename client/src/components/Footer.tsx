// Nome: Footer.tsx
// Caminho: client/src/components/Footer.tsx
// Data: 2026-01-18
// Função: Footer com Formatação Híbrida (8 ou 9 dígitos)
// Versão: v15.2 Smart Format
// Alteração: Correção da máscara de telefone para suportar fixos e celulares corretamente.

import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink, ShieldCheck, ArrowUpCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/context/SiteConfigContext'; 
import ambLogo from '../assets/logo-amb.png';
import fbbmLogo from '../assets/fbbm-icone.jpg';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const { whatsappNumber, emailContact } = useSiteConfig();

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleNavigation = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault(); 
    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else { navigate(`/#${targetId}`); }
  };

  // 1. Obtém o número limpo (apenas dígitos)
  // Fallback para o oficial se vier vazio: 55 + 92 + 92521345
  const rawNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '559292521345';

  // 2. Função de Formatação Inteligente
  const formatPhone = (num: string) => {
    // Remove o DDI (55) se estiver presente para formatar o local
    const local = num.startsWith('55') ? num.substring(2) : num;

    // CASO 1: Celular (DDD 2 + 9 dígitos = 11 chars) -> (92) 99981-0256
    if (local.length === 11) {
      return `(${local.substring(0,2)}) ${local.substring(2,7)}-${local.substring(7)}`;
    }

    // CASO 2: Fixo/Antigo (DDD 2 + 8 dígitos = 10 chars) -> (92) 9252-1345
    if (local.length === 10) {
      return `(${local.substring(0,2)}) ${local.substring(2,6)}-${local.substring(6)}`;
    }

    // Caso não bata com nenhum padrão, retorna original
    return num;
  };

  const displayNumber = formatPhone(rawNumber);
  const displayEmail = emailContact || 'associacaomasterdebasquetebol@gmail.com';

  // O link deve SEMPRE ter o 55
  const whatsLink = rawNumber.startsWith('55') ? `https://wa.me/${rawNumber}` : `https://wa.me/55${rawNumber}`;

  const facebookUrl = "https://facebook.com/ambamazonas"; 
  const instagramUrl = "https://instagram.com/ambamazonas";
  const youtubeUrl = "https://youtube.com/ambamazonas";

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* COLUNA 1: INSTITUCIONAL */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-500">AMB</span> <span className="text-yellow-500">Amazonas</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              A Associação Master de Basquetebol do Amazonas promove o esporte, a saúde e a amizade entre gerações.
            </p>
            <div className="flex gap-4 pt-2">
              <a href={facebookUrl} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href={youtubeUrl} target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* COLUNA 2: NAVEGAÇÃO */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navegação</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-yellow-500 transition-colors">Início</Link></li>
              <li><Link to="/parceiros" className="hover:text-yellow-500 transition-colors">Clube de Vantagens</Link></li>
              <li><Link to="/contato" className="hover:text-yellow-500 transition-colors">Fale Conosco</Link></li>
              <li><Link to="/painel" className="text-yellow-500 hover:text-yellow-400 font-semibold">Área do Associado</Link></li>
            </ul>
          </div>

          {/* COLUNA 3: CONTATO */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Fale Conosco</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="hover:text-white transition-colors">Manaus - Amazonas<br/>Brasil</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <a href={whatsLink} target="_blank" rel="noreferrer" className="hover:text-white transition-colors font-mono font-bold text-green-400">
                  {displayNumber}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <a href={`mailto:${displayEmail}`} className="hover:text-white transition-colors break-all">
                  {displayEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: SELO */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
               <ShieldCheck className="h-8 w-8 text-green-500" />
               <img src={fbbmLogo} alt="FBBM" className="h-8 w-auto rounded border border-white/20" />
            </div>
            <p className="text-xs text-slate-400 mb-4">Afiliada à FBBM e reconhecida pelos órgãos competentes.</p>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-500">© {currentYear} AMB. Todos os direitos reservados.</p>
          <button onClick={scrollToTop} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1">Voltar ao Topo <ArrowUpCircle className="h-4 w-4" /></button>
        </div>
      </div>
    </footer>
  );
}
// linha 110 Footer.tsx