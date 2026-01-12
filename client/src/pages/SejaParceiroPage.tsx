/*
 * ==========================================================
 * MÓDULO: SejaParceiroPage.tsx
 * Versão: 4.0 (Marketing AIDA + Promoção Abertura + Fix Badge)
 * ==========================================================
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Check, Star, Shield, Award, Upload, X, ArrowLeft, Loader2, 
  Image as ImageIcon, Monitor, Zap, Calendar, TrendingUp 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from '@/components/ui/badge'; // <--- IMPORT CORRIGIDO AQUI
import { toast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';

const API_URL = 'https://www.ambamazonas.com.br/api/cadastrar_parceiro.php';
const API_CATEGORIAS = 'https://www.ambamazonas.com.br/api/get_categorias_parceiros.php';

export default function SejaParceiroPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('prata');
  const [isLoading, setIsLoading] = useState(false);
  const [categoriasDB, setCategoriasDB] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // LOGO
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // BANNER
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewBannerUrl, setPreviewBannerUrl] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // DADOS DO FORMULÁRIO
  const [formData, setFormData] = useState({
    empresa: '',
    responsavel: '',
    email: '',
    whatsapp: '',
    categoria: '',
    desconto: '', 
    descricao: '',
    banner_fit_mode: 'cover',
  });

  useEffect(() => {
    const fetchCats = async () => {
        try {
            const res = await axios.get(API_CATEGORIAS);
            if(res.data.status === 'sucesso') {
                setCategoriasDB(res.data.dados);
            }
        } catch (error) {
            console.error("Erro ao carregar categorias", error);
        } finally {
            setLoadingCats(false);
        }
    };
    fetchCats();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoria: value });
  };

  const handleFitModeChange = (value: string) => {
    setFormData({ ...formData, banner_fit_mode: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast({ title: "Arquivo muito grande", description: "Máximo 5MB.", variant: "destructive" });
        return;
      }
      if (type === 'logo') {
        setLogoFile(file);
        setPreviewLogoUrl(URL.createObjectURL(file));
      } else {
        setBannerFile(file);
        setPreviewBannerUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleRemoveFile = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
        setLogoFile(null);
        setPreviewLogoUrl(null);
        if (logoInputRef.current) logoInputRef.current.value = ''; 
    } else {
        setBannerFile(null);
        setPreviewBannerUrl(null);
        if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedPlan === 'ouro') {
        if (!logoFile) {
            toast({ title: "Logo Obrigatória", description: "Plano Ouro exige logo.", variant: "destructive" });
            setIsLoading(false);
            return;
        }
    }

    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        data.append('plano', selectedPlan);
        if (logoFile) data.append('logo', logoFile);
        if (bannerFile) data.append('banner', bannerFile);

        const response = await fetch(API_URL, { method: 'POST', body: data });
        const result = await response.json();

        if (result.sucesso || result.status === 'success') {
            toast({ title: "Solicitação Enviada!", description: "Entraremos em contato para ativar seu plano." });
            setTimeout(() => navigate('/'), 3000);
        } else {
            throw new Error(result.mensagem || "Erro no servidor.");
        }
    } catch (error: any) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pb-20 pt-24"> 

        {/* BOTÃO VOLTAR */}
        <div className="max-w-6xl mx-auto px-4 mb-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 p-0 hover:bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
        </div>

        {/* HEADER AIDA: ATENÇÃO & INTERESSE */}
        <div className="max-w-4xl mx-auto text-center px-4 mb-12">
            <Badge variant="outline" className="mb-4 border-blue-500 text-blue-600 px-4 py-1 text-sm uppercase tracking-widest font-bold bg-blue-50">
                🚀 Abertura de Temporada 2026
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Coloque sua marca em <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">JOGO</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Junte-se ao clube de vantagens da AMB e conecte-se diretamente com centenas de atletas e suas famílias. <span className="font-bold text-slate-800">Escolha seu plano e comece agora.</span>
            </p>

            {/* BANNER PROMOCIONAL */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-lg inline-flex items-center gap-3 animate-pulse">
                <Zap className="h-6 w-6 fill-white" />
                <span className="font-bold text-lg">PROMOÇÃO: 50% OFF na 1ª mensalidade até 28/02!</span>
            </div>
        </div>

        {/* SELEÇÃO DE PLANOS (DESEJO) */}
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 mb-16 items-start">

            {/* PLANO BRONZE */}
            <Card 
                onClick={() => setSelectedPlan('bronze')} 
                className={`relative cursor-pointer transition-all duration-300 h-full hover:-translate-y-1 ${selectedPlan === 'bronze' ? 'ring-2 ring-slate-400 border-slate-400 bg-slate-50 shadow-md' : 'hover:border-slate-300'}`}
            >
               <CardHeader>
                   <CardTitle className="text-slate-600 flex items-center gap-2"><Shield className="h-5 w-5"/> Bronze</CardTitle>
                   <CardDescription>Para quem está começando</CardDescription>
               </CardHeader>
               <CardContent>
                   <div className="text-4xl font-bold text-slate-800 mb-4">Grátis</div>
                   <ul className="space-y-3 text-sm text-slate-600">
                       <li className="flex gap-2"><Check className="h-4 w-4 text-green-500"/> Presença na Lista de Parceiros</li>
                       <li className="flex gap-2"><Check className="h-4 w-4 text-green-500"/> Link para WhatsApp</li>
                       <li className="flex gap-2 opacity-50"><X className="h-4 w-4"/> Sem destaque na Home</li>
                   </ul>
               </CardContent>
            </Card>

            {/* PLANO PRATA */}
            <Card 
                onClick={() => setSelectedPlan('prata')} 
                className={`relative cursor-pointer transition-all duration-300 h-full hover:-translate-y-1 ${selectedPlan === 'prata' ? 'ring-2 ring-blue-500 border-blue-500 bg-white shadow-xl scale-105 z-10' : 'hover:border-blue-300'}`}
            >
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
               <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-700 hover:bg-blue-200">POPULAR</Badge>

               <CardHeader>
                   <CardTitle className="text-blue-700 flex items-center gap-2"><Award className="h-5 w-5"/> Prata</CardTitle>
                   <CardDescription>Visibilidade ideal</CardDescription>
               </CardHeader>
               <CardContent>
                   <div className="flex items-baseline gap-2 mb-1">
                       <span className="text-sm text-slate-400 line-through">R$ 50</span>
                       <span className="text-4xl font-bold text-blue-700">R$ 25</span>
                       <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">-50% OFF</span>
                   </div>
                   <p className="text-xs text-slate-400 mb-6">na 1ª mensalidade. Depois R$ 50/mês.</p>

                   {/* SUGESTÃO ANUAL */}
                   <div className="bg-blue-50 p-2 rounded text-xs text-blue-800 font-semibold mb-6 text-center border border-blue-100">
                       Ou <span className="underline decoration-blue-500 underline-offset-2">R$ 500/ano</span> (2 meses grátis)
                   </div>

                   <ul className="space-y-3 text-sm text-slate-600">
                       <li className="flex gap-2"><Check className="h-4 w-4 text-green-500"/> <strong>Destaque</strong> na Lista de Parceiros</li>
                       <li className="flex gap-2"><Check className="h-4 w-4 text-green-500"/> Logo Colorida</li>
                       <li className="flex gap-2"><Check className="h-4 w-4 text-green-500"/> Selo Oficial "Parceiro Prata"</li>
                   </ul>
                   <Button className={`w-full mt-6 ${selectedPlan === 'prata' ? 'bg-blue-600 hover:bg-blue-700' : 'variant-outline'}`}>
                       {selectedPlan === 'prata' ? 'Plano Selecionado' : 'Selecionar Prata'}
                   </Button>
               </CardContent>
            </Card>

            {/* PLANO OURO */}
            <Card 
                onClick={() => setSelectedPlan('ouro')} 
                className={`relative cursor-pointer transition-all duration-300 h-full hover:-translate-y-1 ${selectedPlan === 'ouro' ? 'ring-2 ring-yellow-500 border-yellow-500 bg-yellow-50/20 shadow-xl' : 'hover:border-yellow-400'}`}
            >
               <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
               <Badge className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">VIP</Badge>

               <CardHeader>
                   <CardTitle className="text-yellow-700 flex items-center gap-2"><Star className="h-5 w-5 fill-yellow-600 text-yellow-600"/> Ouro</CardTitle>
                   <CardDescription>Máxima Exposição</CardDescription>
               </CardHeader>
               <CardContent>
                   <div className="flex items-baseline gap-2 mb-1">
                       <span className="text-sm text-slate-400 line-through">R$ 100</span>
                       <span className="text-4xl font-bold text-yellow-700">R$ 50</span>
                       <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">-50% OFF</span>
                   </div>
                   <p className="text-xs text-slate-400 mb-6">na 1ª mensalidade. Depois R$ 100/mês.</p>

                   {/* SUGESTÃO ANUAL */}
                   <div className="bg-yellow-100/50 p-2 rounded text-xs text-yellow-800 font-semibold mb-6 text-center border border-yellow-200">
                       Ou <span className="underline decoration-yellow-500 underline-offset-2">R$ 1.000/ano</span> (Econ. R$ 200)
                   </div>

                   <ul className="space-y-3 text-sm text-slate-700 font-medium">
                       <li className="flex gap-2 items-start"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5"/> <span><strong>Banner Rotativo</strong> na Página Inicial (Milhares de visualizações)</span></li>
                       <li className="flex gap-2 items-start"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5"/> <span>Topo das Buscas</span></li>
                       <li className="flex gap-2 items-start"><Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5"/> <span>Divulgação no Instagram da AMB</span></li>
                   </ul>
                   <Button className={`w-full mt-6 ${selectedPlan === 'ouro' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'variant-outline'}`}>
                       {selectedPlan === 'ouro' ? 'Plano Selecionado' : 'Selecionar Ouro'}
                   </Button>
               </CardContent>
            </Card>
        </div>

        {/* FORMULÁRIO (AÇÃO) */}
        <div className="max-w-3xl mx-auto px-4" id="form-cadastro">
            <Card className="border-t-4 border-t-slate-800 shadow-2xl">
            <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="text-green-600"/> 
                    Finalizar Cadastro ({selectedPlan.toUpperCase()})
                </CardTitle>
                <CardDescription>Seus dados serão enviados para nossa diretoria comercial.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                {/* DADOS BÁSICOS */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nome da Empresa *</Label>
                        <Input name="empresa" required placeholder="Ex: Academia SuperFit" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>Responsável *</Label>
                        <Input name="responsavel" required placeholder="Nome completo" onChange={handleInputChange} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input name="email" type="email" required onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>WhatsApp *</Label>
                        <Input name="whatsapp" required placeholder="(92) 99999-9999" onChange={handleInputChange} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Categoria *</Label>
                    <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                        <SelectValue placeholder={loadingCats ? "Carregando..." : "Selecione uma categoria"} />
                    </SelectTrigger>
                    <SelectContent>
                        {categoriasDB.map((cat) => (
                            <SelectItem key={cat.id} value={cat.nome}>{cat.nome}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <Label className="text-blue-700 font-semibold flex items-center gap-2"><Award className="h-4 w-4"/> Benefício para o Associado *</Label>
                    <Input name="desconto" required placeholder="Ex: 20% de desconto em toda a loja" onChange={handleInputChange} className="bg-white" />
                </div>

                <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea name="descricao" placeholder="Descreva seus serviços..." rows={3} onChange={handleInputChange} />
                </div>

                <hr className="border-slate-100 my-6" />

                {/* ÁREA DE IMAGENS */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* UPLOAD LOGO */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">Logo da Empresa {selectedPlan === 'ouro' && <span className="text-red-500 text-xs font-bold">(Obrigatório)</span>}</Label>
                        <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" className="hidden" />

                        {!previewLogoUrl ? (
                            <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors group">
                                <div className="bg-slate-100 p-3 rounded-full mb-2 group-hover:bg-blue-100 transition-colors">
                                    <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-600" /> 
                                </div>
                                <span className="text-xs font-medium">Enviar Logo</span>
                            </div>
                        ) : (
                            <div className="relative border rounded-lg h-32 flex items-center justify-center bg-slate-50 p-2 group">
                                <img src={previewLogoUrl} className="max-h-full max-w-full object-contain" />
                                <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveFile('logo')}><X className="h-3 w-3" /></Button>
                            </div>
                        )}
                    </div>

                    {/* UPLOAD BANNER (SÓ OURO) */}
                    <div className={`space-y-3 transition-opacity duration-300 ${selectedPlan !== 'ouro' ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2">Banner Promocional</Label>
                            {selectedPlan !== 'ouro' && <Badge variant="secondary" className="text-[10px]">Exclusivo Ouro</Badge>}
                        </div>

                        <input type="file" ref={bannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} accept="image/*" className="hidden" />

                        {!previewBannerUrl ? (
                            <div onClick={() => bannerInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 hover:border-yellow-400 transition-colors group">
                                <div className="bg-slate-100 p-3 rounded-full mb-2 group-hover:bg-yellow-100 transition-colors">
                                    <ImageIcon className="h-6 w-6 text-slate-400 group-hover:text-yellow-600" /> 
                                </div>
                                <span className="text-xs font-medium">Enviar Banner (16:9)</span>
                            </div>
                        ) : (
                            <div className="relative border rounded-lg h-32 overflow-hidden bg-black flex items-center justify-center group">
                                <img 
                                    src={previewBannerUrl} 
                                    className={`w-full h-full ${formData.banner_fit_mode === 'contain' ? 'object-contain' : 'object-cover'}`} 
                                />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveFile('banner')}><X className="h-3 w-3" /></Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* CONFIGURAÇÃO DE AJUSTE DO BANNER (SÓ OURO) */}
                {selectedPlan === 'ouro' && previewBannerUrl && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                        <Label className="mb-2 block text-xs font-bold uppercase text-slate-500">Ajuste da Imagem do Banner</Label>
                        <RadioGroup defaultValue="cover" onValueChange={handleFitModeChange} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cover" id="mode-cover" />
                                <Label htmlFor="mode-cover" className="cursor-pointer text-sm">Preencher (Cover)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="contain" id="mode-contain" />
                                <Label htmlFor="mode-contain" className="cursor-pointer text-sm">Conter (Inteiro)</Label>
                            </div>
                        </RadioGroup>
                        <p className="text-[10px] text-slate-400 mt-2">
                            Use "Preencher" para fotos de fundo. Use "Conter" se o banner tiver textos nas bordas.
                        </p>
                    </div>
                )}

                <Button type="submit" className="w-full h-14 text-lg font-bold shadow-xl mt-8 bg-slate-900 hover:bg-black text-white transition-all transform hover:scale-[1.01]" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : `Garantir Plano ${selectedPlan.toUpperCase()}`}
                </Button>

                <p className="text-xs text-center text-slate-400 mt-4">
                    Ao enviar, você concorda com os termos de parceria da AMB. A ativação do plano ocorrerá após contato da diretoria.
                </p>

                </form>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}