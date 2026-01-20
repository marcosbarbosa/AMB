// Nome: RedefinirSenhaPage.tsx
// Caminho: client/src/pages/RedefinirSenhaPage.tsx
// Data: 2026-01-22
// Versão: v7.0 Direct Path

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Save, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

// URL Corrigida para apontar para a pasta AUTH
const EXECUTAR_API_URL = 'https://www.ambamazonas.com.br/api/auth/executar_redefinicao.php';

export default function RedefinirSenhaPage() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [erroToken, setErroToken] = useState<string | null>(null);

  useEffect(() => {
    const t = searchParams.get('token');
    if (!t) setErroToken('Link inválido.');
    else setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      toast({ title: 'Erro', description: 'Senhas não conferem.', variant: 'destructive' });
      return;
    }
    if (senha.length < 6) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(EXECUTAR_API_URL, { token, nova_senha: senha });
      if (res.data.status === 'sucesso') {
        setIsSuccess(true);
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message || 'Falha ao salvar.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">

            {isSuccess ? (
              <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-green-100">
                <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Sucesso!</h2>
                <p className="text-slate-600 mb-8">Sua senha foi atualizada.</p>
                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/login">Fazer Login</Link>
                </Button>
              </div>
            ) : erroToken ? (
              <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-red-100">
                <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-700">Link Expirado</h2>
                <Button variant="outline" className="mt-6 w-full" asChild>
                  <Link to="/esqueci-senha">Solicitar Novo</Link>
                </Button>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="text-center mb-6">
                    <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h1 className="text-2xl font-bold text-slate-900">Nova Senha</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Senha</Label>
                    <Input type="password" value={senha} onChange={e=>setSenha(e.target.value)} required minLength={6} className="h-12"/>
                  </div>
                  <div>
                    <Label>Confirmar</Label>
                    <Input type="password" value={confirmarSenha} onChange={e=>setConfirmarSenha(e.target.value)} required minLength={6} className="h-12"/>
                  </div>
                  <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Salvar Senha"}
                  </Button>
                </form>
              </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 100 RedefinirSenhaPage.tsx