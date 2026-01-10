/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Página Pública: Seja um Parceiro
 * Objetivo: Captar novos parceiros, apresentar planos e benefícios.
 * VERSÃO ESTÁVEL: Imports limpos e sem conflitos de nome.
 * ==========================================================
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORTAMOS TUDO DAQUI (INCLUINDO O LOADER2 PARA NÃO DAR ERRO)
import { Check, Star, Shield, Award, Upload, X, ArrowLeft, Loader2 } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation'; 

export default function SejaParceiroPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('prata');
  const [isLoading, setIsLoading] = useState(false);

  // ESTADO PARA A IMAGEM
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dados do formulário
  const [formData, setFormData] = useState({
    empresa: '',
    responsavel: '',
    email: '',
    whatsapp: '',
    categoria: '',
    desconto: '', 
    descricao: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoria: value });
  };

  // FUNÇÃO PARA GERIR A SELEÇÃO DA IMAGEM
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast({ title: "Arquivo muito grande", description: "A imagem deve ter no máximo 5MB.", variant: "destructive" });
        return;
      }
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setLogoFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação extra para plano OURO
    if (selectedPlan === 'ouro' && !logoFile) {
        toast({ title: "Logo Obrigatória", description: "Para o plano Ouro, é necessário enviar a logo.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    setTimeout(() => {
      console.log("Dados enviados:", { ...formData, plano: selectedPlan, arquivo: logoFile?.name });

      toast({
        title: "Proposta Enviada!",
        description: "Analisaremos o seu cadastro e a logo enviada.",
        variant: "default",
      });

      setIsLoading(false);
      navigate('/'); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <Navigation />

      <main className="pb-20 pt-24"> 

        {/* BOTÃO VOLTAR */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
            <Button 
                variant="ghost" 
                onClick={() => navigate(-1)} 
                className="text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
        </div>

        {/* HERO SECTION */}
        <div className="max-w-4xl mx-auto text-center px-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Expanda o seu negócio com a <span className="text-primary">AMB Amazonas</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
            Conecte a sua marca a centenas de atletas e associados. 
            Ofereça benefícios e ganhe clientes fiéis.
            </p>
        </div>

        {/* PLANOS */}
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

        {/* FORMULÁRIO */}
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

                {/* UPLOAD */}
                <div className="space-y-3">
                    <Label className="flex items-center justify-between">
                    <span>Logo da Empresa {selectedPlan === 'ouro' ? '(Obrigatório)' : '(Opcional)'}</span>
                    {selectedPlan === 'ouro' && <span className="text-xs text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded">Obrigatório para Ouro</span>}
                    </Label>

                    <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden" 
                    />

                    {!previewUrl ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 transition-colors cursor-pointer hover:bg-slate-50 ${selectedPlan === 'ouro' ? 'border-amber-300 bg-amber-50/30' : 'border-slate-300'}`}
                    >
                        <Upload className={`h-10 w-10 mb-3 ${selectedPlan === 'ouro' ? 'text-amber-500' : 'text-slate-400'}`} />
                        <span className="font-medium">Clique para enviar a sua logomarca</span>
                        <span className="text-xs text-muted-foreground mt-1">Suporta: JPG, PNG (Max 5MB)</span>
                    </div>
                    ) : (
                    <div className="relative border rounded-lg p-4 bg-slate-50 flex items-center gap-4">
                        <div className="h-16 w-16 bg-white rounded border flex items-center justify-center overflow-hidden">
                            <img src={previewUrl} alt="Preview Logo" className="object-contain max-h-full max-w-full" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{logoFile?.name}</p>
                            <p className="text-xs text-muted-foreground">{(logoFile!.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage} className="text-destructive hover:bg-destructive/10">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    )}
                </div>

                <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                    {isLoading ? 'Enviando...' : 'Finalizar Cadastro de Parceiro'}
                </Button>

                </form>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}