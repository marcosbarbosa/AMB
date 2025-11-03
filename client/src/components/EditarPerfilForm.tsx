/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 3 de novembro de 2025
 * Hora: 10:50
 * Versão: 1.5 (Corrige Envio de Token e Bug do Checkbox)
 * Tarefa: 273
 *
 * Descrição: Formulário para o associado editar seus dados.
 * CORRIGIDO: 
 * 1. Estrutura do payload para {token:..., data: {...}} (para o backend Plano G).
 * 2. Lógica de carregamento do Checkbox (Autoriza Imagem).
 *
 * ==========================================================
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; 
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Save } from 'lucide-react'; 

const API_URL = 'https://www.ambamazonas.com.br/api/atualizar_perfil.php';

export function EditarPerfilForm() {
  const { atleta, token, login } = useAuth(); 
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome_completo: '', data_nascimento: '', endereco: '', rg: '',
    nacionalidade: '', naturalidade: '', filiacao: '',
    autoriza_imagem: false, preferencia_newsletter: 'nenhum',
  });

  // 1. CORREÇÃO CHECKBOX (Carregamento)
  useEffect(() => {
    if (atleta) {
      setFormData({
        nome_completo: atleta.nome_completo || '',
        data_nascimento: atleta.data_nascimento ? atleta.data_nascimento.split('T')[0] : '', 
        endereco: atleta.endereco || '',
        rg: atleta.rg || '',
        nacionalidade: atleta.nacionalidade || '',
        naturalidade: atleta.naturalidade || '',
        filiacao: atleta.filiacao || '',
        // CORREÇÃO CRÍTICA: O 'atleta' do AuthContext já tem o boolean (do login.php)
        // A conversão '!!' garante que 'undefined' ou 'null' vire 'false'.
        autoriza_imagem: !!atleta.autoriza_imagem, 
        preferencia_newsletter: atleta.preferencia_newsletter === 'whatsapp' ? 'email' : (atleta.preferencia_newsletter || 'nenhum'),
      });
    }
  }, [atleta]);


  // Handlers de mudança (Mantidos)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value, }));
  };
  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
      setFormData(prevState => ({ 
        ...prevState, 
        autoriza_imagem: checked === true, // Salva como true/false
      }));
  };
  const handleRadioChange = (value: string) => {
      setFormData(prevState => ({ ...prevState, preferencia_newsletter: value, }));
  };


  // 2. CORREÇÃO TOKEN (Envio)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!token) {
      toast({ title: 'Erro', description: 'Você não está autenticado.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }

    try {
      // 2a. CORREÇÃO PAYLOAD: Estrutura o JSON para o Backend
      const payloadCompleto = {
        token: token,
        data: { // Os dados do formulário vão para o sub-objeto 'data'
            nome_completo: formData.nome_completo,
            data_nascimento: formData.data_nascimento,
            endereco: formData.endereco,
            rg: formData.rg,
            nacionalidade: formData.nacionalidade,
            naturalidade: formData.naturalidade,
            filiacao: formData.filiacao,
            autoriza_imagem: formData.autoriza_imagem, 
            preferencia_newsletter: formData.preferencia_newsletter,
        }
      };

      const response = await axios.post(API_URL, payloadCompleto, { 
        headers: {
          'Content-Type': 'application/json',
          // 2b. REMOVE CABEÇALHO X-AUTHORIZATION (desnecessário, pois o token está no BODY)
        },
      });

      toast({
        title: 'Sucesso!',
        description: response.data.mensagem, 
      });

      // 3. ATUALIZA O "CÉREBRO" (AuthContext) com os dados que acabamos de salvar
      if (atleta && (response.data.status === 'sucesso' || response.data.status === 'info')) { 
           const atletaAtualizado = { ...atleta, ...payloadCompleto.data };
           // O 'login' recarrega o estado global com os dados atualizados
           login(atletaAtualizado as any, token); 
      }

    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      let mensagemErro = 'Não foi possível conectar ao servidor.';
      if (error.response?.data?.mensagem) {
        // Ex: O erro do PHP "Token (Body) inválido ou ausente."
        mensagemErro = error.response.data.mensagem;
      }
      toast({
        title: 'Erro ao atualizar',
        description: mensagemErro,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

   if (!atleta) return <p className="text-muted-foreground">Carregando dados...</p>;

  // JSX do Formulário
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- Secções Dados Pessoais --- */}
      <h3 className="text-xl font-semibold text-foreground border-b pb-2">Dados Pessoais</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome_completo">Nome Completo</Label>
          <Input id="nome_completo" name="nome_completo" value={formData.nome_completo} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input id="data_nascimento" name="data_nascimento" type="date" value={formData.data_nascimento} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
             <Label htmlFor="cpf_display">CPF (Não editável)</Label>
             <Input id="cpf_display" value={atleta.cpf || 'N/A'} disabled className="bg-muted/50"/>
          </div>
        </div>
         <div className="space-y-2">
             <Label htmlFor="email_display">Email (Não editável)</Label>
             <Input id="email_display" value={atleta.email || 'N/A'} disabled className="bg-muted/50"/>
         </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input id="rg" name="rg" value={formData.rg} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nacionalidade">Nacionalidade</Label>
            <Input id="nacionalidade" name="nacionalidade" value={formData.nacionalidade} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="naturalidade">Naturalidade (Cidade/Estado)</Label>
          <Input id="naturalidade" name="naturalidade" value={formData.naturalidade} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filiacao">Filiação (Nome do Pai e Mãe)</Label>
          <Textarea id="filiacao" name="filiacao" value={formData.filiacao} onChange={handleChange} rows={3} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço Completo</Label>
          <Textarea id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} rows={3} />
        </div>
      </div>

      {/* --- Checkbox Autorizo Imagem (CORRIGIDO) --- */}
      <div className="flex items-center space-x-2 pt-4">
        <Checkbox 
            id="autoriza_imagem" 
            name="autoriza_imagem" 
            checked={formData.autoriza_imagem} 
            onCheckedChange={handleCheckboxChange} 
        />
        <Label htmlFor="autoriza_imagem" className="text-sm font-medium leading-none cursor-pointer">
          Autorizo o direito de imagem
        </Label>
      </div>

      {/* --- Comunicações (REMOVIDO WHATSAPP) --- */}
      <h3 className="text-xl font-semibold text-foreground border-b pb-2 mt-6">Comunicações</h3>
      <div className="space-y-3">
         <Label>Deseja receber a Newsletter da AMB?</Label>
         <RadioGroup 
            name="preferencia_newsletter" 
            value={formData.preferencia_newsletter} 
            onValueChange={handleRadioChange} 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2"
         >
           <div className="flex items-center space-x-2">
             <RadioGroupItem value="email" id="edit-news-email" />
             <Label htmlFor="edit-news-email" className="cursor-pointer">Por E-mail</Label>
           </div>
           <div className="flex items-center space-x-2">
             <RadioGroupItem value="nenhum" id="edit-news-nenhum" />
             <Label htmlFor="edit-news-nenhum" className="cursor-pointer">Não desejo receber</Label>
           </div>
         </RadioGroup>
      </div>

      {/* --- Ação --- */}
      <Button 
        type="submit" 
        className="w-full h-12 text-base mt-8"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando Alterações...' : 'Salvar Alterações'}
        <Save className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}