/*
 * ==========================================================
 * MÓDULO: SejaParceiroPage.tsx (Versão Dinâmica v2.0)
 * Descrição: Carrega categorias do banco de dados via API.
 * ==========================================================
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importar Axios
import { Check, Star, Shield, Award, Upload, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';

const API_URL = 'https://www.ambamazonas.com.br/api/cadastrar_parceiro.php';
const API_CATEGORIAS = 'https://www.ambamazonas.com.br/api/get_categorias_parceiros.php'; // NOVA API

export default function SejaParceiroPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('prata');
  const [isLoading, setIsLoading] = useState(false);

  // Estado para Categorias Dinâmicas
  const [categoriasDB, setCategoriasDB] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    empresa: '',
    responsavel: '',
    email: '',
    whatsapp: '',
    categoria: '',
    desconto: '', 
    descricao: '',
  });

  // 1. BUSCAR CATEGORIAS AO CARREGAR
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast({ title: "Arquivo muito grande", description: "Máximo 5MB.", variant: "destructive" });
        return;
      }
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setLogoFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = ''; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedPlan === 'ouro' && !logoFile) {
        toast({ title: "Logo Obrigatória", description: "Plano Ouro exige logo.", variant: "destructive" });
        setIsLoading(false);
        return;
    }

    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        data.append('plano', selectedPlan);
        if (logoFile) data.append('logo', logoFile);

        const response = await fetch(API_URL, { method: 'POST', body: data });
        const result = await response.json();

        if (result.sucesso || result.status === 'success') {
            toast({ title: "Proposta Enviada!", description: "Recebemos seu cadastro." });
            setTimeout(() => navigate('/'), 2000);
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
        <div className="max-w-6xl mx-auto px-4 mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Seja um Parceiro <span className="text-primary">AMB</span></h1>
            <p className="text-xl text-slate-600 mb-8">Conecte a sua marca a centenas de atletas.</p>
        </div>

        {/* PLANOS (MANTIDOS IGUAL AO ORIGINAL, CÓDIGO ABREVIADO PARA FOCAR NA MUDANÇA) */}
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 mb-16">
            <Card onClick={() => setSelectedPlan('bronze')} className={`cursor-pointer ${selectedPlan === 'bronze' ? 'ring-2 ring-primary border-primary' : ''}`}>
               <CardHeader><CardTitle className="text-amber-700 flex gap-2"><Shield className="h-6 w-6"/> Bronze</CardTitle><CardDescription>Grátis</CardDescription></CardHeader>
               <CardContent><div className="text-3xl font-bold">R$ 0</div></CardContent>
            </Card>

            <Card onClick={() => setSelectedPlan('prata')} className={`cursor-pointer transform hover:-translate-y-1 ${selectedPlan === 'prata' ? 'ring-2 ring-slate-400 border-slate-400 shadow-xl' : ''}`}>
               <div className="bg-slate-500 text-white text-center text-xs font-bold py-1">RECOMENDADO</div>
               <CardHeader><CardTitle className="text-slate-500 flex gap-2"><Award className="h-6 w-6"/> Prata</CardTitle><CardDescription>Visibilidade</CardDescription></CardHeader>
               <CardContent><div className="text-3xl font-bold">R$ 50<span className="text-sm font-normal">/mês</span></div></CardContent>
            </Card>

            <Card onClick={() => setSelectedPlan('ouro')} className={`cursor-pointer ${selectedPlan === 'ouro' ? 'ring-2 ring-yellow-500 bg-yellow-50/30' : ''}`}>
               <CardHeader><CardTitle className="text-yellow-600 flex gap-2"><Star className="h-6 w-6 fill-yellow-600"/> Ouro</CardTitle><CardDescription>VIP</CardDescription></CardHeader>
               <CardContent><div className="text-3xl font-bold">R$ 100<span className="text-sm font-normal">/mês</span></div></CardContent>
            </Card>
        </div>

        <div className="max-w-3xl mx-auto px-4">
            <Card>
            <CardHeader><CardTitle>Dados da Empresa ({selectedPlan.toUpperCase()})</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* --- SELEÇÃO DE CATEGORIA DINÂMICA --- */}
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

                <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <Label className="text-primary font-semibold flex items-center gap-2"><Award className="h-4 w-4"/> Vantagem para o Associado *</Label>
                    <Input name="desconto" required placeholder="Ex: 20% de desconto" onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea name="descricao" placeholder="Sobre seus serviços..." rows={4} onChange={handleInputChange} />
                </div>

                <div className="space-y-3">
                    <Label>Logo {selectedPlan === 'ouro' && '(Obrigatório)'}</Label>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    {!previewUrl ? (
                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50">
                            <Upload className="h-10 w-10 mb-3" /> Clique para enviar logo
                        </div>
                    ) : (
                        <div className="relative border rounded-lg p-4 bg-slate-50 flex items-center gap-4">
                            <img src={previewUrl} className="h-16 w-16 object-contain bg-white rounded border" />
                            <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage}><X className="h-5 w-5" /></Button>
                        </div>
                    )}
                </div>

                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Finalizar Cadastro'}
                </Button>
                </form>
            </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}