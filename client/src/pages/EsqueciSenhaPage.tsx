/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 1 de novembro de 2025
 * Hora: 19:40
 * Versão: 1.0
 *
 * Descrição: Página para o associado solicitar a redefinição de senha.
 * (Parte 1 do Módulo 23 - Frontend)
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Mail, Send, Loader2 } from 'lucide-react';

// TODO: (Tarefa 172) Criar este endpoint no backend
const SOLICITAR_API_URL = 'https://www.ambamazonas.com.br/api/solicitar_redefinicao.php';

export default function EsqueciSenhaPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      // O backend (a ser criado) espera um JSON com o email
      const response = await axios.post(SOLICITAR_API_URL, { email });

      if (response.data.status === 'sucesso') {
        toast({
          title: 'Verifique seu E-mail',
          description: response.data.mensagem,
        });
        setIsSuccess(true); // Mostra a mensagem de sucesso na página
      } else {
        throw new Error(response.data.mensagem || 'Erro desconhecido');
      }

    } catch (error: any) {
      console.error("Erro ao solicitar redefinição:", error);
      let mensagemErro = 'Não foi possível conectar ao servidor.';
      if (error.response?.data?.mensagem) {
        // Ex: "E-mail não encontrado."
        mensagemErro = error.response.data.mensagem;
      }
      toast({
        title: 'Erro na Solicitação',
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
                Redefinir Senha
              </h1>
              <p className="text-muted-foreground">
                Digite seu e-mail e enviaremos um link para você
                voltar a acessar sua conta.
              </p>
            </div>

            {/* Se o email foi enviado com sucesso, esconde o form e mostra a msg */}
            {isSuccess ? (
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border text-center">
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Email enviado!</h2>
                <p className="text-muted-foreground">
                  Um link de redefinição foi enviado para <strong>{email}</strong>. 
                  Por favor, verifique sua caixa de entrada e spam.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link to="/login">Voltar para o Login</Link>
                </Button>
              </div>
            ) : (
              // Formulário de solicitação
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="seu@email.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? 'Aguarde...' : 'Enviar Link de Redefinição'}
                </Button>

                <div className="text-center text-muted-foreground text-sm">
                  Lembrou a senha?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Faça login aqui
                  </Link>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}