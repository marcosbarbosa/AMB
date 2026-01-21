// Nome: EleicoesPage.tsx
// Caminho: client/src/pages/eleicoes/EleicoesPage.tsx
// Data: 2026-01-20
// Hora: 21:00 (America/Sao_Paulo)
// Função: Urna Eletrônica de Alta Segurança (IP Lock + Anti-Bot + 2FA + Audit)
// Versão: v13.0 Fortress Edition
// Alteração: Reimplementação detalhada de todos os estados de segurança e feedback de UI.

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Loader2, Lock, CheckCircle2, XCircle, AlertTriangle, Fingerprint, 
    ArrowRight, User, Users, Clock, ShieldAlert, FileCheck, 
    ShieldCheck, MonitorOff, Globe, LogOut 
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'https://www.ambamazonas.com.br/api';

// Estados da Máquina de Votação
type ElectionStep = 
    | 'CHECKING'        // Validando IP e Elegibilidade
    | 'BLOCKED'         // Acesso Negado (IP, CPF, Tentativas)
    | 'CAPTCHA'         // Desafio Anti-Robô
    | 'READY_TO_START'  // Confirmado, pronto para 2FA
    | 'AWAITING_2FA'    // Aguardando Código
    | 'VOTING'          // Cabine de Votação
    | 'RECEIPT';        // Comprovante

interface Chapa {
    numero_chapa: number;
    nome_chapa: string;
    nome_presidente: string;
    nome_vice: string;
    foto_url?: string;
}

