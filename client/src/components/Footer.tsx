/*
 * ==========================================================
 * COMPONENTE: Footer.tsx
 * Versão: v14.0 (Dinâmico + Shield FBBM)
 * ==========================================================
 */

import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink, ShieldCheck, ArrowUpCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/context/SiteConfigContext'; // Consumo do Contexto
import ambLogo from '../assets/logo-amb.png';
import fbbmLogo from '../assets/fbbm-icone.jpg';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  // Consome dados globais
  const { whatsappNumber, emailContact } = useSiteConfig();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault(); 
    if (location.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${targetId}`);
    }
  };

  // Formatação segura para exibição e link
  // Se não houver número no banco, usa o padrão do cliente
  const rawNumber = whatsappNumber ? whatsappNumber.replace(/\D/g, '') : '559292521345';
  const displayNumber = whatsappNumber || '(92) 9252-1345';
  const displayEmail = emailContact || 'associacaomasterdebasquetebol@gmail.com';

  const whatsLink = `https://wa.me/${rawNumber}`;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* COLUNA 1: SOBRE */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-500">AMB</span> <span className="text-yellow-500">Amazonas</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              A Associação Master de Basquetebol do Amazonas promove o esporte, a saúde e a amizade entre gerações. Desde 2004 fortalecendo o cenário esportivo local.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://facebook.com/ambamazonas" target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/ambamazonas" target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/ambamazonas" target="_blank" rel="noreferrer" className="bg-slate-800 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* COLUNA 2: NAVEGAÇÃO */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navegação</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-yellow-500 transition-colors flex items-center gap-2">Início</Link></li>
              <li><a href="/#sobre" onClick={(e) => handleNavigation(e, 'sobre')} className="hover:text-yellow-500 transition-colors flex items-center gap-2">A Associação</a></li>
              <li><Link to="/parceiros" className="hover:text-yellow-500 transition-colors flex items-center gap-2">Clube de Vantagens</Link></li>
              <li><Link to="/contato" className="hover:text-yellow-500 transition-colors flex items-center gap-2">Fale Conosco</Link></li>
              <li><Link to="/painel" className="text-yellow-500 hover:text-yellow-400 font-semibold flex items-center gap-2">Área do Associado</Link></li>
            </ul>
          </div>

          {/* COLUNA 3: CONTATO DINÂMICO */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Fale Conosco</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <span className="cursor-pointer hover:text-white transition-colors">
                  R. Washington Luís, 111<br/>Dom Pedro, Manaus - AM<br/>CEP: 69040-210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <a href={whatsLink} target="_blank" rel="noreferrer" className="hover:text-white transition-colors font-mono">
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
            <h4 className="text-white font-bold mb-2 text-sm">Entidade Oficial</h4>
            <p className="text-xs text-slate-400 mb-4">
              Afiliada à FBBM e reconhecida pelos órgãos competentes do desporto nacional.
            </p>
            <Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" onClick={() => window.open('https://www.ambamazonas.com.br/uploads/docs-oficiais/NOVOESTATUTOAMB-AM.pdf', '_blank')}>
              Ver Estatuto Social
            </Button>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            © {currentYear} AMB Amazonas. Todos os direitos reservados.
          </p>
          <button onClick={scrollToTop} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition-colors group">
              Voltar ao Topo <ArrowUpCircle className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
// linha 120 Footer.tsx