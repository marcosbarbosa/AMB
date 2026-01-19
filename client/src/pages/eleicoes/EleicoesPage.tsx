// Nome: EleicoesPage.tsx
// Caminho: client/src/pages/eleicoes/EleicoesPage.tsx
// Data: 2026-01-19
// Hora: 18:30
// Função: Portal de Segurança Eleitoral (Verifica CPF e Adimplência)
// Versão: v1.0 Security Gate

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Lock, CheckCircle2, XCircle, AlertTriangle, Fingerprint } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Altere para a URL correta se necessário
const API_BASE = 'https://www.ambamazonas.com.br/api/eleicoes';

interface ElegibilidadeState {
  status: 'loading' | 'apto' | 'inapto' | 'erro';
  mensagem: string;
  motivo?: string;
  dados?: { nome: string; cpf_masked: string };
}

export default function EleicoesPage() {
  const { atleta, token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<ElegibilidadeState>({ status: 'loading', mensagem: 'Conectando ao TSE da AMB...' });

  useEffect(() => {
    // 1. Redireciona se não estiver logado
    if (!isAuthLoading && !isAuthenticated) {
        navigate('/login?redirect=/eleicoes');
        return;
    }

    // 2. Se tiver token, faz a auditoria
    if (token) {
        checkElegibilidade();
    }
  }, [token, isAuthenticated, isAuthLoading, navigate]);

  const checkElegibilidade = async () => {
    try {
        const res = await axios.post(`${API_BASE}/check_elegibilidade.php`, { token });

        if (res.data.status === 'sucesso' && res.data.pode_votar) {
            setEstado({
                status: 'apto',
                mensagem: res.data.mensagem,
                dados: res.data.dados_eleitor
            });
        } else {
            setEstado({
                status: 'inapto',
                mensagem: "Acesso Negado à Urna",
                motivo: res.data.motivo || "Critérios de segurança não atendidos."
            });
        }
    } catch (error: any) {
        console.error("Erro Eleição:", error);
        setEstado({
            status: 'erro',
            mensagem: "Erro de Comunicação",
            motivo: "Não foi possível validar suas credenciais. Tente novamente."
        });
    }
  };

  if (isAuthLoading || estado.status === 'loading') {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin"/>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Auditando Credenciais...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <Navigation />

      <main className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-lg w-full">

            {/* CABEÇALHO DE SEGURANÇA */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-6 border border-slate-100">
                    <Fingerprint className={`h-10 w-10 ${estado.status === 'apto' ? 'text-green-600' : 'text-slate-400'}`} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">Eleições AMB 2026</h1>
                <div className="flex justify-center items-center gap-2 mt-3">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ambiente Seguro & Auditado</p>
                </div>
            </div>

            {/* CARD DE STATUS */}
            <Card className={`border-0 shadow-2xl overflow-hidden ${estado.status === 'apto' ? 'ring-4 ring-green-500/20' : 'ring-4 ring-red-500/10'}`}>

                {/* TOPO DO CARD */}
                <div className={`p-6 ${estado.status === 'apto' ? 'bg-green-600 text-white' : 'bg-slate-900 text-white'}`}>
                    <div className="flex items-center gap-3">
                        {estado.status === 'apto' ? <CheckCircle2 className="h-8 w-8 text-green-200"/> : <XCircle className="h-8 w-8 text-red-400"/>}
                        <div>
                            <h2 className="text-lg font-bold leading-none">{estado.status === 'apto' ? "Habilitado para Votar" : "Acesso Restrito"}</h2>
                            <p className="text-xs opacity-80 mt-1 font-medium">{estado.mensagem}</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8 space-y-6 bg-white">
                    {estado.status === 'inapto' && (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-4 items-start">
                            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-black text-red-900 text-sm uppercase tracking-wide">Motivo do Bloqueio</h4>
                                <p className="text-red-700 text-sm mt-1 leading-relaxed">{estado.motivo}</p>
                            </div>
                        </div>
                    )}

                    {estado.status === 'erro' && (
                        <div className="text-center py-6">
                            <p className="text-slate-500 mb-4">{estado.motivo}</p>
                            <Button variant="outline" onClick={() => window.location.reload()}>Tentar Novamente</Button>
                        </div>
                    )}

                    {estado.status === 'apto' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase">Identificação</p>
                                    <p className="font-bold text-slate-800 truncate">{estado.dados?.nome}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase">CPF Validado</p>
                                    <p className="font-mono font-bold text-slate-800">{estado.dados?.cpf_masked}</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-900 flex items-center gap-3">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                Situação Financeira: <strong>ADIMPLENTE</strong>
                            </div>

                            <Button 
                                className="w-full h-16 text-lg font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/30 transition-all uppercase tracking-wide rounded-xl"
                                onClick={() => navigate('/eleicoes/urna')} 
                            >
                                Entrar na Cabine de Votação
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>

                            <p className="text-center text-[10px] text-slate-400">
                                Ao prosseguir, você concorda com o regulamento eleitoral vigente.
                            </p>
                        </div>
                    )}

                    {estado.status === 'inapto' && (
                        <Button variant="ghost" className="w-full text-slate-500 hover:text-slate-900" onClick={() => navigate('/contato')}>
                            Falar com a Secretaria
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
// linha 175 EleicoesPage.tsx