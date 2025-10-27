/*
 * ==========================================================
 * MÓDULO 10: Componente CadastroForm.tsx (RF-CAD-001)
 * Este é o formulário de cadastro de atleta.
 * ==========================================================
 */
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; // Usaremos Label simples
import { Checkbox } from '@/components/ui/checkbox'; // Para a autorização de imagem
import { Send, User, Mail, Lock, Calendar, Home, FileText } from 'lucide-react';

// ***** ATENÇÃO: DEFINE O URL DO TEU BACKEND REAL *****
const API_URL = 'https://www.ambamazonas.com.br/api/cadastrar_atleta.php';

export function CadastroForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Não vamos usar react-hook-form aqui por agora, pois 'FormData'
  // (necessário para o upload de fotos) funciona melhor com um formulário controlado simples.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Impede o recarregamento da página
    setIsSubmitting(true);

    // 1. Criar um objeto 'FormData'
    // FormData é a forma correta de enviar ficheiros e texto juntos
    const formData = new FormData(event.currentTarget);

    // 2. Debug: Verificar o que estamos a enviar (opcional)
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      // 3. Enviar os dados usando AXIOS
      // O backend PHP (Módulo 3) espera 'form-data' (que é o padrão do FormData)
      const response = await axios.post(API_URL, formData, {
        headers: {
          // O Axios define 'multipart/form-data' automaticamente com o FormData
          'Content-Type': 'multipart/form-data',
        },
      });

      // 4. Sucesso!
      toast({
        title: 'Cadastro enviado!',
        description: response.data.mensagem, // Mensagem do nosso PHP!
      });
      (event.target as HTMLFormElement).reset(); // Limpa o formulário

    } catch (error: any) {
      // 5. Erro!
      console.error("Erro ao cadastrar:", error);

      // Tenta ler a mensagem de erro do nosso PHP (ex: "CPF já existe")
      let mensagemErro = 'Não foi possível conectar ao servidor.';
      if (error.response && error.response.data && error.response.data.mensagem) {
        mensagemErro = error.response.data.mensagem;
      }

      toast({
        title: 'Erro ao cadastrar',
        description: mensagemErro,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Este é o nosso formulário HTML/JSX
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Vamos agrupar os campos em secções.
        Nota: 'data-testid' é para testes, 'name' é o que o PHP recebe.
      */}

      {/* --- Secção 1: Login --- */}
      <h3 className="text-xl font-semibold text-foreground border-b pb-2">Informações de Acesso</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="seu@email.com" required data-testid="input-cadastro-email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" name="senha" type="password" placeholder="********" required data-testid="input-cadastro-senha" />
        </div>
      </div>

      {/* --- Secção 2: Dados Pessoais --- */}
      <h3 className="text-xl font-semibold text-foreground border-b pb-2 mt-6">Dados Pessoais</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome_completo">Nome Completo</Label>
          <Input id="nome_completo" name="nome_completo" placeholder="Seu nome completo" required data-testid="input-cadastro-nome" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input id="data_nascimento" name="data_nascimento" type="date" required data-testid="input-cadastro-data" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" name="cpf" placeholder="000.000.000-00" required data-testid="input-cadastro-cpf" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input id="rg" name="rg" placeholder="00.000.000-0" data-testid="input-cadastro-rg" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nacionalidade">Nacionalidade</Label>
            <Input id="nacionalidade" name="nacionalidade" placeholder="Brasileiro(a)" data-testid="input-cadastro-nacionalidade" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="naturalidade">Naturalidade (Cidade/Estado)</Label>
          <Input id="naturalidade" name="naturalidade" placeholder="Manaus/AM" data-testid="input-cadastro-naturalidade" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filiacao">Filiação (Nome do Pai e Mãe)</Label>
          <Textarea id="filiacao" name="filiacao" placeholder="Nome do Pai..." rows={3} data-testid="textarea-cadastro-filiacao" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço Completo</Label>
          <Textarea id="endereco" name="endereco" placeholder="Rua, Número, Bairro, CEP..." rows={3} data-testid="textarea-cadastro-endereco" />
        </div>
      </div>

      {/* --- Secção 3: Foto e Autorização --- */}
      <h3 className="text-xl font-semibold text-foreground border-b pb-2 mt-6">Foto e Termos</h3>
      <div className="space-y-2">
        <Label htmlFor="foto_perfil">Foto de Perfil (Selfie)</Label>
        <Input 
          id="foto_perfil" 
          name="foto_perfil" // Este 'name' DEVE bater com o do PHP: $_FILES['foto_perfil']
          type="file" 
          accept="image/png, image/jpeg" 
          required 
          data-testid="input-cadastro-foto" 
        />
        <p className="text-sm text-muted-foreground">Obrigatório para a ficha. Formatos JPG ou PNG.</p>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Checkbox 
          id="autoriza_imagem" 
          name="autoriza_imagem" // Este 'name' DEVE bater com o do PHP: $_POST['autoriza_imagem']
          value="true" // O valor que será enviado se marcado
          required 
          data-testid="checkbox-cadastro-autoriza"
        />
        <Label htmlFor="autoriza_imagem" className="text-sm font-medium leading-none cursor-pointer">
          Autorizo o direito de imagem (RF-CAD-006)
        </Label>
      </div>

      {/* --- Secção 4: Envio --- */}
      <Button 
        type="submit" 
        className="w-full h-12 text-base mt-8"
        disabled={isSubmitting}
        data-testid="button-cadastro-submit"
      >
        {isSubmitting ? 'Enviando Cadastro...' : 'Enviar Cadastro'}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}