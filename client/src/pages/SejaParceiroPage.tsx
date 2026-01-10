/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Página Pública: Seja um Parceiro
 * Objetivo: Captar novos parceiros, apresentar planos e benefícios.
 * * Estratégia: Funil de vendas (Benefícios -> Escolha do Plano -> Cadastro).
 * ==========================================================
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Shield, Award, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function SejaParceiroPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('prata'); // Plano padrão
  const [isLoading, setIsLoading] = useState(false);

  // Dados do formulário
  const [formData, setFormData] = useState({
    empresa: '',
    responsavel: '',
    email: '',
    whatsapp: '',
    categoria: '',
    desconto: '', // A "isca" para os associados
    descricao: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoria: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // SIMULAÇÃO DO ENVIO (Aqui conectarias com o teu Backend/Supabase)
    // O status inicial deve ser "pendente" para aprovação no admin
    setTimeout(() => {
      console.log("Dados enviados:", { ...formData, plano: selectedPlan });

      toast({
        title: "Proposta Enviada!",
        description: "Analisaremos o seu cadastro e entraremos em contato em breve.",
        variant: "default", // ou "success" se tiveres configurado
      });

      setIsLoading(false);
      navigate('/'); // Volta para a home ou página de sucesso
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24"> {/* pt-24 para não ficar debaixo do menu fixo */}

      {/* 1. HERO SECTION: A Promessa */}
      <div className="max-w-4xl mx-auto text-center px-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Expanda o seu negócio com a <span className="text-primary">AMB Amazonas</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Conecte a sua marca a centenas de atletas e associados. 
          Ofereça benefícios e ganhe clientes fiéis.
        </p>
      </div>

      {/* 2. PLANOS: A Comparação (Estratégia Ouro/Prata/Bronze) */}
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 mb-16">

        {/* PLANO BRONZE */}
        <Card className={`cursor-pointer transition-all hover:shadow-lg ${selectedPlan === 'bronze' ? 'ring-2 ring-primary border-primary' : ''}`}
              onClick={() => setSelectedPlan('bronze')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Shield className="h-6 w-6" /> Bronze
            </CardTitle>
            <CardDescription>Entrada Gratuita</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Presença na busca de parceiros</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Nome e Telefone listados</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Categoria pesquisável</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant={selectedPlan === 'bronze' ? 'default' : 'outline'} className="w-full">Selecionar Bronze</Button>
          </CardFooter>
        </Card>

        {/* PLANO PRATA */}
        <Card className={`relative cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1 ${selectedPlan === 'prata' ? 'ring-2 ring-slate-400 border-slate-400 shadow-xl scale-105' : ''}`}
              onClick={() => setSelectedPlan('prata')}>
          <div className="absolute -top-4 left-0 right-0 flex justify-center">
            <span className="bg-slate-500 text-white px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider">Mais Popular</span>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-500">
              <Award className="h-6 w-6" /> Prata
            </CardTitle>
            <CardDescription>Visibilidade Ideal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">R$ 50<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Logotipo na Home do Site</strong></li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Perfil com Descrição Curta</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Link Direto WhatsApp</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Destaque na Busca</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant={selectedPlan === 'prata' ? 'default' : 'outline'} className="w-full bg-slate-600 hover:bg-slate-700">Selecionar Prata</Button>
          </CardFooter>
        </Card>

        {/* PLANO OURO */}
        <Card className={`cursor-pointer transition-all hover:shadow-lg ${selectedPlan === 'ouro' ? 'ring-2 ring-yellow-500 border-yellow-500 bg-yellow-50/30' : ''}`}
              onClick={() => setSelectedPlan('ouro')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Star className="h-6 w-6 fill-yellow-600" /> Ouro
            </CardTitle>
            <CardDescription>Parceiro VIP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">R$ 100<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Destaque Premium na Home</strong></li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Exibição de Folder/Banner</strong></li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Página Exclusiva Completa</li>
              <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Prioridade nas Buscas</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant={selectedPlan === 'ouro' ? 'default' : 'outline'} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">Selecionar Ouro</Button>
          </CardFooter>
        </Card>
      </div>

      {/* 3. FORMULÁRIO DE CADASTRO */}
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Cadastro da Empresa</CardTitle>
            <CardDescription>
              Você selecionou o plano <span className="font-bold uppercase text-primary">{selectedPlan}</span>. Preencha os dados abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Nome da Empresa / Negócio *</Label>
                  <Input id="empresa" name="empresa" required placeholder="Ex: Academia SuperFit" value={formData.empresa} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Nome do Responsável *</Label>
                  <Input id="responsavel" name="responsavel" required placeholder="Seu nome completo" value={formData.responsavel} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Comercial *</Label>
                  <Input id="email" name="email" type="email" required placeholder="contato@empresa.com" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp para Contato *</Label>
                  <Input id="whatsapp" name="whatsapp" required placeholder="(92) 99999-9999" value={formData.whatsapp} onChange={handleInputChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria do Serviço *</Label>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saude">Saúde e Bem-estar (Fisioterapia, Médicos)</SelectItem>
                    <SelectItem value="fitness">Academia e Fitness</SelectItem>
                    <SelectItem value="alimentacao">Alimentação e Suplementos</SelectItem>
                    <SelectItem value="equipamentos">Artigos Esportivos</SelectItem>
                    <SelectItem value="servicos">Serviços Gerais</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* A ISCA PARA O ASSOCIADO */}
              <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                <Label htmlFor="desconto" className="text-primary font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4" /> Vantagem para o Associado AMB
                </Label>
                <p className="text-xs text-muted-foreground mb-2">Qual benefício exclusivo você oferece? (Ex: 15% de desconto, Avaliação Grátis)</p>
                <Input id="desconto" name="desconto" required placeholder="Ex: 20% de desconto na primeira mensalidade" value={formData.desconto} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Empresa</Label>
                <Textarea id="descricao" name="descricao" placeholder="Conte um pouco sobre seus serviços..." rows={4} value={formData.descricao} onChange={handleInputChange} />
              </div>

              {/* Upload de Logo (Simulado visualmente) */}
              <div className="space-y-2">
                <Label>Logo da Empresa (Opcional agora)</Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm">Clique para enviar imagem (JPG, PNG)</span>
                </div>
              </div>

              <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {isLoading ? 'Enviando...' : 'Finalizar Cadastro de Parceiro'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente auxiliar para o loader, caso não tenhas importado
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  );
}