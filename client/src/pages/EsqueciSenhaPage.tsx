// Nome: EsqueciSenhaPage.tsx
// Caminho: client/src/pages/EsqueciSenhaPage.tsx
// Data: 2026-01-22
// Versão: v7.0 Direct Path

import { useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// URL Corrigida para apontar para a pasta AUTH
const API_URL = 'https://www.ambamazonas.com.br/api/auth/solicitar_redefinicao.php';

export default function EsqueciSenhaPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await axios.post(API_URL, { email });

      if (res.data.status === 'sucesso') {
        setSent(true);
        toast({ 
            title: "Verifique seu e-mail", 
            description: res.data.mensagem,
            className: "bg-green-600 text-white border-0"
        });
      } else {
        toast({ title: "Atenção", description: res.data.mensagem, variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Erro:", error);
      const msg = error.response?.data?.mensagem || "Erro de conexão com o servidor.";
      toast({ title: "Falha", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
            <div className="mb-6">
                <Link to="/login" className="text-slate-500 hover:text-blue-600 text-sm flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> Voltar para Login
                </Link>
            </div>

            <Card className="shadow-2xl border-slate-200">
                <CardHeader className="text-center pb-2">
                    <div className={`mx-auto p-4 rounded-full w-fit mb-4 ${sent ? 'bg-green-100' : 'bg-blue-50'}`}>
                        {sent ? <CheckCircle2 className="h-8 w-8 text-green-600" /> : <Mail className="h-8 w-8 text-blue-600" />}
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 uppercase">
                        {sent ? "E-mail Enviado" : "Recuperar Senha"}
                    </CardTitle>
                    <CardDescription>
                        {sent ? "Siga as instruções enviadas para seu e-mail." : "Informe seu e-mail para continuar."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input 
                                type="email" 
                                placeholder="seu@email.com" 
                                className="h-12 text-lg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <Button type="submit" className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : "Enviar Link"}
                            </Button>
                        </form>
                    ) : (
                        <Button variant="outline" className="w-full h-12" onClick={() => setSent(false)}>
                            Tentar outro e-mail
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
// linha 100 EsqueciSenhaPage.tsx