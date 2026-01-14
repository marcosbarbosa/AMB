/*
 * ==========================================================
 * ARQUIVO: LoginForm.tsx
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 * STATUS: Versão Estável 6.5 - "Momento Sublime"
 * DATA: 14 de Janeiro de 2026
 * FUNÇÃO: Formulário de login sincronizado com a API PHP (user/password).
 * CORREÇÃO: Mapeamento de 'senha' para 'password' e 'user' para 'atleta'.
 * ==========================================================
 */

import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react'; // Ícones
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// URL direta da API de produção
const API_URL = 'https://www.ambamazonas.com.br/api/login.php';

export function LoginForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // CORREÇÃO 1: O PHP espera 'password', não 'senha'
    const payload = { 
      email, 
      password: senha 
    };

    try {
      const response = await axios.post(API_URL, payload);

      // CORREÇÃO 2: O PHP retorna 'user', mas o AuthContext espera 'atleta'
      // Mapeamos a resposta 'user' para a variável 'atleta'
      const { user, token } = response.data; 
      const atleta = user; 

      toast({
        title: 'Login bem-sucedido!',
        description: `Bem-vindo de volta, ${atleta.nome_completo}!`,
        duration: 3000,
      });

      // 3. Efetiva o login no contexto global
      login(atleta, token);

    } catch (error: any) {
      console.error("Erro ao fazer login:", error);

      let mensagemErro = 'Não foi possível conectar ao servidor.';

      // Tratamento robusto de erros vindos do PHP
      if (error.response?.data?.message) {
        mensagemErro = error.response.data.message; // Padrão novo 'message'
      } else if (error.response?.data?.mensagem) {
        mensagemErro = error.response.data.mensagem; // Padrão antigo 'mensagem'
      }

      toast({
        title: 'Falha no acesso',
        description: mensagemErro,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
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
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <Input 
          id="senha" 
          name="senha" 
          type="password" 
          placeholder="********" 
          required 
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="h-12"
        />
      </div>

      <div className="flex items-center justify-between">
        <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
          Esqueceu sua senha?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verificando...' : 'Entrar no Portal'}
        {!isSubmitting && <LogIn className="ml-2 h-4 w-4" />}
      </Button>

      <div className="text-center text-muted-foreground text-sm pt-2">
        Não tem uma conta?{' '}
        <Link to="/cadastro" className="text-primary hover:underline font-bold">
          Cadastre-se aqui
        </Link>
      </div>
    </form>
  );
}