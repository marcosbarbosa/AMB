// Nome: EleicoesGestaoPage.tsx
// Caminho: client/src/pages/admin/EleicoesGestaoPage.tsx
// Data: 2026-01-20
// Hora: 20:30
// Função: Painel Admin Blindado contra Falhas de API
// Versão: v3.0 Crash Safe

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, RefreshCw, ShieldCheck, AlertTriangle, Fingerprint, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const API_BASE = 'https://www.ambamazonas.com.br/api/eleicoes';

export default function EleicoesGestaoPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Estado inicial seguro
  const [dados, setDados] = useState<{
      eleicao_status: string;
      apuracao: any[];
      total_computado: number;
      total_auditoria: number;
      integridade: boolean;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.get(`${API_BASE}/get_admin_stats.php`, {
        headers: { Authorization: token }
      });

      // Validação defensiva: Se a API retornar erro JSON 200 OK
      if (res.data.status === 'erro') {
          throw new Error(res.data.mensagem);
      }

      // Validação de estrutura
      if (Array.isArray(res.data.apuracao)) {
          setDados(res.data);
      } else {
          throw new Error("Formato de dados inválido recebido do servidor.");
      }

    } catch (error: any) {
      console.error("Erro Painel TRE:", error);
      const msg = error.response?.data?.mensagem || error.message || "Erro desconhecido ao carregar dados.";
      setErrorMsg(msg);
      toast({ title: "Erro de Conexão", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) fetchStats(); }, [token]);

  const toggleStatus = async (acao: 'abrir' | 'fechar') => {
    try {
        const res = await axios.post(`${API_BASE}/toggle_status.php`, { acao }, {
            headers: { Authorization: token }
        });
        if (res.data.status === 'sucesso') {
            toast({ 
                title: "Status Atualizado", 
                description: `A urna foi ${acao === 'abrir' ? 'ABERTA' : 'FECHADA'} com sucesso.`,
                className: "bg-green-600 text-white border-none"
            });
            fetchStats();
        } else {
            toast({ title: "Erro", description: res.data.mensagem, variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Erro", description: "Falha ao enviar comando.", variant: "destructive" });
    }
  };

  if (loading) return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600"/>
          <p className="text-slate-500 font-bold animate-pulse">Conectando ao TRE...</p>
      </div>
  );

  // Tela de Erro Amigável (Substitui o Crash)
  if (errorMsg || !dados) return (
      <div className="min-h-screen bg-slate-50 pt-24 px-4 text-center">
          <Navigation />
          <Card className="max-w-md mx-auto border-red-200 bg-red-50 shadow-xl mt-10">
              <CardContent className="pt-8 pb-8">
                  <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600"/>
                  </div>
                  <h2 className="text-xl font-black text-red-900 mb-2 uppercase">Conexão Interrompida</h2>
                  <p className="text-red-700 mb-6 text-sm px-4">{errorMsg || "Não foi possível sincronizar com a base de dados."}</p>
                  <Button onClick={fetchStats} className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200">
                      <RefreshCw className="mr-2 h-4 w-4"/> Tentar Reconectar
                  </Button>
              </CardContent>
          </Card>
      </div>
  );

  const isAberta = dados.eleicao_status === 'votacao_aberta';

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-blue-800"/> Gestão Eleitoral
            </h1>
            <Button variant="outline" onClick={fetchStats} className="bg-white hover:bg-slate-50 border-slate-200 text-slate-600">
                <RefreshCw className="mr-2 h-4 w-4"/> Atualizar Painel
            </Button>
        </div>

        {/* STATUS CONTROL */}
        <Card className={`mb-8 border-l-8 ${isAberta ? 'border-l-green-500 shadow-green-100' : 'border-l-red-500 shadow-red-100'} shadow-xl transition-all duration-500`}>
            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-lg font-bold text-slate-800">Status da Urna</h2>
                        <Badge className={`${isAberta ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'} px-3 py-1 text-xs font-black uppercase tracking-wider border-0`}>
                            {isAberta ? 'ABERTA' : 'FECHADA'}
                        </Badge>
                    </div>
                    <p className="text-slate-500 text-sm">
                        {isAberta 
                            ? "✅ O sistema está recebendo votos. Monitore a apuração abaixo." 
                            : "🔒 O sistema está bloqueado para votos. Abra para iniciar o pleito."}
                    </p>
                </div>
                <div>
                    {isAberta ? (
                        <Button variant="destructive" size="lg" onClick={() => toggleStatus('fechar')} className="font-bold shadow-lg shadow-red-200 w-full md:w-auto h-12 px-8">
                            <Lock className="mr-2 h-5 w-5"/> ENCERRAR VOTAÇÃO
                        </Button>
                    ) : (
                        <Button className="bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-200 w-full md:w-auto h-12 px-8 text-white" onClick={() => toggleStatus('abrir')}>
                            <Unlock className="mr-2 h-5 w-5"/> ABRIR URNA AGORA
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* APURAÇÃO */}
            <Card className="shadow-lg border-slate-200 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
                        <Fingerprint className="h-5 w-5 text-blue-600"/> Apuração em Tempo Real
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {dados.apuracao.length > 0 ? (
                            dados.apuracao.map((chapa: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-5 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        {Number(chapa.numero_chapa) > 0 ? (
                                            <span className="bg-slate-800 text-white font-black text-sm w-10 h-10 flex items-center justify-center rounded-full shadow-md">
                                                {chapa.numero_chapa}
                                            </span>
                                        ) : (
                                            <span className="bg-slate-200 text-slate-500 font-bold text-xs w-10 h-10 flex items-center justify-center rounded-full">
                                                {chapa.numero_chapa === 0 ? 'BR' : 'NL'}
                                            </span>
                                        )}
                                        <span className="font-bold text-slate-700 uppercase text-sm tracking-tight">{chapa.nome_chapa}</span>
                                    </div>
                                    <Badge variant="outline" className="text-lg px-4 py-1 bg-white border-slate-200 text-slate-900 font-mono shadow-sm">
                                        {chapa.quantidade_votos}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <p>Nenhum voto registrado ainda.</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total de Votos</span>
                        <span className="text-xl font-black text-slate-900">{dados.total_computado}</span>
                    </div>
                </CardContent>
            </Card>

            {/* AUDITORIA */}
            <Card className="shadow-lg border-slate-200 h-fit">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
                        <AlertTriangle className="h-5 w-5 text-orange-500"/> Integridade do Sistema
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                            <span className="block text-[10px] font-bold text-blue-400 uppercase mb-1 tracking-wider">Logs de Acesso</span>
                            <span className="font-mono font-black text-3xl text-blue-900">{dados.total_auditoria}</span>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100">
                            <span className="block text-[10px] font-bold text-indigo-400 uppercase mb-1 tracking-wider">Votos na Urna</span>
                            <span className="font-mono font-black text-3xl text-indigo-900">{dados.total_computado}</span>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-center justify-center gap-3 font-bold text-sm shadow-sm ${dados.integridade ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700 animate-pulse'}`}>
                        {dados.integridade 
                            ? <><ShieldCheck className="h-5 w-5"/> INTEGRIDADE CONFIRMADA</> 
                            : <><AlertTriangle className="h-5 w-5"/> DIVERGÊNCIA CRÍTICA DETECTADA</>}
                    </div>

                    <div className="text-[10px] text-slate-400 leading-relaxed text-justify px-2">
                        O sistema realiza uma verificação cruzada em tempo real entre a tabela de auditoria (quem votou) e a urna secreta (o voto). A igualdade numérica garante que nenhum voto foi inserido ou removido externamente.
                    </div>
                </CardContent>
            </Card>
        </div>

      </main>
    </div>
  );
}
// linha 215 EleicoesGestaoPage.tsx