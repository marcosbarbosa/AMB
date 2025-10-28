/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:12
 * Versão: 1.2 (Refatoração de Terminologia)
 *
 * Descrição: Formulário de login do associado.
 * ATUALIZADO para usar a terminologia "Associado" nos logs e comentários.
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
import { useAuth } from '@/context/AuthContext';

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

    const payload = { email, senha };

    try {
      const response = await axios.post(API_URL, payload);
      // 1. O backend ainda retorna um objeto 'atleta', vamos manter isso internamente
      // mas a interface do utilizador dirá 'associado'.
      const { atleta, token } = response.data; 

      toast({
        title: 'Login bem-sucedido!',
        description: `Bem-vindo de volta, ${atleta.nome_completo}!`,
      });

      // 2. Chama a função login do AuthContext (que armazena 'atletaInfo')
      login(atleta, token);

      // console.log('Login do associado com sucesso:', atleta); // Log atualizado
      // console.log('Token recebido:', token);

      // Ação futura: Redirecionar para o Painel do Associado
      // window.location.href = '/painel'; 

    } catch (error: any) {
      console.error("Erro ao fazer login do associado:", error); // Log atualizado

      let mensagemErro = 'Não foi possível conectar ao servidor.';
      if (error.response?.data?.mensagem) {
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