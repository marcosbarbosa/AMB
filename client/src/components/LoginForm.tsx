/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 16:00
 * Versão: 1.1 (Atualizado para AuthContext)
 *
 * Descrição: Formulário de login do atleta.
 * ATUALIZADO para usar o AuthContext (useAuth) para gerir o estado.
 *
 * ==========================================================
 */
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. IMPORTA O "ATALHO" (HOOK) PARA O NOSSO "CÉREBRO"
import { useAuth } from '@/context/AuthContext';

// ***** ATENÇÃO: VERIFIQUE O URL DO SEU BACKEND REAL *****
const API_URL = 'https://www.ambamazonas.com.br/api/login.php';

export function LoginForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // 2. CHAMA O NOSSO "CÉREBRO"
  const { login } = useAuth(); // Obtém a função de login do AuthContext

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      email: email,
      senha: senha,
    };

    try {
      const response = await axios.post(API_URL, payload);
      const { atleta, token } = response.data;

      toast({
        title: 'Login bem-sucedido!',
        description: `Bem-vindo de volta, ${atleta.nome_completo}!`,
      });

      // 3. AÇÃO PRINCIPAL: CHAMA A FUNÇÃO DE LOGIN DO "CÉREBRO"
      // Em vez de mexer no localStorage, nós apenas entregamos os dados.
      login(atleta, token);

      // 4. Ação futura: Redirecionar para o Painel do Atleta
      // (Agora que o estado está global, o Header vai mudar sozinho)
      // window.location.href = '/painel'; 

    } catch (error: any) {
      // 5. O tratamento de erros continua igual
      console.error("Erro ao fazer login:", error);

      let mensagemErro = 'Não foi possível conectar ao servidor.';
      if (error.response && error.response.data && error.response.data.mensagem) {
        mensagemErro = error.response.data.mensagem;
      }

      toast({
        title: 'Erro no Login',
        description: mensagemErro,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // O JSX/HTML abaixo não muda nada
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
        />
      </div>

      <div className="flex items-center justify-between">
        {/* 6. TODO: Criar a página /esqueci-senha */}
        <Link to="/esqueci-senha" className="text-sm text-primary hover:underline">
          Esqueceu sua senha?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
        <LogIn className="ml-2 h-4 w-4" />
      </Button>

      <div className="text-center text-muted-foreground text-sm">
        Não tem uma conta?{' '}
        <Link to="/cadastro" className="text-primary hover:underline font-medium">
          Cadastre-se aqui
        </Link>
      </div>
    </form>
  );
}