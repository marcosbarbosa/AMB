// Nome: LoginForm.tsx
// Caminho: client/src/components/LoginForm.tsx
// Data: 2026-01-22
// Hora: 15:30
// Função: Login com Rota Auth Atualizada
// Versão: v7.0 Auth Path Fix
// Alteração: Correção da API_URL para /api/auth/login.php

import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// CORREÇÃO CRÍTICA: Apontando para a pasta AUTH correta
const API_URL = 'https://www.ambamazonas.com.br/api/auth/login.php';

export function LoginForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = { 
      email, 
      password: senha 
    };

    try {
      const response = await axios.post(API_URL, payload);

      const { status, message, token, user } = response.data;

      if (status === 'sucesso' && token) {
        toast({
            title: 'Bem-vindo!',
            description: `Olá, ${user.nome_completo || 'Atleta'}!`,
            className: "bg-green-600 text-white border-0"
        });
        login(user, token);
      } else {
        throw new Error(message || 'Credenciais inválidas.');
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      const msg = error.response?.data?.message || error.response?.data?.mensagem || error.message || 'Erro de conexão.';

      toast({
        title: 'Acesso Negado',
        description: msg,
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center justify-between">
        <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
          Esqueceu sua senha?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all bg-blue-600 hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="ml-2 h-4 w-4" />}
        {isSubmitting ? 'Verificando...' : 'Entrar no Portal'}
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
// linha 115 LoginForm.tsx