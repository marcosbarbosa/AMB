/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Versão: 1.2 (Corrigido)
 *
 * Descrição: Componente de formulário de cadastro de associado.
 *
 * ==========================================================
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';

const cadastroSchema = z.object({
  nome_completo: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  data_nascimento: z.string().min(1, 'Data de nascimento é obrigatória'),
  genero: z.enum(['masculino', 'feminino'], { required_error: 'Selecione o gênero' }),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Use a sigla do estado (ex: AM)'),
  posicao: z.string().optional(),
  time_atual: z.string().optional(),
  observacoes: z.string().optional(),
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

export function CadastroForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome_completo: '',
      email: '',
      telefone: '',
      data_nascimento: '',
      genero: undefined,
      cpf: '',
      endereco: '',
      cidade: '',
      estado: '',
      posicao: '',
      time_atual: '',
      observacoes: '',
    },
  });

  const onSubmit = async (data: CadastroFormData) => {
    setIsSubmitting(true);
    try {
      // Envia para o backend PHP externo
      const response = await axios.post(
        'https://ambdobrasil.com.br/api/cadastro.php',
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setIsSuccess(true);
        toast({
          title: 'Cadastro Enviado!',
          description: 'Seu cadastro foi recebido e está aguardando aprovação.',
        });
        reset();
      } else {
        throw new Error(response.data.message || 'Erro ao enviar cadastro');
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 pb-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Cadastro Enviado!</h2>
          <p className="text-muted-foreground mb-6">
            Seu cadastro foi recebido com sucesso. Aguarde a aprovação da administração.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            Fazer Novo Cadastro
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ficha de Cadastro</CardTitle>
        <CardDescription>
          Preencha todos os campos obrigatórios (*) para se associar à AMB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dados Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome Completo *</Label>
                <Input
                  id="nome_completo"
                  {...register('nome_completo')}
                  placeholder="Seu nome completo"
                  data-testid="input-nome"
                />
                {errors.nome_completo && (
                  <p className="text-sm text-destructive">{errors.nome_completo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  {...register('cpf')}
                  placeholder="000.000.000-00"
                  data-testid="input-cpf"
                />
                {errors.cpf && (
                  <p className="text-sm text-destructive">{errors.cpf.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="seu@email.com"
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                <Input
                  id="telefone"
                  {...register('telefone')}
                  placeholder="(92) 99999-9999"
                  data-testid="input-telefone"
                />
                {errors.telefone && (
                  <p className="text-sm text-destructive">{errors.telefone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  {...register('data_nascimento')}
                  data-testid="input-data-nascimento"
                />
                {errors.data_nascimento && (
                  <p className="text-sm text-destructive">{errors.data_nascimento.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Gênero *</Label>
                <Select onValueChange={(value) => setValue('genero', value as 'masculino' | 'feminino')}>
                  <SelectTrigger data-testid="select-genero">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                {errors.genero && (
                  <p className="text-sm text-destructive">{errors.genero.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Endereço</h3>
            
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo *</Label>
              <Input
                id="endereco"
                {...register('endereco')}
                placeholder="Rua, número, bairro"
                data-testid="input-endereco"
              />
              {errors.endereco && (
                <p className="text-sm text-destructive">{errors.endereco.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  {...register('cidade')}
                  placeholder="Manaus"
                  data-testid="input-cidade"
                />
                {errors.cidade && (
                  <p className="text-sm text-destructive">{errors.cidade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Input
                  id="estado"
                  {...register('estado')}
                  placeholder="AM"
                  maxLength={2}
                  data-testid="input-estado"
                />
                {errors.estado && (
                  <p className="text-sm text-destructive">{errors.estado.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Informações Esportivas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Informações Esportivas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="posicao">Posição em Quadra</Label>
                <Input
                  id="posicao"
                  {...register('posicao')}
                  placeholder="Ex: Armador, Ala, Pivô"
                  data-testid="input-posicao"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_atual">Time Atual</Label>
                <Input
                  id="time_atual"
                  {...register('time_atual')}
                  placeholder="Nome do time (se houver)"
                  data-testid="input-time"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                {...register('observacoes')}
                placeholder="Informações adicionais (opcional)"
                rows={3}
                data-testid="input-observacoes"
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            data-testid="button-submit-cadastro"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Enviando...' : 'Enviar Cadastro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
