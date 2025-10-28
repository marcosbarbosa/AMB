/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:05
 * Versão: 1.2 (Refatoração de Terminologia)
 *
 * Descrição: Formulário de cadastro de associado.
 * ATUALIZADO para usar a terminologia "Associado" em vez de "Atleta".
 *
 * ==========================================================
 */
// ... (importações mantidas - useState, axios, useToast, etc.)
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label'; 
import { Checkbox } from '@/components/ui/checkbox'; 
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; 
import { Send } from 'lucide-react'; // Removi ícones não usados aqui

const API_URL = 'https://www.ambamazonas.com.br/api/cadastrar_atleta.php'; // Backend ainda usa 'atleta' no nome do script

export function CadastroForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({
        title: 'Cadastro enviado!',
         // 1. ATUALIZA A MENSAGEM DE SUCESSO VINDA DO PHP (se necessário)
         // O PHP já foi atualizado para dizer "Associado", então deve funcionar.
        description: response.data.mensagem, 
      });
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error("Erro ao cadastrar associado:", error); // Atualiza log
      let mensagemErro = 'Não foi possível conectar ao servidor.';
      if (error.response?.data?.mensagem) {
        mensagemErro = error.response.data.mensagem;
      }
      toast({
        title: 'Erro ao cadastrar', // Mantém genérico
        description: mensagemErro,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* --- Secção 1: Login --- */}
      <h3 className="text-xl font-semibold text-foreground border-b pb-2">Informações de Acesso</h3>
       {/* ... (campos Email, Senha mantidos) ... */}
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
      <h3 className="text-xl font-semibold text-foreground border-b pb-2 mt-6">Dados Pessoais do Associado</h3> 
       {/* ... (campos Nome, Data Nasc, CPF, RG, etc. - Mantidos iguais) ... */}
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

      {/* --- Secção 3: Foto e Termos --- */}
      <h3 className="text-xl font-semibold text-foreground border-b pb-2 mt-6">Foto e Termos</h3>
      {/* ... (campo Foto de Perfil mantido) ... */}
      <div className="space-y-2">
        <Label htmlFor="foto_perfil">Foto de Perfil (Selfie)</Label>
        <Input id="foto_perfil" name="foto_perfil" type="file" accept="image/png, image/jpeg" required data-testid="input-cadastro-foto" />
        <p className="text-sm text-muted-foreground">Obrigatório para a ficha. Formatos JPG ou PNG.</p>
      </div>
      {/* ... (Checkbox Autoriza Imagem mantido) ... */}
      <div className="flex items-center space-x-2 pt-4">
        <Checkbox id="autoriza_imagem" name="autoriza_imagem" value="true" required data-testid="checkbox-cadastro-autoriza"/>
        <Label htmlFor="autoriza_imagem" className="text-sm font-medium leading-none cursor-pointer">
          Autorizo o direito de imagem (RF-CAD-006)
        </Label>
      </div>

      {/* --- Secção 4: Newsletter --- */}
      <h3 className="text-xl font-semibold text-foreground border-b pb-2 mt-6">Comunicações</h3>
      {/* ... (Opções de Newsletter mantidas) ... */}
      <div className="space-y-3">
         <Label>Deseja receber a Newsletter da AMB?</Label>
         <RadioGroup name="preferencia_newsletter" defaultValue="nenhum" className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2" data-testid="radio-group-newsletter">
           <div className="flex items-center space-x-2">
             <RadioGroupItem value="whatsapp" id="news-whatsapp" />
             <Label htmlFor="news-whatsapp" className="cursor-pointer">Pelo WhatsApp</Label>
           </div>
           <div className="flex items-center space-x-2">
             <RadioGroupItem value="email" id="news-email" />
             <Label htmlFor="news-email" className="cursor-pointer">Por E-mail</Label>
           </div>
           <div className="flex items-center space-x-2">
             <RadioGroupItem value="nenhum" id="news-nenhum" />
             <Label htmlFor="news-nenhum" className="cursor-pointer">Não desejo receber</Label>
           </div>
         </RadioGroup>
         <p className="text-sm text-muted-foreground pt-1">
            Enviaremos novidades sobre eventos e competições. Você pode alterar esta preferência depois no seu painel.
         </p>
      </div>


      {/* --- Secção Final: Envio --- */}
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