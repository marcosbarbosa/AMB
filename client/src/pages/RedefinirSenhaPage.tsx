// Nome: RedefinirSenhaPage.tsx
// Caminho: client/src/pages/RedefinirSenhaPage.tsx
// Data: 2026-01-22
// Hora: 01:20
// Função: Formulário de nova senha
// Versão: v2.0 Final URL

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Save, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const EXECUTAR_API_URL = '[https://www.ambamazonas.com.br/api/auth/executar_redefinicao.php](https://www.ambamazonas.com.br/api/auth/executar_redefinicao.php)';

export default function RedefinirSenhaPage() {
  const { toast } = useToast();
  // const navigate = useNavigate(); // Opcional: redirecionar automaticamente
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [erroToken, setErroToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenDaUrl = searchParams.get('token');
    if (!tokenDaUrl) {
      setErroToken('Token não encontrado na URL.');
    } else {
      setToken(tokenDaUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (senha !== confirmarSenha) {
      toast({ title: 'Senhas não conferem', variant: 'destructive' });
      return;
    }
    if (senha.length < 6) {
      toast({ title: 'Senha muito curta (mín. 6 caracteres)', variant: 'destructive' });
      return;
    }
    if (!token) return;

    setIsSubmitting(true);

    try {
      const payload = { token, nova_senha: senha };
      const response = await axios.post(EXECUTAR_API_URL, payload);

      if (response.data.status === 'sucesso') {
        setIsSuccess(true);
        toast({ 
            title: 'Sucesso!', 
            description: 'Sua senha foi alterada.', 
            className: "bg-green-600 text-white" 
        });
      } else {
        throw new Error(response.data.mensagem || 'Erro desconhecido');
      }

    } catch (error: any) {
      const msg = error.response?.data?.mensagem || error.message || 'Erro de conexão.';
      toast({ title: 'Falha na Redefinição', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navigation />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">

            {/* CABEÇALHO SUCESSO */}
            {isSuccess ? (
              <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-green-100">
                <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Senha Alterada!</h2>
                <p className="text-slate-600 mb-8">
                  Sua senha foi atualizada com sucesso. Você já pode acessar sua conta.
                </p>
                <Button className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/login">Ir para Login</Link>
                </Button>
              </div>

            /* ERRO DE TOKEN */
            ) : erroToken ? (
              <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-red-100">
                <div className="mx-auto bg-red-100 p-4 rounded-full w-fit mb-6">
                    <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Link Inválido</h2>
                <p className="text-slate-600 mb-8">
                  O link de recuperação parece estar quebrado ou já foi utilizado.
                </p>
                <Button variant="outline" className="w-full h-12" asChild>
                  <Link to="/esqueci-senha">Solicitar Novo Link</Link>
                </Button>
              </div>

            /* FORMULÁRIO */
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 uppercase">Nova Senha</h1>
                    <p className="text-sm text-slate-500 mt-2">Crie uma senha segura para sua conta.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="senha">Nova Senha</Label>
                    <Input 
                      id="senha" 
                      type="password" 
                      placeholder="Mínimo 6 caracteres" 
                      required 
                      className="h-12"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                    <Input