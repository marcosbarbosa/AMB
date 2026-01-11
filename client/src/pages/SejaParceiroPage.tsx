/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * Arquivo: src/pages/SejaParceiroPage.tsx
 * Objetivo: Página pública com formulário de cadastro de parceiros.
 * ATUALIZADO: Envia FormData compatível com o novo Backend PHP.
 * ==========================================================
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Shield, Award, Upload, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';

// URL DO BACKEND
const API_URL = 'https://www.ambamazonas.com.br/api/cadastrar_parceiro.php';

export default function SejaParceiroPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('prata');
  const [isLoading, setIsLoading] = useState(false);

  // ESTADO DA IMAGEM
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ESTADO DO FORMULÁRIO TEXTUAL
  const [formData, setFormData] = useState({
    empresa: '',
    responsavel: '',
    email: '',
    whatsapp: '',
    categoria: '',
    desconto: '', 
    descricao: '',
  });

  // HANDLERS (Mudança de Inputs)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoria: value });
  };

  // HANDLER DE ARQUIVO
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validação de tamanho (5MB)
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

  // --- O ENVIO (AQUI ESTÁ A MÁGICA) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação Ouro
    if (selectedPlan === 'ouro' && !logoFile) {
        toast({ title: "Logo Obrigatória", description: "Para o plano Ouro, é necessário enviar a logo.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
        // 1. CRIAÇÃO DO FORMDATA
        // (Isso empacota texto e arquivo juntos, igual ao cadastro de associado)
        const data = new FormData();

        data.append('empresa', formData.empresa);
        data.append('responsavel', formData.responsavel);
        data.append('email', formData.email);
        data.append('whatsapp', formData.whatsapp);
        data.append('categoria', formData.categoria);
        data.append('desconto', formData.desconto);
        data.append('descricao', formData.descricao);
        data.append('plano', selectedPlan); // Envia 'ouro', 'prata' ou 'bronze'

        if (logoFile) {
            data.append('logo', logoFile);
        }

        // 2. ENVIO PARA O PHP
        const response = await fetch(API_URL, {
            method: 'POST',
            body: data, 
            // Nota: Não defina 'Content-Type' manualmente aqui, o fetch faz isso automático para FormData
        });

        const result = await response.json();

        if (result.sucesso || result.status === 'success') {
            toast({
                title: "Proposta Enviada!",
                description: "Seu cadastro foi recebido com sucesso.",
            });
            setTimeout(() => navigate('/'), 2000);
        } else {
            throw new Error(result.mensagem || "Erro ao salvar no servidor.");
        }

    } catch (error: any) {
        console.error("Erro técnico:", error);
        toast({
            title: "Erro no Envio",
            description: error.message || "Falha de conexão.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
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

        {/* CABEÇALHO */}
        <div className="max-w-4xl mx-auto text-center px-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Seja um Parceiro <span className="text-primary">AMB</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8">
            Conecte a sua marca a centenas de atletas e associados.
            </p>
        </div>

        {/* SELEÇÃO DE PLANOS (Visual) */}
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 mb-16">

            {/* BRONZE */}
            <Card className={`cursor-pointer transition-all hover:shadow-lg ${selectedPlan === 'bronze' ? 'ring-2 ring-primary border-primary' : ''}`}
                onClick={() => setSelectedPlan('bronze')}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                <Shield className="h-6 w-6" /> Bronze
                </CardTitle>
                <CardDescription>Entrada Gratuita</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold mb-4">R$ 0<span className="text-sm font-normal">/mês</span></div>
                <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Presença na busca</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Nome e Telefone</li>
                </ul>
            </CardContent>
            <CardFooter>
                <Button variant={selectedPlan === 'bronze' ? 'default' : 'outline'} className="w-full">Selecionar Bronze</Button>
            </CardFooter>
            </Card>

            {/* PRATA */}
            <Card className={`relative cursor-pointer transition-all hover:shadow-xl transform hover:-translate-y-1 ${selectedPlan === 'prata' ? 'ring-2 ring-slate-400 border-slate-400 shadow-xl scale-105' : ''}`}
                onClick={() => setSelectedPlan('prata')}>
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-slate-500 text-white px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider">Recomendado</span>
            </div>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-500">
                <Award className="h-6 w-6" /> Prata
                </CardTitle>
                <CardDescription>Visibilidade Ideal</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold mb-4">R$ 50<span className="text-sm font-normal">/mês</span></div>
                <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Logotipo na Home</strong></li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Descrição Curta</li>
                </ul>
            </CardContent>
            <CardFooter>
                <Button variant={selectedPlan === 'prata' ? 'default' : 'outline'} className="w-full bg-slate-600 hover:bg-slate-700">Selecionar Prata</Button>
            </CardFooter>
            </Card>

            {/* OURO */}
            <Card className={`cursor-pointer transition-all hover:shadow-lg ${selectedPlan === 'ouro' ? 'ring-2 ring-yellow-500 border-yellow-500 bg-yellow-50/30' : ''}`}
                onClick={() => setSelectedPlan('ouro')}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Star className="h-6 w-6 fill-yellow-600" /> Ouro
                </CardTitle>
                <CardDescription>Parceiro VIP</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold mb-4">R$ 100<span className="text-sm font-normal">/mês</span></div>
                <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Destaque Premium</strong></li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> <strong>Banner/Folder</strong></li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-green-500" /> Prioridade na Busca</li>
                </ul>
            </CardContent>
            <CardFooter>
                <Button variant={selectedPlan === 'ouro' ? 'default' : 'outline'} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">Selecionar Ouro</Button>
            </CardFooter>
            </Card>
        </div>

        {/* FORMULÁRIO DE CADASTRO */}
        <div className="max-w-3xl mx-auto px-4">
            <Card>
            <CardHeader>
                <CardTitle>Dados da Empresa ({selectedPlan.toUpperCase()})</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="empresa">Nome da Empresa *</Label>
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
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="saude">Saúde e Bem-estar</SelectItem>
                        <SelectItem value="fitness">Academia e Fitness</SelectItem>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="equipamentos">Artigos Esportivos</SelectItem>
                        <SelectItem value="servicos">Serviços Gerais</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <Label htmlFor="desconto" className="text-primary font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4" /> Vantagem para o Associado AMB *
                    </Label>
                    <Input id="desconto" name="desconto" required placeholder="Ex: 20% de desconto na primeira mensalidade" value={formData.desconto} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição da Empresa</Label>
                    <Textarea id="descricao" name="descricao" placeholder="Conte um pouco sobre seus serviços..." rows={4} value={formData.descricao} onChange={handleInputChange} />
                </div>

                {/* UPLOAD LOGO */}
                <div className="space-y-3">
                    <Label>Logo da Empresa {selectedPlan === 'ouro' ? '(Obrigatório)' : '(Opcional)'}</Label>

                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden" />

                    {!previewUrl ? (
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50">
                        <Upload className="h-10 w-10 mb-3 text-slate-400" />
                        <span className="font-medium">Clique para enviar logomarca</span>
                    </div>
                    ) : (
                    <div className="relative border rounded-lg p-4 bg-slate-50 flex items-center gap-4">
                        <img src={previewUrl} alt="Preview" className="h-16 w-16 object-contain border bg-white rounded" />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{logoFile?.name}</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage}><X className="h-5 w-5" /></Button>
                    </div>
                    )}
                </div>

                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                    {isLoading ? 'Enviando...' : 'Finalizar Cadastro'}
                </Button>

                </form>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}