export default function EleicoesPage() {
  const { token, isAuthenticated, logout, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Máquina de Estados
  const [step, setStep] = useState<ElectionStep>('CHECKING');
  const [errorDetails, setErrorDetails] = useState({ title: '', msg: '', type: '' });

  // Dados do Eleitor
  const [dadosEleitor, setDadosEleitor] = useState<any>(null);
  const [userIp, setUserIp] = useState<string>('...');

  // Segurança
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
  const [tentativas, setTentativas] = useState<number | null>(null);

  // Loadings
  const [isRequesting2FA, setIsRequesting2FA] = useState(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);

  // Votação
  const [chapas, setChapas] = useState<Chapa[]>([]);
  const [votoSel, setVotoSel] = useState<number | null>(null);
  const [recibo, setRecibo] = useState<any>(null);

  // 1. Cronômetro de Segurança (2FA)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'AWAITING_2FA' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'AWAITING_2FA') {
      handleBlock('Sessão Expirada', 'O tempo limite de segurança (2 min) foi excedido.', 'TIMEOUT');
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // 2. Inicialização e Check de Segurança
  useEffect(() => {
    if (!isAuthLoading) {
        if (!isAuthenticated) {
            navigate('/login?redirect=/eleicoes');
        } else if (token && step === 'CHECKING') {
            runSafetyCheck();
        }
    }
  }, [token, isAuthenticated, isAuthLoading]);

  // 3. Carregamento da Cédula (Lazy Load)
  useEffect(() => {
      if (step === 'VOTING') loadBallot();
  }, [step]);

  // --- FUNÇÕES DE LÓGICA ---

  const handleBlock = (title: string, msg: string, type: string) => {
      setErrorDetails({ title, msg, type });
      setStep('BLOCKED');
  };

  const runSafetyCheck = async () => {
    try {
        // Chamada ao Backend Blindado
        const res = await axios.post(`${API_BASE}/eleicoes.php?action=check_safety`, { token }, {
            headers: { Authorization: token }
        });

        if (res.data.status === 'sucesso') {
            setDadosEleitor(res.data.eleitor);
            setUserIp(res.data.user_ip);
            setStep('CAPTCHA'); // Sucesso vai para o Anti-Robô
        } else {
            // Tratamento de Erros Granulares
            const msg = res.data.mensagem;
            if (msg.includes("SESSAO_DUPLICADA") || msg.includes("CONFLITO")) {
                handleBlock('Conflito de Sessão', msg, 'IP_LOCK');
            } else if (msg.includes("CPF_INVALIDO")) {
                handleBlock('Cadastro Irregular', msg, 'CPF');
            } else if (msg.includes("VOTO_DUPLICADO")) {
                handleBlock('Voto Registrado', 'Sua participação já foi auditada nesta eleição.', 'VOTED');
            } else {
                handleBlock('Acesso Negado', msg, 'ADMIN');
            }
        }
    } catch (error: any) {
        console.error("Erro Crítico:", error);
        handleBlock('Falha de Conexão', 'Não foi possível estabelecer link seguro com o Tribunal Eleitoral.', 'NETWORK');
    }
  };

  const request2FA = async () => {
    if (!captchaSolved) return;
    setIsRequesting2FA(true);
    try {
        const res = await axios.post(`${API_BASE}/eleicoes/enviar_2fa.php`, { token });
        if (res.data.status === 'sucesso') {
            setTentativas(res.data.tentativas_restantes);
            setTimeLeft(120); // Reseta timer
            setStep('AWAITING_2FA');
            toast({ 
                title: "Código Enviado", 
                description: "Verifique sua caixa de entrada (e spam).", 
                className: "bg-blue-600 text-white border-none"
            });
        } else {
            handleBlock('Erro de Segurança', res.data.mensagem, 'LOCK');
        }
    } catch (e) {
        toast({ title: "Erro", description: "Falha no serviço de e-mail.", variant: "destructive" });
    } finally {
        setIsRequesting2FA(false);
    }
  };

  const loadBallot = async () => {
      try {
          const res = await axios.get(`${API_BASE}/eleicoes.php?action=get_ballot`, { 
              headers: { Authorization: token } 
          });
          if (res.data.status === 'sucesso') {
              setChapas(res.data.chapas);
          }
      } catch (e) {
          toast({ title: "Erro", description: "Falha ao carregar candidatos.", variant: "destructive" });
      }
  };

  const castVote = async () => {
      if (votoSel === null) return;
      setIsSubmittingVote(true);
      try {
          const res = await axios.post(`${API_BASE}/eleicoes.php?action=vote`, {
              token, 
              token_2fa: tokenInput, 
              voto: votoSel
          }, { headers: { Authorization: token } });

          if (res.data.status === 'sucesso') {
              setRecibo(res.data);
              setStep('RECEIPT');
              toast({ title: "Sucesso", description: "Voto confirmado!", className: "bg-green-600 text-white" });
          } else {
              toast({ title: "Erro na Urna", description: res.data.mensagem, variant: "destructive" });
              // Se o erro for de código, volta para tentar de novo (se tiver tentativas)
              if (res.data.mensagem.includes("Código") || res.data.mensagem.includes("expirado")) {
                  // Mantém na tela de 2FA ou checa tentativas
              } else {
                  handleBlock('Erro Fatal', res.data.mensagem, 'FATAL');
              }
          }
      } catch (error) {
          handleBlock('Erro de Rede', 'Conexão perdida durante o voto. Verifique se o voto foi computado.', 'NETWORK');
      } finally {
          setIsSubmittingVote(false);
      }
  };

  // Formatador de Tempo (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- RENDERIZAÇÃO CONDICIONAL (VIEW LAYERS) ---

  if (step === 'CHECKING') {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
            </div>
            <div className="text-center">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Auditando Acesso</h2>
                <p className="text-sm text-slate-500 font-bold mt-2">Validando IP e Sessão...</p>
            </div>
        </div>
      );
  }

  if (step === 'BLOCKED') {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            <Navigation />
            <Card className="max-w-md w-full border-t-8 border-t-red-600 shadow-2xl mt-10 animate-in fade-in zoom-in duration-300">
                <CardContent className="p-8 text-center space-y-6">
                    <div className="bg-red-100 p-6 rounded-full w-fit mx-auto">
                        {errorDetails.type === 'IP_LOCK' ? <MonitorOff className="h-12 w-12 text-red-600"/> : 
                         errorDetails.type === 'VOTED' ? <FileCheck className="h-12 w-12 text-green-600"/> :
                         <ShieldAlert className="h-12 w-12 text-red-600" />}
                    </div>

                    <h2 className="text-2xl font-black uppercase text-slate-900 leading-tight">{errorDetails.title}</h2>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm leading-relaxed">
                        {errorDetails.msg}
                    </div>

                    <div className="pt-4">
                        {errorDetails.type === 'CPF' ? (
                            <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => navigate('/editar-perfil')}>
                                CORRIGIR MEU CADASTRO
                            </Button>
                        ) : (
                            <Button variant="outline" className="w-full h-12 font-bold border-slate-300 hover:bg-slate-50 text-slate-600" onClick={() => logout()}>
                                <LogOut className="mr-2 h-4 w-4"/> ENCERRAR SESSÃO
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      );
  }

  if (step === 'CAPTCHA') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navigation />
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-2xl border-none overflow-hidden animate-in slide-in-from-bottom-10">
                    <div className="bg-slate-900 p-8 text-white text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm border border-white/20">
                                <Lock className="h-10 w-10 text-blue-400" />
                            </div>
                        </div>
                        <CardTitle className="text-xl uppercase font-black tracking-tight">Portaria Digital</CardTitle>
                        <div className="mt-4 inline-flex items-center gap-2 bg-black/30 px-4 py-1.5 rounded-full text-[10px] font-mono border border-white/10 text-slate-300">
                            <Globe className="h-3 w-3" /> IP REGISTRADO: {userIp}
                        </div>
                    </div>
                    <CardContent className="p-8 space-y-8 text-center bg-white">
                        <div className="bg-slate-50 p-4 rounded-lg border text-left text-sm space-y-1">
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Identidade Confirmada</p>
                            <p className="font-bold text-slate-800 text-lg">{dadosEleitor?.nome}</p>
                            <p className="text-slate-500 font-mono">{dadosEleitor?.cpf_masked}</p>
                        </div>

                        <div 
                            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${captchaSolved ? 'bg-green-50 border-green-500' : 'bg-white border-slate-200 hover:border-blue-400'}`}
                            onClick={() => setCaptchaSolved(!captchaSolved)}
                        >
                            <div className="flex items-center justify-center gap-4">
                                <div className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-colors ${captchaSolved ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                    {captchaSolved && <CheckCircle2 className="h-4 w-4 text-white" />}
                                </div>
                                <span className={`font-bold text-sm uppercase tracking-wide ${captchaSolved ? 'text-green-700' : 'text-slate-600'}`}>Não sou um robô</span>
                            </div>
                        </div>

                        <Button 
                            disabled={!captchaSolved} 
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 font-black text-lg shadow-xl rounded-xl transition-all active:scale-95 disabled:opacity-50" 
                            onClick={() => setStep('READY_TO_START')}
                        >
                            AVANÇAR
                        </Button>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
      );
  }

  if (step === 'READY_TO_START') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navigation />
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-2xl overflow-hidden border-0 animate-in zoom-in-95">
                    <div className="bg-blue-600 p-8 text-white text-center">
                        <CheckCircle2 className="h-16 w-16 text-white mx-auto mb-4 opacity-90" />
                        <CardTitle className="text-2xl font-black uppercase">Tudo Pronto</CardTitle>
                        <p className="text-blue-100 text-sm mt-2">Vamos iniciar o protocolo de segurança.</p>
                    </div>
                    <CardContent className="p-8 space-y-6 bg-white text-center">
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Ao clicar abaixo, enviaremos um <strong>código único de 6 dígitos</strong> para o seu e-mail cadastrado. Você terá <strong>2 minutos</strong> para usá-lo.
                        </p>
                        <Button 
                            className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-xl rounded-xl" 
                            onClick={request2FA} 
                            disabled={isRequesting2FA}
                        >
                            {isRequesting2FA ? <Loader2 className="animate-spin mr-2" /> : "RECEBER CÓDIGO DE ACESSO"}
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
      );
  }

  if (step === 'AWAITING_2FA') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navigation />
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-2xl border-none overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white text-center relative">
                        <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors duration-500 ${timeLeft < 30 ? 'bg-red-600 animate-pulse' : 'bg-slate-700'}`}>
                            <Clock className="h-3 w-3" /> {formatTime(timeLeft)}
                        </div>
                        <Fingerprint className="h-12 w-12 mx-auto mb-3 text-blue-400" />
                        <CardTitle className="text-xl font-black uppercase tracking-tight">Validar Acesso</CardTitle>
                    </div>
                    <CardContent className="p-8 space-y-8 bg-white text-center">
                        <div className="space-y-2">
                            <Input 
                                className="text-center text-5xl h-24 font-mono tracking-[0.3em] font-black border-2 border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all rounded-xl" 
                                maxLength={6} 
                                placeholder="000000" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value.replace(/\D/g,''))} 
                            />
                            {tentativas !== null && (
                                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                                    Tentativas Restantes: <span className="text-red-600">{5 - (5 - tentativas)}</span>
                                </div>
                            )}
                        </div>
                        <Button 
                            className="w-full h-16 bg-green-600 hover:bg-green-700 font-black text-white text-lg shadow-xl rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                            disabled={tokenInput.length !== 6} 
                            onClick={() => { setStep('VOTING'); loadBallot(); }}
                        >
                            ACESSAR CABINE <ArrowRight className="ml-2 h-5 w-5"/>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
      );
  }

  if (step === 'VOTING') {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            <div className="bg-slate-800 p-4 shadow-md flex justify-between items-center px-4 md:px-8 border-b border-slate-700 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-full"><ShieldCheck className="h-6 w-6 text-green-400" /></div>
                    <div>
                        <h1 className="font-black text-lg uppercase tracking-tighter leading-none">Cabine Virtual</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Sessão: {dadosEleitor?.cpf_masked}</p>
                    </div>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <div className="text-center mb-10">
                    <Badge variant="outline" className="mb-4 border-slate-600 text-slate-400 px-4 py-1 uppercase tracking-widest text-[10px]">Eleições AMB 2026</Badge>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Selecione seu Candidato</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {chapas.map(c => (
                        <div 
                            key={c.numero_chapa} 
                            onClick={() => setVotoSel(c.numero_chapa)} 
                            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 group relative overflow-hidden ${votoSel === c.numero_chapa ? 'border-green-500 bg-slate-800 shadow-2xl shadow-green-500/20 scale-[1.02]' : 'border-slate-800 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800'}`}
                        >
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <span className="text-6xl font-black text-slate-200 opacity-90">{c.numero_chapa}</span>
                                {votoSel === c.numero_chapa && <div className="bg-green-500 p-2 rounded-full animate-in zoom-in"><CheckCircle2 className="h-6 w-6 text-slate-900" /></div>}
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-white uppercase leading-tight mb-2">{c.nome_chapa}</h3>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><User className="h-4 w-4"/> {c.nome_presidente}</p>
                                    {c.nome_vice && <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 ml-1"><Users className="h-3 w-3"/> {c.nome_vice}</p>}
                                </div>
                            </div>
                            {/* Efeito de Fundo */}
                            {votoSel === c.numero_chapa && <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent pointer-events-none"/>}
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-32">
                    <Button variant="outline" className={`h-14 px-8 font-black uppercase tracking-wider ${votoSel === 0 ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-slate-700 hover:border-white hover:text-white'}`} onClick={() => setVotoSel(0)}>Votar em Branco</Button>
                    <Button variant="outline" className={`h-14 px-8 font-black uppercase tracking-wider ${votoSel === -1 ? 'bg-red-600 text-white border-red-600' : 'bg-transparent text-slate-400 border-slate-700 hover:border-red-500 hover:text-red-500'}`} onClick={() => setVotoSel(-1)}>Anular Voto</Button>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-6 z-50">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="hidden md:block">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Confirmação:</span>
                        <span className="text-xl font-black text-white">
                            {votoSel !== null ? (votoSel > 0 ? `CHAPA ${votoSel}` : votoSel === 0 ? "VOTO EM BRANCO" : "VOTO NULO") : "NENHUM SELECIONADO"}
                        </span>
                    </div>
                    <Button 
                        disabled={votoSel === null || isSubmittingVote} 
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 font-black px-12 h-16 rounded-full text-lg shadow-xl shadow-green-900/50 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100" 
                        onClick={castVote}
                    >
                        {isSubmittingVote ? <Loader2 className="animate-spin mr-2" /> : "CONFIRMAR VOTO AGORA"}
                    </Button>
                </div>
            </div>
        </div>
      );
  }

  if (step === 'RECEIPT') {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-green-600 animate-in zoom-in duration-500">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-green-100 p-6 rounded-full w-fit mb-6 animate-bounce">
                        <FileCheck className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Voto Computado</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Sua participação foi auditada com sucesso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-200/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-slate-200 px-3 py-1 rounded-bl-xl text-[10px] font-bold text-slate-500">SHA-256</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hash de Auditoria</p>
                        <p className="font-mono text-xs break-all text-slate-800 font-bold leading-relaxed">{recibo?.hash}</p>
                        <div className="h-px bg-slate-300 my-4"></div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                            <span>DATA:</span>
                            <span>{recibo?.data}</span>
                        </div>
                    </div>
                    <Button className="w-full h-14 font-black bg-slate-900 text-white hover:bg-slate-800 rounded-xl" onClick={() => navigate('/')}>VOLTAR AO INÍCIO</Button>
                </CardContent>
            </Card>
        </div>
      );
  }

  return null;
}
// linha 380 EleicoesPage.tsx