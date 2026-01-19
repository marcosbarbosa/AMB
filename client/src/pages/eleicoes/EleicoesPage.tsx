// Nome: EleicoesPage.tsx
// Caminho: client/src/pages/eleicoes/EleicoesPage.tsx
// Data: 2026-01-20
// Hora: 10:00
// Função: Urna Eletrônica Completa (Check -> 2FA -> Voto -> Recibo)
// Versão: v4.0 Full Voting Cycle

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, CheckCircle2, XCircle, AlertTriangle, Fingerprint, ArrowRight, UserCheck, FileCheck } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'https://www.ambamazonas.com.br/api/eleicoes';

type Step = 'CHECKING' | 'BLOCKED' | 'READY_TO_START' | 'AWAITING_2FA' | 'VOTING' | 'RECEIPT';

interface Chapa {
    numero_chapa: number;
    nome_chapa: string;
    nome_presidente: string;
    nome_vice: string;
    foto_url: string;
}

export default function EleicoesPage() {
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>('CHECKING');
  const [motivoBloqueio, setMotivoBloqueio] = useState('');
  const [dadosEleitor, setDadosEleitor] = useState<{ nome: string; cpf_masked: string } | null>(null);

  // 2FA
  const [tokenInput, setTokenInput] = useState('');
  const [loading2FA, setLoading2FA] = useState(false);

  // Votação
  const [chapas, setChapas] = useState<Chapa[]>([]);
  const [votoSelecionado, setVotoSelecionado] = useState<number | null>(null); // numero da chapa, 0 (branco), -1 (nulo)
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [comprovante, setComprovante] = useState<{hash: string, data: string} | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
        navigate('/login?redirect=/eleicoes');
        return;
    }
    if (token && step === 'CHECKING') {
        checkElegibilidade();
    }
  }, [token, isAuthenticated, isAuthLoading]);

  // Carrega chapas quando entra no modo de votação
  useEffect(() => {
      if (step === 'VOTING') {
          carregarChapas();
      }
  }, [step]);

 const checkElegibilidade = async () => {
    setStep('CHECKING');
    try {
        const res = await axios.post(`${API_BASE}/check_elegibilidade.php`, { token });
        
        console.log("Status Eleição:", res.data); // LOG PARA DEBUG

        if (res.data.status === 'sucesso' && res.data.pode_votar) {
            setDadosEleitor(res.data.dados_eleitor);
            setStep('READY_TO_START');
        } else {
            setMotivoBloqueio(res.data.motivo || "Critérios não atendidos.");
            setStep('BLOCKED');
        }
    } catch (error: any) {
        console.error("Erro Check:", error);
        
        // Tenta extrair mensagem de erro real do PHP (caso seja 500 ou 404)
        let msg = "Erro de conexão com o Tribunal Eleitoral.";
        if (error.response && error.response.data) {
             // Se o PHP retornou HTML de erro ou JSON de erro
             msg = typeof error.response.data === 'string' 
                ? `Erro do Servidor (${error.response.status})` 
                : error.response.data.motivo || error.response.data.mensagem || msg;
        }
        setMotivoBloqueio(msg);
        setStep('BLOCKED');
    }
  };

  const iniciarProtocolo2FA = async () => {
    setLoading2FA(true);
    try {
        const res = await axios.post(`${API_BASE}/enviar_2fa.php`, { token });
        if (res.data.status === 'sucesso') {
            setStep('AWAITING_2FA');
            if (res.data.debug_token) {
                toast({ title: "Debug Mode", description: `Código: ${res.data.debug_token}`, className: "bg-yellow-100 text-yellow-900" });
            } else {
                toast({ title: "Código Enviado", description: "Verifique seu e-mail/WhatsApp." });
            }
        } else {
            toast({ title: "Erro", description: res.data.mensagem, variant: "destructive" });
        }
    } catch (error) {
        toast({ title: "Erro", description: "Falha ao gerar token.", variant: "destructive" });
    } finally {
        setLoading2FA(false);
    }
  };

  const validarTokenClientSide = () => {
      if (tokenInput.length === 6) {
          setStep('VOTING'); // O token será validado de verdade no submit do voto
      } else {
          toast({ title: "Inválido", description: "Digite os 6 números.", variant: "destructive" });
      }
  };

  const carregarChapas = async () => {
      try {
          const res = await axios.get(`${API_BASE}/get_chapas.php`);
          if (res.data.status === 'sucesso') {
              setChapas(res.data.dados);
          }
      } catch (error) {
          toast({ title: "Erro", description: "Falha ao carregar candidatos.", variant: "destructive" });
      }
  };

  const confirmarVoto = async () => {
      if (votoSelecionado === null) return;
      setIsSubmittingVote(true);

      try {
          const payload = {
              token: token,
              token_2fa: tokenInput, // Envia o 2FA junto para validar no ato do voto
              voto: votoSelecionado
          };

          const res = await axios.post(`${API_BASE}/registrar_voto.php`, payload);

          if (res.data.status === 'sucesso') {
              setComprovante({ hash: res.data.comprovante, data: res.data.data });
              setStep('RECEIPT');
              toast({ title: "Sucesso!", description: "Voto computado.", className: "bg-green-600 text-white" });
          } else {
              toast({ title: "Erro no Registro", description: res.data.mensagem, variant: "destructive" });
              // Se o token 2FA estiver errado ou expirado, volta pra tela anterior
              if (res.data.mensagem.includes("segurança")) {
                  setStep('AWAITING_2FA');
              }
          }
      } catch (error) {
          toast({ title: "Erro Crítico", description: "Não foi possível conectar à urna.", variant: "destructive" });
      } finally {
          setIsSubmittingVote(false);
      }
  };

  const getNomeVoto = () => {
      if (votoSelecionado === 0) return "VOTO EM BRANCO";
      if (votoSelecionado === -1) return "VOTO NULO";
      const chapa = chapas.find(c => c.numero_chapa === votoSelecionado);
      return chapa ? `CHAPA ${chapa.numero_chapa} - ${chapa.nome_chapa}` : "DESCONHECIDO";
  };

  if (isAuthLoading || step === 'CHECKING') {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin"/>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Auditando Credenciais...</p>
        </div>
      );
  }

  // --- TELA DA URNA (VOTING) ---
  if (step === 'VOTING') {
      return (
          <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
              <div className="bg-slate-800 p-4 shadow-md flex justify-between items-center px-8">
                  <div className="flex items-center gap-3">
                      <Fingerprint className="h-6 w-6 text-green-400" />
                      <div>
                          <h1 className="font-bold text-lg leading-none">Ambiente de Votação Seguro</h1>
                          <p className="text-xs text-slate-400">Identificação: {dadosEleitor?.cpf_masked}</p>
                      </div>
                  </div>
                  <div className="text-right">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">ELEIÇÕES 2026</span>
                  </div>
              </div>

              <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl flex flex-col justify-center">
                  <h2 className="text-2xl font-light text-center mb-8 text-slate-300">Escolha sua representação</h2>

                  {/* GRID DE CHAPAS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                      {chapas.map(chapa => (
                          <div 
                            key={chapa.numero_chapa}
                            onClick={() => setVotoSelecionado(chapa.numero_chapa)}
                            className={`cursor-pointer rounded-xl p-6 border-2 transition-all relative overflow-hidden group ${votoSelecionado === chapa.numero_chapa ? 'border-green-500 bg-slate-800 shadow-lg shadow-green-900/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                          >
                              <div className="flex items-center justify-between mb-4">
                                  <span className="text-4xl font-black text-slate-200">{chapa.numero_chapa}</span>
                                  {votoSelecionado === chapa.numero_chapa && <CheckCircle2 className="h-8 w-8 text-green-500 animate-in zoom-in" />}
                              </div>
                              <h3 className="text-xl font-bold text-white uppercase mb-1">{chapa.nome_chapa}</h3>
                              <div className="text-sm text-slate-400 space-y-1">
                                  <p><span className="font-bold text-slate-500">PRESIDENTE:</span> {chapa.nome_presidente}</p>
                                  {chapa.nome_vice && <p><span className="font-bold text-slate-500">VICE:</span> {chapa.nome_vice}</p>}
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* OPÇÕES EXTRAS */}
                  <div className="flex justify-center gap-4 mb-12">
                      <button 
                        onClick={() => setVotoSelecionado(0)}
                        className={`px-6 py-3 rounded-lg font-bold uppercase transition-all ${votoSelecionado === 0 ? 'bg-white text-black ring-4 ring-white/50' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                          Votar em Branco
                      </button>
                      <button 
                        onClick={() => setVotoSelecionado(-1)}
                        className={`px-6 py-3 rounded-lg font-bold uppercase transition-all ${votoSelecionado === -1 ? 'bg-red-600 text-white ring-4 ring-red-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                          Votar Nulo
                      </button>
                  </div>

                  {/* BARRA DE CONFIRMAÇÃO */}
                  <div className="bg-slate-800 border-t border-slate-700 p-6 fixed bottom-0 left-0 right-0 z-50">
                      <div className="container mx-auto max-w-5xl flex justify-between items-center">
                          <div className="hidden md:block">
                              <p className="text-xs text-slate-500 uppercase font-bold">Seleção Atual</p>
                              <p className="text-lg font-bold text-white">{getNomeVoto()}</p>
                          </div>
                          <div className="flex gap-4 w-full md:w-auto">
                              <Button variant="ghost" className="flex-1 md:flex-none text-slate-400 hover:text-white" onClick={() => window.location.reload()}>Cancelar</Button>
                              <Button 
                                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wide h-12 px-8"
                                disabled={votoSelecionado === null || isSubmittingVote}
                                onClick={confirmarVoto}
                              >
                                  {isSubmittingVote ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                                  Confirmar Voto
                              </Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- TELA DE RECIBO (RECEIPT) ---
  if (step === 'RECEIPT') {
      return (
          <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-4">
              <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-green-600">
                  <CardHeader className="text-center pb-2">
                      <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-4">
                          <FileCheck className="h-10 w-10 text-green-600" />
                      </div>
                      <CardTitle className="text-2xl font-black text-slate-900 uppercase">Voto Computado</CardTitle>
                      <CardDescription>Seu exercício democrático foi registrado com sucesso.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                      <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 space-y-2">
                          <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hash do Comprovante</p>
                              <p className="font-mono text-xs break-all text-slate-800 font-bold">{comprovante?.hash}</p>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-slate-200 mt-2">
                              <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">Data</p>
                                  <p className="text-xs font-bold text-slate-800">{comprovante?.data}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase">Eleitor</p>
                                  <p className="text-xs font-bold text-slate-800">{dadosEleitor?.cpf_masked}</p>
                              </div>
                          </div>
                      </div>
                      <div className="text-center">
                          <p className="text-xs text-slate-400 mb-4">Salve este comprovante para fins de auditoria.</p>
                          <Button className="w-full" variant="outline" onClick={() => navigate('/')}>Voltar ao Início</Button>
                      </div>
                  </CardContent>
              </Card>
          </div>
      );
  }

  // --- TELAS DE FLUXO ANTERIOR (CHECK, BLOCKED, 2FA) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />
      <main className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-lg w-full">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-6 border border-slate-100">
                    <Fingerprint className={`h-10 w-10 ${step === 'BLOCKED' ? 'text-red-500' : 'text-blue-600'}`} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none">Eleições AMB 2026</h1>
                <div className="flex justify-center items-center gap-2 mt-3">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Ambiente Seguro & Auditado</p>
                </div>
            </div>

            <Card className={`border-0 shadow-2xl overflow-hidden ${step === 'BLOCKED' ? 'ring-4 ring-red-500/10' : 'ring-4 ring-blue-500/20'}`}>
                <div className={`p-6 ${step === 'BLOCKED' ? 'bg-red-600' : 'bg-slate-900'} text-white transition-colors duration-500`}>
                    <div className="flex items-center gap-3">
                        {step === 'BLOCKED' ? <XCircle className="h-8 w-8 text-white/80"/> : <CheckCircle2 className="h-8 w-8 text-green-400"/>}
                        <div>
                            <h2 className="text-lg font-bold leading-none">{step === 'BLOCKED' ? "Acesso Negado" : "Credenciais Validadas"}</h2>
                            <p className="text-xs opacity-80 mt-1 font-medium">{step === 'BLOCKED' ? "Irregularidade encontrada" : "Identificação confirmada"}</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-8 space-y-6 bg-white">
                    {step === 'BLOCKED' && (
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-4 items-start">
                            <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                            <div><h4 className="font-black text-red-900 text-sm uppercase">Motivo do Bloqueio</h4><p className="text-red-700 text-sm mt-1">{motivoBloqueio}</p></div>
                        </div>
                    )}

                    {step === 'READY_TO_START' && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700">
                                <p className="mb-2"><strong className="text-slate-900">Eleitor:</strong> {dadosEleitor?.nome}</p>
                                <p><strong className="text-slate-900">CPF:</strong> {dadosEleitor?.cpf_masked}</p>
                            </div>
                            <Button className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl rounded-xl" onClick={iniciarProtocolo2FA} disabled={loading2FA}>
                                {loading2FA ? <Loader2 className="animate-spin" /> : "Receber Código de Acesso"}
                            </Button>
                        </div>
                    )}

                    {step === 'AWAITING_2FA' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-2">
                                <h3 className="font-bold text-slate-900">Digite o Código de 6 Dígitos</h3>
                                <p className="text-xs text-slate-500">Enviado para seus contatos cadastrados.</p>
                            </div>
                            <div className="flex justify-center">
                                <Input className="text-center text-3xl font-mono tracking-[0.5em] h-16 w-48 font-black border-2 border-slate-200 focus:border-blue-600" maxLength={6} placeholder="000000" value={tokenInput} onChange={(e) => setTokenInput(e.target.value.replace(/\D/g, ''))} />
                            </div>
                            <Button className="w-full h-14 text-lg font-black bg-green-600 hover:bg-green-700 shadow-xl rounded-xl" onClick={validarTokenClientSide}>
                                Acessar Cabine de Votação <ArrowRight className="ml-2 h-5 w-5"/>
                            </Button>
                            <div className="text-center"><button onClick={() => setStep('READY_TO_START')} className="text-xs text-slate-400 hover:text-blue-600 underline">Reenviar Código</button></div>
                        </div>
                    )}

                    {step === 'BLOCKED' && <Button variant="ghost" className="w-full" onClick={() => navigate('/contato')}>Contestar</Button>}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 300 EleicoesPage.tsx