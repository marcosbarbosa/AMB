/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 20:05
 * Versão: 1.0
 *
 * Descrição: Página para o associado EXECUTAR a redefinição de senha.
 * (Parte 5 do Módulo 23 - Frontend)
 * Lê o token da URL e envia a nova senha para o backend.
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Save, Loader2, AlertTriangle } from 'lucide-react';

// TODO: (Tarefa 180) Criar este endpoint no backend
const EXECUTAR_API_URL = 'https://www.ambamazonas.com.br/api/executar_redefinicao.php';

export default function RedefinirSenhaPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook para ler a URL

  const [token, setToken] = useState<string | null>(null);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [erroToken, setErroToken] = useState<string | null>(null);

  // Efeito: Lê o token da URL quando a página carrega
  useEffect(() => {
    const tokenDaUrl = searchParams.get('token');
    if (!tokenDaUrl) {
      setErroToken('Token de redefinição não encontrado ou inválido.');
      toast({
        title: 'Link Inválido',
        description: 'O link de redefinição de senha parece estar quebrado ou incompleto.',
        variant: 'destructive',
      });
    } else {
      setToken(tokenDaUrl);
    }
  }, [searchParams, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (senha !== confirmarSenha) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }
    if (senha.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter no mínimo 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }
    if (!token) return; // Segurança

    setIsSubmitting(true);

    try {
      const payload = {
        token: token,
        nova_senha: senha
      };

      // TODO: (Tarefa 180) Criar este endpoint
      const response = await axios.post(EXECUTAR_API_URL, payload);

      if (response.data.status === 'sucesso') {
        toast({
          title: 'Senha Redefinida!',
          description: response.data.mensagem,
        });
        setIsSuccess(true); // Mostra a mensagem de sucesso
      } else {
        throw new Error(response.data.mensagem || 'Erro desconhecido');
      }

    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error);
      let mensagemErro = 'Não foi possível conectar ao servidor.';
      if (error.response?.data?.mensagem) {
        // Ex: "Token inválido ou expirado."
        mensagemErro = error.response.data.mensagem;
      }
      toast({
        title: 'Erro na Redefinição',
        description: mensagemErro,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
                Criar Nova Senha
              </h1>
            </div>

            {/* Se o link foi enviado com sucesso */}
            {isSuccess ? (
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
                <Lock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Senha Alterada!</h2>
                <p className="text-muted-foreground">
                  Sua senha foi redefinida com sucesso. 
                  Você já pode fazer login com sua nova senha.
                </p>
                <Button variant="default" className="mt-6" asChild>
                  <Link to="/login">Ir para o Login</Link>
                </Button>
              </div>

            /* Se o token estiver quebrado/ausente */
            ) : erroToken ? (
              <div className="bg-card p-6 rounded-lg shadow-sm border border-destructive text-center">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-destructive-foreground mb-2">Link Inválido</h2>
                <p className="text-muted-foreground">
                  {erroToken} Por favor, solicite um novo link.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link to="/esqueci-senha">Solicitar Novo Link</Link>
                </Button>
              </div>

            /* Formulário Padrão */
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-sm text-muted-foreground text-center">
                  Digite sua nova senha. Ela deve ter no mínimo 6 caracteres.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="senha">Nova Senha</Label>
                  <Input 
                    id="senha" 
                    name="senha" 
                    type="password" 
                    placeholder="********" 
                    required 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirmarSenha" 
                    name="confirmarSenha" 
                    type="password" 
                    placeholder="********" 
                    required 
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? 'Aguarde...' : 'Salvar Nova Senha'}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}